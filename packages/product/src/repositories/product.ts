import { Product } from "@models"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { Context, DAL } from "@medusajs/types"
import { BaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ModuleUtils } from "@medusajs/utils"

export class ProductRepository extends BaseRepository<Product> {
  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<Product> = { where: {} },
    context: Context = {}
  ): Promise<Product[]> {
    // Spread is used to cssopy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      ModuleUtils.deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    await this.mutateNotInCategoriesConstraints(findOptions_)

    return await this.manager_.find(
      Product,
      findOptions_.where as MikroFilterQuery<Product>,
      findOptions_.options as MikroOptions<Product>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Product> = { where: {} },
    context: Context = {}
  ): Promise<[Product[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      ModuleUtils.deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    await this.mutateNotInCategoriesConstraints(findOptions_)

    return await this.manager_.findAndCount(
      Product,
      findOptions_.where as MikroFilterQuery<Product>,
      findOptions_.options as MikroOptions<Product>
    )
  }

  /**
   * In order to be able to have a strict not in categories, and prevent a product
   * to be return in the case it also belongs to other categories, we need to
   * first find all products that are in the categories, and then exclude them
   */
  private async mutateNotInCategoriesConstraints(
    findOptions: DAL.FindOptions<Product> = { where: {} }
  ): Promise<void> {
    if (findOptions.where.categories?.id?.["$nin"]) {
      const productsInCategories = await this.manager_.find(
        Product,
        {
          categories: {
            id: { $in: findOptions.where.categories.id["$nin"] },
          },
        },
        {
          fields: ["id"],
        }
      )

      const productIds = productsInCategories.map((product) => product.id)

      if (productIds.length) {
        findOptions.where.id = { $nin: productIds }
        delete findOptions.where.categories?.id

        if (Object.keys(findOptions.where.categories).length === 0) {
          delete findOptions.where.categories
        }
      }
    }
  }
}

import {
  ContainerRegistrationKeys,
  ManyToManyInventoryFeatureFlag,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { InventoryItemDTO } from "@medusajs/types"

export const attachInventoryItemToVariantsStepId =
  "attach-inventory-items-to-variants-step"
export const attachInventoryItemToVariants = createStep(
  attachInventoryItemToVariantsStepId,
  async (
    input: {
      inventoryItem: InventoryItemDTO
      tag?: string
    }[],
    { container }
  ) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const linkDefinitions = input
      .filter(({ tag }) => !!tag)
      .map(({ inventoryItem, tag }) => ({
        productService: {
          variant_id: tag,
        },
        inventoryService: {
          inventory_item_id: inventoryItem.id,
        },
      }))

    const links = await remoteLink.create(linkDefinitions)

    return new StepResponse(links, linkDefinitions)
  },
  async (linkDefinitions, { container }) => {
    if (!linkDefinitions?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    await remoteLink.dismiss(linkDefinitions)
  }
)

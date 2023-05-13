import { MedusaContainer, RemoteJoinerQuery } from "@medusajs/types"
import { RemoteJoiner } from "../../joiner"

import {
  mock,
  serviceConfigs,
  serviceMock,
} from "../../__mocks__/joiner/mock_data"

const container = {
  resolve: (serviceName) => {
    return {
      list: (...args) => {
        return serviceMock[serviceName].apply(this, args)
      },
      getByVariantId: (options) => {
        if (serviceName !== "orderService") {
          return
        }

        let orderVar = JSON.parse(JSON.stringify(mock.order_variant))

        if (options.expands?.order) {
          orderVar = orderVar.map((item) => {
            item.order = JSON.parse(
              JSON.stringify(mock.order.find((o) => o.id === item.order_id))
            )
            return item
          })
        }

        return orderVar
      },
    }
  },
} as MedusaContainer

describe("RemoteJoiner", () => {
  let joiner: RemoteJoiner
  beforeAll(() => {
    joiner = new RemoteJoiner(container, serviceConfigs)
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Simple query of a service, its id and no fields specified", async () => {
    const query = {
      service: "User",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["id", "name", "email"],
    }

    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "janedoe@example.com",
      },
      {
        id: 3,
        name: "aaa bbb",
        email: "aaa@example.com",
      },
      {
        id: 4,
        name: "a4444 44 44",
        email: "444444@example.com",
      },
    ])
  })

  it("Query of a service, expanding a property and restricting the fields expanded", async () => {
    const query = {
      service: "User",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["username", "email", "products"],
      expands: [
        {
          property: "products.product",
          fields: ["name"],
        },
      ],
    }

    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        email: "johndoe@example.com",
        products: [
          {
            id: 1,
            product_id: 102,
            product: {
              name: "Product 2",
              id: 102,
            },
          },
        ],
      },
      {
        email: "janedoe@example.com",
        products: [
          {
            id: 2,
            product_id: [101, 102],
            product: [
              {
                name: "Product 1",
                id: 101,
              },
              {
                name: "Product 2",
                id: 102,
              },
            ],
          },
        ],
      },
      {
        email: "aaa@example.com",
      },
      {
        email: "444444@example.com",
        products: [
          {
            id: 4,
            product_id: 103,
            product: {
              name: "Product 3",
              id: 103,
            },
          },
        ],
      },
    ])
  })

  it("Query a service expanding multiple nested properties", async () => {
    const query = {
      service: "Order",
      fields: ["number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product", "user"],
        },
        {
          property: "products.product",
          fields: ["name"],
        },
        {
          property: "user",
          fields: ["fullname", "email", "products"],
        },
        {
          property: "user.products.product",
          fields: ["name"],
        },
      ],
      args: [
        {
          name: "id",
          value: "3",
        },
      ],
    }

    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        number: "ORD-001",
        date: "2023-04-01T12:00:00Z",
        products: [
          {
            product_id: 101,
            variant_id: 991,
            quantity: 1,
            product: {
              name: "Product 1",
              id: 101,
            },
          },
          {
            product_id: 101,
            variant_id: 992,
            quantity: 5,
            product: {
              name: "Product 1",
              id: 101,
            },
          },
        ],
        user_id: 4,
        user: {
          fullname: "444 Doe full name",
          email: "444444@example.com",
          products: [
            {
              id: 4,
              product_id: 103,
              product: {
                name: "Product 3",
                id: 103,
              },
            },
          ],
          id: 4,
        },
      },
      {
        number: "ORD-202",
        date: "2023-04-01T12:00:00Z",
        products: [
          {
            product_id: [101, 103],
            variant_id: 993,
            quantity: 4,
            product: [
              {
                name: "Product 1",
                id: 101,
              },
              {
                name: "Product 3",
                id: 103,
              },
            ],
          },
        ],
        user_id: 1,
        user: {
          fullname: "John Doe full name",
          email: "johndoe@example.com",
          products: [
            {
              id: 1,
              product_id: 102,
              product: {
                name: "Product 2",
                id: 102,
              },
            },
          ],
          id: 1,
        },
      },
    ])
  })

  it.only("Query a service expanding an inverse relation", async () => {
    let query: RemoteJoinerQuery = {
      service: "Variant",
      fields: ["name"],
      expands: [
        {
          property: "orders",
          fields: ["order"],
        },
        {
          property: "orders.order",
          fields: ["id", "number"],
          args: [
            {
              name: "limit",
              value: "5",
            },
          ],
        },
        {
          property: "orders.order.products.product",
          fields: ["name"],
        },
        {
          property: "orders.variant",
          fields: ["name"],
        },
      ],
    }

    query = RemoteJoiner.parseQuery(`
      query {
        variant {
          id
          name
          orders {
            order {
              number
              products {
                product {
                  name
                }
              }
            }
          }
        }
      }
    `)

    console.log(JSON.stringify(query, null, 2))

    const data = await joiner.query(query)
    console.log(JSON.stringify(data, null, 2))
    //process.exit(0)

    expect(data).toEqual([
      {
        number: "ORD-001",
        date: "2023-04-01T12:00:00Z",
        products: [
          {
            product_id: 101,
            variant_id: 991,
            quantity: 1,
            product: {
              name: "Product 1",
              id: 101,
            },
          },
          {
            product_id: 101,
            variant_id: 992,
            quantity: 5,
            product: {
              name: "Product 1",
              id: 101,
            },
          },
        ],
        user_id: 4,
        user: {
          fullname: "444 Doe full name",
          email: "444444@example.com",
          products: [
            {
              id: 4,
              product_id: 103,
              product: {
                name: "Product 3",
                id: 103,
              },
            },
          ],
          id: 4,
        },
      },
      {
        number: "ORD-202",
        date: "2023-04-01T12:00:00Z",
        products: [
          {
            product_id: [101, 103],
            variant_id: 993,
            quantity: 4,
            product: [
              {
                name: "Product 1",
                id: 101,
              },
              {
                name: "Product 3",
                id: 103,
              },
            ],
          },
        ],
        user_id: 1,
        user: {
          fullname: "John Doe full name",
          email: "johndoe@example.com",
          products: [
            {
              id: 1,
              product_id: 102,
              product: {
                name: "Product 2",
                id: 102,
              },
            },
          ],
          id: 1,
        },
      },
    ])
  })
})

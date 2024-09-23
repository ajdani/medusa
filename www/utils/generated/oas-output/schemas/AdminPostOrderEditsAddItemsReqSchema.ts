/**
 * @schema AdminPostOrderEditsAddItemsReqSchema
 * type: object
 * description: The details of items to be edited.
 * x-schemaName: AdminPostOrderEditsAddItemsReqSchema
 * properties:
 *   items:
 *     type: array
 *     description: The details of items to be edited.
 *     items:
 *       type: object
 *       description: An item's details.
 *       required:
 *         - variant_id
 *         - quantity
 *       properties:
 *         variant_id:
 *           type: string
 *           title: variant_id
 *           description: The ID of the associated product variant.
 *         quantity:
 *           type: number
 *           title: quantity
 *           description: The item's quantity.
 *         unit_price:
 *           type: number
 *           title: unit_price
 *           description: The item's unit price.
 *         internal_note:
 *           type: string
 *           title: internal_note
 *           description: A note viewed only by admin users.
 *         allow_backorder:
 *           type: boolean
 *           title: allow_backorder
 *           description: Whether the item can be added even if there's no available invenotory quantity of the variant.
 *         metadata:
 *           type: object
 *           description: The item's metadata, can hold custom key-value pairs.
 * 
*/

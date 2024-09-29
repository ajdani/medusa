/**
 * @schema StoreCreateReturn
 * type: object
 * description: The details of the return to create.
 * x-schemaName: StoreCreateReturn
 * required:
 *   - order_id
 *   - items
 *   - return_shipping
 * properties:
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order this return is created for.
 *   items:
 *     type: array
 *     description: The return's items.
 *     items:
 *       $ref: "#/components/schemas/StoreCreateReturnItem"
 *   return_shipping:
 *     $ref: "#/components/schemas/StoreCreateReturnShipping"
 *   note:
 *     type: string
 *     title: note
 *     description: A note with more details about the return.
 *   receive_now:
 *     type: boolean
 *     title: receive_now
 *     description: Whether to mark the return as received.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the location that items are returned to.
 * 
*/

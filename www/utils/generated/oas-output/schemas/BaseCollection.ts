/**
 * @schema BaseCollection
 * type: object
 * description: The collection's details.
 * x-schemaName: BaseCollection
 * required:
 *   - id
 *   - title
 *   - handle
 *   - created_at
 *   - updated_at
 *   - deleted_at
 *   - metadata
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The collection's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The collection's title.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The collection's handle.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the collection is created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the collection is updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the collection is deleted.
 *   products:
 *     type: array
 *     description: The collection's products.
 *     items:
 *       $ref: "#/components/schemas/AdminProduct"
 *   metadata:
 *     type: object
 *     description: The collection's metadata, can hold custom key-value pairs.
 * 
*/

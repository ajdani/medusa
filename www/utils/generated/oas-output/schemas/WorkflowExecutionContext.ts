/**
 * @schema WorkflowExecutionContext
 * type: object
 * description: The workflow execution's context.
 * x-schemaName: WorkflowExecutionContext
 * required:
 *   - compensate
 *   - errors
 * properties:
 *   data:
 *     type: object
 *     description: The context's data.
 *     properties:
 *       invoke:
 *         type: object
 *         description: The step's invokation details.
 *         required:
 *           - output
 *         additionalProperties:
 *           type: object
 *           properties:
 *             output:
 *               type: object
 *               description: The invokation's details.
 *               required:
 *                 - output
 *                 - compensateInput
 *               properties:
 *                 output:
 *                   description: the step's output
 *                 compensateInput:
 *                   description: the compensation function's input.
 *       payload:
 *         description: the payload of the transaction.
 *     required:
 *       - invoke
 *   compensate:
 *     type: object
 *     description: The context's compensate.
 *   errors:
 *     type: array
 *     description: The context's errors.
 *     items:
 *       type: object
 *       description: The error's details.
 *       properties:
 *         error:
 *           type: object
 *           description: The error's details.
 *         action:
 *           type: string
 *           title: action
 *           description: The error's action.
 *         handlerType:
 *           type: string
 *           title: handlerType
 *           description: The error's handler type.
 *       required:
 *         - error
 *         - action
 *         - handlerType
 * 
*/

import { createReturnShippingMethodWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostReturnsShippingReqSchemaType } from "../../validators"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsShippingReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminReturnPreviewResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await createReturnShippingMethodWorkflow(req.scope).run({
    input: { ...req.validatedBody, return_id: id },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderReturn] = await remoteQuery(queryObject)

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}
import { FulfillmentWorkflow, ServiceZoneDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createServiceZonesStep } from "../steps"

export const createServiceZonesWorkflowId = "create-service-zones-workflow"
/**
 * This workflow creates one or more service zones.
 */
export const createServiceZonesWorkflow = createWorkflow(
  createServiceZonesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateServiceZonesWorkflowInput>
  ): WorkflowResponse<ServiceZoneDTO[]> => {
    return new WorkflowResponse(createServiceZonesStep(input.data))
  }
)
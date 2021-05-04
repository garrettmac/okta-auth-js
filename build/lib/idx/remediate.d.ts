import { IdxResponse, RemediationFlow, RemediationValues, APIError, NextStep } from '../types';
interface RemediationResponse {
    idxResponse?: IdxResponse;
    nextStep?: NextStep;
    formError?: APIError;
}
export declare function remediate(idxResponse: IdxResponse, flow: RemediationFlow, values: RemediationValues): Promise<RemediationResponse>;
export {};

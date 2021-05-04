import { AuthApiError } from '../../errors';
import { IdxRemediation, IdxToRemediationValueMap, IdxResponse, NextStep } from '../types';
export interface RemediationValues {
    stateHandle?: string;
}
export declare class Base {
    remediation: IdxRemediation;
    values: RemediationValues;
    map?: IdxToRemediationValueMap;
    constructor(remediation: IdxRemediation, values: RemediationValues);
    canRemediate(): boolean;
    getData(key?: string): any;
    hasData(key: string): boolean;
    getNextStep(): NextStep;
    getErrorMessages(errorRemediation: IdxResponse): string[];
    createFormError(err: any): AuthApiError;
}

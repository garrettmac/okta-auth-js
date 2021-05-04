import { Base, RemediationValues } from './Base';
export interface SelectEnrollProfileValues extends RemediationValues {
}
export declare class SelectEnrollProfile extends Base {
    values: SelectEnrollProfileValues;
    canRemediate(): boolean;
}

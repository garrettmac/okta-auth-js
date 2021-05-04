import { Base, RemediationValues } from './Base';
import { IdxRemediation, IdxRemeditionValue } from '../types';
export interface SelectAuthenticatorValues extends RemediationValues {
    authenticators?: string[];
}
export declare class SelectAuthenticator extends Base {
    values: SelectAuthenticatorValues;
    remediationValue: IdxRemeditionValue;
    matchedOption: IdxRemediation;
    map: {
        authenticator: any;
    };
    constructor(remediation: IdxRemediation, values: RemediationValues);
    canRemediate(): boolean;
    getNextStep(): {
        name: string;
        authenticators: {
            label: string;
            value: string;
        }[];
    };
    mapAuthenticator(remediationValue: IdxRemeditionValue): {
        id: any;
    };
}

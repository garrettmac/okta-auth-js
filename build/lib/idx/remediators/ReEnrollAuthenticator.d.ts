import { Base, RemediationValues } from './Base';
export interface ReEnrollAuthenticatorValues extends RemediationValues {
    newPassword?: string;
}
export declare class ReEnrollAuthenticator extends Base {
    values: ReEnrollAuthenticatorValues;
    map: {
        credentials: string[];
    };
    mapCredentials(): {
        passcode: string;
    };
    getNextStep(): {
        name: string;
        type: string;
    };
    getErrorMessages(errorRemediation: any): any;
}

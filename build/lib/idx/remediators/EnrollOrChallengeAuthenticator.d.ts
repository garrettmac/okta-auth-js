import { Base, RemediationValues } from './Base';
export interface EnrollOrChallengeAuthenticatorValues extends RemediationValues {
    verificationCode?: string;
    password?: string;
}
export declare class EnrollOrChallengeAuthenticator extends Base {
    values: EnrollOrChallengeAuthenticatorValues;
    map: {
        credentials: string[];
    };
    canRemediate(): boolean;
    mapCredentials(): {
        passcode: string;
    };
    getNextStep(): {
        name: string;
        type: string;
    };
    getErrorMessages(errorRemediation: any): any;
}

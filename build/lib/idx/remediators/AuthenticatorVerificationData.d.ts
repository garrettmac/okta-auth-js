import { Base, RemediationValues } from './Base';
export interface AuthenticatorVerificationDataValues extends RemediationValues {
    authenticators?: string[];
}
export declare class AuthenticatorVerificationData extends Base {
    values: AuthenticatorVerificationDataValues;
    map: {
        authenticator: string[];
    };
    canRemediate(): boolean;
    mapAuthenticator(): {
        id: string;
        enrollmentId: string;
        methodType: string;
    };
}

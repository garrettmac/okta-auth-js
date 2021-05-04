import { Base, RemediationValues } from './Base';
export interface IdentifyValues extends RemediationValues {
    username?: string;
    password?: string;
}
export declare class Identify extends Base {
    values: IdentifyValues;
    map: {
        identifier: string[];
        credentials: string[];
    };
    mapCredentials(): {
        passcode: string;
    };
}

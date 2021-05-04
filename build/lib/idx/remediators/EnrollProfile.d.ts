import { Base, RemediationValues } from './Base';
export interface EnrollProfileValues extends RemediationValues {
    firstName?: string;
    lastName?: string;
    email?: string;
}
export declare class EnrollProfile extends Base {
    values: EnrollProfileValues;
    map: {
        userProfile: string[];
    };
    mapUserProfile(): {
        firstName: string;
        lastName: string;
        email: string;
    };
    getErrorMessages(errorRemediation: any): any;
}

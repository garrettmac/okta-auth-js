import { Base } from './Base';
export declare class RedirectIdp extends Base {
    canRemediate(): boolean;
    getNextStep(): {
        name: string;
        type: string;
        idp: import("../types").IdpConfig;
        href: string;
    };
}

import { IdxTransactionMeta } from '../types/Transaction';
import { Base as Remeditor } from './remediators';
export { RemediationValues } from './remediators';
export { AuthenticationOptions } from './authenticate';
export { RegistrationOptions } from './register';
export { PasswordRecoveryOptions } from './recoverPassword';
export { CancelOptions } from './cancel';
export declare type RemediationFlow = Record<string, typeof Remeditor>;
export declare type IdxToRemediationValueMap = Record<string, string[] | string | boolean>;
export declare type NextStep = {
    name: string;
    type?: string;
};
export interface AcceptsInteractionHandle {
    interactionHandle?: string;
}
export interface IntrospectOptions extends AcceptsInteractionHandle {
    stateHandle?: string;
}
export interface InteractOptions extends AcceptsInteractionHandle {
    state?: string;
    scopes?: string[];
}
export interface InteractResponse {
    state?: string;
    stateHandle?: string;
    interactionHandle?: string;
    idxResponse?: IdxResponse;
    meta?: IdxTransactionMeta;
}
export interface IdxOptions extends InteractOptions, AcceptsInteractionHandle {
}
export declare enum IdxStatus {
    SUCCESS = 0,
    PENDING = 1,
    FAILED = 2
}
export interface IdpConfig {
    id: string;
    name: string;
}
export interface IdxRemeditionValue {
    name: string;
    type?: string;
    required?: boolean;
    value?: string;
    form?: {
        value: IdxRemeditionValue[];
    };
    options?: IdxRemediation[];
}
export interface IdxRemediation {
    name: string;
    label?: string;
    value: IdxRemeditionValue[];
    relatesTo: {
        type: string;
        value: {
            type: string;
        };
    };
    idp?: IdpConfig;
    href?: string;
    method?: string;
    type?: string;
}
export interface IdxMessage {
    message: string;
    class: string;
}
export interface IdxMessages {
    type: string;
    value: IdxMessage[];
}
export interface RawIdxResponse {
    version: string;
    stateHandle: string;
    remediation?: IdxRemediation[];
    messages?: IdxMessages;
}
export declare function isRawIdxResponse(obj: any): obj is RawIdxResponse;
export interface IdxResponse {
    proceed: (remediationName: string, params: unknown) => Promise<IdxResponse>;
    neededToProceed: IdxRemediation[];
    rawIdxState: RawIdxResponse;
    interactionCode?: string;
    actions: Record<string, Function>;
    toPersist: {
        interactionHandle?: string;
    };
}

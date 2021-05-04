export declare class TransactionState {
    interactionHandle?: string;
    stateToken?: string;
    type?: string;
    expiresAt?: string;
    relayState?: string;
    factorResult?: string;
    factorType?: string;
    recoveryToken?: string;
    recoveryType?: string;
    autoPush?: boolean | (() => boolean);
    rememberDevice?: boolean | (() => boolean);
    profile?: {
        updatePhone?: boolean;
    };
}

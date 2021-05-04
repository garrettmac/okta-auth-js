import { AuthState, AuthStateLogOptions } from './types';
import { OktaAuth } from '.';
declare const PCancelable: any;
export declare const DEFAULT_AUTH_STATE: {
    isPending: boolean;
    isAuthenticated: boolean;
    idToken: any;
    accessToken: any;
    refreshToken: any;
};
export declare class AuthStateManager {
    _sdk: OktaAuth;
    _pending: {
        updateAuthStatePromise: typeof PCancelable;
        canceledTimes: number;
    };
    _authState: AuthState;
    _logOptions: AuthStateLogOptions;
    _lastEventTimestamp: number;
    constructor(sdk: OktaAuth);
    _setLogOptions(options: any): void;
    getAuthState(): AuthState;
    updateAuthState(): void;
    subscribe(handler: any): void;
    unsubscribe(handler?: any): void;
}
export {};

/* eslint-disable max-statements */
/* eslint-disable complexity */
/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
/* SDK_VERSION is defined in webpack config */
/* global SDK_VERSION, window */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { DEFAULT_MAX_CLOCK_SKEW, REFERRER_PATH_STORAGE_KEY } from './constants';
import * as constants from './constants';
import { transactionStatus, resumeTransaction, transactionExists, introspect, postToTransaction } from './tx';
import PKCE from './oidc/util/pkce';
import { closeSession, sessionExists, getSession, refreshSession, setCookieAndRedirect } from './session';
import { getOAuthUrls, getWithoutPrompt, getWithPopup, getWithRedirect, isLoginRedirect, parseFromUrl, decodeToken, revokeToken, renewToken, renewTokens, renewTokensWithRefresh, getUserInfo, verifyToken, prepareTokenParams, exchangeCodeForTokens, isInteractionRequiredError, isInteractionRequired, } from './oidc';
import { isBrowser } from './features';
import * as features from './features';
import browserStorage from './browser/browserStorage';
import { toQueryString, toAbsoluteUrl, clone } from './util';
import { getUserAgent } from './builderUtil';
import { TokenManager } from './TokenManager';
import http from './http';
import PromiseQueue from './PromiseQueue';
import fingerprint from './browser/fingerprint';
import { AuthStateManager } from './AuthStateManager';
import StorageManager from './StorageManager';
import TransactionManager from './TransactionManager';
import { buildOptions } from './options';
import { authenticate, cancel, register, recoverPassword, handleInteractionCodeRedirect, } from './idx';
import { startAuthTransaction } from './idx/startAuthTransaction';
const Emitter = require('tiny-emitter');
class OktaAuth {
    constructor(args) {
        this.options = buildOptions(args);
        const { storageManager, cookies, storageUtil } = this.options;
        this.storageManager = new StorageManager(storageManager, cookies, storageUtil);
        this.transactionManager = new TransactionManager(Object.assign({
            storageManager: this.storageManager
        }, args.transactionManager));
        this.tx = {
            status: transactionStatus.bind(null, this),
            resume: resumeTransaction.bind(null, this),
            exists: Object.assign(transactionExists.bind(null, this), {
                _get: (name) => {
                    const storage = storageUtil.storage;
                    return storage.get(name);
                }
            }),
            introspect: introspect.bind(null, this)
        };
        this.pkce = {
            DEFAULT_CODE_CHALLENGE_METHOD: PKCE.DEFAULT_CODE_CHALLENGE_METHOD,
            generateVerifier: PKCE.generateVerifier,
            computeChallenge: PKCE.computeChallenge
        };
        // Add shims for compatibility, these will be removed in next major version. OKTA-362589
        Object.assign(this.options.storageUtil, {
            getPKCEStorage: this.storageManager.getLegacyPKCEStorage.bind(this.storageManager),
            getHttpCache: this.storageManager.getHttpCache.bind(this.storageManager),
        });
        this._pending = { handleLogin: false };
        if (isBrowser()) {
            this.options = Object.assign(this.options, {
                redirectUri: toAbsoluteUrl(args.redirectUri, window.location.origin), // allow relative URIs
            });
            this.userAgent = getUserAgent(args, `okta-auth-js/${SDK_VERSION}`);
        }
        else {
            this.userAgent = getUserAgent(args, `okta-auth-js-server/${SDK_VERSION}`);
        }
        // Digital clocks will drift over time, so the server
        // can misalign with the time reported by the browser.
        // The maxClockSkew allows relaxing the time-based
        // validation of tokens (in seconds, not milliseconds).
        // It currently defaults to 300, because 5 min is the
        // default maximum tolerance allowed by Kerberos.
        // (https://technet.microsoft.com/en-us/library/cc976357.aspx)
        if (!args.maxClockSkew && args.maxClockSkew !== 0) {
            this.options.maxClockSkew = DEFAULT_MAX_CLOCK_SKEW;
        }
        else {
            this.options.maxClockSkew = args.maxClockSkew;
        }
        this.session = {
            close: closeSession.bind(null, this),
            exists: sessionExists.bind(null, this),
            get: getSession.bind(null, this),
            refresh: refreshSession.bind(null, this),
            setCookieAndRedirect: setCookieAndRedirect.bind(null, this)
        };
        this._tokenQueue = new PromiseQueue();
        this.token = {
            prepareTokenParams: prepareTokenParams.bind(null, this),
            exchangeCodeForTokens: exchangeCodeForTokens.bind(null, this),
            getWithoutPrompt: getWithoutPrompt.bind(null, this),
            getWithPopup: getWithPopup.bind(null, this),
            getWithRedirect: getWithRedirect.bind(null, this),
            parseFromUrl: parseFromUrl.bind(null, this),
            decode: decodeToken,
            revoke: revokeToken.bind(null, this),
            renew: renewToken.bind(null, this),
            renewTokensWithRefresh: renewTokensWithRefresh.bind(null, this),
            renewTokens: renewTokens.bind(null, this),
            getUserInfo: getUserInfo.bind(null, this),
            verify: verifyToken.bind(null, this),
            isLoginRedirect: isLoginRedirect.bind(null, this)
        };
        // Wrap all async token API methods using MethodQueue to avoid issues with concurrency
        const syncMethods = ['decode', 'isLoginRedirect'];
        Object.keys(this.token).forEach(key => {
            if (syncMethods.indexOf(key) >= 0) { // sync methods should not be wrapped
                return;
            }
            var method = this.token[key];
            this.token[key] = PromiseQueue.prototype.push.bind(this._tokenQueue, method, null);
        });
        Object.assign(this.token.getWithRedirect, {
            // This is exposed so we can set window.location in our tests
            _setLocation: function (url) {
                window.location = url;
            }
        });
        Object.assign(this.token.parseFromUrl, {
            // This is exposed so we can mock getting window.history in our tests
            _getHistory: function () {
                return window.history;
            },
            // This is exposed so we can mock getting window.location in our tests
            _getLocation: function () {
                return window.location;
            },
            // This is exposed so we can mock getting window.document in our tests
            _getDocument: function () {
                return window.document;
            }
        });
        // IDX
        this.idx = {
            authenticate: authenticate.bind(null, this),
            register: register.bind(null, this),
            cancel: cancel.bind(null, this),
            recoverPassword: recoverPassword.bind(null, this),
            handleInteractionCodeRedirect: handleInteractionCodeRedirect.bind(null, this),
            startAuthTransaction: startAuthTransaction.bind(null, this),
        };
        // Fingerprint API
        this.fingerprint = fingerprint.bind(null, this);
        this.emitter = new Emitter();
        // TokenManager
        this.tokenManager = new TokenManager(this, args.tokenManager);
        // AuthStateManager
        this.authStateManager = new AuthStateManager(this);
    }
    start() {
        this.tokenManager.start();
        this.authStateManager.updateAuthState();
    }
    stop() {
        this.tokenManager.stop();
    }
    // ES6 module users can use named exports to access all symbols
    // CommonJS module users (CDN) need all exports on this object
    // Utility methods for interaction code flow
    isInteractionRequired() {
        return isInteractionRequired(this);
    }
    isInteractionRequiredError(error) {
        return isInteractionRequiredError(error);
    }
    signIn(opts = { useInteractionCodeFlow: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            const useInteractionCodeFlow = opts.useInteractionCodeFlow || this.options.useInteractionCodeFlow;
            if (useInteractionCodeFlow) {
                return authenticate(this, opts);
            }
            // Authn V1 flow
            return this.signInWithCredentials(opts);
        });
    }
    signInWithCredentials(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            opts = clone(opts || {});
            const _postToTransaction = (options) => {
                delete opts.sendFingerprint;
                return postToTransaction(this, '/api/v1/authn', opts, options);
            };
            if (!opts.sendFingerprint) {
                return _postToTransaction();
            }
            return this.fingerprint()
                .then(function (fingerprint) {
                return _postToTransaction({
                    headers: {
                        'X-Device-Fingerprint': fingerprint
                    }
                });
            });
        });
    }
    signInWithRedirect(opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { originalUri } = opts, additionalParams = __rest(opts, ["originalUri"]);
            if (this._pending.handleLogin) {
                // Don't trigger second round
                return;
            }
            this._pending.handleLogin = true;
            try {
                // Trigger default signIn redirect flow
                if (originalUri) {
                    this.setOriginalUri(originalUri);
                }
                const params = Object.assign({
                    // TODO: remove this line when default scopes are changed OKTA-343294
                    scopes: this.options.scopes || ['openid', 'email', 'profile']
                }, additionalParams);
                yield this.token.getWithRedirect(params);
            }
            finally {
                this._pending.handleLogin = false;
            }
        });
    }
    // Ends the current Okta SSO session without redirecting to Okta.
    closeSession() {
        // Clear all local tokens
        this.tokenManager.clear();
        return this.session.close() // DELETE /api/v1/sessions/me
            .catch(function (e) {
            if (e.name === 'AuthApiError' && e.errorCode === 'E0000007') {
                // Session does not exist or has already been closed
                return null;
            }
            throw e;
        });
    }
    // Revokes the access token for the application session
    revokeAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessToken) {
                accessToken = (yield this.tokenManager.getTokens()).accessToken;
                const accessTokenKey = this.tokenManager.getStorageKeyByType('accessToken');
                this.tokenManager.remove(accessTokenKey);
            }
            // Access token may have been removed. In this case, we will silently succeed.
            if (!accessToken) {
                return Promise.resolve(null);
            }
            return this.token.revoke(accessToken);
        });
    }
    // Revokes the refresh token for the application session
    revokeRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                refreshToken = (yield this.tokenManager.getTokens()).refreshToken;
                const refreshTokenKey = this.tokenManager.getStorageKeyByType('refreshToken');
                this.tokenManager.remove(refreshTokenKey);
            }
            // Refresh token may have been removed. In this case, we will silently succeed.
            if (!refreshToken) {
                return Promise.resolve(null);
            }
            return this.token.revoke(refreshToken);
        });
    }
    getSignOutRedirectUrl(options = {}) {
        let { idToken, postLogoutRedirectUri, state, } = options;
        if (!idToken) {
            idToken = this.tokenManager.getTokensSync().idToken;
        }
        if (!idToken) {
            return '';
        }
        if (!postLogoutRedirectUri) {
            postLogoutRedirectUri = this.options.postLogoutRedirectUri;
        }
        const logoutUrl = getOAuthUrls(this).logoutUrl;
        const idTokenHint = idToken.idToken; // a string
        let logoutUri = logoutUrl + '?id_token_hint=' + encodeURIComponent(idTokenHint);
        if (postLogoutRedirectUri) {
            logoutUri += '&post_logout_redirect_uri=' + encodeURIComponent(postLogoutRedirectUri);
        }
        // State allows option parameters to be passed to logout redirect uri
        if (state) {
            logoutUri += '&state=' + encodeURIComponent(state);
        }
        return logoutUri;
    }
    // Revokes refreshToken or accessToken, clears all local tokens, then redirects to Okta to end the SSO session.
    signOut(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({}, options);
            // postLogoutRedirectUri must be whitelisted in Okta Admin UI
            var defaultUri = window.location.origin;
            var currentUri = window.location.href;
            var postLogoutRedirectUri = options.postLogoutRedirectUri
                || this.options.postLogoutRedirectUri
                || defaultUri;
            var accessToken = options.accessToken;
            var refreshToken = options.refreshToken;
            var revokeAccessToken = options.revokeAccessToken !== false;
            var revokeRefreshToken = options.revokeRefreshToken !== false;
            if (revokeRefreshToken && typeof refreshToken === 'undefined') {
                refreshToken = this.tokenManager.getTokensSync().refreshToken;
            }
            if (revokeAccessToken && typeof accessToken === 'undefined') {
                accessToken = this.tokenManager.getTokensSync().accessToken;
            }
            if (!options.idToken) {
                options.idToken = this.tokenManager.getTokensSync().idToken;
            }
            // Clear all local tokens
            this.tokenManager.clear();
            if (revokeRefreshToken && refreshToken) {
                yield this.revokeRefreshToken(refreshToken);
            }
            if (revokeAccessToken && accessToken) {
                yield this.revokeAccessToken(accessToken);
            }
            const logoutUri = this.getSignOutRedirectUrl(Object.assign(Object.assign({}, options), { postLogoutRedirectUri }));
            // No logoutUri? This can happen if the storage was cleared.
            // Fallback to XHR signOut, then simulate a redirect to the post logout uri
            if (!logoutUri) {
                return this.closeSession() // can throw if the user cannot be signed out
                    .then(function () {
                    if (postLogoutRedirectUri === currentUri) {
                        window.location.reload(); // force a hard reload if URI is not changing
                    }
                    else {
                        window.location.assign(postLogoutRedirectUri);
                    }
                });
            }
            else {
                // Flow ends with logout redirect
                window.location.assign(logoutUri);
            }
        });
    }
    webfinger(opts) {
        var url = '/.well-known/webfinger' + toQueryString(opts);
        var options = {
            headers: {
                'Accept': 'application/jrd+json'
            }
        };
        return http.get(this, url, options);
    }
    //
    // Common Methods from downstream SDKs
    //
    isAuthenticated(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            const authState = this.authStateManager.getAuthState();
            if (!authState.isPending) {
                return Promise.resolve(authState.isAuthenticated);
            }
            let clear, handler, timeoutId;
            return new Promise(resolve => {
                clear = () => {
                    this.authStateManager.unsubscribe(handler);
                    clearTimeout(timeoutId);
                };
                handler = ({ isAuthenticated, isPending }) => {
                    if (!isPending) {
                        resolve(isAuthenticated);
                        clear();
                    }
                };
                timeoutId = setTimeout(() => {
                    resolve(false);
                    clear();
                }, timeout || 60 * 1000);
                this.authStateManager.subscribe(handler);
                this.authStateManager.updateAuthState();
            });
        });
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const { idToken, accessToken } = this.authStateManager.getAuthState();
            return this.token.getUserInfo(accessToken, idToken);
        });
    }
    getIdToken() {
        const { idToken } = this.authStateManager.getAuthState();
        return idToken ? idToken.idToken : undefined;
    }
    getAccessToken() {
        const { accessToken } = this.authStateManager.getAuthState();
        return accessToken ? accessToken.accessToken : undefined;
    }
    getRefreshToken() {
        const { refreshToken } = this.authStateManager.getAuthState();
        return refreshToken ? refreshToken.refreshToken : undefined;
    }
    /**
     * Store parsed tokens from redirect url
     */
    storeTokensFromRedirect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokens } = yield this.token.parseFromUrl();
            this.tokenManager.setTokens(tokens);
        });
    }
    setOriginalUri(originalUri) {
        const storage = browserStorage.getSessionStorage();
        storage.setItem(REFERRER_PATH_STORAGE_KEY, originalUri);
    }
    getOriginalUri() {
        const storage = browserStorage.getSessionStorage();
        const originalUri = storage.getItem(REFERRER_PATH_STORAGE_KEY);
        return originalUri;
    }
    removeOriginalUri() {
        const storage = browserStorage.getSessionStorage();
        storage.removeItem(REFERRER_PATH_STORAGE_KEY);
    }
    isLoginRedirect() {
        return isLoginRedirect(this);
    }
    handleLoginRedirect(tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            const handleRedirect = ({ isPending }) => __awaiter(this, void 0, void 0, function* () {
                if (isPending) {
                    return;
                }
                // Unsubscribe listener
                this.authStateManager.unsubscribe(handleRedirect);
                // Get and clear originalUri from storage
                const originalUri = this.getOriginalUri();
                this.removeOriginalUri();
                // Redirect to originalUri
                const { restoreOriginalUri } = this.options;
                if (restoreOriginalUri) {
                    yield restoreOriginalUri(this, originalUri);
                }
                else {
                    window.location.replace(originalUri);
                }
            });
            // Handle redirect after authState is updated 
            this.authStateManager.subscribe(handleRedirect);
            // Store tokens and update AuthState by the emitted events
            if (tokens) {
                this.tokenManager.setTokens(tokens);
            }
            else if (this.isLoginRedirect()) {
                yield this.storeTokensFromRedirect();
            }
            else {
                this.authStateManager.unsubscribe(handleRedirect);
            }
        });
    }
    isPKCE() {
        return !!this.options.pkce;
    }
    hasResponseType(responseType) {
        let hasResponseType = false;
        if (Array.isArray(this.options.responseType) && this.options.responseType.length) {
            hasResponseType = this.options.responseType.indexOf(responseType) >= 0;
        }
        else {
            hasResponseType = this.options.responseType === responseType;
        }
        return hasResponseType;
    }
    isAuthorizationCodeFlow() {
        return this.hasResponseType('code');
    }
    // { username, password, (relayState), (context) }
    // signIn(opts: SignInWithCredentialsOptions): Promise<AuthTransaction> {
    //   return postToTransaction(this, '/api/v1/authn', opts);
    // }
    getIssuerOrigin() {
        // Infer the URL from the issuer URL, omitting the /oauth2/{authServerId}
        return this.options.issuer.split('/oauth2/')[0];
    }
    // { username, (relayState) }
    forgotPassword(opts) {
        return postToTransaction(this, '/api/v1/authn/recovery/password', opts);
    }
    resetPassword(opts) {
        return postToTransaction(this, '/api/v1/authn/credentials/reset_password', opts);
    }
    // { username, (relayState) }
    unlockAccount(opts) {
        return postToTransaction(this, '/api/v1/authn/recovery/unlock', opts);
    }
    // { recoveryToken }
    verifyRecoveryToken(opts) {
        return postToTransaction(this, '/api/v1/authn/recovery/token', opts);
    }
}
// Hoist feature detection functions to static type
OktaAuth.features = OktaAuth.prototype.features = features;
// Also hoist values and utility functions for CommonJS users
Object.assign(OktaAuth, {
    constants,
    isInteractionRequiredError
});
export default OktaAuth;

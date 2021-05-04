/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { warn } from '../util';
import { getOAuthUrls } from '../oidc';
export function getTransactionMeta(authClient) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load existing transaction meta from storage
        if (authClient.transactionManager.exists()) {
            const existing = authClient.transactionManager.load();
            if (isTransactionMetaValid(authClient, existing)) {
                return existing;
            }
            // existing meta is not valid for this configuration
            // this is common when changing configuration in local development environment
            // in a production environment, this may indicate that two apps are sharing a storage key
            warn('Saved transaction meta does not match the current configuration. ' +
                'This may indicate that two apps are sharing a storage key.');
        }
        // Calculate new values
        const tokenParams = yield authClient.token.prepareTokenParams();
        const urls = getOAuthUrls(authClient, tokenParams);
        const issuer = authClient.options.issuer;
        const { pkce, clientId, redirectUri, responseType, responseMode, scopes, state, nonce, ignoreSignature, codeVerifier, codeChallengeMethod, codeChallenge, } = tokenParams;
        const meta = {
            issuer,
            pkce,
            clientId,
            redirectUri,
            responseType,
            responseMode,
            scopes,
            state,
            nonce,
            urls,
            ignoreSignature,
            codeVerifier,
            codeChallengeMethod,
            codeChallenge
        };
        return meta;
    });
}
export function saveTransactionMeta(authClient, meta) {
    authClient.transactionManager.save(meta);
}
export function clearTransactionMeta(authClient) {
    authClient.transactionManager.clear();
}
// returns true if values in meta match current authClient options
export function isTransactionMetaValid(authClient, meta) {
    const keys = ['issuer', 'clientId', 'redirectUri'];
    const mismatch = keys.find(key => {
        return authClient.options[key] !== meta[key];
    });
    return !mismatch;
}

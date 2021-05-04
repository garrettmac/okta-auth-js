var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthSdkError, OAuthError } from '../errors';
export function handleInteractionCodeRedirect(authClient, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = authClient.transactionManager.load();
        if (!meta) {
            throw new Error('No transaction data was found in storage');
        }
        const { codeVerifier, state: savedState } = meta;
        const { searchParams
        // URL API has been added to the polyfill
        // eslint-disable-next-line compat/compat
         } = new URL(url);
        const state = searchParams.get('state');
        const interactionCode = searchParams.get('interaction_code');
        // Error handling
        const error = searchParams.get('error');
        if (error) {
            throw new OAuthError(error, searchParams.get('error_description'));
        }
        if (state !== savedState) {
            throw new AuthSdkError('State in redirect uri does not match with transaction state');
        }
        if (!interactionCode) {
            throw new AuthSdkError('Unable to parse interaction_code from the url');
        }
        // Save tokens to storage
        const { tokens } = yield authClient.token.exchangeCodeForTokens({ interactionCode, codeVerifier });
        authClient.tokenManager.setTokens(tokens);
    });
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable max-statements, max-depth */
import { AuthTransaction } from '../tx';
import { interact } from './interact';
import { remediate } from './remediate';
import { IdxStatus, } from '../types';
export function run(authClient, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { flow, actions } = options;
        let tokens;
        let nextStep;
        let interactionHandle;
        let error;
        let status;
        try {
            // Start/resume the flow
            let { idxResponse, stateHandle } = yield interact(authClient, options);
            interactionHandle = idxResponse.toPersist.interactionHandle;
            // Call first available option
            if (actions) {
                for (let action of actions) {
                    if (typeof idxResponse.actions[action] === 'function') {
                        idxResponse = yield idxResponse.actions[action]();
                        break;
                    }
                }
            }
            const values = Object.assign(Object.assign({}, options), { stateHandle });
            // Can we handle the remediations?
            const { idxResponse: { interactionCode, } = {}, nextStep: nextStepFromResp, formError, } = yield remediate(idxResponse, flow, values);
            // Track nextStep and formError
            nextStep = nextStepFromResp;
            error = formError;
            // Did we get an interaction code?
            status = IdxStatus.PENDING;
            if (interactionCode) {
                const meta = authClient.transactionManager.load();
                const { codeVerifier, clientId, redirectUri, scopes, urls, ignoreSignature } = meta;
                tokens = yield authClient.token.exchangeCodeForTokens({
                    interactionCode,
                    codeVerifier,
                    clientId,
                    redirectUri,
                    scopes,
                    ignoreSignature
                }, urls);
                status = IdxStatus.SUCCESS;
            }
        }
        catch (err) {
            error = err;
            status = IdxStatus.FAILED;
            // Clear transaction meta when error is not handlable
            authClient.transactionManager.clear();
        }
        const authTransaction = new AuthTransaction(authClient, {
            interactionHandle,
            tokens: tokens ? tokens.tokens : null,
            status,
            nextStep,
            error,
        });
        return authTransaction;
    });
}

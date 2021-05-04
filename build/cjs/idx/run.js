"use strict";

exports.run = run;

var _tx = require("../tx");

var _interact = require("./interact");

var _remediate = require("./remediate");

var _types = require("../types");

/* eslint-disable max-statements, max-depth */
async function run(authClient, options) {
  const {
    flow,
    actions
  } = options;
  let tokens;
  let nextStep;
  let interactionHandle;
  let error;
  let status;

  try {
    // Start/resume the flow
    let {
      idxResponse,
      stateHandle
    } = await (0, _interact.interact)(authClient, options);
    interactionHandle = idxResponse.toPersist.interactionHandle; // Call first available option

    if (actions) {
      for (let action of actions) {
        if (typeof idxResponse.actions[action] === 'function') {
          idxResponse = await idxResponse.actions[action]();
          break;
        }
      }
    }

    const values = { ...options,
      stateHandle
    }; // Can we handle the remediations?

    const {
      idxResponse: {
        interactionCode
      } = {},
      nextStep: nextStepFromResp,
      formError
    } = await (0, _remediate.remediate)(idxResponse, flow, values); // Track nextStep and formError

    nextStep = nextStepFromResp;
    error = formError; // Did we get an interaction code?

    status = _types.IdxStatus.PENDING;

    if (interactionCode) {
      const meta = authClient.transactionManager.load();
      const {
        codeVerifier,
        clientId,
        redirectUri,
        scopes,
        urls,
        ignoreSignature
      } = meta;
      tokens = await authClient.token.exchangeCodeForTokens({
        interactionCode,
        codeVerifier,
        clientId,
        redirectUri,
        scopes,
        ignoreSignature
      }, urls);
      status = _types.IdxStatus.SUCCESS;
    }
  } catch (err) {
    error = err;
    status = _types.IdxStatus.FAILED; // Clear transaction meta when error is not handlable

    authClient.transactionManager.clear();
  }

  const authTransaction = new _tx.AuthTransaction(authClient, {
    interactionHandle,
    tokens: tokens ? tokens.tokens : null,
    status,
    nextStep,
    error
  });
  return authTransaction;
}
//# sourceMappingURL=run.js.map
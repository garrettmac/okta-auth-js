"use strict";

exports.handleInteractionCodeRedirect = handleInteractionCodeRedirect;

var _errors = require("../errors");

async function handleInteractionCodeRedirect(authClient, url) {
  const meta = authClient.transactionManager.load();

  if (!meta) {
    throw new Error('No transaction data was found in storage');
  }

  const {
    codeVerifier,
    state: savedState
  } = meta;
  const {
    searchParams // URL API has been added to the polyfill
    // eslint-disable-next-line compat/compat

  } = new URL(url);
  const state = searchParams.get('state');
  const interactionCode = searchParams.get('interaction_code'); // Error handling

  const error = searchParams.get('error');

  if (error) {
    throw new _errors.OAuthError(error, searchParams.get('error_description'));
  }

  if (state !== savedState) {
    throw new _errors.AuthSdkError('State in redirect uri does not match with transaction state');
  }

  if (!interactionCode) {
    throw new _errors.AuthSdkError('Unable to parse interaction_code from the url');
  } // Save tokens to storage


  const {
    tokens
  } = await authClient.token.exchangeCodeForTokens({
    interactionCode,
    codeVerifier
  });
  authClient.tokenManager.setTokens(tokens);
}
//# sourceMappingURL=handleInteractionCodeRedirect.js.map
"use strict";

exports.isInteractionRequiredError = isInteractionRequiredError;
exports.isAuthorizationCodeError = isAuthorizationCodeError;

function isInteractionRequiredError(error) {
  if (error.name !== 'OAuthError') {
    return false;
  }

  const oauthError = error;
  return oauthError.errorCode === 'interaction_required';
}

function isAuthorizationCodeError(sdk, error) {
  if (error.name !== 'AuthApiError') {
    return false;
  }

  const authApiError = error; // xhr property doesn't seem to match XMLHttpRequest type

  const errorResponse = authApiError.xhr;
  const responseJSON = errorResponse?.responseJSON;
  return sdk.options.pkce && responseJSON?.error === 'invalid_grant';
}
//# sourceMappingURL=errors.js.map
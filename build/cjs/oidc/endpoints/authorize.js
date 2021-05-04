"use strict";

exports.convertTokenParamsToOAuthParams = convertTokenParamsToOAuthParams;
exports.buildAuthorizeParams = buildAuthorizeParams;

var _util = require("../../util");

var _errors = require("../../errors");

function convertTokenParamsToOAuthParams(tokenParams) {
  // Quick validation
  if (!tokenParams.clientId) {
    throw new _errors.AuthSdkError('A clientId must be specified in the OktaAuth constructor to get a token');
  }

  if ((0, _util.isString)(tokenParams.responseType) && tokenParams.responseType.indexOf(' ') !== -1) {
    throw new _errors.AuthSdkError('Multiple OAuth responseTypes must be defined as an array');
  } // Convert our params to their actual OAuth equivalents


  var oauthParams = {
    'client_id': tokenParams.clientId,
    'code_challenge': tokenParams.codeChallenge,
    'code_challenge_method': tokenParams.codeChallengeMethod,
    'display': tokenParams.display,
    'idp': tokenParams.idp,
    'idp_scope': tokenParams.idpScope,
    'login_hint': tokenParams.loginHint,
    'max_age': tokenParams.maxAge,
    'nonce': tokenParams.nonce,
    'prompt': tokenParams.prompt,
    'redirect_uri': tokenParams.redirectUri,
    'response_mode': tokenParams.responseMode,
    'response_type': tokenParams.responseType,
    'sessionToken': tokenParams.sessionToken,
    'state': tokenParams.state
  };
  oauthParams = (0, _util.removeNils)(oauthParams);
  ['idp_scope', 'response_type'].forEach(function (mayBeArray) {
    if (Array.isArray(oauthParams[mayBeArray])) {
      oauthParams[mayBeArray] = oauthParams[mayBeArray].join(' ');
    }
  });

  if (tokenParams.responseType.indexOf('id_token') !== -1 && tokenParams.scopes.indexOf('openid') === -1) {
    throw new _errors.AuthSdkError('openid scope must be specified in the scopes argument when requesting an id_token');
  } else {
    oauthParams.scope = tokenParams.scopes.join(' ');
  }

  return oauthParams;
}

function buildAuthorizeParams(tokenParams) {
  var oauthQueryParams = convertTokenParamsToOAuthParams(tokenParams);
  return (0, _util.toQueryString)(oauthQueryParams);
}
//# sourceMappingURL=authorize.js.map
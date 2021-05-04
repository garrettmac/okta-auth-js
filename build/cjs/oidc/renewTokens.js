"use strict";

exports.renewTokens = renewTokens;

var _getWithoutPrompt = require("./getWithoutPrompt");

var _renewTokensWithRefresh = require("./renewTokensWithRefresh");

var _util = require("./util");

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
 *
 */
function renewTokens(sdk, options) {
  // If we have a refresh token, renew using that, otherwise getWithoutPrompt
  // Calling via async as auth-js doesn't yet (as of 4.2) ensure that updateAuthState() was ever called
  return sdk.tokenManager.getTokens().then(tokens => tokens.refreshToken).then(refreshTokenObject => {
    if (refreshTokenObject) {
      return (0, _renewTokensWithRefresh.renewTokensWithRefresh)(sdk, options, refreshTokenObject);
    }

    options = Object.assign({
      scopes: sdk.options.scopes,
      authorizeUrl: sdk.options.authorizeUrl,
      userinfoUrl: sdk.options.userinfoUrl,
      issuer: sdk.options.issuer
    }, options);

    if (sdk.options.pkce) {
      options.responseType = 'code';
    } else {
      const {
        responseType
      } = (0, _util.getDefaultTokenParams)(sdk);
      options.responseType = responseType;
    }

    return (0, _getWithoutPrompt.getWithoutPrompt)(sdk, options).then(res => res.tokens);
  });
}
//# sourceMappingURL=renewTokens.js.map
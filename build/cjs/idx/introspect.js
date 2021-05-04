"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.introspect = introspect;

var _oktaIdxJs = _interopRequireDefault(require("@okta/okta-idx-js"));

var _constants = require("../constants");

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
async function introspect(authClient, options) {
  const domain = authClient.options.issuer.split('/oauth2')[0];
  const version = _constants.IDX_API_VERSION;
  return _oktaIdxJs.default.start({
    domain,
    version,
    ...options
  });
}
//# sourceMappingURL=introspect.js.map
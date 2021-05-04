"use strict";

exports.authenticate = authenticate;

var _run = require("./run");

var _remediators = require("./remediators");

const flow = {
  'identify': _remediators.Identify,
  'select-authenticator-authenticate': _remediators.SelectAuthenticator,
  'challenge-authenticator': _remediators.EnrollOrChallengeAuthenticator,
  'reenroll-authenticator': _remediators.ReEnrollAuthenticator,
  'redirect-idp': _remediators.RedirectIdp
};

async function authenticate(authClient, options) {
  return (0, _run.run)(authClient, { ...options,
    flow
  });
}
//# sourceMappingURL=authenticate.js.map
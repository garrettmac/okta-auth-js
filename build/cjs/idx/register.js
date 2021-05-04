"use strict";

exports.register = register;

var _run = require("./run");

var _remediators = require("./remediators");

const flow = {
  'select-enroll-profile': _remediators.SelectEnrollProfile,
  'enroll-profile': _remediators.EnrollProfile,
  'select-authenticator-enroll': _remediators.SelectAuthenticator,
  'enroll-authenticator': _remediators.EnrollOrChallengeAuthenticator
};

async function register(authClient, options) {
  return (0, _run.run)(authClient, { ...options,
    flow
  });
}
//# sourceMappingURL=register.js.map
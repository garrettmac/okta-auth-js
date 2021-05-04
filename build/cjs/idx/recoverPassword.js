"use strict";

exports.recoverPassword = recoverPassword;

var _run = require("./run");

var _remediators = require("./remediators");

const flow = {
  'identify-recovery': _remediators.Identify,
  'select-authenticator-authenticate': _remediators.SelectAuthenticator,
  'challenge-authenticator': _remediators.EnrollOrChallengeAuthenticator,
  'authenticator-verification-data': _remediators.AuthenticatorVerificationData,
  'reset-authenticator': _remediators.EnrollOrChallengeAuthenticator
};

async function recoverPassword(authClient, options) {
  return (0, _run.run)(authClient, { ...options,
    flow,
    actions: ['currentAuthenticator-recover', 'currentAuthenticatorEnrollment-recover']
  });
}
//# sourceMappingURL=recoverPassword.js.map
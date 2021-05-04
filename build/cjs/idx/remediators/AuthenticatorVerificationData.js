"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.AuthenticatorVerificationData = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Base = require("./Base");

class AuthenticatorVerificationData extends _Base.Base {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "map", {
      'authenticator': ['authenticator']
    });
  }

  canRemediate() {
    // TODO: check if authenticator exist in values
    return this.remediation.value.some(({
      name
    }) => name === 'authenticator');
  }

  mapAuthenticator() {
    const authenticatorVal = this.remediation.value.find(({
      name
    }) => name === 'authenticator').form.value;
    return {
      id: authenticatorVal.find(({
        name
      }) => name === 'id').value,
      enrollmentId: authenticatorVal.find(({
        name
      }) => name === 'enrollmentId').value,
      methodType: 'sms'
    };
  }

}

exports.AuthenticatorVerificationData = AuthenticatorVerificationData;
//# sourceMappingURL=AuthenticatorVerificationData.js.map
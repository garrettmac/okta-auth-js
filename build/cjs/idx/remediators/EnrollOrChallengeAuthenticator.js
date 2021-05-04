"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.EnrollOrChallengeAuthenticator = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Base = require("./Base");

class EnrollOrChallengeAuthenticator extends _Base.Base {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "map", {
      'credentials': ['password', 'verificationCode']
    });
  }

  canRemediate() {
    if (this.values.verificationCode && ['email', 'phone'].includes(this.remediation.relatesTo.value.type)) {
      return true;
    }

    if (this.values.password && this.remediation.relatesTo.value.type === 'password') {
      return true;
    }

    return false;
  }

  mapCredentials() {
    return {
      passcode: this.values.verificationCode || this.values.password
    };
  }

  getNextStep() {
    return {
      name: this.remediation.name,
      type: this.remediation.relatesTo.value.type
    };
  }

  getErrorMessages(errorRemediation) {
    return errorRemediation.value[0].form.value.reduce((errors, field) => {
      if (field.messages) {
        errors.push(field.messages.value[0].message);
      }

      return errors;
    }, []);
  }

}

exports.EnrollOrChallengeAuthenticator = EnrollOrChallengeAuthenticator;
//# sourceMappingURL=EnrollOrChallengeAuthenticator.js.map
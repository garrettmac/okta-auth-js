"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.ReEnrollAuthenticator = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Base = require("./Base");

class ReEnrollAuthenticator extends _Base.Base {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "map", {
      'credentials': ['newPassword']
    });
  }

  mapCredentials() {
    return {
      passcode: this.values.newPassword
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

exports.ReEnrollAuthenticator = ReEnrollAuthenticator;
//# sourceMappingURL=ReEnrollAuthenticator.js.map
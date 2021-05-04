"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.SelectAuthenticator = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Base = require("./Base");

var _errors = require("../../errors");

// Find matched authenticator in provided order
function findMatchedOption(authenticators, options) {
  let option;

  for (let authenticator of authenticators) {
    option = options.find(({
      relatesTo
    }) => relatesTo.type === authenticator);

    if (option) {
      break;
    }
  }

  return option;
}

class SelectAuthenticator extends _Base.Base {
  constructor(remediation, values) {
    super(remediation, values);
    (0, _defineProperty2.default)(this, "map", {
      authenticator: null // value here does not matter, fall to the custom map function

    });
    this.remediationValue = this.remediation.value.find(({
      name
    }) => name === 'authenticator');
  }

  canRemediate() {
    const {
      authenticators
    } = this.values;
    const {
      options
    } = this.remediationValue; // Let users select authenticator if no input is provided

    if (!authenticators || !authenticators.length) {
      return false;
    } // Proceed with provided authenticators


    const matchedOption = findMatchedOption(authenticators, options);

    if (matchedOption) {
      return true;
    } // Terminate idx interaction if provided authenticators are not supported


    throw new _errors.AuthSdkError('Provided authenticators are not supported, please check your org configuration');
  }

  getNextStep() {
    const authenticators = this.remediationValue.options.map(option => {
      const {
        label,
        relatesTo: {
          type
        }
      } = option;
      return {
        label,
        value: type
      };
    });
    return {
      name: this.remediation.name,
      authenticators
    };
  }

  mapAuthenticator(remediationValue) {
    const {
      authenticators
    } = this.values;
    const {
      options
    } = remediationValue;
    const selectedOption = findMatchedOption(authenticators, options);
    return {
      id: selectedOption?.value.form.value.find(({
        name
      }) => name === 'id').value
    };
  }

}

exports.SelectAuthenticator = SelectAuthenticator;
//# sourceMappingURL=SelectAuthenticator.js.map
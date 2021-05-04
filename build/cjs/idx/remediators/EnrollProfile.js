"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.EnrollProfile = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Base = require("./Base");

class EnrollProfile extends _Base.Base {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "map", {
      'userProfile': ['firstName', 'lastName', 'email']
    });
  }

  mapUserProfile() {
    const {
      firstName,
      lastName,
      email
    } = this.values;
    return {
      firstName,
      lastName,
      email
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

exports.EnrollProfile = EnrollProfile;
//# sourceMappingURL=EnrollProfile.js.map
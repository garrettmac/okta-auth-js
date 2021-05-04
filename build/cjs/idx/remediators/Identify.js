"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.Identify = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Base = require("./Base");

class Identify extends _Base.Base {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "map", {
      'identifier': ['identifier', 'username'],
      'credentials': ['credentials', 'password']
    });
  }

  mapCredentials() {
    return {
      passcode: this.values.password
    };
  }

}

exports.Identify = Identify;
//# sourceMappingURL=Identify.js.map
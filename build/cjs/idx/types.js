"use strict";

exports.isRawIdxResponse = isRawIdxResponse;
Object.defineProperty(exports, "RemediationValues", {
  enumerable: true,
  get: function () {
    return _remediators.RemediationValues;
  }
});
Object.defineProperty(exports, "AuthenticationOptions", {
  enumerable: true,
  get: function () {
    return _authenticate.AuthenticationOptions;
  }
});
Object.defineProperty(exports, "RegistrationOptions", {
  enumerable: true,
  get: function () {
    return _register.RegistrationOptions;
  }
});
Object.defineProperty(exports, "PasswordRecoveryOptions", {
  enumerable: true,
  get: function () {
    return _recoverPassword.PasswordRecoveryOptions;
  }
});
Object.defineProperty(exports, "CancelOptions", {
  enumerable: true,
  get: function () {
    return _cancel.CancelOptions;
  }
});
exports.IdxStatus = void 0;

var _remediators = require("./remediators");

var _authenticate = require("./authenticate");

var _register = require("./register");

var _recoverPassword = require("./recoverPassword");

var _cancel = require("./cancel");

let IdxStatus;
exports.IdxStatus = IdxStatus;

(function (IdxStatus) {
  IdxStatus[IdxStatus["SUCCESS"] = 0] = "SUCCESS";
  IdxStatus[IdxStatus["PENDING"] = 1] = "PENDING";
  IdxStatus[IdxStatus["FAILED"] = 2] = "FAILED";
})(IdxStatus || (exports.IdxStatus = IdxStatus = {}));

function isRawIdxResponse(obj) {
  return obj && obj.version;
} // Object returned from idx-js
//# sourceMappingURL=types.js.map
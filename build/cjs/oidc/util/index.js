"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _exportNames = {
  pkce: true
};
Object.defineProperty(exports, "pkce", {
  enumerable: true,
  get: function () {
    return _pkce.default;
  }
});

var _browser = require("./browser");

Object.keys(_browser).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _browser[key];
    }
  });
});

var _defaultTokenParams = require("./defaultTokenParams");

Object.keys(_defaultTokenParams).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _defaultTokenParams[key];
    }
  });
});

var _errors = require("./errors");

Object.keys(_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _errors[key];
    }
  });
});

var _loginRedirect = require("./loginRedirect");

Object.keys(_loginRedirect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _loginRedirect[key];
    }
  });
});

var _oauth = require("./oauth");

Object.keys(_oauth).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _oauth[key];
    }
  });
});

var _pkce = _interopRequireDefault(require("./pkce"));

var _prepareTokenParams = require("./prepareTokenParams");

Object.keys(_prepareTokenParams).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _prepareTokenParams[key];
    }
  });
});

var _urlParams = require("./urlParams");

Object.keys(_urlParams).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _urlParams[key];
    }
  });
});

var _validateClaims = require("./validateClaims");

Object.keys(_validateClaims).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validateClaims[key];
    }
  });
});
//# sourceMappingURL=index.js.map
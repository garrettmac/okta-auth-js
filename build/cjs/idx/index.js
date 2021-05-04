"use strict";

var _authenticate = require("./authenticate");

Object.keys(_authenticate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authenticate[key];
    }
  });
});

var _introspect = require("./introspect");

Object.keys(_introspect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _introspect[key];
    }
  });
});

var _cancel = require("./cancel");

Object.keys(_cancel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cancel[key];
    }
  });
});

var _register = require("./register");

Object.keys(_register).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _register[key];
    }
  });
});

var _recoverPassword = require("./recoverPassword");

Object.keys(_recoverPassword).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _recoverPassword[key];
    }
  });
});

var _handleInteractionCodeRedirect = require("./handleInteractionCodeRedirect");

Object.keys(_handleInteractionCodeRedirect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _handleInteractionCodeRedirect[key];
    }
  });
});
//# sourceMappingURL=index.js.map
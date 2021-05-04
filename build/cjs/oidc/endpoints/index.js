"use strict";

var _authorize = require("./authorize");

Object.keys(_authorize).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authorize[key];
    }
  });
});

var _token = require("./token");

Object.keys(_token).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _token[key];
    }
  });
});

var _wellKnown = require("./well-known");

Object.keys(_wellKnown).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _wellKnown[key];
    }
  });
});
//# sourceMappingURL=index.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toast = require('./js/toast');

// register plugin if it is used via cdn or directly as a script tag
if (typeof window !== 'undefined') {
	window.Toasted = _toast.Toasted;
}

exports.default = _toast.Toasted;
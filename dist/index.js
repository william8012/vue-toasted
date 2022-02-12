'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toast = require('./js/toast');

var _toast2 = require('./toast.vue');

var _toast3 = _interopRequireDefault(_toast2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Toasted = {
    install: function install(Vue, options) {
        if (!options) {
            options = {};
        }

        var Toast = new _toast.Toasted(options);
        Vue.component('toasted', _toast3.default);
        Vue.toasted = Vue.prototype.$toasted = Toast;
    }
};

// register plugin if it is used via cdn or directly as a script tag
if (typeof window !== 'undefined' && window.Vue) {
    window.Toasted = Toasted;
}

exports.default = Toasted;
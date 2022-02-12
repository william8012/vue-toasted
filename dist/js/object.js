'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toastObject = exports.changeText = exports.goAway = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _animations = require('./animations.js');

var _animations2 = _interopRequireDefault(_animations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// fade the toast away
var _goAway = function _goAway(el, delay, instance) {

    // Animate toast out
    setTimeout(function () {

        // if the toast is on bottom set it as bottom animation
        if (instance.cached_options.position && instance.cached_options.position.includes('bottom')) {
            _animations2.default.animateOutBottom(el, function () {
                instance.remove(el);
            });
            return;
        }

        _animations2.default.animateOut(el, function () {
            instance.remove(el);
        });
    }, delay);

    return true;
};

// change the text of toast
exports.goAway = _goAway;
var changeText = exports.changeText = function changeText(el, text) {
    if ((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === "object" ? text instanceof HTMLElement : text && (typeof text === 'undefined' ? 'undefined' : _typeof(text)) === "object" && text !== null && text.nodeType === 1 && typeof text.nodeName === "string") {
        el.appendChild(text);
    } else {
        el.innerHTML = text;
    }

    return undefined;
};

var toastObject = exports.toastObject = function toastObject(el, instance) {
    var _disposed = false;

    return {
        el: el,
        text: function text(_text) {
            changeText(el, _text);
            return this;
        },
        goAway: function goAway() {
            var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;

            _disposed = true;
            return _goAway(el, delay, instance);
        },
        remove: function remove() {
            instance.remove(el);
        },
        disposed: function disposed() {
            return _disposed;
        }
    };
};
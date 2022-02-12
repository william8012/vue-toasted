'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _animejs = require('animejs');

var _animejs2 = _interopRequireDefault(_animejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var duration = 300;

exports.default = {
    animateIn: function animateIn(el) {
        (0, _animejs2.default)({
            targets: el,
            translateY: '-35px',
            opacity: 1,
            duration: duration,
            easing: 'easeOutCubic'
        });
    },
    animateOut: function animateOut(el, onComplete) {
        (0, _animejs2.default)({
            targets: el,
            opacity: 0,
            marginTop: '-40px',
            duration: duration,
            easing: 'easeOutExpo',
            complete: onComplete
        });
    },
    animateOutBottom: function animateOutBottom(el, onComplete) {
        (0, _animejs2.default)({
            targets: el,
            opacity: 0,
            marginBottom: '-40px',
            duration: duration,
            easing: 'easeOutExpo',
            complete: onComplete
        });
    },
    animateReset: function animateReset(el) {
        (0, _animejs2.default)({
            targets: el,
            left: 0,
            opacity: 1,
            duration: duration,
            easing: 'easeOutExpo'
        });
    },
    animatePanning: function animatePanning(el, left, opacity) {
        (0, _animejs2.default)({
            targets: el,
            duration: 10,
            easing: 'easeOutQuad',
            left: left,
            opacity: opacity
        });
    },
    animatePanEnd: function animatePanEnd(el, onComplete) {
        (0, _animejs2.default)({
            targets: el,
            opacity: 0,
            duration: duration,
            easing: 'easeOutExpo',
            complete: onComplete
        });
    },
    clearAnimation: function clearAnimation(toasts) {

        var timeline = _animejs2.default.timeline();

        toasts.forEach(function (t) {
            timeline.add({
                targets: t.el,
                opacity: 0,
                right: '-40px',
                duration: 300,
                offset: '-=150',
                easing: 'easeOutExpo',
                complete: function complete() {
                    t.remove();
                }
            });
        });
    }
};
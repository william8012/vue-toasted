"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initiateCustomToasts = exports._show = exports.Toasted = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _show2 = require("./show");

var _show3 = _interopRequireDefault(_show2);

var _animations = require("./animations");

var _animations2 = _interopRequireDefault(_animations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = require("shortid");

// add Object.assign Polyfill
require("es6-object-assign").polyfill();

/**
 * Toast
 * core instance of toast
 *
 * @param _options
 * @returns {Toasted}
 * @constructor
 */
var Toasted = exports.Toasted = function Toasted(_options) {
  var _this = this;

  /**
   * Unique id of the toast
   */
  this.id = uuid.generate();

  /**
   * Shared Options of the Toast
   */
  this.options = _options;

  /**
   * Cached Options of the Toast
   */
  this.cached_options = {};

  /**
   * Shared Toasts list
   */
  this.global = {};

  /**
   * All Registered Groups
   */
  this.groups = [];

  /**
   * All Registered Toasts
   */
  this.toasts = [];

  /**
   * Element of the Toast Container
   */
  this.container = null;

  /**
   * Initiate toast container
   */
  initiateToastContainer(this);

  /**
   * Initiate custom toasts
   */
  initiateCustomToasts(this);

  /**
   * Create New Group of Toasts
   *
   * @param o
   */
  this.group = function (o) {
    if (!o) o = {};

    if (!o.globalToasts) {
      o.globalToasts = {};
    }

    // share parents global toasts
    Object.assign(o.globalToasts, _this.global);

    // tell parent about the group
    var group = new Toasted(o);
    _this.groups.push(group);

    return group;
  };

  /**
   * Register a Global Toast
   *
   * @param name
   * @param payload
   * @param options
   */
  this.register = function (name, payload, options) {
    options = options || {};
    return register(_this, name, payload, options);
  };

  /**
   * Show a Simple Toast
   *
   * @param message
   * @param options
   * @returns {*}
   */
  this.show = function (message, options) {
    return _show(_this, message, options);
  };

  /**
   * Show a Toast with Success Style
   *
   * @param message
   * @param options
   * @returns {*}
   */
  this.success = function (message, options) {
    options = options || {};
    options.type = "success";
    return _show(_this, message, options);
  };

  /**
   * Show a Toast with Info Style
   *
   * @param message
   * @param options
   * @returns {*}
   */
  this.info = function (message, options) {
    options = options || {};
    options.type = "info";
    return _show(_this, message, options);
  };

  /**
   * Show a Toast with Error Style
   *
   * @param message
   * @param options
   * @returns {*}
   */
  this.error = function (message, options) {
    options = options || {};
    options.type = "error";
    return _show(_this, message, options);
  };

  /**
   * Remove a Toast
   * @param el
   */
  this.remove = function (el) {
    _this.toasts = _this.toasts.filter(function (t) {
      return t.el.hash !== el.hash;
    });
    if (el.parentNode) el.parentNode.removeChild(el);
  };

  /**
   * Clear All Toasts
   *
   * @returns {boolean}
   */
  this.clear = function (onClear) {
    _animations2.default.clearAnimation(_this.toasts, function () {
      onClear && onClear();
    });
    _this.toasts = [];

    return true;
  };

  return this;
};

/**
 * Wrapper for show method in order to manipulate options
 *
 * @param instance
 * @param message
 * @param options
 * @returns {*}
 * @private
 */
var _show = exports._show = function _show(instance, message, options) {
  options = options || {};
  var toast = null;

  if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== "object") {
    console.error("Options should be a type of object. given : " + options);
    return null;
  }

  // singleton feature
  if (instance.options.singleton && instance.toasts.length > 0) {
    instance.cached_options = options;
    instance.toasts[instance.toasts.length - 1].goAway(0);
  }

  // clone the global options
  var _options = Object.assign({}, instance.options);

  // merge the cached global options with options
  Object.assign(_options, options);

  toast = (0, _show3.default)(instance, message, _options);
  instance.toasts.push(toast);

  return toast;
};

/**
 * Register the Custom Toasts
 */
var initiateCustomToasts = exports.initiateCustomToasts = function initiateCustomToasts(instance) {
  var customToasts = instance.options.globalToasts;

  // this will initiate toast for the custom toast.
  var initiate = function initiate(message, options) {
    // check if passed option is a available method if so call it.
    if (typeof options === "string" && instance[options]) {
      return instance[options].apply(instance, [message, {}]);
    }

    // or else create a new toast with passed options.
    return _show(instance, message, options);
  };

  if (customToasts) {
    instance.global = {};

    Object.keys(customToasts).forEach(function (key) {
      // register the custom toast events to the Toast.custom property
      instance.global[key] = function () {
        var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        //console.log(payload);
        // return the it in order to expose the Toast methods
        return customToasts[key].apply(null, [payload, initiate]);
      };
    });
  }
};

var initiateToastContainer = function initiateToastContainer(instance) {
  // create notification container
  var container = document.createElement("div");
  container.id = instance.id;
  container.setAttribute("role", "status");
  container.setAttribute("aria-live", "polite");
  container.setAttribute("aria-atomic", "false");

  document.body.appendChild(container);
  instance.container = container;
};

var register = function register(instance, name, callback, options) {
  !instance.options.globalToasts ? instance.options.globalToasts = {} : null;

  instance.options.globalToasts[name] = function (payload, initiate) {
    // if call back is string we will keep it that way..
    var message = null;

    if (typeof callback === "string") {
      message = callback;
    }

    if (typeof callback === "function") {
      message = callback(payload);
    }

    return initiate(message, options);
  };

  initiateCustomToasts(instance);
};

exports.default = { Toasted: Toasted };
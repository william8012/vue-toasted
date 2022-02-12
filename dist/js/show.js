'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (instance, message, options) {

	// share the instance across
	_instance = instance;

	options = parseOptions(options);
	var container = _instance.container;

	options.containerClass.unshift('toasted-container');

	// check if the container classes has changed if so update it
	if (container.className !== options.containerClass.join(' ')) {
		container.className = "";
		options.containerClass.forEach(function (className) {
			container.classList.add(className);
		});
	}

	// Select and append toast
	var newToast = createToast(message, options);

	// only append toast if message is not undefined
	if (message) {
		container.appendChild(newToast);
	}

	newToast.style.opacity = 0;

	// Animate toast in
	_animations2.default.animateIn(newToast);

	// Allows timer to be pause while being panned
	var timeLeft = options.duration;
	var counterInterval = void 0;
	if (timeLeft !== null) {

		var createInterval = function createInterval() {
			return setInterval(function () {
				if (newToast.parentNode === null) window.clearInterval(counterInterval);

				// If toast is not being dragged, decrease its time remaining
				if (!newToast.classList.contains('panning')) {
					timeLeft -= 20;
				}

				if (timeLeft <= 0) {
					// Animate toast out

					_animations2.default.animateOut(newToast, function () {
						// Call the optional callback
						if (typeof options.onComplete === "function") options.onComplete();
						// Remove toast after it times out
						if (newToast.parentNode) {
							_instance.remove(newToast);
						}
					});

					window.clearInterval(counterInterval);
				}
			}, 20);
		};

		counterInterval = createInterval();

		// Toggle interval on hover
		if (options.keepOnHover) {
			newToast.addEventListener('mouseover', function () {
				window.clearInterval(counterInterval);
			});
			newToast.addEventListener('mouseout', function () {
				counterInterval = createInterval();
			});
		}
	}

	return (0, _object.toastObject)(newToast, _instance);
};

var _hammerjs = require('hammerjs');

var _hammerjs2 = _interopRequireDefault(_hammerjs);

var _animations = require('./animations');

var _animations2 = _interopRequireDefault(_animations);

var _object = require('./object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = require('shortid');

// string includes polyfill
if (!String.prototype.includes) {
	Object.defineProperty(String.prototype, 'includes', {
		value: function value(search, start) {
			if (typeof start !== 'number') {
				start = 0;
			}

			if (start + search.length > this.length) {
				return false;
			} else {
				return this.indexOf(search, start) !== -1;
			}
		}
	});
}

var _options = {};
var _instance = null;
/**
 * parse Options
 *
 * @param options
 * @returns {{el: *, text: text, goAway: goAway}}
 */
var parseOptions = function parseOptions(options) {

	// class name to be added on the toast
	options.className = options.className || null;

	// complete call back of the toast
	options.onComplete = options.onComplete || null;

	// toast position
	options.position = options.position || "top-right";

	// toast duration
	options.duration = options.duration || null;

	// keep toast open on mouse over
	options.keepOnHover = options.keepOnHover || false;

	// normal type will allow the basic color
	options.theme = options.theme || "toasted-primary";

	// normal type will allow the basic color
	options.type = options.type || "default";

	// class name to be added on the toast container
	options.containerClass = options.containerClass || null;

	// check if the fullWidth is enabled
	options.fullWidth = options.fullWidth || false;

	// get icon name
	options.icon = options.icon || null;

	// get action name
	options.action = options.action || null;

	// check if the toast needs to be fitted in the screen (no margin gap between screen)
	options.fitToScreen = options.fitToScreen || null;

	// check if closes the toast when the user swipes it
	options.closeOnSwipe = typeof options.closeOnSwipe !== 'undefined' ? options.closeOnSwipe : true;

	// get the icon pack name. defaults to material
	options.iconPack = options.iconPack || 'material';

	/* transform options */

	// toast class
	if (options.className && typeof options.className === "string") {
		options.className = options.className.split(' ');
	}

	if (!options.className) {
		options.className = [];
	}

	options.theme && options.className.push(options.theme.trim());
	options.type && options.className.push(options.type);

	// toast container class
	if (options.containerClass && typeof options.containerClass === "string") {
		options.containerClass = options.containerClass.split(' ');
	}

	if (!options.containerClass) {
		options.containerClass = [];
	}

	options.position && options.containerClass.push(options.position.trim());
	options.fullWidth && options.containerClass.push('full-width');
	options.fitToScreen && options.containerClass.push('fit-to-screen');

	_options = options;
	return options;
};

var createToast = function createToast(html, options) {

	// Create toast
	var toast = document.createElement('div');
	toast.classList.add('toasted');

	// set unique identifier
	toast.hash = uuid.generate();

	if (options.className) {
		options.className.forEach(function (className) {
			toast.classList.add(className);
		});
	}

	// If type of parameter is HTML Element
	if ((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === "object" ? html instanceof HTMLElement : html && (typeof html === 'undefined' ? 'undefined' : _typeof(html)) === "object" && html !== null && html.nodeType === 1 && typeof html.nodeName === "string") {
		toast.appendChild(html);
	} else {
		// Insert as text;
		toast.innerHTML = html;
	}

	// add material icon if available
	createIcon(options, toast);

	if (options.closeOnSwipe) {
		// Bind hammer
		var hammerHandler = new _hammerjs2.default(toast, { prevent_default: false });
		hammerHandler.on('pan', function (e) {
			var deltaX = e.deltaX;
			var activationDistance = 80;

			// Change toast state
			if (!toast.classList.contains('panning')) {
				toast.classList.add('panning');
			}

			var opacityPercent = 1 - Math.abs(deltaX / activationDistance);
			if (opacityPercent < 0) opacityPercent = 0;

			_animations2.default.animatePanning(toast, deltaX, opacityPercent);
		});

		hammerHandler.on('panend', function (e) {
			var deltaX = e.deltaX;
			var activationDistance = 80;

			// If toast dragged past activation point
			if (Math.abs(deltaX) > activationDistance) {

				_animations2.default.animatePanEnd(toast, function () {
					if (typeof options.onComplete === "function") {
						options.onComplete();
					}

					if (toast.parentNode) {
						_instance.remove(toast);
					}
				});
			} else {
				toast.classList.remove('panning');
				// Put toast back into original position
				_animations2.default.animateReset(toast);
			}
		});
	}

	// create and append actions
	if (Array.isArray(options.action)) {
		options.action.forEach(function (action) {
			var el = createAction(action, (0, _object.toastObject)(toast, _instance));
			if (el) toast.appendChild(el);
		});
	} else if (_typeof(options.action) === 'object') {
		var action = createAction(options.action, (0, _object.toastObject)(toast, _instance));
		if (action) toast.appendChild(action);
	}

	return toast;
};

var createIcon = function createIcon(options, toast) {

	// add material icon if available
	if (options.icon) {

		var iel = document.createElement('i');
		iel.setAttribute('aria-hidden', 'true');

		switch (options.iconPack) {
			case 'fontawesome':

				iel.classList.add('fa');

				var faName = options.icon.name ? options.icon.name : options.icon;

				if (faName.includes('fa-')) {
					iel.classList.add(faName.trim());
				} else {
					iel.classList.add('fa-' + faName.trim());
				}

				break;
			case 'mdi':

				iel.classList.add('mdi');

				var mdiName = options.icon.name ? options.icon.name : options.icon;

				if (mdiName.includes('mdi-')) {
					iel.classList.add(mdiName.trim());
				} else {
					iel.classList.add('mdi-' + mdiName.trim());
				}

				break;
			case 'custom-class':

				var classes = options.icon.name ? options.icon.name : options.icon;

				if (typeof classes === 'string') {
					classes.split(' ').forEach(function (className) {
						iel.classList.add(className);
					});
				} else if (Array.isArray(classes)) {
					classes.forEach(function (className) {
						iel.classList.add(className.trim());
					});
				}

				break;
			case 'callback':
				var callback = options.icon && options.icon instanceof Function ? options.icon : null;

				if (callback) {
					iel = callback(iel);
				}

				break;
			default:
				iel.classList.add('material-icons');
				iel.textContent = options.icon.name ? options.icon.name : options.icon;
		}

		if (options.icon.after) {
			iel.classList.add('after');
		}

		appendIcon(options, iel, toast);
	}
};

var appendIcon = function appendIcon(options, el, toast) {

	if (options.icon) {

		if (options.icon.after && options.icon.name) {
			toast.appendChild(el);
		} else if (options.icon.name) {
			toast.insertBefore(el, toast.firstChild);
		} else {
			toast.insertBefore(el, toast.firstChild);
		}
	}
};

/**
 * Create Action for the toast
 *
 * @param action
 * @param toastObject
 * @returns {Element}
 */
var createAction = function createAction(action, toastObject) {

	if (!action) {
		return null;
	}

	var el = void 0;
	if (action.href) {
		el = document.createElement('a');
	} else {
		el = document.createElement('button');
	}

	el.classList.add('action');
	el.classList.add('ripple');

	if (action.text) {
		el.text = action.text;
	}

	if (action.href) {
		el.href = action.href;
	}

	if (action.target) {
		el.target = action.target;
	}

	if (action.icon) {

		// add icon class to style it
		el.classList.add('icon');

		// create icon element
		var iel = document.createElement('i');

		switch (_options.iconPack) {
			case 'fontawesome':
				iel.classList.add('fa');

				if (action.icon.includes('fa-')) {
					iel.classList.add(action.icon.trim());
				} else {
					iel.classList.add('fa-' + action.icon.trim());
				}

				break;
			case 'mdi':
				iel.classList.add('mdi');

				if (action.icon.includes('mdi-')) {
					iel.classList.add(action.icon.trim());
				} else {
					iel.classList.add('mdi-' + action.icon.trim());
				}

				break;
			case 'custom-class':

				if (typeof action.icon === 'string') {
					action.icon.split(' ').forEach(function (className) {
						el.classList.add(className);
					});
				} else if (Array.isArray(action.icon)) {
					action.icon.forEach(function (className) {
						el.classList.add(className.trim());
					});
				}

				break;
			default:
				iel.classList.add('material-icons');
				iel.textContent = action.icon;
		}

		// append it to the button
		el.appendChild(iel);
	}

	if (action.class) {

		if (typeof action.class === 'string') {
			action.class.split(' ').forEach(function (className) {
				el.classList.add(className);
			});
		} else if (Array.isArray(action.class)) {
			action.class.forEach(function (className) {
				el.classList.add(className.trim());
			});
		}
	}

	// initiate push with ready
	if (action.push) {

		el.addEventListener('click', function (e) {
			e.preventDefault();

			// check if vue router passed through global options
			if (!_options.router) {
				console.warn('[vue-toasted] : Vue Router instance is not attached. please check the docs');
				return;
			}

			_options.router.push(action.push);

			// fade away toast after action.
			if (!action.push.dontClose) {
				toastObject.goAway(0);
			}
		});
	}

	if (action.onClick && typeof action.onClick === 'function') {
		el.addEventListener('click', function (e) {

			if (action.onClick) {
				e.preventDefault();
				action.onClick(e, toastObject);
			}
		});
	}

	return el;
};

/**
 * this method will create the toast
 *
 * @param instance
 * @param message
 * @param options
 * @returns {{el: *, text: text, goAway: goAway}}
 */
;
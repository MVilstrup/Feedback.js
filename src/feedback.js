/*global define*/
(function (global, undefined) {
	"use strict";

	var document = global.document,
	    Feedback;

	Feedback = function () {

		var _feedback = {},
		    dialogs   = {},
		    isopen    = false,
		    keys      = { ENTER: 13, ESC: 27, SPACE: 32 },
		    queue     = [],
		    $, btnCancel, btnOK, btnPos, btnNeutral, btnNeg, btnReset, btnResetBack, btnFocus, elCallee, elCover, elDialog, elLog, form, input, getTransitionEvent;

		/**
		 * Markup pieces
		 * @type {Object}
		 */
		dialogs = {
			buttons : {
				holder 	 : "<nav class=\"feedback-buttons\">{{buttons}}</nav>",
				submit 	 : "<button type=\"submit\" class=\"feedback-button feedback-button-ok\" id=\"feedback-ok\">{{ok}}</button>",
				ok     	 : "<button class=\"feedback-button feedback-button-ok\" id=\"feedback-ok\">{{ok}}</button>",
				cancel 	 : "<button class=\"feedback-button feedback-button-cancel\" id=\"feedback-cancel\">{{cancel}}</button>",
				positive : "<button class=\"feedback-button feedback-image-button feedback-button-pos\" id=\"feedback-pos\"></button>",
				neutral  : "<button class=\"feedback-button feedback-image-button feedback-button-neutral\" id=\"feedback-neutral\"></button>",
				negative : "<button class=\"feedback-button feedback-image-button feedback-button-neg\" id=\"feedback-neg\"></button>",

			},
			input   : "<div class=\"feedback-text-wrapper\"><textarea class=\"feedback-text\" rows='5' id=\"feedback-text\"></textarea>",
			message : "<p class=\"feedback-message\">{{message}}</p>",
			log     : "<article class=\"feedback-log{{class}}\">{{message}}</article>"
		};

		/**
		 * Return the proper transitionend event
		 * @return {String}    Transition type string
		 */
		getTransitionEvent = function () {
			var t,
			    type,
			    supported   = false,
			    el          = document.createElement("fakeelement"),
			    transitions = {
				    "WebkitTransition" : "webkitTransitionEnd",
				    "MozTransition"    : "transitionend",
				    "OTransition"      : "otransitionend",
				    "transition"       : "transitionend"
			    };

			for (t in transitions) {
				if (el.style[t] !== undefined) {
					type      = transitions[t];
					supported = true;
					break;
				}
			}

			return {
				type      : type,
				supported : supported
			};
		};

		/**
		 * Shorthand for document.getElementById()
		 *
		 * @param  {String} id    A specific element ID
		 * @return {Object}       HTML element
		 */
		$ = function (id) {
			return document.getElementById(id);
		};

		/**
		 * Feedback private object
		 * @type {Object}
		 */
		_feedback = {

			/**
			 * Labels object
			 * @type {Object}
			 */
			labels : {
				ok     	: "OK",
				cancel 	: "Cancel",
			},

			/**
			 * Delay number
			 * @type {Number}
			 */
			delay : 5000,

			/**
			 * Whether buttons are reversed (default is secondary/primary)
			 * @type {Boolean}
			 */
			buttonReverse : false,

			/**
			 * Set the transition event on load
			 * @type {[type]}
			 */
			transition : undefined,

			/**
			 * Set the proper button click events
			 *
			 * @param {Function} fn    [Optional] Callback function
			 *
			 * @return {undefined}
			 */
			addListeners : function (fn) {
				var hasOK     	= (typeof btnOK 	!== "undefined"),
				    hasCancel 	= (typeof btnCancel !== "undefined"),
				    
				    hasPos     	= (typeof btnPos 	!== "undefined"),
				    hasNeutral  = (typeof btnNeutral!== "undefined"),
				    hasNeg     	= (typeof btnNeg 	!== "undefined"),
				    
				    hasInput  	= (typeof input 	!== "undefined"),
				    val       	= "",
				    self      	= this,
				    ok, cancel, pos, neg, neutral, common, key, reset;

				// ok event handler
				ok = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();
					common(event);
					if (typeof input !== "undefined") val = input.value;
					if (typeof fn === "function") {
						if (typeof input !== "undefined") {
							fn(true, val);
						}
						else fn(true);
					}
					return false;
				};

				// cancel event handler
				cancel = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();
					common(event);
					if (typeof fn === "function") fn(false);
					return false;
				};


				// positive event handler
				pos = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();
					common(event);
					if (typeof fn === "function") {
						fn(1)					
					}
					return false;
				};

				// negative event handler
				neg = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();
					common(event);
					if (typeof fn === "function") {
						fn(-1);
					}
					return false;
				};

				// neutral event handler
				neutral = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();
					common(event);
					if (typeof fn === "function") {
						fn(0);
					}
					return false;
				};


				// common event handler (keyup, ok and cancel)
				common = function (event) {
					self.hide();
					self.unbind(document.body, "keyup", key);
					self.unbind(btnReset, "focus", reset);
					if (hasOK) self.unbind(btnOK, "click", ok);
					if (hasCancel) self.unbind(btnCancel, "click", cancel);
				};

				// keyup handler
				key = function (event) {
					var keyCode = event.keyCode;
					if ((keyCode === keys.SPACE && !hasInput) || (hasInput && keyCode === keys.ENTER)) ok(event);
					if (keyCode === keys.ESC && hasCancel) cancel(event);
				};

				// reset focus to first item in the dialog
				reset = function (event) {
					if (hasInput) input.focus();
					else if (!hasCancel || self.buttonReverse) btnOK.focus();
					else btnCancel.focus();
				};

				// handle reset focus link
				// this ensures that the keyboard focus does not
				// ever leave the dialog box until an action has
				// been taken
				this.bind(btnReset, "focus", reset);
				this.bind(btnResetBack, "focus", reset);

				// handle OK click
				if (hasOK) this.bind(btnOK, "click", ok);
				// handle Cancel click
				if (hasCancel) this.bind(btnCancel, "click", cancel);

				// FEEDBACK Buttons!

				// handle positive click
				if (hasPos) this.bind(btnPos, "click", pos);

				// handle neutral click
				if (hasNeutral) this.bind(btnNeutral, "click", neutral);

				// handle negative click
				if (hasNeg) this.bind(btnNeg, "click", neg);

				// listen for keys, Cancel => ESC
				this.bind(document.body, "keyup", key);
				if (!this.transition.supported) {
					this.setFocus();
				}
			},

			/**
			 * Append button HTML strings
			 *
			 * @param {String} secondary    The secondary button HTML string
			 * @param {String} primary      The primary button HTML string
			 *
			 * @return {String}             The appended button HTML strings
			 */
			appendButtons : function (secondary, primary, tertiary) {
				if(tertiary){
					return this.buttonReverse ? primary + secondary + tertiary : tertiary + secondary + primary;
				} else {
					return this.buttonReverse ? primary + secondary : secondary + primary;
				}
			},

			/**
			 * Bind events to elements
			 *
			 * @param  {Object}   el       HTML Object
			 * @param  {Event}    event    Event to attach to element
			 * @param  {Function} fn       Callback function
			 *
			 * @return {undefined}
			 */
			bind : function (el, event, fn) {
				if (typeof el.addEventListener === "function") {
					el.addEventListener(event, fn, false);
				} else if (el.attachEvent) {
					el.attachEvent("on" + event, fn);
				}
			},

			/**
			 * Build the proper message box
			 *
			 * @param  {Object} item    Current object in the queue
			 *
			 * @return {String}         An HTML string of the message box
			 */
			build : function (item) {
				var html    = "",
				    type    = item.type,
				    message = item.message,
				    css     = item.cssClass || "";

				html += "<div class=\"feedback-dialog\">";
				html += "<a id=\"feedback-resetFocusBack\" class=\"feedback-resetFocus\" href=\"#\">Reset Focus</a>";

				html += "<a href=\"#\" id=\"feedback-noneFocus\" class=\"feedback-hidden\"></a>";

				// doens't require an actual form
				if (type === "prompt") html += "<div id=\"feedback-form\">";

				html += "<article class=\"feedback-inner\">";
				html += dialogs.message.replace("{{message}}", message);

				if (type === "prompt") html += dialogs.input;

				html += dialogs.buttons.holder;
				html += "</article>";

				if (type === "prompt") html += "</div>";

				html += "<a id=\"feedback-resetFocus\" class=\"feedback-resetFocus\" href=\"#\">Reset Focus</a>";
				html += "</div>";

				switch (type) {
				case "feedback":
					html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.neutral, dialogs.buttons.positive, dialogs.buttons.negative));
					break;
				case "confirm":
					html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.ok));
					html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
					break;
				case "prompt":
					html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.submit));
					html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
					break;
				case "alert":
					html = html.replace("{{buttons}}", dialogs.buttons.ok);
					html = html.replace("{{ok}}", this.labels.ok);
					break;
				default:
					break;
				}

				elDialog.className = "feedback feedback-" + type + " " + css;
				elCover.className  = "feedback-cover";
				return html;
			},


			/**
			 * Close the log messages
			 *
			 * @param  {Object} elem    HTML Element of log message to close
			 * @param  {Number} wait    [optional] Time (in ms) to wait before automatically hiding the message, if 0 never hide
			 *
			 * @return {undefined}
			 */
			close : function (elem, wait) {
				// Unary Plus: +"2" === 2
				var timer = (wait && !isNaN(wait)) ? +wait : this.delay,
				    self  = this,
				    hideElement, transitionDone;

				// set click event on log messages
				this.bind(elem, "click", function () {
					hideElement(elem);
				});
				// Hide the dialog box after transition
				// This ensure it doens't block any element from being clicked
				transitionDone = function (event) {
					event.stopPropagation();
					// unbind event so function only gets called once
					self.unbind(this, self.transition.type, transitionDone);
					// remove log message
					elLog.removeChild(this);
					if (!elLog.hasChildNodes()) elLog.className += " feedback-logs-hidden";
				};
				// this sets the hide class to transition out
				// or removes the child if css transitions aren't supported
				hideElement = function (el) {
					// ensure element exists
					if (typeof el !== "undefined" && el.parentNode === elLog) {
						// whether CSS transition exists
						if (self.transition.supported) {
							self.bind(el, self.transition.type, transitionDone);
							el.className += " feedback-log-hide";
						} else {
							elLog.removeChild(el);
							if (!elLog.hasChildNodes()) elLog.className += " feedback-logs-hidden";
						}
					}
				};
				// never close (until click) if wait is set to 0
				if (wait === 0) return;
				// set timeout to auto close the log message
				setTimeout(function () { hideElement(elem); }, timer);
			},

			/**
			 * Create a dialog box
			 *
			 * @param  {String}   message        The message passed from the callee
			 * @param  {String}   type           Type of dialog to create
			 * @param  {Function} fn             [Optional] Callback function
			 * @param  {String}   placeholder    [Optional] Default value for prompt input field
			 * @param  {String}   cssClass       [Optional] Class(es) to append to dialog box
			 *
			 * @return {Object}
			 */
			dialog : function (message, type, fn, placeholder, cssClass) {
				// set the current active element
				// this allows the keyboard focus to be resetted
				// after the dialog box is closed
				elCallee = document.activeElement;

				// check to ensure the feedback dialog element
				// has been successfully created
				var check = function () {
					if ((elLog && elLog.scrollTop !== null) && (elCover && elCover.scrollTop !== null)) return;
					else check();
				};
				// error catching
				if (typeof message !== "string") throw new Error("message must be a string");
				if (typeof type !== "string") throw new Error("type must be a string");
				if (typeof fn !== "undefined" && typeof fn !== "function") throw new Error("fn must be a function");
				
				// initialize feedback if it hasn't already been done
				this.init();
				check();

				queue.push({ type: type, message: message, callback: fn, placeholder: placeholder, cssClass: cssClass });
				if (!isopen) this.setup();

				return this;
			},

			/**
			 * Extend the log method to create custom methods
			 *
			 * @param  {String} type    Custom method name
			 *
			 * @return {Function}
			 */
			extend : function (type) {
				if (typeof type !== "string") throw new Error("extend method must have exactly one parameter");
				return function (message, wait) {
					this.log(message, type, wait);
					return this;
				};
			},

			/**
			 * Use feedback as the global error handler (using window.onerror)
			 *
			 * @return {boolean} success
			 */
			handleErrors : function () {
				if (typeof global.onerror !== "undefined") {
					var self = this;
					global.onerror = function (msg, url, line) {
						self.error("[" + msg + " on line " + line + " of " + url + "]", 0);
					};
					return true;
				} else {
					return false;
				}
			},

			/**
			 * Hide the dialog and rest to defaults
			 *
			 * @return {undefined}
			 */
			hide : function () {
				var transitionDone,
				    self = this;
				// remove reference from queue
				queue.splice(0,1);
				// if items remaining in the queue
				if (queue.length > 0) this.setup(true);
				else {
					isopen = false;
					// Hide the dialog box after transition
					// This ensure it doens't block any element from being clicked
					transitionDone = function (event) {
						event.stopPropagation();
						// unbind event so function only gets called once
						self.unbind(elDialog, self.transition.type, transitionDone);
					};
					// whether CSS transition exists
					if (this.transition.supported) {
						this.bind(elDialog, this.transition.type, transitionDone);
						elDialog.className = "feedback feedback-hide feedback-hidden";
					} else {
						elDialog.className = "feedback feedback-hide feedback-hidden feedback-isHidden";
					}
					elCover.className  = "feedback-cover feedback-cover-hidden";
					// set focus to the last element or body
					// after the dialog is closed
					elCallee.focus();
				}
			},

			/**
			 * Initialize Feedback
			 * Create the 2 main elements
			 *
			 * @return {undefined}
			 */
			init : function () {
				// ensure legacy browsers support html5 tags
				document.createElement("nav");
				document.createElement("article");
				document.createElement("section");
				// cover
				if ($("feedback-cover") == null) {
					elCover = document.createElement("div");
					elCover.setAttribute("id", "feedback-cover");
					elCover.className = "feedback-cover feedback-cover-hidden";
					document.body.appendChild(elCover);
				}
				// main element
				if ($("alertify") == null) {
					isopen = false;
					queue = [];
					elDialog = document.createElement("section");
					elDialog.setAttribute("id", "alertify");
					elDialog.className = "feedback feedback-hidden";
					document.body.appendChild(elDialog);
				}
				// log element
				if ($("feedback-logs") == null) {
					elLog = document.createElement("section");
					elLog.setAttribute("id", "feedback-logs");
					elLog.className = "feedback-logs feedback-logs-hidden";
					document.body.appendChild(elLog);
				}
				// set tabindex attribute on body element
				// this allows script to give it focus
				// after the dialog is closed
				document.body.setAttribute("tabindex", "0");
				// set transition type
				this.transition = getTransitionEvent();
			},

			/**
			 * Show a new log message box
			 *
			 * @param  {String} message    The message passed from the callee
			 * @param  {String} type       [Optional] Optional type of log message
			 * @param  {Number} wait       [Optional] Time (in ms) to wait before auto-hiding the log
			 *
			 * @return {Object}
			 */
			log : function (message, type, wait) {
				// check to ensure the feedback dialog element
				// has been successfully created
				var check = function () {
					if (elLog && elLog.scrollTop !== null) return;
					else check();
				};
				// initialize feedback if it hasn't already been done
				this.init();
				check();

				elLog.className = "feedback-logs";
				this.notify(message, type, wait);
				return this;
			},

			/**
			 * Add new log message
			 * If a type is passed, a class name "feedback-log-{type}" will get added.
			 * This allows for custom look and feel for various types of notifications.
			 *
			 * @param  {String} message    The message passed from the callee
			 * @param  {String} type       [Optional] Type of log message
			 * @param  {Number} wait       [Optional] Time (in ms) to wait before auto-hiding
			 *
			 * @return {undefined}
			 */
			notify : function (message, type, wait) {
				var log = document.createElement("article");
				log.className = "feedback-log" + ((typeof type === "string" && type !== "") ? " feedback-log-" + type : "");
				log.innerHTML = message;
				// append child
				elLog.appendChild(log);
				// triggers the CSS animation
				setTimeout(function() { log.className = log.className + " feedback-log-show"; }, 50);
				this.close(log, wait);
			},

			/**
			 * Set properties
			 *
			 * @param {Object} args     Passing parameters
			 *
			 * @return {undefined}
			 */
			set : function (args) {
				var k;
				// error catching
				if (typeof args !== "object" && args instanceof Array) throw new Error("args must be an object");
				// set parameters
				for (k in args) {
					if (args.hasOwnProperty(k)) {
						this[k] = args[k];
					}
				}
			},

			/**
			 * Common place to set focus to proper element
			 *
			 * @return {undefined}
			 */
			setFocus : function () {
				if (input) {
					input.focus();
					input.select();
				}
				else btnFocus.focus();
			},

			/**
			 * Initiate all the required pieces for the dialog box
			 *
			 * @return {undefined}
			 */
			setup : function (fromQueue) {
				var item = queue[0],
				    self = this,
				    transitionDone;

				// dialog is open
				isopen = true;
				// Set button focus after transition
				transitionDone = function (event) {
					event.stopPropagation();
					self.setFocus();
					// unbind event so function only gets called once
					self.unbind(elDialog, self.transition.type, transitionDone);
				};
				// whether CSS transition exists
				if (this.transition.supported && !fromQueue) {
					this.bind(elDialog, this.transition.type, transitionDone);
				}
				// build the proper dialog HTML
				elDialog.innerHTML = this.build(item);
				// assign all the common elements
				btnReset  = $("feedback-resetFocus");
				btnResetBack  = $("feedback-resetFocusBack");
				btnOK     = $("feedback-ok")     || undefined;
				btnCancel = $("feedback-cancel") || undefined;

				btnPos     	= $("feedback-pos")     || undefined;
				btnNeutral  = $("feedback-neutral") || undefined;
				btnNeg     	= $("feedback-neg")     || undefined;
				
				

				input     = $("feedback-text")   || undefined;
				form      = $("feedback-form")   || undefined;
				// add placeholder value to the input field
				if (typeof item.placeholder === "string" && item.placeholder !== "") input.value = item.placeholder;
				if (fromQueue) this.setFocus();
				this.addListeners(item.callback);
			},

			/**
			 * Unbind events to elements
			 *
			 * @param  {Object}   el       HTML Object
			 * @param  {Event}    event    Event to detach to element
			 * @param  {Function} fn       Callback function
			 *
			 * @return {undefined}
			 */
			unbind : function (el, event, fn) {
				if (typeof el.removeEventListener === "function") {
					el.removeEventListener(event, fn, false);
				} else if (el.detachEvent) {
					el.detachEvent("on" + event, fn);
				}
			}
		};

		return {
			alert    : function (message, fn, cssClass) { _feedback.dialog(message, "alert", fn, "", cssClass); return this; },
			confirm  : function (message, fn, cssClass) { _feedback.dialog(message, "confirm", fn, "", cssClass); return this; },
			feedback : function (message, fn, cssClass) { _feedback.dialog(message, "feedback", fn, "", cssClass); return this; },
			extend   : _feedback.extend,
			init     : _feedback.init,
			log      : function (message, type, wait) { _feedback.log(message, type, wait); return this; },
			prompt   : function (message, fn, placeholder, cssClass) { _feedback.dialog(message, "prompt", fn, placeholder, cssClass); return this; },
			neutral  : function (message, type, wait) { _feedback.log(message, "neutral", wait); return this; },
			success  : function (message, wait) { _feedback.log(message, "success", wait); return this; },
			error    : function (message, wait) { _feedback.log(message, "error", wait); return this; },
			set      : function (args) { _feedback.set(args); },
			labels   : _feedback.labels,
			debug    : _feedback.handleErrors
		};
	};

	// AMD and window support
	if (typeof define === "function") {
		define([], function () { return new Feedback(); });
	} else if (typeof global.alertify === "undefined") {
		global.alertify = new Feedback();
	}

}(this));

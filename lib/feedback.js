

var FeedbackFeeling = function(settings) {

	/**
	 * 	Overall settings of the object. These can all be modified by the user.
	 * 	The values stored here is just the standard setup
	 */
	this.settings = {
		id 		: "feedback-log",
		classes : "feedback-log",
		labels : {
				ok     	: "Send",
				cancel 	: "No thanks",
		},
		detailQuestion : {
			positive : "What about it do you like?",
			neutral  : "What could be improved?",
			negative : "What about it don't you like?"
		},
		placement 		: "bottom-right",
		buttonReverse 	: false,
		detailed 		: true,
		inline 			: false,
		holderID 		: ""
	};


	this.setUp(settings);

	/**
	 * 	The HTML code needed to place create the buttons.
	 * 	This is stored inside the JavaScript file, to make it easier for the user of the library.
	 */
	this.html = {
		// Question and holder for buttons
		layout 		 : '<div id="feedback-log-content" class="feedback-log-content-show"><div id="feedback-log-top"></div> <div id="feedback-log-bottom">{{bottom}}</div></div>',
		question 	 : '<div id="feedback-question"><p>{{question}}</p></div>',
		buttonNav 	 : '<nav class=" feedback-buttons ">{{buttons}}</nav>',

		// Buttons
		ok 		 	: '<button class="feedback-button feedback-button-ok " id="feedback-button-ok">{{ok}}</button>',
		cancel 	 	: '<button class="feedback-button feedback-button-cancel" id="feedback-button-cancel">{{cancel}}</button>',
		positive	: '<button class="feedback-image-button feedback-button-positive" id="feedback-positive"></button>',
		neutral 	: '<button class="feedback-image-button feedback-button-neutral " id="feedback-neutral"></button>',
		negative 	: '<button class="feedback-image-button feedback-button-negative" id="feedback-negative"></button>',

		//Text area used in the detailed feedback
		textarea 	: '<div class=" feedback-text-wrapper "><textarea class="feedback-text" rows="4" id="feedback-text"></textarea>'
	};

}

/*
	------------------------------------------------------ PROTOTYPE DEFINITIONS -------------------------------------------------------
*/

/**
 * Set the proper button click events.
 * This method uses the ID of the buttons, to add action listeners.
 * If the ID's in the FeedbackFeeling instantiation is changed, they should be changed here as well.
 *
 * @param {Button-ID} 	btnID 	The ID of the button to attach the event to
 * @param {Function} 	fn    	[Optional] Callback function
 *
 * @return {undefined}
 */
FeedbackFeeling.prototype.updateListener = function(btnID, fn, on) {

	var button = this.get(btnID);
	var self = this;

	if(typeof button !== "undefined"){
		switch  (btnID) {

			// ok event handler
			case "feedback-button-ok":

				ok = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();

					var input = self.get('feedback-text');
					if (typeof input !== "undefined") val = input.value;
					if (typeof fn === "function") {
						if (typeof input !== "undefined") {
							fn(true, val);
						}
						else fn(true);
					}

					self.close();

					return false;
				};
				if(on){
					this.bind(button, "click", ok);
				} else {
					this.unbind(button, "click", ok);
				}
				break;

			// cancel event handler
			case "feedback-button-close": case "feedback-button-cancel":

				var cancel = function (event) {
						if (typeof event.preventDefault !== "undefined") event.preventDefault();

						if (typeof fn === "function") fn(false);

						self.close();

						return false;
				};
				if(on){
					this.bind(button, "click", cancel);
				} else {
					this.unbind(button, "click", cancel);
				}
				break;

			// positive event handler
			case "feedback-positive":

				var positive = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();

					if (typeof fn === "function") {
						fn({opinion: 1})
					}

					if(self.settings.detailed){
						self.details(fn, self.settings.detailQuestion.positive);
					}else {
						self.close();
					}

					return false;
				};
				if(on){
					this.bind(button, "click", positive);
				} else {
					this.unbind(button, "click", positive);
				}
				break;

			// neutral event handler
			case "feedback-neutral":
				var neutral = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();

					if (typeof fn === "function") {
						fn({opinion: 0});
					}

					if(self.settings.detailed){
						self.details(fn, self.settings.detailQuestion.neutral);
					}else {
						self.close();
					}

					return false;
				};
				if(on){
					this.bind(button, "click", neutral);
				} else {
					this.unbind(button, "click", neutral);
				}
				break;

			// negative event handler
			case "feedback-negative":
				var negative = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();


					if (typeof fn === "function") {
						fn({opinion: -1});
					}

					if(self.settings.detailed){
						self.details(fn, self.settings.detailQuestion.negative);
					}else {
						self.close();
					}

					return false;
				};
				if(on){
					this.bind(button, "click", negative);
				} else {
					this.unbind(button, "click", negative);
				}
				break;

			// No default implemented
			default:
				break;
		}


	}
};

/**
 * Append button HTML strings
 *
 * @param {String} secondary    The secondary button HTML string
 * @param {String} primary      The primary button HTML string
 * @param {String} tertiary     The tertiary button HTML string
 *
 * @return {String}             The appended button HTML strings
 */
FeedbackFeeling.prototype.appendButtons = function (secondary, primary, tertiary) {

	if(tertiary){
		return this.settings.buttonReverse ? primary + secondary + tertiary : tertiary + secondary + primary;
	}

	return this.settings.buttonReverse ? primary + secondary : secondary + primary;
};

/**
 * Bind events to elements
 *
 * @param  {Object}   el       HTML Object
 * @param  {Event}    event    Event to attach to element
 * @param  {Function} fn       Callback function
 *
 * @return {undefined}
 */
FeedbackFeeling.prototype.bind = function (el, event, fn) {
	if (typeof el.addEventListener === "function") {
		el.addEventListener(event, fn, false);
	} else if (el.attachEvent) {
		el.attachEvent("on" + event, fn);
	}
};

FeedbackFeeling.prototype.close = function(fn) {

	if(this.get("feedback-positive")){
		this.updateListener('feedback-positive', fn, false);
	}
	if(this.get("feedback-neutral")){
		this.updateListener('feedback-neutral', fn, false);
	}
	if(this.get("feedback-negative")){
		this.updateListener('feedback-negative', fn, false);
	}
	if(this.get("feedback-button-close")){
		this.updateListener('feedback-button-close', fn, false);
	}
	if(this.get("feedback-button-cancel")){
		this.updateListener('feedback-button-cancel', fn, false);
	}
	if(this.get("feedback-button-ok")){
		this.updateListener('feedback-button-ok', fn, false);
	}

	var base = this.get(this.settings.id);
	base.className = "feedback-log feedback-log-hidden";
};

FeedbackFeeling.prototype.details = function(fn, question) {

	var logContent = this.get('feedback-log-content');

	logContent.className = "feedback-log-content-hide";

	var bottom = this.get('feedback-log-bottom');


	html = this.html.question;
	html += this.html.textarea;
	html += this.html.buttonNav;
	html = html.replace("{{question}}", question);
	html = html.replace("{{buttons}}", this.appendButtons(this.html.cancel,this.html.ok));
	html = html.replace("{{ok}}", this.settings.labels.ok).replace("{{cancel}}",this.settings.labels.cancel);

	bottom.innerHTML = html;
	this.get("feedback-question").className = "detail-question";
	logContent.className = "feedback-log-content-show";

	this.updateListener('feedback-button-cancel', fn, true);
	this.updateListener('feedback-button-close', fn, true);
	this.updateListener('feedback-button-ok', fn, true);
};

/**
 * Shorthand for document.getElementById()
 *
 * @param  {String} id    A specific element ID
 * @return {Object}       HTML element
 */
FeedbackFeeling.prototype.get = function (id) {
	return document.getElementById(id);
};


/**
 * Shorthand for document.getElementById()
 *
 * @param  {String} id    A specific element ID
 * @return {Object}       HTML element
 */
FeedbackFeeling.prototype.setUp = function (settings) {
	if (settings instanceof Object) {
		if("classes" in settings){
			base.className += " " + settings.classes;
		}

		if ("labels" in settings){
			if("ok" in settings.labels) {
				this.settings.labels.ok = settings.labels.ok;
			}
			if("cancel" in settings.labels) {
				this.settings.labels.cancel = settings.labels.cancel;
			}
		}

		if ("buttonReverse" in settings) {
			this.settings.buttonReverse = true;
		}

		if ("detailed" in settings) {
			this.settings.detailed = settings.detailed;
		}

		if ("placement" in settings) {
			this.settings.placement = settings.placement;
		}
	}

	this.settings.id += "-" + this.settings.placement;

	var base = document.createElement("section");
	base.setAttribute("id", this.settings.id);
	base.className = " feedback-log-hidden feedback-log";

	document.body.appendChild(base);

};

/**
 * Append button HTML strings
 *
 * @param {Array} 		settings    The secondary button HTML string
 * @param {Function} 	fn    		[Optional] Callback function
 *
 * @return {FeedbackFeeling}       		The normal FeedbackFeeling without a text area.
 */
FeedbackFeeling.prototype.show = function(question, fn) {

	var base = this.get(this.settings.id);

	var log = document.createElement("article");

	base.className = this.settings.classes + " feedback-log-show";
	var html = this.html.layout;

	var bottom = this.html.question;
	bottom += this.html.buttonNav;

	html = html.replace("{{bottom}}", bottom);
	html = html.replace("{{question}}", question);
	html = html.replace("{{buttons}}", this.appendButtons(this.html.neutral, this.html.positive, this.html.negative));

	base.innerHTML = html;

	var top = this.get("feedback-log-top");
	var close = document.createElement("button");
	close.innerHTML = "&#10006";
	close.className = "feedback-button-close";
 	close.setAttribute("id", 'feedback-button-close');
	top.appendChild(close);

	this.updateListener('feedback-positive', fn, true);
	this.updateListener('feedback-neutral', fn, true);
	this.updateListener('feedback-negative', fn, true);
	this.updateListener('feedback-button-close', fn, true);
};

/**
 * Unbind events to elements
 *
 * @param  {Object}   el       HTML Object
 * @param  {Event}    event    Event to detach to element
 * @param  {Function} fn       Callback function
 *
 * @return {undefined}
 */
FeedbackFeeling.prototype.unbind = function (el, event, fn) {
	if (typeof el.removeEventListener === "function") {
		el.removeEventListener(event, fn, false);
	} else if (el.detachEvent) {
		el.detachEvent("on" + event, fn);
	}
}







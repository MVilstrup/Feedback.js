

var FeedbackLog = function(settings) {
	
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
		layout 		 : '<div id="feedback-log-top"></div> <div id="feedback-log-bottom">{{bottom}}</div>',
		question 	 : '<div class=" feedback-question "><p>{{question}}</p></div>',
		buttonNav 	 : '<nav class=" feedback-buttons ">{{buttons}}</nav>',
		
		// Buttons
		ok 		 	: '<button class="feedback-button feedback-button-ok " id="feedback-ok">{{ok}}</button>',
		cancel 	 	: '<button class="feedback-cancel" id="feedback-cancel">{{cancel}}</button>',
		positive	: '<button class="feedback-button feedback-image-button feedback-button-positive" id="feedback-positive"></button>',
		neutral 	: '<button class="feedback-button feedback-image-button feedback-button-neutral " id="feedback-neutral"></button>',
		negative 	: '<button class="feedback-button feedback-image-button feedback-button-negative" id="feedback-negative"></button>',

		//Text area used in the detailed feedback
		textarea 	: '<div class=" feedback-text-wrapper "><textarea class="feedback-text" rows="2" id="feedback-text"></textarea>'
	};

}

/*
	------------------------------------------------------ PROTOTYPE DEFINITIONS -------------------------------------------------------
*/

/**
 * Set the proper button click events.
 * This method uses the ID of the buttons, to add action listeners. 
 * If the ID's in the FeedbackLog instantiation is changed, they should be changed here as well.
 *
 * @param {Button-ID} 	btnID 	The ID of the button to attach the event to
 * @param {Function} 	fn    	[Optional] Callback function 
 *
 * @return {undefined}
 */
FeedbackLog.prototype.updateListener = function(btnID, fn, on) {
	
	var button = this.get(btnID);
	var self = this;

	if(typeof button !== "undefined"){
		switch  (btnID) {

			// ok event handler
			case "feedback-ok":
				
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
			case "feedback-cancel", "feedback-close":

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
						self.details(fn);
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
						self.details(fn);
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
						self.details(fn);
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
FeedbackLog.prototype.appendButtons = function (secondary, primary, tertiary) {
	
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
FeedbackLog.prototype.bind = function (el, event, fn) {
	if (typeof el.addEventListener === "function") {
		el.addEventListener(event, fn, false);
	} else if (el.attachEvent) {
		el.attachEvent("on" + event, fn);
	}
};

FeedbackLog.prototype.close = function(fn) {
	
	if(this.get("feedback-positive")){
		this.updateListener('feedback-positive', fn, false);
	}
	if(this.get("feedback-neutral")){
		this.updateListener('feedback-neutral', fn, false);
	}
	if(this.get("feedback-negative")){
		this.updateListener('feedback-negative', fn, false);
	}
	if(this.get("feedback-close")){
		this.updateListener('feedback-close', fn, false);
	}
	if(this.get("feedback-cancel")){
		this.updateListener('feedback-cancel', fn, false);
	}
	if(this.get("feedback-ok")){
		this.updateListener('feedback-ok', fn, false);
	}

	var base = this.get(this.settings.id);
	base.className = "feedback-log feedback-log-hidden";
};

FeedbackLog.prototype.details = function(fn) {

	var bottom = this.get('feedback-log-bottom');


	html = this.html.question;
	html += this.html.textarea;
	html += this.html.buttonNav;
	html = html.replace("{{question}}", "Could you give us some more details?");
	html = html.replace("{{buttons}}", this.appendButtons(this.html.cancel,this.html.ok));
	html = html.replace("{{ok}}", this.settings.labels.ok).replace("{{cancel}}",this.settings.labels.cancel);

	bottom.innerHTML = html;

	this.updateListener('feedback-cancel', fn, true);
	this.updateListener('feedback-close', fn, true);
	this.updateListener('feedback-ok', fn, true);
};

/**
 * Shorthand for document.getElementById()
 *
 * @param  {String} id    A specific element ID
 * @return {Object}       HTML element
 */
FeedbackLog.prototype.get = function (id) {
	return document.getElementById(id);
};


/**
 * Shorthand for document.getElementById()
 *
 * @param  {String} id    A specific element ID
 * @return {Object}       HTML element
 */
FeedbackLog.prototype.setUp = function (settings) {
	if (settings instanceof Array) {
		if(settings.classes){
			base.className += " " + settings.classes;
		}

		if (settings.id) {
			base.setAttribute("id", settings.id);
		}

		if (settings.labels.ok){
			this.settings.labels.ok = settings.labels.ok;
		}

		if (settings.labels.cancel){
			this.settings.labels.cancel = settings.labels.cancel;
		}

		if (settings.buttonReverse) {
			this.buttonReverse = true;
		}

		if (settings.detailed) {
			this.detailed = true;
		}
	}

	var base = document.createElement("section");
	base.setAttribute("id", this.settings.id);
	base.className = "feedback-log feedback-log-hidden";

	document.body.appendChild(base);

};

/**
 * Append button HTML strings
 *
 * @param {Array} 		settings    The secondary button HTML string
 * @param {Function} 	fn    		[Optional] Callback function 
 *
 * @return {FeedbackLog}       		The normal FeedbackLog without a text area.
 */
FeedbackLog.prototype.show = function(question, fn) {
	
	var base = this.get(this.settings.id);
	if(base === "undefined"){
		console.log("this is the problem");
	}
	
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
	var cancel = document.createElement("button");
	cancel.innerHTML = "&#10006";
	cancel.className = "feedback-close";
 	cancel.setAttribute("id", 'feedback-close');
	top.appendChild(cancel);

	this.updateListener('feedback-positive', fn, true);
	this.updateListener('feedback-neutral', fn, true);
	this.updateListener('feedback-negative', fn, true);
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
FeedbackLog.prototype.unbind = function (el, event, fn) {
	if (typeof el.removeEventListener === "function") {
		el.removeEventListener(event, fn, false);
	} else if (el.detachEvent) {
		el.detachEvent("on" + event, fn);
	}
}







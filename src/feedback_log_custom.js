

var FeedbackLog = function(settings) {
	
	/**
	 * 	Overall settings of the object. These can all be modified by the user. 
	 * 	The values stored here is just the standard setup
	 */
	this.settings = {
		id 		: "feedback-log",
		classes : "feedback-log",
		labels : {
				ok     	: "OK",
				cancel 	: "Cancel",
		},
		buttonReverse 	: false,
		detailed 		: false
	};

	if (settings instanceof Array) {
		this.setUp(settings);
	}

	/**
	 * 	The HTML code needed to place create the buttons.
	 * 	This is stored inside the JavaScript file, to make it easier for the user of the library.
	 */
	this.html = {
		// Question and holder for buttons
		question : '<div class=" feedback-question ">{{question}}</div>',
		holder 	 : '<nav class=" feedback-buttons ">{{buttons}}</nav>',
		
		// Buttons
		ok 		 	: '<button class=" feedback-button feedback-button-ok " id="feedback-ok">{{ok}}</button>',
		cancel 	 	: '<button class=" feedback-button feedback-button-cancel " id="feedback-cancel">{{cancel}}</button>',
		positive	: '<button class=" feedback-image-button feedback-button-positive" id="feedback-positive"></button>',
		neutral 	: '<button class=" feedback-button feedback-image-button feedback-button-neutral " id="feedback-neutral"></button>',
		negative 	: '<button class=" feedback-button feedback-image-button feedback-button-negative" id="feedback-negative"></button>',

		//Text area used in the detailed feedback
		textarea 	: '<div class=" feedback-text-wrapper "><textarea class=" feedback-text " rows="5" id=" feedback-text "></textarea>'
	};
	

	
		document.getElementById(this.settings.id).remove();


	var base = document.createElement("section");
	base.setAttribute("id", this.settings.id);
	base.className = "feedback-log-hidden";

	document.body.appendChild(base);

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
FeedbackLog.prototype.addListener = function(btnID, fn) {
	
	var button = this.get(btnID);

	if(typeof button !== "undefined"){
		switch  (btnID) {

			// ok event handler
			case "feedback-ok":
				
				var ok = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();

					if (typeof input !== "undefined") val = input.value;
					if (typeof fn === "function") {
						if (typeof input !== "undefined") {
							fn(true, val);
						}
						else fn(true);
					}
					return false;
				};
				this.bind(button, "click", ok);
			break;

			// cancel event handler
			case "feedback-cancel":

				var cancel = function (event) {
						if (typeof event.preventDefault !== "undefined") event.preventDefault();

						if (typeof fn === "function") fn(false);
						return false;
				};
				this.bind(button, "click", cancel);
			break;

			// positive event handler
			case "feedback-positive":

				var positive = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();

					if (typeof fn === "function") {
						fn(1)					
					}

					this.close();

					return false;
				};
				this.bind(button, "click", positive);
			break;

			// neutral event handler
			case "feedback-neutral":
				var neutral = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();

					if (typeof fn === "function") {
						fn(0);
					}

					this.close();

					return false;
				};
				this.bind(button, "click", neutral);
			break;

			// negative event handler
			case "feedback-negative":
				var negative = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();

					
					if (typeof fn === "function") {
						fn(-1);
					}

					this.close();

					return false;
				};
				this.bind(button, "click", negative);
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
},

/**
 * Append button HTML strings
 *
 * @param {Array} 		settings    The secondary button HTML string
 * @param {Function} 	fn    		[Optional] Callback function 
 *
 * @return {FeedbackLog}       The normal FeedbackLog without a text area.
 */
FeedbackLog.prototype.build = function(question, fn) {
	var base = this.get(this.settings.id);
	// console.log(base);
	
	base.className = this.settings.classes + "feedback-log-show";

	html = this.html.question;
	html = html.replace("{{question}}", question);

	html += this.html.holder;
	html = html.replace("{{buttons}}", this.appendButtons(this.html.neutral, this.html.positive, this.html.negative));

	
	base.innerHTML = html;
	console.log(base);

	this.addListener('feedback-positive', fn);
	this.addListener('feedback-neutral', fn);
	this.addListener('feedback-negative', fn);

	return this;
};

FeedbackLog.prototype.close = function(fn) {


};

FeedbackLog.prototype.details = function(fn) {

	this.close()
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
	
	if(settings.classes){
		base.className += "" + settings.classes;
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

};







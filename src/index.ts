import * as Alexa from 'alexa-sdk';
import { readSampleUtterances } from './fs';
import { StoryNode, Action, PASS_THROUGH } from './parseStory';

let nodes: Map<string, StoryNode>;
const data = require('../speechAssets/IntentSchema.json');
var text = await readSampleUtterances();

const APP_ID = ''; //TODO

export function handler(
	event: Alexa.RequestBody,
	context: Alexa.Context,
	callback: Function
) {
	const alexa = Alexa.handler(event, context);
	alexa.registerHandlers(
		newSessionHandlers,
		startGameHandlers,
		askQuestionHandlers,
	);
	alexa.execute();
}

var GAME_STATES = {
	START: "_STARTMODE", // Entry point, start the game.
	END:   "_ENDMODE", // Ending point, end the game.
	HELP: "_HELPMODE" // The user is asking for help.

	SAYING_STORY: "_STORY" // Alexa is saying the message
	SAYING_ACTIONS: "_ACTIONS" // Alexa is talking about the actions
};

class InvalidActionError extends Error {};

const newSessionHandlers: Alexa.Handlers = {
	LaunchRequest() {
		this.handler.state = GAME_STATES.START;
		const start = nodes.get('start');
		if (!start) throw new Error('Missing start node');
		this.emit(':ask', start.message);
	},
}

function handleAction(this: Alexa.Handler, action: Action) {
	const currentState: StoryNode = this.attributes.currentState;
	if (!currentState) throw new Error();

	const isValidAction = currentState.actions.some(action => action.message === action.message);
	if (!isValidAction) {
		throw new InvalidActionError();
	}

	const nextState = nodes.get(action.next_id);
	this.attributes.currentState = nextState;

	readStory.call(this);
}

function createActionsMessage(actions: Action[]) {
	const first = actions.slice(0, -1);
	const last = actions[actions.length - 1];
	return `Do you want to ${first.join(', ')} or ${last}`;
}

function shouldPassThrough(node: StoryNode) {
	return node.actions.some(action => action.message === PASS_THROUGH);
}

function readStory(this: Alexa.Handler) {
	const story = this.attributes.currentNode;
	this.handler.state = GAME_STATES.SAYING_STORY;

	const { message } = story;
	this.emit(':tell', message);

	if (shouldPassThrough(story)) {
		readStory.call(this);
	} else {
		const askMessage = createActionsMessage(story.actions);
		this.emit(':ask', askMessage, askMessage);
	}
}

var helpStateHandlers = Alexa.CreateStateHandler(GAME_STATES.HELP, {
	"helpTheUser": function (newGame) {
	   // var askMessage = newGame ? this.t("ASK_MESSAGE_START") : this.t("REPEAT_QUESTION_MESSAGE") + this.t("STOP_MESSAGE");
		var speechOutput = this.t("HELP_MESSAGE", GAME_LENGTH) + askMessage;
		var repromptText = this.t("HELP_REPROMPT") + askMessage;
		this.emit(":ask", speechOutput, repromptText);
	},
	"AMAZON.StartOverIntent": function () {
		this.handler.state = GAME_STATES.START;
		this.emitWithState("StartGame", false);
	},
   /* "AMAZON.RepeatIntent": function () {
		var newGame = (this.attributes["speechOutput"] && this.attributes["repromptText"]) ? false : true;
		this.emitWithState("helpTheUser", newGame);
	},
	"AMAZON.HelpIntent": function() {
		var newGame = (this.attributes["speechOutput"] && this.attributes["repromptText"]) ? false : true;
		this.emitWithState("helpTheUser", newGame);
	},
	"AMAZON.YesIntent": function() {
		if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
			this.handler.state = GAME_STATES.TRIVIA;
			this.emitWithState("AMAZON.RepeatIntent");
		} else {
			this.handler.state = GAME_STATES.START;
			this.emitWithState("StartGame", false);
		}
	},
	async "AMAZON.NoIntent"() {
		var speechOutput = this.t("NO_MESSAGE");
		this.emit(":tell", speechOutput);
	},
	"AMAZON.StopIntent": function () {
		var speechOutput = this.t("STOP_MESSAGE");
		this.emit(":ask", speechOutput, speechOutput);
	},
	"AMAZON.CancelIntent": function () {
		this.emit(":tell", this.t("CANCEL_MESSAGE"));
	},
	"Unhandled": function () {
		var speechOutput = this.t("HELP_UNHANDLED");
		this.emit(":ask", speechOutput, speechOutput);
	},
	*/
	"SessionEndedRequest": function () {
		console.log("Session ended in help state: " + this.event.request.reason);
	}
});



function hi() {
	console.log("Hello");
}

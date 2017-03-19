import * as Alexa from 'alexa-sdk';
import parseStory, { StoryNode, Action, PASS_THROUGH } from './parseStory';

let nodes: Map<string, StoryNode> = parseStory();

export function handler(
	event: Alexa.RequestBody,
	context: Alexa.Context,
) {
	const alexa = Alexa.handler(event, context);
	alexa.registerHandlers(
		newSessionHandlers,
		helpStateHandlers,
	);
	alexa.execute();
}

var GAME_STATES = {
	START: "_STARTMODE", // Entry point, start the game.
	END:   "_ENDMODE", // Ending point, end the game.
	HELP: "_HELPMODE", // The user is asking for help.

	SAYING_STORY: "_STORY", // Alexa is saying the message
	SAYING_ACTIONS: "_ACTIONS", // Alexa is talking about the actions
};

class InvalidActionError extends Error {};

const newSessionHandlers: Alexa.Handlers = {
	LaunchRequest() {
		this.handler.state = GAME_STATES.START;
		const start = nodes.get('start');
		if (!start) throw new Error('Missing start node');
		this.emit(':ask', start.message);
	},
	"AMAZON.StartOverIntent"() {
		this.handler.state = GAME_STATES.START;
		const lost = nodes.get('lost_in_school');
		if (!lost) throw new Error('Missing lost in school node');
		this.emit(':ask', lost.message);
	}
}

function handleAction(this: Alexa.Handler, action: Action) {
	const currentState: StoryNode = this.attributes.currentState || nodes.get('start');
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

const helpStateHandlers = Alexa.CreateStateHandler(GAME_STATES.HELP, {
	"AMAZON.StartOverIntent"(this: Alexa.Handler) {
		this.handler.state = GAME_STATES.START;
		this.emitWithState("StartGame", false);
	},
	"SessionEndedRequest"(this: Alexa.Handler) {
		console.log("Session ended in help state: " + this.event.request.reason);
	},
});

import * as Alexa from 'alexa-sdk';
// import { StoryNode, Action, PASS_THROUGH } from './parseStory';
import generateHandlers, { nodes } from './game';

export function handler(
	event: Alexa.RequestBody,
	context: Alexa.Context,
	callback: Function,
) {
	const alexa = Alexa.handler(event, context);
	alexa.registerHandlers(
		newSessionHandlers,
		helpStateHandlers,
		generateHandlers(),
	);
	alexa.execute();
	callback();
}

var GAME_STATES = {
	START: "_STARTMODE", // Entry point, start the game.
	END:   "_ENDMODE", // Ending point, end the game.
	HELP: "_HELPMODE", // The user is asking for help.
};

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

const helpStateHandlers = Alexa.CreateStateHandler(GAME_STATES.HELP, {
	"AMAZON.StartOverIntent"(this: Alexa.Handler) {
		this.handler.state = GAME_STATES.START;
		this.emitWithState("StartGame", false);
	},
	"SessionEndedRequest"(this: Alexa.Handler) {
		console.log("Session ended in help state: " + this.event.request.reason);
	},
});

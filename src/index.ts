import * as Alexa from 'alexa-sdk';
import generateHandlers, { readStory, nodes, listActions } from './game';

export function handler(
	event: Alexa.RequestBody,
	context: Alexa.Context,
	callback: Function,
) {
	const alexa = Alexa.handler(event, context, callback);
	alexa.registerHandlers(
		newHandlers,
		generateHandlers(),
	);
	alexa.execute();
}

const newHandlers: Alexa.Handlers = {
	NewSession() {
		this.attributes.currentState = nodes.get('start');
		readStory(this);
	},
	"AMAZON.HelpIntent"() {
		listActions(this);
	},
	'AMAZON.RepeatIntent'() {
		listActions(this);
	},
	'AMAZON.StartOverIntent'() {
		this.attributes.currentState = nodes.get('lost_in_school');
		readStory(this, 'A wormhole opens under your feet! You wake up and notice you need to pee.');
	},
	"AMAZON.CancelIntent"() {
		this.attributes.currentState = nodes.get('start');
		this.emit(':tell', 'Oh no, you peed your pants. The game has ended');
	},
	'AMAZON.StopIntent'() {
		this.attributes.currentState = nodes.get('start');
		this.emit(':tell', 'Oh no, you peed your pants. The game has ended');
	},
}

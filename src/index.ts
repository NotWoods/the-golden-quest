import * as Alexa from 'alexa-sdk';
import generateHandlers, { readStory, nodes } from './game';

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
	}
}

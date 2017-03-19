import * as Alexa from 'alexa-sdk';
import generateHandlers from './game';

export function handler(
	event: Alexa.RequestBody,
	context: Alexa.Context,
	callback: Function,
) {
	const alexa = Alexa.handler(event, context);
	alexa.registerHandlers(
		generateHandlers(),
	);
	alexa.execute();
	callback();
}

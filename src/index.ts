import * as Alexa from 'alexa-sdk';

const APP_ID = ''; //TODO

export function handler(
	event: Alexa.RequestBody,
	context: Alexa.Context,
	callback: Function
) {
	const alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
	alexa.registerHandlers(
		newSessionHandlers,
		startStateHandlers,
		triviaStateHandlers,
		helpStateHandlers
	);
	alexa.execute();
}

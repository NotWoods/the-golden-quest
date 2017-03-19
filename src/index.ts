import * as Alexa from 'alexa-sdk';
import { readSampleUtterances } from './fs';

const data = require('../speechAssets/IntentSchema.json');
//var text = await readSampleUtterances();

const APP_ID = ''; //TODO

export function handler(
	event: Alexa.RequestBody,
	context: Alexa.Context,
	callback: Function
) {
	const alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
    alexa.resources = languageString;
	alexa.registerHandlers(
		newSessionHandlers,
		startStateHandlers,
		gameStateHandlers,
		helpStateHandlers
	);
	alexa.execute();
}

var GAME_STATES = {
    START: "_STARTMODE", // Entry point, start the game.
    END:   "_ENDMODE", // Ending point, end the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

var languageString = {
    "en": {
        "translation": {
            // "QUESTIONS" : questions["QUESTIONS_EN_US"],
            "GAME_NAME" : "Where is the bathroom?", // Be sure to change this for your skill.
            "HELP_MESSAGE": "I will ask you %s multiple choice questions. Respond with the number of the answer. " + //Needed
            "For example, say one, two, three, or four. To start a new game at any time, say, start game. ",
            "REPEAT_QUESTION_MESSAGE": "To repeat the last question, say, repeat. ", //Needed
            "ASK_MESSAGE_START": "Do you need to go to the bathroom?", //Needed 
            "HELP_REPROMPT": "To give an answer to a question, respond with the number of the answer. ", //Needed 
            "STOP_MESSAGE": "Do you want to give up and pee your pants?", //Needed 
            "CANCEL_MESSAGE": "You\'ve failed to find a bathroom and have peed your pants. Play again?.", //Needed
            "NO_MESSAGE": "Ok, we\'ll play another time. Goodbye!", //Needed 
            "HELP_UNHANDLED": "Say yes to continue, or no to end the game.", //Needed
            "START_UNHANDLED": "Say start to start a new game.", //Needed
            "NEW_GAME_MESSAGE": "Welcome to %s. ",
            "WELCOME_MESSAGE": "I will ask you %s questions, try to get as many right as you can. " +
            "Just say the number of the answer. Let\'s begin. ",
            "ANSWER_CORRECT_MESSAGE": "correct. ",
            "ANSWER_WRONG_MESSAGE": "wrong. ",
            "CORRECT_ANSWER_MESSAGE": "The correct answer is %s: %s. ",
            "GAME_OVER_MESSAGE": "stub",
            
        }
    }
};

var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    }
};

var startStateHandlers = Alexa.CreateStateHandler(GAME_STATES.START, {
    "StartGame": function (newGame) {
        var speechOutput = newGame ? this.t("NEW_GAME_MESSAGE", this.t("GAME_NAME")) + this.t("WELCOME_MESSAGE"): "";
    }
});


function hi() {
	console.log("Hello");
}

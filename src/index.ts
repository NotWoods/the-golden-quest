import * as Alexa from 'alexa-sdk';
import { readSampleUtterances } from './fs';

const data = require('../speechAssets/IntentSchema.json');

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
            "ANSWER_IS_MESSAGE": "That answer is ",
            "TELL_QUESTION_MESSAGE": "Question %s. %s ",
            "GAME_OVER_MESSAGE": "You got %s out of %s questions correct. Thank you for playing!",
            "SCORE_IS_MESSAGE": "Your score is %s. "
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
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState("helpTheUser", true);
    },
    "Unhandled": function () {
        var speechOutput = this.t("START_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    }
};

var helpStateHandlers = Alexa.CreateStateHandler(GAME_STATES.HELP, {
    "helpTheUser": function (newGame) {
        var askMessage = newGame ? this.t("ASK_MESSAGE_START") : this.t("REPEAT_QUESTION_MESSAGE") + this.t("STOP_MESSAGE");
        var speechOutput = this.t("HELP_MESSAGE", GAME_LENGTH) + askMessage;
        var repromptText = this.t("HELP_REPROMPT") + askMessage;
        this.emit(":ask", speechOutput, repromptText);
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", false);
    },
    "AMAZON.RepeatIntent": function () {
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
		var text = await readSampleUtterances();
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
    "SessionEndedRequest": function () {
        console.log("Session ended in help state: " + this.event.request.reason);
    }
});



function hi() {
	console.log("Hello");
}

import { Handler } from 'alexa-sdk';
import { EventEmitter } from 'events';
import { StoryNode } from '../parseStory';

export default function makeHandler(state: StoryNode): Handler & { once: Function } {
	const handler: Handler & { once: Function } = new EventEmitter();
	handler.attributes = { currentState: state };
	return handler;
}

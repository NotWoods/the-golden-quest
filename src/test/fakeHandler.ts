import { Handler } from 'alexa-sdk';
import { EventEmitter } from 'events';
import { StoryNode } from '../parseStory';

interface SpecialHandler extends Handler {
	once: (id: string, ...args: any[]) => void,
	attributes: { currentState: StoryNode }
}

export default function makeHandler(state: StoryNode) {
	const handler: SpecialHandler = new EventEmitter();
	handler.attributes = { currentState: state };
	return handler;
}

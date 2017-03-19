import { readFileSync } from 'fs';
import { resolve } from 'path';
import 'string.prototype.startswith';

export const PASS_THROUGH = '__PASS_THROUGH'
const STORY_PATH = resolve(__dirname, '../story.txt');

function partition<T>(filter: (item: T) => boolean, array: T[]): [T[], T[]] {
	const matched = [], unmatched = [];

	for (const item of array) {
		if (filter(item)) matched.push(item);
		else unmatched.push(item);
	}

	return [matched, unmatched];
}

export interface StoryNode {
	node: string
	message: string
	actions: Action[]
}

export interface Action {
	message: string | symbol
	next_id: string
}

export default function parseStory(text?: string) {
	const data: string = text ? text : readFileSync(STORY_PATH, 'utf8');
	const parts = data.trim().split(/(?:\r|\n|\r\n){3,}/);

	const nodes: Map<string, StoryNode> = parts.reduce(function addNode(map, node) {
			if (/^\s*$/.test(node)) return map;

			const lines = node.split(/(?:\r|\n|\r\n)/);
			const [actionsStr, textArr] = partition(line => line.startsWith('>'), lines);

			let text = textArr.join('');
			const actions: Action[] = actionsStr.map(function parseAction(action) {
				if (action.startsWith('>>')) {
					return {
						message: PASS_THROUGH,
						next_id: action.slice(2).trim(),
					};
				}

				const name = action.match(/^>\s*([\w\s]+)\|/);
				const next = action.match(/\|\s*(\w+)\s*$/);

				if (name == null || next == null) {
					throw new Error('Invalid action syntax: ' + action);
				}

				return { message: name[1].trim(), next_id: next[1].trim() };
			});

			const colonLocation = text.indexOf(':');
			if (colonLocation == -1) {
				throw new Error('Invalid text syntax: ' + text);
			}

			const id = text.slice(0, colonLocation).trim();
			text = text.slice(colonLocation + 1).trim();

			return map.set(id, { node: id, message: text, actions });
		}, new Map());

	return nodes;
}

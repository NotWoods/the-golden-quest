import * as fs from 'fs';
import { resolve } from 'path';
import denodeify from 'denodeify';

const readFile = denodeify(fs.readFile);

const PASS_THROUGH = Symbol('PASS_THROUGH');
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
	id: string
	text: string
	actions: Action[]
}

export interface Action {
	text: string | symbol
	next_id: string
	next?: StoryNode
}

export default async function parseStory(text?: string) {
	const data: string = text ? await readFile(STORY_PATH, 'utf8') : text;

	const nodes: Map<string, StoryNode> = data.trim()
		.split(/(?:\r|\n|\r\n){2,}/).reduce(function addNode(map, node) {
			const lines = node.split(/(?:\r|\n|\r\n)/);
			const [actionsStr, textArr] = partition(line => line.startsWith('>'), lines);

			let text = textArr.join('');
			const actions: Action[] = actionsStr.map(function parseAction(action) {
				if (action.startsWith('>>')) {
					return {
						text: PASS_THROUGH,
						next_id: action.slice(2).trim(),
					};
				}

				const name = action.match(/^>\s*([\w\s]+)\|/);
				const next = action.match(/\|\s*(\w+)\s*$/);

				if (name == null || next == null) {
					throw new Error('Invalid action syntax: ' + action);
				}

				return { text: name[1].trim(), next_id: next[1].trim() };
			});

			const colonLocation = text.indexOf(':');
			if (colonLocation == -1) {
				throw new Error('Invalid text syntax: ' + text);
			}

			const id = text.slice(0, colonLocation).trim();
			text = text.slice(colonLocation + 1).trim();

			return map.set(id, { id, text, actions });
		}, new Map());

	for (const node of nodes.values()) {
		for (const action of node.actions) {
			if (!action.next) action.next = nodes.get(action.next_id);
		}
	}

	return nodes;
}

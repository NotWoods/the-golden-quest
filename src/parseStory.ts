import * as fs from 'fs';
import { resolve } from 'path';
import denodeify from 'denodeify';

const readFile = denodeify(fs.readFile);

export default async function parseStory() {
	const data = await readFile(resolve(__dirname, '../story.txt'));
}

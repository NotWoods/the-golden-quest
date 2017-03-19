import * as test from 'blue-tape';
import parseStory from '../src/parseStory';

test('parseStory', async (t) => {
	console.log('Parsing story file...');
	const nodes = await parseStory();

	nodes.forEach(node => console.log(node));
});

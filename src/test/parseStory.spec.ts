import * as test from 'blue-tape';
import parseStory from '../parseStory';

test.skip('parseStory', async () => {
	console.log('Parsing story file...');
	const nodes = await parseStory();

	nodes.forEach(node => console.log(node));
});

import * as test from 'blue-tape';
import { nodes, handleAction } from '../game';
import makeHandler from './fakeHandler';

test('handleAction', t => {
	const lost = nodes.get('lost_in_school');
	if (!lost) throw new Error();
	const handlerTester = makeHandler(lost);

	handlerTester.on(':tell', (message: string) => {
		t.equal(message,
			"You meet your friend from your comp sci class. She tries to get a conversation going.");
		t.end();
	});

	handleAction(handlerTester, lost.actions[0]);
})



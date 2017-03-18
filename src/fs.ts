import * as fs from 'fs';
import { resolve } from 'path';
import denodeify from 'denodeify';

export const readFile = denodeify(fs.readFile);

export async function readSampleUtterances(language = 'en_US') {
	return readFile(
		resolve(__dirname, `../SampleUtterances_${language}`),
		'utf8'
	);
}

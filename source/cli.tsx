#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import axios from 'axios';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ vowels-consonants-game-cli

	Options
		--speed           Game speed (the lower the value, the more difficult the passage)
		--complicate      Add extra complication
		--url             Optional url source with words suite (when no provided default suite will be used)
		--no-show-banner  Whether to use banner at the top

	Examples
	  $ vowels-consonants-game-cli --speed 4
	  $ vowels-consonants-game-cli --no-show-banner
	  $ vowels-consonants-game-cli --speed 3 --complicate
	  $ vowels-consonants-game-cli --speed 3 --url https://gist.githubusercontent.com/akgondber/3a1da5cb02ba0f6f61f14cffd0ae93f2/raw/1835ade2290657acd3b544ea92d7eaf1aeabab9b/words.txt
`,
	{
		importMeta: import.meta,
		flags: {
			showBanner: {
				type: 'boolean',
				default: true,
			},
			speed: {
				type: 'number',
				default: 3,
			},
			complicate: {
				type: 'boolean',
				default: false,
			},
			wordsSuiteUrl: {
				type: 'string',
				aliases: ['url'],
			},
		},
	},
);

const {showBanner, speed, complicate, wordsSuiteUrl} = cli.flags;
const suite: string[][] = [];

if (wordsSuiteUrl) {
	const resp = await axios.get<string>(wordsSuiteUrl);

	for (const line of resp.data.split('\n')) {
		const words: string[] = line.split(',');

		if (words.length > 0) {
			suite.push(words.map((word: string) => word));
		}
	}
}

render(
	<App
		isBannerDisabled={!showBanner}
		speed={speed}
		suite={suite}
		hasExtraComplication={complicate}
	/>,
);

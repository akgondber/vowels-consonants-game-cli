#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ vowels-consonants-game-cli

	Options
		--no-show-banner  Whether to use banner when starting
		--speed           Game speed (the lower the value, the more difficult the passage)
		--complicate      Add extra complication

	Examples
	  $ vowels-consonants-game-cli --speed 4
	  $ vowels-consonants-game-cli --no-show-banner
	  $ vowels-consonants-game-cli --speed 3 --complicate
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
		},
	},
);

const {showBanner, speed, complicate} = cli.flags;

render(
	<App
		isBannerDisabled={!showBanner}
		speed={speed}
		hasExtraComplication={complicate}
	/>,
);

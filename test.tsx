import React from 'react';
import test from 'ava';
import {render} from 'ink-testing-library';
import App from './source/app.js';

test('shows description', t => {
	const {lastFrame} = render(<App />);

	t.true(
		lastFrame()!.includes(
			'Count up vowels and consonants in the escaping word.',
		),
	);
});

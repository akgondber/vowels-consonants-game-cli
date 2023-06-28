import test from 'ava';

test('all right', t => {
	t.true(['Tests', 'are', 'coming'].includes('coming'));
});

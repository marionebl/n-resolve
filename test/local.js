const test = require('ava');
const nResolve = require('../source');
const h = require('./helpers');

test('local', async () => {
	// resolve needs a parent filename or paths to be able to lookup files
	// we provide a phony parent file
	const expected = h.resolveFixture('./foo');
	const actual = await nResolve('./foo', {
		filename: h.resolveFixture('./phony.js')
	});
	h.same(actual, expected);
});

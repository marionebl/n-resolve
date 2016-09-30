const test = require('ava');
const nResolve = require('../source');
const h = require('./helpers');

const modules = {events: 'foo'};

test('shim found', async () => {
	const expected = 'foo';
	const actual = await nResolve('events', {modules});
	h.same(actual, expected, 'should resolve to provided module shim');
});

test('core shim not found', async () => {
	const expected = 'http';
	const actual = await nResolve(expected, {modules});
	h.same(actual, expected, 'should resolve to core module name');
});

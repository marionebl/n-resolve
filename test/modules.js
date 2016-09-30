const test = require('ava');
const nResolve = require('../source');
const h = require('./helpers');

test('index.js of module dir', async () => {
	const expected = h.resolveFixture('module-a/index');
	const actual = await nResolve('module-a', {
		base: h.resolveFixture(),
		package: h.package()
	});
	h.same(actual, expected);
});

test('alternate main value', async () => {
	const expected = h.resolveFixture('module-b/main');
	const actual = await nResolve('module-b', {
		base: h.resolveFixture(),
		package: h.package()
	});
	h.same(actual, expected);
});

test('alternate resolveKey', async () => {
	const expected = h.resolveFixture('module-c/browser');
	const actual = await nResolve('module-c', {
		base: h.resolveFixture(),
		package: h.package(),
		resolveKey: 'browser'
	});
	h.same(actual, expected);
});

test('string browser field as main - require subfile', async () => {
	const expected = h.resolveFixture('module-c/bar');

	const actual = await nResolve('./bar', {
		filename: h.resolveFixture('module-c/browser.js'),
		base: h.resolveFixture('module-c'),
		package: {main: './browser.js'}
	});

	h.same(actual, expected);
});

test('string alt browser field as main - require subfile', async () => {
	const expected = h.resolveFixture('module-c/foo');
	const actual = await nResolve('./foo', {
		filename: h.resolveFixture('module-c/chromeapp'),
		base: h.resolveFixture('module-c'),
		package: {main: './chromeapp.js'},
		resolveKey: 'chromeapp'
	});

	h.same(actual, expected);
});

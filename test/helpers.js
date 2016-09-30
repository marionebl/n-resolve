const path = require('path');
const expect = require('unexpected');

const e = module.exports;
const fixtures = path.resolve(__dirname, '..', 'fixtures');

e.fixtures = fixtures;
e.package = () => ({main: 'fixtures'});
e.resolveFixture = (id = '') => {
	const fragments = id.split('/').filter(Boolean);
	const [name] = fragments;
	const isRelative = name === '..' || name === '.';
	const args = isRelative ? [fixtures] : [fixtures, 'node_modules'];
	return path.resolve(...[...args, id]);
};
e.same = (a, e) => expect(a, 'to be', e);

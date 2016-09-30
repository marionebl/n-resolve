/* @flow */
const assert = require('assert');
const get = require('lodash/fp').get;
const plain = require('lodash/fp').isPlainObject;

const getManifest = require('./get-manifest');
const nonEmpty = require('./non-empty');

type Options = {
	base: string;
	index: string;
	package: {[key: string]: any};
	resolveKey: string;
};

module.exports = getMainPath;

async function getMainPath(modulePath: string, settings: Options): Promise<string> {
	assert(nonEmpty(modulePath), '<modulePath> has to be a non-empty string');
	assert(plain(settings), '[settings] has to be an object');

	const selectResolveValue = get(settings.resolveKey);
	const manifest = await getManifest(modulePath, settings);
	const resolveValue = selectResolveValue(manifest) || settings.index;

	const resolveValueType = typeof resolveValue;
	assert(resolveValueType === 'string', `main field in ${modulePath}/package.json must be string. Received ${resolveValueType}: ${JSON.stringify(resolveValue)}`);

	return resolveValue;
}

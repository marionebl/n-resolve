/* @flow */
const assert = require('assert');
const path = require('path');
const plain = require('lodash').isPlainObject;
const exists = require('path-exists');
const nodeModulesPath = require('node-modules-path');

const nonEmpty = require('./non-empty');

type Options = {
	base: string;
	index: string;
	package: {[key: string]: any};
	resolveKey: string;
};

module.exports = getModulePath;

async function getModulePath(name:string, ctx: Options): Promise<string> {
	assert(nonEmpty(name), '<name> must be a non-empty string');
	assert(plain(ctx), '[ctx] must be an object');
	assert(nonEmpty(ctx.base), 'ctx.base must be a non-empty string');

	const modulesPath = nodeModulesPath(ctx.base);

	if (!modulesPath) {
		throw new Error(`Could not find a modules directory "node_modules" at ${ctx.base}.`);
	}

	const modulePath = path.resolve(modulesPath, name);

	if (!await exists(modulePath)) {
		throw new Error(`Could not find ${name} from ${ctx.base}. Module directory ${modulePath} not found.`);
	}

	return modulePath;
}

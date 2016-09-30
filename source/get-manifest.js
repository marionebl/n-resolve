/* @flow */
const path = require('path');
const exists = require('path-exists');
const fs = require('mz/fs');
const nodeModulesPath = require('node-modules-path');

module.exports = getManifest;

type Options = {
	base: string;
	index: string;
	resolveKey: string;
};

async function getManifest(name: string, ctx: Options): Promise<Object> {
	const modulesPath = nodeModulesPath(ctx.base);
	const modulePath = path.resolve(modulesPath, name);
	const manifestPath = path.resolve(modulePath, 'package.json');

	if (!await exists(manifestPath)) {
		return {};
	}

	const content = await fs.readFile(manifestPath);

	try {
		return JSON.parse(content);
	} catch (err) {
		err.message = [`Could not parse manifest for ${name} at ${manifestPath}`, err.message].join('\n');
		throw err;
	}
}

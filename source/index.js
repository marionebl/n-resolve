/* @flow */
const assert = require('assert');

const path = require('path');
const exists = require('path-exists');
const isCore = require('node-resolve').isCore;
const merge = require('lodash/fp').merge;
const plain = require('lodash/fp').isPlainObject;

const defaults = require('./defaults');
const getMainPath = require('./get-main-path');
const getModulePath = require('./get-module-path');
const nonEmpty = require('./non-empty');

const getSettings = merge(defaults);

module.exports = nResolve;

/**
 * Resolve a node module <id>
 */
async function nResolve(id: string, options?: Options): Promise<string> { // eslint-disable-line no-use-before-define
	assert(typeof id === 'string' && id.length > 0, '<id> has to be a non-empty string');
	assert(typeof options === 'object' && !Array.isArray(options), '[options] has to be an object');

	const s = getSettings(options);
	assert(nonEmpty(s.base), 'options.base has to be a non-empty string');
	assert(nonEmpty(s.index), 'options.index has to be a non-empty string');
	assert(nonEmpty(s.resolveKey), 'options.resolveKey has to be a non-empty string');
	assert(plain(s.package), 'options.package has to be an object');
	assert(plain(s.modules), 'options.modules has to be an object');

	if (s.modules[id]) {
		return s.modules[id];
	}

	if (isCore(id)) {
		return id;
	}

	const [name, ...rest] = id.split('/').filter(Boolean);
	const isRelative = name === '.' || name === '..';

	const modulePath = isRelative ?
		path.resolve(s.base, name) :
		await getModulePath(name, s);

	const relativeBase = s.filename ?
		path.dirname(s.filename) :
		s.base;

	const relativePath = rest.length ?
		path.resolve(relativeBase, ...rest) :
		await getMainPath(modulePath, s);

	const moduleRelativePath = path.extname(relativePath) === '' ?
		`${relativePath}.js` : relativePath;

	const moduleFilePath = path.resolve(modulePath, moduleRelativePath);

	if (!(await exists(moduleFilePath))) {
		const nameDesc = isRelative ? '' : ` in ${name}`;
		throw new Error(`Could not find ${moduleFilePath}${nameDesc} at ${modulePath}`);
	}

	const parsed = path.parse(moduleFilePath);

	return path.format({
		dir: parsed.dir,
		name: parsed.name,
		ext: parsed.ext === '.js' ? '' : parsed.ext
	});
}

/** Options */
type Options = {
	/**
	 * The base path to resolve from, defaults to process.cwd()
	 * @example
	 * nResolve('n-resolve', {base: '/usr/local/lib/'})
	 *   .then(result => console.log(result));
	 *   // => /usr/local/lib/node_modules/distribution/index.js
	 *   .catch(error => {throw error});
	 */
	base?: string;
	/**
	 * The default index basename to use, defaults to 'index.js'
	 * @example
	 * nResolve('normalize.css', {index: 'index.css'})
	 *   .then(result => console.log(result));
	 *   // => node_modules/normalize.css/index.css
	 *   .catch(error => {throw error});
	 */
	index?: string;
	/**
	 * Map of module names to custom resolve paths
	 * @example
	 * nResolve('events', {modules: {events: './foo.js'}})
	 *   .then(result => console.log(result));
	 *   // => ./foo.js
	 *   .catch(error => {throw error});
	 */
	modules?: {[key:string]: string};
	/**
	 * Resolve key to use, defaults to 'main'
	 * @example
	 * nResolve('isomorphic-fetch')
	 *   .then(result => console.log(result));
	 *   // => node_modules/isomorphic-fetch/fetch-npm-node.js
	 *   .catch(error => {throw error});
	 * nResolve('isomorphic-fetch', {resolveKey: 'browser'})
	 *   .then(result => console.log(result));
	 *   // => node_modules/isomorphic-fetch/fetch-npm-browserify.js
	 *   .catch(error => {throw error});
	 */
	resolveKey?: string;
};

/* @flow */
const isString = require('lodash/fp').isString;

module.exports = (i: any): boolean => isString(i) && i;

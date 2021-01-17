/**
 * @module jsdoc
 * @category command
 * @description documentation generation tool
 * @file doc/index.js
 */

const {doc} = require('./doc.class')

/**
 * @typedef {Object} StrCmdObj
 * @property {Boolean} verbose
 * @property {Boolean} ini
 */

module.exports = {
    short: 'doc',
    long: 'jsdoc',
    command: 'doc',
    description: [
        'doc command'
    ],
    option: [
        ['-i, --ini', 'Initialize "doc" tool for current package'],
        ['-r, --recursive', 'If lang flag is set adding or removing languages is done recursively'],
        ['-s, --scan', 'Scans and rebuilds documentation'],
    ],
    /**
     * @param {Object} cmdObj
     * @returns {Promise<void>}
     */
    action: async cmdObj => {
        if (cmdObj.init) return await doc.init(cmdObj.verbose)
    }
}

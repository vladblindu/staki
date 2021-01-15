/**
 * @module strings
 * @category command
 * @description internationalization strings management
 * @file str/index.js
 */

const Strings = require('./strings.class')

/**
 * @typedef {Object} StrCmdObj
 * @property {Boolean} verbose
 * @property {Boolean} ini
 */

module.exports = {
    short: 'str',
    long: 'strings',
    command: 'str [lang]',
    description: [
        'str command'
    ],
    option: [
        ['-i, --ini', 'Initialize "str" tool for current package'],
        ['-l, --langs', 'Edit/modify language list for current package'],
        ['-r, --recursive', 'If lang flag is set adding or removing languages is done recursively'],
        ['-a, --add', 'Adds a specified language to the package'],
        ['-d, --delete', 'Deletes the specified language to the package \n(WARNING - no undoing possible))'],
        ['-f, --default', 'Change default language for current package']
    ],
    /**
     *
     * @param {String?} lang
     * @param {Object} cmdObj
     * @returns {Promise<void>}
     */
    action: async (lang, cmdObj) => {
        const strings = new Strings()
        if (cmdObj.init) return await strings.init(cmdObj.verbose)
    }
}

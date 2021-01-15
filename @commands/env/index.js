/**
 * @module environment
 * @category command
 * @description environment vars management
 * @file env/index.js
 */

const {add, list, remove, update, createEnv, updateConfig} = require('./actions')

/**
 * @typedef {object} EnvCmdObj
 * @property {string} add
 * @property {string} list
 * @property {string} update
 * @property {string} remove
 * @property {string} create
 * @property {string} new
 */

module.exports = {
    short: 'env',
    long: 'environment',
    command: 'env [name] [value]',
    description: [
        'env command',
        {
            name: 'name of env key',
            value: 'value of env key'
        }],
    option: [
        [
            '-a, --add',
            'Save values to env cache.'
        ],
        [
            '-l, --list',
            'lists all env cache saved key/values pairs.'
        ],
        [
            '-r, --remove',
            'Remove env entry by key'
        ],
        [
            '-u, --update',
            'Update env entry by key'
        ],
        [
            '-n, --new',
            'Add env entry by key and save it to both env cache and local staki.config.js'
        ],
        [
            '-c, --create',
            'Create .env file'
        ]
    ],

    /**
     * @name action
     * @param {String} key
     * @param {String} val
     * @param {EnvCmdObj} cmdObj
     * @returns {void}
     */
    action: async (key, val, cmdObj) => {
        if (cmdObj.add) return add(key, val)
        if (cmdObj.list) return list(key)
        if (cmdObj.remove) return remove(key)
        if (cmdObj.update) return update(key, val)
        if (cmdObj.new) {
            add(key, val)
            return updateConfig(key)
        }
        if (cmdObj.create) await createEnv()
    }
}
const {add, list, remove, update, createEnv, updateConfig} = require('./actions')

/**
 * @type {object} cmdObj
 * @param {string} cmdObj.add
 * @param {string} cmdObj.list
 * @param {string} cmdObj.update
 * @param {string} cmdObj.remove
 * @param {string} cmdObj.create
 * @param {string} cmdObj.new
 */

/**
 *
 * @param {String} key
 * @param {String} val
 * @param {Object} cmdObj
 * @returns {void}
 */
const env = async (key, val, cmdObj) => {
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

module.exports = env
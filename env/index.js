const {add, list, remove, update, createEnv} = require('./actions')

module.exports = async (key, val, cmdObj) => {
    if (cmdObj.add) return add(key, val)
    if (cmdObj.list) return list(key)
    if (cmdObj.remove) return remove(key)
    if (cmdObj.update) return update(key, val)
    await createEnv()
}
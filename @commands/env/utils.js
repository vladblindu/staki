const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const {STAKI} = require('../../@globals/constants')
const {throwErr, warn, interactiveFail} = require('../../@globals/helpers')
const {cachePath} = require('./constants')

/**
 * @name cacheEnv
 * @description saves env data in json format to a hidden file in the current dir
 * @param {object} env
 * @param {String?} pth
 */
const cacheEnv = (env, pth = '') => {
    try {
        fs.writeFileSync(pth || cachePath, JSON.stringify(env, null, 2))
    } catch (err) {
        throwErr(`Couldn't create env cache file in ${cachePath}. Reason: ${err.message}`)
    }
}

/**
 * @name getEnvCache
 * @description reads env data in json format to a hidden file in the user's home dir
 * @param {String?} pth
 */
const getEnvCache = (pth = cachePath) => {
    if (!fs.existsSync(pth)) {
        warn(`A env cache file couldn't be found in ${pth}.\nA new one will be created.`)
        return {}
    }
    let content = ''
    try {
        content = fs.readFileSync(pth, 'utf8')
    } catch (err) {
        throwErr(`Couldn't read the env cache file from ${pth}. Reason: ${err.message}`)
    }
    if (!content.trim())
        throwErr(`No content in env cache file from ${pth}.`)

    let envData = null
    try {
        envData = JSON.parse(content)
    } catch (err) {
        throwErr(`Couldn't read the env cache file from ${pth}. Reason: ${err.message}`)
    }
    if (typeof envData !== 'object')
        throwErr(`Invalid env data in env cache file from ${pth}.`)
    return envData
}

/**
 * @name unregisteredKey
 * @description if an unregistered key is declared it will be added to both
 * the env cache and the package.json
 * @param key
 * @returns {Promise<*>}
 */
const unregisteredKey = async key => {
    try {
        return await inquirer.prompt([
            {
                type: 'input',
                name: 'value',
                message: `${key} key not found in env cache. Specify vale:`
            },
            {
                type: 'confirm',
                name: 'save',
                message: `Would you like to save the ${key} key in env cache (default: Yes)?`,
                default: true
            }
        ])
    } catch (err) {
        interactiveFail(err)
    }
}
/**
 * @name writeEnv
 * @description create a .env file in the root (defaults to cwd)
 * @param {String} env
 * @param {String?} pth
 */
const writeEnv = (env, pth = process.cwd()) => {
    if (!env.trim()) throwErr('No data to write to env provided.')
    try {
        fs.writeFileSync(
            path.join(pth, '.env'),
            env
        )
    } catch (err) {
        throwErr(`Could not create .env file in ${pth}. Reason: ${err.message}`)
    }
}

/**
 *
 * @param {Object} pkgData
 * @param {String} key
 * @returns {Object}
 */
const addEnvKey = (pkgData, key) => {
    if (!pkgData[STAKI].env[key])
        pkgData[STAKI].env.push(key)
    return pkgData
}

/**
 *
 * @param {Object} pkgData
 * @returns {Object}
 */
const initEnv = pkgData => {
    if (!pkgData[STAKI]) pkgData[STAKI] = {env: []}
    if (!pkgData[STAKI].env) pkgData[STAKI].env = []
    return pkgData
}

module.exports = {
    unregisteredKey,
    cacheEnv,
    getEnvCache,
    initEnv,
    addEnvKey,
    writeEnv
}
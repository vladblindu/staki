/**
 * @module actions
 * @description env module specific actions
 */
const {getPackage, putPackage} = require('../../lib/utils')
const {cacheEnv, getEnvCache, unregisteredKey, writeEnv, initEnv, addEnvKey} = require('./utils')
const {throwErr, log} = require('../../lib/helpers')

/**
 * @name add
 * @description adds an entry to the env cache
 * @param {string} key
 * @param {string} val
 * @param {String?} pth
 */
const add = (key, val, pth) => {
    if (!key || !val) throwErr('No proper key/value pair provided. Exiting.')
    const env = getEnvCache(pth)
    if (env[key]) {
        log(`A ${key}/${env[key]} env key/value pair already exists and it's.
            Use update flag (-u) to update the existing value`)
    }
    env[key] = val
    cacheEnv(env, pth)
}

/**
 * @name list
 * @description list an entry if key is present or all
 * entries of the env cache otherwise
 * @param {string?} [key]
 * @param {String?} pth
 */
const list = (key, pth) => {
    const env = getEnvCache(pth)
    if (key && env[key]) {
        log(`Content of env cache: \n${key} = ${env[key]}`)
        return
    }
    if (key && !env[key]) throwErr(`No env cache entries found for key ${key}`)
    const lst = Object.keys(env).reduce((acc, k, i) => {
        return `${acc}\n${i + 1}. ${k} = ${env[k]}`
    }, 'Content of env cache :')
    log(lst)
}

/**
 * @name remove
 * @description removes an entry to the env cache
 * @param {string} key
 * @param {String?} pth
 */
const
    remove = (key, pth) => {
        if (!key) throwErr('No key provided. Exiting.')
        const env = getEnvCache(pth)
        if (!env[key]) throwErr(`No ${key} present in env cache. Exiting.`)
        delete env[key]
        cacheEnv(env, pth)
    }

/**
 * @name update
 * @description updates an entry to the env cache
 * @param {string} key
 * @param {string} val
 * @param {String?} pth
 */
const update = (key, val, pth) => {
    if (!key || !val) {
        console.error('No proper key/value pair provided. Exiting.')
        return 0
    }
    const env = getEnvCache(pth)
    if (!env[key]) {
        log(`No ${key} present in env cache. Exiting.`)
        process.exit(0)
    }
    env[key] = val
    cacheEnv(env, pth)
}

/**
 * @name createEnv
 * @description creates a .env file out of the keys specified
 * in the staki.config.js file from the values in the env cache.json file
 * @param {string?} root
 * @param {String?} pth
 */
const createEnv = async (root = process.cwd(), pth) => {
    const pkg = getPackage(root)
    const envVault = getEnvCache(pth)
    const env = await Promise.all(
        pkg['staki'].env.map(
            async k => {
                if (!envVault[k]) {
                    const queryData = await unregisteredKey(k)
                    if (queryData['save']) add(k, queryData['value'])
                    return `${k}=${queryData['value']}`
                } else
                    return Promise.resolve(`${k}=${envVault[k]}`)
            }
        ))
    writeEnv(
        `# Environment variables\n #for ${pkg['name']}\n`.concat(env.join('\n')),
        pth
    )
}

/**
 * @name updateConfig
 * @description adds a env key to package.json's env config property
 * @param {String} key
 */
const updateConfig = key => {
    let {path, data} = getPackage()
    putPackage({
        path,
        data: addEnvKey(
            initEnv(data),
            key
        )
    })
}

module.exports = {
    add,
    list,
    remove,
    update,
    createEnv,
    updateConfig
}
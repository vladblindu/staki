const {getPackages, getPackage, putPackage} = require('../../@globals/utils')
const {setVersion, list} = require('./actions')

/**
 * @type {object} cmdObj
 * @param {string} cmdObj.increment
 * @param {string} cmdObj.decrement
 * @param {string} cmdObj.major
 * @param {string} cmdObj.minor
 * @param {string} cmdObj.recursive
 * @return {*}
 */

module.exports = (version, cmdObj) => {

    let inc = true
    const packs = cmdObj.recursive
        ? [...getPackages()]
        : [getPackage()]

    if(cmdObj.list) return list(packs)

    if (cmdObj.decrement) inc = false

    packs.forEach(pkg => {
            const data = setVersion(pkg.data, {
                version,
                major: cmdObj.major,
                minor: cmdObj.minor,
                patch: cmdObj.patch,
                inc
            })
            putPackage({path: pkg.path, data})
        }
    )
}
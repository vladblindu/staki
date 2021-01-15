/**
 * @module version
 * @category command
 * @description monorepo version management cli tool
 * @file ver/index.js
 */

const {getPackages, getPackage, putPackage} = require('../../lib/utils')
const {setVersion, list} = require('./actions')

/**
 * @typedef {Object} VerCmdObj
 * @property {Boolean} recursive
 * @property {Boolean} increment
 * @property {Boolean} decrement
 * @property {Boolean} major
 * @property {Boolean} minor
 * @property {Boolean} patch
 * @property {Boolean} list
 */

module.exports = {
    short: 'ver',
    long: 'version',
    command: 'ver [ver]',
    description: [
        'ver command',
        {
            ver: 'value of new ver'
        }],
    option: [
        ['-R, --recursive', 'increment all package.json ver fields recursively starting from current dir'],
        ['-M, --major', 'increment major ver number'],
        ['-m, --minor', 'increment minor ver number'],
        ['-d, --decrement', 'decrement instead of increment'],
        ['-l, --list', 'list version(s)']
    ],
    /**
     * @name action
     * @param {String?} version
     * @param {VerCmdObj} cmdObj
     * @returns {void}
     */
    action: (version, cmdObj) => {

        let inc = true
        const packs = cmdObj.recursive
            ? [...getPackages()]
            : [getPackage()]

        if (cmdObj.list) return list(packs)

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
}
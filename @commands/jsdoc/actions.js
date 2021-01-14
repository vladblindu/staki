const chalk = require('chalk')
const path = require('path')
const {log} = require('../../@globals/helpers')
const {throwErr} = require('../../@globals/helpers')
const {isEmpty} = require('../../@globals/helpers')
const {SEMVER_REGEXP, PKG} = require('../../@globals/constants')

/**
 * @type {Object} Package
 * @property {String} path
 * @property {Object} data
 */


/**
 * @name list
 * @description list the current version of provided package.json`s
 * @param {Package[]} packs
 */
const list = packs => {
    log('Version listing:')
    log(`root: ${chalk.blue(process.cwd())}\n`)
    packs.forEach(pkg => {
        log(`package name: ${chalk.green(pkg.data.name)}`)
        log(`path: ${chalk.blue(path.relative(process.cwd(), pkg.path) || '.')}`)
        log(`version: ${chalk.green(pkg.data.version)}\n`)
    })
}

/**
 * @param {object} pkg
 * @param {object?} opts
 * @param {string?} opts.version
 * @param {boolean?} opts.major
 * @param {boolean?} opts.minor
 * @param {boolean?} opts.patch
 * @param {boolean?} opts.inc
 * @returns {object}
 */
const setVersion = (pkg, opts) => {

    const modify = (str, inc) => {
        let nr = parseInt(str)
        if (!nr && !inc) throwErr('Csn not decrement version descriptor if it`s value is 0')
        return inc ? ++nr : --nr
    }

    if (opts && opts.version) {
        if (!SEMVER_REGEXP.test(opts.version))
            throwErr(`${opts.version} is not a valid semver format\n(major.minor.patch - ex: 2.3.14), which is not supported.`)
        pkg.version = opts.version
        return pkg
    }
    if (!SEMVER_REGEXP.test(pkg.version))
        throwErr(`${pkg.name}'s ${PKG} version (${pkg.version}) is not a valid semver format\n(major.minor.patch - ex: 2.3.14), which is not supported.`)

    if (!opts || isEmpty(opts))
        opts = {patch: true, inc: true}

    if (opts.patch !== false)
        opts.patch = true

    if (opts.inc !== false)
        opts.inc = true

    let [major, minor, patch] = pkg.version.split('.')

    if (opts.major) major = modify(major, opts.inc)
    if (opts.minor) minor = modify(minor, opts.inc)
    if (opts.patch) patch = modify(patch, opts.inc)

    pkg.version = [major.toString(), minor.toString(), patch.toString()].join('.')

    return pkg
}

module.esports = {
    list,
    setVersion
}
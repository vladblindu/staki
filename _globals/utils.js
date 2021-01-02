const path = require('path')
const fs = require('fs')
const glob = require('glob')
const {findProjectRoot} = require('./helpers')
const {STAKI, PKG, PACKAGES_ROOT} = require('./constants')

/**
 * @typedef {Object} Package
 * @property {String} path
 * @property {Object} data
 */

/**
 * @name getPackage
 * @description gets a single package.json
 * @param {String?} root
 * @return {Package}
 */
const getPackage = (root = process.cwd()) => {
    const rootPkg = path.join(root, PKG)
    try {
        return {
            path: root,
            data: JSON.parse(
                fs.readFileSync(rootPkg, 'utf8')
            )
        }
    } catch (err) {
        throw new Error(`Couldn't read/find any valid ${PKG} in ${rootPkg}. Reason: ${err.message}`)
    }
}

/**
 * @name getPackages
 * @description gets multiple package.json`s
 * @param {String?} root
 * @return {Package[]}
 */
const getPackages = (root = process.cwd()) => {
    const opts = {absolute: true}
    if (root) opts.cwd = root

    const rootPkg = getPackage(root)

    let pkgRoots = ''

    if (rootPkg.data[PACKAGES_ROOT] && rootPkg.data[PACKAGES_ROOT].length)
        pkgRoots = rootPkg.data[PACKAGES_ROOT]
    else return [rootPkg]

    return pkgRoots.reduce(
        (acc, pkr) => {
            const pth = path.join(root, pkr)
            const packagesPath = glob.sync(`${pth}/**/${PKG}`, {absolute: true, dir: true})
            acc.push(...packagesPath.map(pth => getPackage(path.dirname(pth))))
            return acc
        }, [rootPkg])
}


/**
 * @name putPackages
 * @description writes a package.json file
 * @param {Package} pkg
 */
const putPackage = pkg => {
    try {
        fs.writeFileSync(path.join(pkg.path, PKG), JSON.stringify(pkg.data, null, 2))
    } catch (err) {
        throw new Error(`Couldn't save staki config in ${root}/${PKG}. reason: ${err.message}`)
    }
}

/**
 * @name initStakiConfig
 * @description adds a staki data structure to a given package.json
 * @param {object} pkg
 * @return {Package}
 */
const initStakiConfig = pkg => {
    if (!pkg[STAKI]) {
        pkg[STAKI] = {}
        return pkg
    }
    if (!pkg[STAKI].env) {
        pkg[STAKI].env = []
        return pkg
    }
    if (!pkg[STAKI].root) {
        pkg[STAKI].root = findProjectRoot()
        return pkg
    }
    return pkg
}
module.exports = {

    getPackage,

    getPackages,

    putPackage,

    initStakiConfig
}
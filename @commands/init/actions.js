const execa = require('execa')
const path = require('path')
const {putPackage} = require('../../@globals/utils')
const {createRoot, getRoot} = require('./utils')
const {starterGitTemplate} = require('./config')
const {inline, throwErr, log, logOK} = require('../../@globals/helpers')
const {GREEN, STAKI} = require('../../@globals/constants')


/**
 * @name initStakiConfig
 * @description adds a staki data structure to a given package.json
 * @param {object} data
 * @return {Package}
 */
const initStakiConfig = data => {
    if (!data[STAKI]) data[STAKI] = {}
    return data
}

/**
 * @name setPackageName
 * @description creates a monorepo type package naming in a given package.json
 * @param {string} projectName
 * @param {object} pkg
 */
const setPackageName = (projectName, pkg) => {
    if (pkg.data.name.indexOf('/') !== -1) {
        const bits = pkg.data.name.split('/')
        if (!bits[0].startsWith('@'))
            bits[0] = '@' + bits[0]
        return bits[0] + '/' + projectName
    }
    return '@' + path.basename(pkg.path) + '/' + projectName
}

/**
 * @name updatePackages
 * @description initialises the new package .json in every package contained by the app
 * @param {Object} packages
 * @param {Object} queryData
 */
const updatePackages = (packages, queryData) => {
    packages.map(
        pkg => {
            let {path, data} = pkg
            process.stdout.write(`Processing ./${path.relative(process.cwd(), path)}...`)
            data.name = setPackageName(queryData['appName'], pkg)
            data = initStakiConfig(data)
            delete queryData['appName']
            data[STAKI] = queryData
            putPackage({path, data})
            logOK()
        })
}

/**
 * @name getGit
 * @description clones the template repo
 * @param {string} dir
 * @param {string?} tpl
 */
const getGit = (dir, tpl = starterGitTemplate) => {
    try {
        execa.commandSync(`git clone ${tpl} ${dir}`)
        process.stdout.write('Cloning start-up repo...')
    } catch (err) {
        throwErr(`Couldn't clone the starter template repo at ${starterGitTemplate}`)
    }
    logOK()
}

/**
 * @name setupDir
 * @description handles the initial directory setup
 * @param {String} dir
 * @return {String}
 */
const setupDir = dir => {
    const local = !dir || dir.trim() === '.'
    const root = local ? process.cwd() : getRoot(dir)

    if (local) {
        inline('Creating root directory...')
        createRoot(dir)
        logOK()
    }
    return root
}

module.exports = {
    setupDir,
    getGit,
    updatePackages,
    setPackageName
}
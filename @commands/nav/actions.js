const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const {getPackages} = require('../../lib/utils')
const {warn, throwErr, log, findMonoRepoRoot, findProjectRoot, interactiveFail} = require('../../lib/helpers')
const {cache} = require('./constants')
const {GREEN} = require('../../lib/constants')

const cachePth = path.join(__dirname, cache)

/**
 * @name getCache
 * @description reads the default project's root dir from the .cache file
 * @returns {string}
 */
const getCache = () => fs.readFileSync(cachePth, 'utf8').trim()

/**
 * @name setCache
 * @description saves the dir arg in the .cache file
 * @param {String} dir
 */
const setCache = dir => {
    fs.writeFileSync(cachePth, dir)
}

/**
 * @name set
 * @description saves the current project's root dir in the .cache file
 */
const setCurrent = () => {
    const root = findProjectRoot()
    setCache(root)
}

/**
 * @name back
 * @description rolls back to the cwd to the cached default
 */
const back = () => {
    try {
        const pth = getCache()
        log(`Current work dir: ${pth}`)
        return process.chdir(pth)
    } catch (err) {
        throwErr(`Couldn't return to last project. Reason: ${err.message}`)
    }
}
/**
 * @name goToRoot
 * @description sets the cwd to the mono-repo root directory
 */
const goToRoot = () => {
    const root = findMonoRepoRoot()

    if (process.cwd() !== root) {
        log('Current work dir' + chalk.blue('(Project root):'), GREEN)
        log(root)
        return process.chdir(root)
    }
}
/**
 * @name navToPkg
 * @description interactively let's you choose a package to
 * set as default from the available packages in the monorepo
 * (root package included)
 * @returns {Promise<void>}
 */
const navToPkg = async () => {
    // get the project's root directory
    const root = findMonoRepoRoot()

    // get all packages
    const packs = getPackages(root)
    let queryData = ''

    // create an interactive query list out of the found packages
    const query = {
        type: 'list',
        name: 'package',
        message: `Select package to go to:?`,
        choices: () => packs.map(pkg => ({name: pkg.data.name, value: pkg.path})),
        default: {name: 'Project root', value: root}
    }

    // run the query
    try {
        queryData = await inquirer.prompt(query)
    } catch (err) {
        interactiveFail(err)
    }

    // change the directory accordingly
    process.chdir(queryData['package'])

    // if the project root is requested, don't cache it
    try {
        // if it's a package, cache-it and log the cwd
        if (queryData['package'] !== root) {
            setCache(queryData['package'])
            log('Current work dir:', GREEN)
            log(queryData['package'])
        } else {
            // else, just log teh cwd
            log('Current work dir' + chalk.blue(('(Project root):')), GREEN)
            log(root)
        }
    } catch (err) {
        warn(`Couldn't cache the current project's directory. Reason ${err.message}`)
    }
}


module.exports = {
    setCache,
    getCache,
    setCurrent,
    back,
    navToPkg,
    goToRoot
}
const path = require('path')
const inquirer = require('inquirer')
const queries = require('./queries')
const {setupDir, getGit, updatePackages} = require('./actions')
const {log, interactiveFail} = require('../../@globals/helpers')
const {getPackages} = require('../../@globals/utils')
const {GREEN} = require('../../@globals/constants')

/**
 * @name init
 * @description project initialisation command utility
 * @param {String} dir
 * @param {String} tpl
 * @return {Promise<void>}
 */
const init = async (dir, tpl) => {
    log('Initializing new project...', GREEN)
    let queryData = null
    try {
        queryData = await inquirer.prompt(queries)
    } catch (err) {
        interactiveFail(err)
    }

    const root = setupDir(dir)

    getGit(dir, tpl)

    const pkgs = getPackages(root)

    updatePackages(pkgs, queryData)

    log('Setup ready.', GREEN)
    if (root !== process.cwd()) log(`cd into ${path.basename(path.dirname(root))}`)
    log('Run "yarn install" to proceed')
}

module.exports = init
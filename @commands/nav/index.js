const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const {getPackages} = require('../../_globals/utils')
const {findProjectRoot} = require('../../_globals/helpers')

/**
 * @name nav
 * @description project dir navigation command utility
 * @param {Object} cmdObj
 * @param {boolean} cmdObj.back
 * @param {boolean} cmdObj.root
 * @return {Promise<void>}
 */

const nav = async cmdObj => {
    const tmpPath = path.join(__dirname, 'tmp', 'history')

    if (cmdObj.back) {
        try {
            const pth = fs.readFileSync(tmpPath, 'utf8')
            console.log(`Current work dir: ${pth}`)
            return process.chdir(pth)
        } catch (err) {
            throw new Error(`Couldn't return to last project. Reason: ${err.message}`)
        }
    }

    const root = findProjectRoot()

    if (cmdObj.root && process.cwd() !== root) {
        console.log(chalk.green('Current work dir', chalk.blue('(Project root):')))
        console.log(root)
        return process.chdir(root)
    }

    const packs = getPackages(root)
    let queryData = ''

    const query = {
        type: 'list',
        name: 'package',
        message: `Select package to go to:?`,
        choices: () => packs.map(pkg => ({name: pkg.data.name, value: pkg.path})),
        default: {name: 'Project root', value: root}
    }
    try {
        queryData = await inquirer.prompt(query)
    } catch (err) {
        console.error(err.message)
        console.error('FATAL ERROR! Process exiting.')
        process.exit(1)
    }

    process.chdir(queryData['package'])
    try {
        if (queryData['package'] !== root)
            fs.writeFileSync(tmpPath, queryData['package'])
    } catch (err) {
        console.warn(`Couldn't save history. Reason ${err.message}`)
    }
    if (queryData['package'] !== root) {
        console.log(chalk.green('Current work dir:'))
        console.log(queryData['package'])
    }
    else {
        console.log(chalk.green('Current work dir', chalk.blue(('(Project root):'))))
        console.log(root)
    }
}

module.exports = nav
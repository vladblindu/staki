const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const {putPackage, getPackages, initStakiConfig} = require('../../_globals/utils')
const {getGit, getRoot, createRoot, setPackageName, setPackageData} = require('./utils')
const {appName, version, author, licenseTypes} = require('../../_globals/defaults.config')

const queries = [
    {
        type: 'input',
        name: 'appName',
        message: `Project name (${appName})?`,
        default: appName
    },
    {
        type: 'input',
        name: 'version',
        message: `Version(${version})?`,
        default: version
    },
    {
        type: 'input',
        name: 'author',
        message: `Author(${author})?`,
        default: author
    },
    {
        type: 'list',
        name: 'licence',
        message: `Licence (${licenseTypes[0]})?`,
        choices: licenseTypes,
        default: licenseTypes[0]
    }
]

/**
 * @name init
 * @description project initialisation command utility
 * @param {String} dir
 * @param {String} tpl
 * @return {Promise<void>}
 */
const init = async (dir, tpl) => {
    console.log('Initializing new startup-project...')
    let queryData = null
    try {
        queryData = await inquirer.prompt(queries)
    } catch (err) {
        console.error(err.message)
        console.error('FATAL ERROR! Process exiting.')
        process.exit(1)
    }

    const local = !dir || dir.trim() === '.'
    const root = local ? process.cwd() : getRoot(dir)

    if (local) {
        process.stdout.write('Creating root directory...')
        createRoot(dir)
        console.log(chalk.green('OK'))
    }

    process.stdout.write('Cloning start-up repo...')
    getGit(dir, tpl)
    console.log(chalk.green('OK'))

    process.stdout.write('retrieving package data...')
    const pks = getPackages(root)
    console.log(chalk.green('OK'))

    pks.map(
        pkg => {
            process.stdout.write(`Processing ./${path.relative(process.cwd(), pkg.path)}...`)
            pkg.data.name = setPackageName(queryData['appName'], pkg)
            if (!pkg.data['staki']) pkg = initStakiConfig(pkg)
            delete queryData['appName']
            pkg.data = setPackageData(queryData, pkg)
            putPackage(pkg)
            console.log(chalk.green('OK'))
        })


    console.log(chalk.green('Setup ready.'))
    if (!local) console.log(`cd into ${path.basename(path.dirname(root))}`)
    console.log('Run "yarn install" to proceed')
}

module.exports = init
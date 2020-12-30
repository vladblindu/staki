const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const {getGit, getPackages, getRoot, createRoot, setPackageName, setPackageData, putPackage} = require('./utils')
const {appName, version, author, licenseTypes} = require('../defaults.config')


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

module.exports = async () => {
    console.log('Initializing new startup-project...')
    let queryData = null
    try {
        queryData = await inquirer.prompt(queries)
    } catch (err) {
        console.error(err.message)
        console.error('FATAL ERROR! Process exiting.')
        process.exit(1)
    }
    const root = getRoot(process.argv)
    const isLocal = root === process.cwd()

    if (!isLocal) {
        process.stdout.write('Creating root directory...')
        createRoot(root)
        console.log(chalk.green('OK'))
    }

    process.stdout.write('Cloning start-up repo...')
    getGit(root)
    console.log(chalk.green('OK'))

    process.stdout.write('retrieving package data...')
    const pks = getPackages(root)
    console.log(chalk.green('OK'))

    pks.map(
        pkg => {
            process.stdout.write(`Processing ./${path.relative(process.cwd(), pkg.path)}...`)
            pkg.data.name = setPackageName(queryData['appName'], pkg)
            delete queryData['appName']
            pkg.data = setPackageData(queryData, pkg)
            putPackage(pkg)
            console.log(chalk.green('OK'))
        })


    console.log(chalk.green('Setup ready.'))
    if(!isLocal) console.log(`cd into ${path.basename(path.dirname(root))}`)
    console.log('Run "yarn install" to proceed')

}
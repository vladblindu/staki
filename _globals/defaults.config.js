const path = require('path')

// _globals
const appName = path.basename(path.resolve('./'))
const version = '1.0.0'
const author = 'bitbrother'
const licenseTypes = [
    'MIT',
    'UNLICENSED'
]

// default package.json staki configuration object
const stakiConfig = {
    env: []
}

// git templates
const starterGitTemplate = 'https://github.com/vladblindu/test-repo.git'

// env section
const envVaultPath = process.env.NODE_ENV.toUpperCase() === 'TEST'
    ? path.join(process.cwd(), 'env-vault.json')
    : '~/.env-vault.json'

module.exports = {
    stakiConfig,
    appName,
    version,
    author,
    licenseTypes,
    starterGitTemplate,
    envVaultPath
}
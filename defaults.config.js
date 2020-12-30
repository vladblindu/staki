const path = require('path')
const pkgUp = require('pkg-up')
const isTesting = process.env.NODE_ENV.toUpperCase() === 'TEST'

// globals
const appName = path.basename(path.resolve('./'))
const binPath = path.resolve('./')
const version = '1.0.0'
const author = 'bitbrother'
const licenseTypes = [
    'MIT',
    'UNLICENSED'
]

// git templates
const starterGitTemplate = isTesting
    ? 'https://github.com/vladblindu/test-repo.git'
    : 'https://github.com/vladblindu/test-repo.git'

// env section
const envVaultPath = isTesting
    ? path.join(__dirname, 'test', '__fixtures__', 'env-test', 'env-vault.json')
    : '~/.env-vault.json'

const skConfigPath = isTesting
    ? path.join(__dirname, 'test', '__fixtures__', 'env-test', 'sk.config.js')
    : path.join(path.dirname(pkgUp.sync()), '/sk.config.js')


module.exports = {
    appName,
    binPath,
    version,
    author,
    licenseTypes,
    starterGitTemplate,
    envVaultPath,
    skConfigPath
}
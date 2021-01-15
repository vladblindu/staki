const {
    defaultAppName,
    defaultVersion,
    defaultAuthor,
    defaultLicenseTypes
} = require('./config')

module.exports = [
    {
        type: 'input',
        name: 'defaultAppName',
        message: `Project name (${defaultAppName})?`,
        default: defaultAppName
    },
    {
        type: 'input',
        name: 'defaultVersion',
        message: `defaultVersion(${defaultVersion})?`,
        default: defaultVersion
    },
    {
        type: 'input',
        name: 'defaultAuthor',
        message: `defaultAuthor(${defaultAuthor})?`,
        default: defaultAuthor
    },
    {
        type: 'list',
        name: 'licence',
        message: `Licence (${defaultLicenseTypes[0]})?`,
        choices: defaultLicenseTypes,
        default: defaultLicenseTypes[0]
    }
]
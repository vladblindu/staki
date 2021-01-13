const path = require('path')

module.exports = {
    starterGitTemplate: 'https://github.com/vladblindu/test-repo.git',
    defaultAppName: path.basename(path.resolve('./')),
    defaultVersion: '1.0.0',
    defaultAuthor: 'bitbrother',
    defaultLicenseTypes: [
        'MIT',
        'UNLICENSED'
    ]
}
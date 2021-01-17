const {README, defaultSrcRoot, targetFiles} = require('./config')

const initQuery = [
    {
        type: 'input',
        name: 'docFile',
        message: 'Documentation filename? (default README.md):',
        default: README
    },
    {
        type: 'input',
        name: 'srcRoot',
        message: 'Target files start scan directory:(default: src):',
        default: defaultSrcRoot
    },
    {
        type: 'list',
        name: 'targetFiles',
        message: 'What kind of files should be tracked?: (default: js, ts, jsx, tsx)',
        default: targetFiles
    },
    {
        type: 'confirm',
        name: 'catPartials',
        message: 'Should it create partial category doc files? (default: yes)',
        default: true
    },
    {
        type: 'confirm',
        name: 'index',
        message: 'Should be documentation linked and indexed in a global README.md file:',
        default: true
    }
]

module.exports = {
    initQuery
}
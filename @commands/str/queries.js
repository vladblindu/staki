const {readJson} = require('../../lib/helpers')
const {langList, selectedLangs} = require('./helpers')
const {
    defaultLangs,
    defaultLang,
    defaultConfigRoot,
    defaultDestRoot,
    defaultSrcRoot
} = require('./config')
const {LOCALES_FILE_PATH} = require('./constants')


/**
 * @name primaryQuery
 * @param {Object} locales
 * @return {Object[]}
 */
const primaryQuery = locales => [
    {
        type: 'input',
        name: 'srcRoot',
        message: 'What is the source root path?:',
        default: defaultSrcRoot
    },
    {
        type: 'input',
        name: 'destRoot',
        message: 'What is the destination path of the lang files?:',
        default: defaultDestRoot
    },
    {
        type: 'input',
        name: 'configRoot',
        message: 'What is the destination path of stringer configuration file?:',
        default: defaultConfigRoot
    },
    {
        type: 'checkbox',
        name: 'langs',
        message: 'Chose the languages you would like to use:',
        choices: langList(Object.keys(locales), 'locales'),
        default: defaultLangs
    }]
/**
 * @name secondaryQuery
 * @param {Strings[]} langs
 * @param {Object} locales
 * @return {Object}
 */
const secondaryQuery = (langs, locales) => {
    const selected = langList(langs, locales)
    return {
        type: 'list',
        name: 'defaultLang',
        message: 'Chose default language:',
        choices: selected,
        default: selected.includes(defaultLang)
            ? defaultLang
            : selected[0]
    }
}

module.exports = {
    // #NOT-TESTED
    primaryQuery,
    // #NOT-TESTED
    secondaryQuery
}
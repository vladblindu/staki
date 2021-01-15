const path = require('path')
const locales = require('../../@resources/locales/locales.json')
const fs = require('fs')
const {LOCALES_FILE_PATH, FLAGS_PATH, FLAG_EXTENSION, SECTION, IMG_BASE64} = require('./constants')
const {throwErr, readJson, dashToCamel} = require('../../@globals/helpers')

/**
 * @name langList
 * @description converts locales data to query specific data
 * @param langs
 * @return {*}
 */
const langList = langs =>
    langs.map(lng => ({
        name: readJson(LOCALES_FILE_PATH)[lng]['name'],
        value: lng
    }))

/**
 * @name flagConvert
 * @description converts a png picture file to a base64 string
 * @param {String} flag
 * @return {String}
 */
const flagConvert = flag => {
    const flagFile = path.join(FLAGS_PATH, flag.concat('.', FLAG_EXTENSION))
    try {
        return IMG_BASE64 + fs.readFileSync(flagFile, 'base64')
    } catch (err) {
        throwErr(`Unable to read/convert ${flagFile} to string. Reason: ${err.message}`)
    }
}

/**
 * @name getSection
 * @description extracts the component information from a strings file
 * @param {String} pth
 * @param {Object} cont
 * @return {String}
 */
const getSection = (pth, cont) => {
    if (cont[SECTION]) return cont[SECTION]
    const bits = path.basename(pth).split('.')
    if (bits.length > 2) return dashToCamel(bits[0])
    return dashToCamel(
        path.basename(
            path.dirname(pth)))
}

module.exports = {
    langList,
    flagConvert,
    getSection
}

const path = require('path')
const fs = require('fs')
const {throwErr} = require('../../lib/helpers')

/**
 * @name getRoot
 * @description gets the root of a new project
 * @param {string} dir
 * @returns {string}
 */
const getRoot = dir => {
    if (fs.existsSync(
        path.join(process.cwd(), dir)))
        throwErr(`Directory ${dir} already exists.`)
    return path.join(process.cwd(), dir)
}

/**
 * @name createRoot
 * @description creates a new folder for the current project
 * @param {string} root
 */
const createRoot = root => {
    if (/[%#&*+?!~<>^]/.test(root))
        throwErr('Invalid directory name. (contains illegal characters)')
    try {
        fs.mkdirSync(root)
    } catch (err) {
        throwErr(`Couldn't create directory: ${root}, ${err.message}`)
    }
}
module.exports = {
    getRoot,
    createRoot
}
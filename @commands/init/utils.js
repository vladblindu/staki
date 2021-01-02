const path = require('path')
const fs = require('fs')
const execa = require('execa')
const {starterGitTemplate} = require('../../_globals/defaults.config')

module.exports = {
    /**
     * @name getRoot
     * @description gets the root of a new project
     * @param {string} dir
     * @returns {string}
     */
    getRoot: dir => {
        if (fs.existsSync(
            path.join(process.cwd(), dir)))
            throw new Error(`Directory ${dir} already exists. Fatal error. Exiting.`)
        return path.join(process.cwd(), dir)
    },
    /**
     * @name createRoot
     * @description creates a new folder for the current project
     * @param {string} root
     */
    createRoot: root => {
        if (/[%#&*+?!~<>^]/.test(root))
            throw new Error('Invalid directory name. (contains illegal characters)')
        try {
            fs.mkdirSync(root)
        } catch (err) {
            throw new Error(`Couldn't create directory: ${root}, ${err.message}`)
        }
    },
    /**
     * @name getGit
     * @description clones the template repo
     * @param {string} dir
     * @param {string?} tpl
     */
    getGit: (dir, tpl = starterGitTemplate) => {
        try {
            execa.commandSync(`git clone ${tpl} ${dir}`)
        } catch (err) {
            throw new Error(`Couldn't clone the starter template repo at ${starterGitTemplate}`)
        }
    },
    /**
     * @name setPackageName
     * @description creates a monorepo type package naming in a given package.json
     * @param {string} projectName
     * @param {object} pkg
     */
    setPackageName: (projectName, pkg) => {
        if (pkg.data.name.indexOf('/') !== -1) {
            const bits = pkg.data.name.split('/')
            if (!bits[0].startsWith('@'))
                bits[0] = '@' + bits[0]
            return bits[0] + '/' + projectName
        }
        return '@' + path.basename(pkg.path) + '/' + projectName
    },
    /**
     * @name setPackageValues
     * @param {object} data
     * @param {object} pkg
     * @returns {object}
     */
    setPackageData: (data, pkg) =>
        ({
            ...pkg.data,
            ...data
        })
}
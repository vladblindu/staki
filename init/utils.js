const path = require('path')
const fs = require('fs')
const glob = require('glob')
const execa = require('execa')
const {PKG} = require('../_globals/constants')
const {starterGitTemplate} = require('../_globals/defaults.config')

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
     * @name getPackages
     * @descripton gets all packages.json from current project in a
     * {
     *      path: package.json path
     *      data: package.json data
     * }
     * @param {string} dir
     * @returns {object}[]}
     */
    getPackages: (dir ) => {
        let packs = []
        try {
            packs = glob.sync(`**/${PKG}`, {
                cwd: dir,
                absolute: true
            })
        } catch (err) {
            throw new Error('Error reading package.json files. ' + err.message)
        }
        if (!packs.length)
            throw new Error(`Didn't find any package.json files in ${root}`)
        return packs.map(pkg => ({
            path: pkg,
            data: require(pkg)
        }))
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
        }),
    /**
     * @name putPackages
     * @description write back the modified packages.json file
     * @param {object} pkg
     */
    putPackage: pkg => {
        fs.writeFileSync(pkg.path, JSON.stringify(pkg.data, null, 2))
    }
}
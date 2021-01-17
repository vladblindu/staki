const path = require('path')
const inquirer = require('inquirer')
const glob = require('glob')
const getMd = require('jsdoc-to-markdown')
const {pattern} = require('./config')
const queries = require('./queries')
const {getPackage, putPackage} = require('../../lib/utils')
const {interactiveFail, throwErr} = require('../../lib/helpers')
const {STAKI, JSDOC} = require('../../lib/constants')

/**
 * @typedef {Object} InitData
 * @property {String} docFile
 * @property {String} srcRoot
 * @property {TargetFiles[]} targetFiles
 * @property {String[]} pattern
 */


/**
 * @class Doc
 * @property {String} _docFile
 * @property {String} _srcRoot
 * @property {TargetFiles[]} _targetFiles
 * @property {String[]} _pattern
 */
class Doc {

    constructor() {
        this._query = inquirer.prompt
        this._getPakage = getPackage
        this._putPackage = putPackage
    }

    /**
     * @method _getQueriesData
     * @returns {QueriesData}
     * @private
     * @returns {InitData|undefined}
     */
    async _getQueriesData() {
        try {
            return await inquirer.prompt(queries)
        } catch (err) {
            interactiveFail(err)
        }
    }

    /**
     * @method _populate
     * @param {InitData} initData
     * @private
     * @tested
     */
    _populate(initData) {
        Object.keys(initData).forEach(
            k => this['_' + k] = initData[k])
    }

    /**
     * @method _initPkg
     * @param {Object} pkg
     * @private
     * @tested
     */
    _initPkg = async (pkg) => {
        const setupData = await this._getQueriesData()
        if (!pkg.data[STAKI]) pkg.data[STAKI] = {}
        pkg.data[STAKI][JSDOC] = setupData
        this._putPackage(pkg)
    }

    /**
     * @method _collectFiles
     * @private
     */
    _collectFiles() {
        // solve the cwd
        const root = path.isAbsolute(this._srcRoot)
            ? this._srcRoot
            : path.join(process.cwd(), this._srcRoot)
        // glob the strings files
        const filePaths = glob.sync(this._globPattern(), {
            cwd: root,
            absolute: true
        })
        if (!filePaths.length)
            throwErr(`No ${this._targetFiles.join(', ')} files found in: ${root}`)
        return filePaths
    }

    /**
     *@method _globPattern
     * @returns {String}
     * @private
     */
    _globPattern() {
        return pattern[0].concat(
            this._targetFiles.map(ft => `*.${ft}`).join('|'),
            pattern[1])
    }

    _getMd(source){
        return getMd.renderSync({source})
    }

    /**
     * @method init
     * @param {Boolean?} verbose
     */
    async init(verbose){
        const pkg = getPackage()
        await this._initPkg(pkg)
        await this.scan(pkg, verbose)
    }

    /**
     * @method scan
     * @param {Object?} pkg
     * @param {Boolean} verbose
     */
    scan(pkg, verbose){
        pkg = pkg || getPackage()
        console.log('Will scan!!!', verbose, pkg)
    }
}

module.exports = new Doc()
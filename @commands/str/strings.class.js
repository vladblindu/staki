const path = require('path')
const inquirer = require('inquirer')
const glob = require('glob')
const chalk = require('chalk')
const {flagConvert, getSection} = require('./helpers')
const {secondaryQuery, primaryQuery} = require('./queries')
const {getPackage, putPackage, setupDir} = require('../../@globals/utils')
const {
    throwErr,
    interactiveFail,
    readJson,
    writeJson,
    inline,
    logOK,
    silentMkDir,
    isEmpty
} = require('../../@globals/helpers')
const {
    GLOB_PATTERN,
    LOCALES_FILE_PATH,
    META_FILE_NAME,
    BASE_NAME,
    LANG_FILE_EXTENSION,
    INITIAL_STRINGS_FILE,
    CONFIG_ROOT
} = require('./constants')

const {
    PKG,
    PACKAGES_ROOT,
    STAKI,
    STRINGER
} = require('../../@globals/constants')

/**
 * @typedef {Object} FileData
 * @property {String} path
 * @property {String} section
 * @property {Object} content
 */

/**
 * @typedef {Object} QueriesData
 * @property {String[]} _langs
 * @property {String} _defaultLang
 * @property {String} _srcRoot
 * @property {String} _destRoot
 * @property {String} _configRoot
 */

/**
 * @class Strings
 * @property {String[]} _langs
 * @property {String} _defaultLang
 * @property {String} _srcRoot
 * @property {String} _destRoot
 * @property {String} _configRoot
 */
class Strings {

    /**
     * @method _putPackage
     * @param {Object} pkg
     * @private
     * @no-test
     */
    _putPackage(pkg){
        putPackage(pkg)
    }

    /**
     * @method _getLocales
     * @returns {Object}
     * @private
     * @n-test
     */
    _getLocales() {
        return readJson(LOCALES_FILE_PATH)
    }

    /**
     * @method _setupDir
     * @returns {Promise<void>}
     * @private
     * @NO-TEST
     */
    async _setupDir() {
        for (const root of this.roots) {
            await setupDir(root)
        }
    }

    /**
     * @method _populate
     * @param {Object} data
     * @private
     * @tested
     */
    _populate(data) {
        Object.keys(data).forEach(
            k => {
                return this['_' + k] = k === CONFIG_ROOT
                    ? path.join(data[k], BASE_NAME)
                    : data[k]
            }
        )
    }

    /**
     * @method _putMeta
     * @param {Boolean} verbose
     * @private
     * @tested
     */
    _putMeta(verbose = false) {
        const locales = this._getLocales()
        const meta = this._langs.reduce(
            (acc, lng) => {
                acc[lng] = {}
                acc[lng].name = locales[lng].name
                try {
                    acc[lng]['flag'] = flagConvert(locales[lng]['flagFile'])
                } catch (err) {
                    throwErr(`PNG to Base64 conversion error. Reason:${err.message}`)
                }
                return acc
            }, {})
        writeJson(
            path.join(process.cwd(), this._configRoot, META_FILE_NAME),
            meta)
    }

    /**
     * @method _setup
     * @param {Object} pkg
     * @param {Boolean} verbose
     * @private
     * @tested
     */
    _setup(pkg, verbose = false) {
        // 2. if it's a monorepo root package throw
        if (pkg.data[PACKAGES_ROOT])
            return throwErr(`The current ${PKG} belongs to a mono-repo root (${chalk.blue(pkg.data.name)}).\n` +
                `Stringer should be initialized only in child projects.`)
        if (pkg.data[STAKI] &&
            pkg.data[STAKI][STRINGER] &&
            pkg.data[STAKI][STRINGER]['langs'] &&
            pkg.data[STAKI][STRINGER]['defaultLang'] &&
            pkg.data[STAKI][STRINGER]['srcRoot'] &&
            pkg.data[STAKI][STRINGER]['destRoot'] &&
            pkg.data[STAKI][STRINGER]['configRoot']
        ) return this._populate(pkg.data[STAKI][STRINGER])
        throwErr(`Invalid ${STAKI}.${STRINGER} configuration settings (missing or invalid keys). ` +
            `Consider relaunching with the -i (--init) option`)
    }

    /**
     * @method _initialize
     * @param {Object} pkg
     * @param {Boolean} verbose
     * @private
     * @tested
     */
    async _initialize(pkg, verbose) {
        if (!pkg.data[STAKI]) pkg.data[STAKI] = {}
        if (!pkg.data[STAKI][STRINGER]) pkg.data[STAKI][STRINGER] = {}
        // 2. initialize the package data and
        const setupData = await this._getQueriesData()
        this._populate(setupData)
        // 3. Solve the root dirs
        await this._setupDir()
        this._putMeta(verbose)
        pkg.data[STAKI][STRINGER] = setupData
        this._putPackage(pkg)
    }

    /**
     * @method roots
     * @returns {String[]}
     * @no-test
     */
    get roots() {
        return [this._srcRoot, this._destRoot, this._configRoot]
    }

    /**
     * @method _getQueriesData
     * @returns {QueriesData}
     * @private
     */
    async _getQueriesData() {
        const locales = this._getLocales()
        let tmp = null
        try {
            const _primaryQuery = primaryQuery(locales)
            const initial = await inquirer.prompt(_primaryQuery)
            const _secondaryQuery = secondaryQuery(initial['langs'], locales)
            const defaultLang = await inquirer.prompt(_secondaryQuery)
            return {
                ...initial,
                defaultLang
            }
        } catch (err) {
            interactiveFail(err)
        }
    }

    /**
     * @method _collectFiles
     * @private
     * @returns {FileData[]}
     */
    _collectFiles() {
        // solve the cwd
        const root = path.isAbsolute(this._srcRoot)
            ? root
            : path.join(process.cwd(), this._srcRoot)
        // glob the strings files
        const filePaths = glob.sync(GLOB_PATTERN, {
            cwd: root,
            absolute: true
        })

        return filePaths.map(
            filePath => {
                const fileCont = readJson(filePath)
                return {
                    path: path.relative(process.cwd(), filePath),
                    section: getSection(filePath, fileCont),
                    content: fileCont
                }
            }
        )
    }

    /**
     * @method _validate
     * @param {FileData} fileData
     * @private
     */
    _validate(fileData) {
        this._langs.forEach(lng => {
            // check for missing language entries
            if (!fileData.content[lng])
                throwErr(`${fileData.path} ${BASE_NAME} file has a missing ${lng} key. Please fix and rescan`)
        })
    }

    /**
     * @method parse
     * @returns {Object}
     * @private
     */
    _parse() {
        // 1. glob the strings files
        return this._collectFiles().reduce(
            // 2. for each file
            (acc, fileData) => {
                inline(`Processing file: ${fileData.path}...`)
                // 3. validate it's content
                this._validate(fileData)
                // 4. and for each project lang
                this._langs.forEach(
                    lng => {
                        // 5. store in the acc the [section.key] data for each language
                        Object.keys(fileData.content).forEach(
                            k => acc[lng][fileData.section.concat('.', k)] = fileData.content[k]
                        )
                    })
                logOK()
                return acc
            }, {})
    }

    /**
     * @method _putLangsFiles
     * @param {Object} langData
     * @private
     */
    _putLangsFiles(langData) {
        this._langs.forEach(
            lng => {
                inline(`Writing ${path.join(this._destRoot, lng.concat(LANG_FILE_EXTENSION))}`)
                writeJson(
                    path.join(process.cwd(), this._destRoot, lng.concat(LANG_FILE_EXTENSION)),
                    langData[lng]
                )
                logOK()
            }
        )
    }

    /**
     * @method _putInitialStrings
     * @param {Object} langData
     * @private
     */
    _putInitialStrings(langData) {
        inline(`Writing the initial.${BASE_NAME}.${LANG_FILE_EXTENSION}...`)
        writeJson(
            path.join(process.cwd(), this._destRoot, INITIAL_STRINGS_FILE),
            langData[this._defaultLang]
        )
        logOK()
    }

    /**
     * @method init
     * @param {Boolean} verbose
     * @returns {Promise<void>}
     */
    async init(verbose) {

        // 1. get the package.json file
        const pkg = getPackage()

        // 2. initialize and populate
        await this._initialize(pkg, verbose)

        // 3. parse lang files
        const langData = this._parse()

        // 4. write the lang files
        this._putLangsFiles(langData)

        // 5. save the initial.strings file
        this._putInitialStrings()
    }

    /**
     * @method scan
     * @param {Boolean} verbose
     * @returns {Promise<void>}
     */
    scan(verbose) {
        // 1. get the package.json file
        const pkg = getPackage()

        // 2. setup and populate
        this._setup(pkg, verbose)

        // 3. parse lang files
        const langData = this._parse()

        // 4. write the lang files
        this._putLangsFiles(langData)

        // 5. save the initial.strings file
        this._putInitialStrings(langData)
    }
}

module.exports = Strings
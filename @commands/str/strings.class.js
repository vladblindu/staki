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
    silentMkDir
} = require('../../@globals/helpers')
const {
    GLOB_PATTERN,
    LOCALES_FILE_PATH,
    META_FILE_NAME,
    BASE_NAME
} = require('./constants')

const {
    PKG,
    PACKAGES_ROOT,
    STAKI,
    STRINGER,
    LANG_FILE_EXTENSION,
    INITIAL_STRINGS_PATH,
} = require('../../@globals/constants')

class Strings {

    constructor() {
        this.locales = readJson(LOCALES_FILE_PATH)
    }

    _getPkg() {
        const pkg = getPackage()
        if (pkg.data[PACKAGES_ROOT])
            return throwErr(`The current ${PKG} belongs to a mono-repo root (${chalk.blue(pkg.data.name)}).\n` +
                `Stringer should be initialized only in child projects.`)
        return pkg
    }

    _initPkg(pkg) {
        if (!pkg.data[STAKI]) pkg.data[STAKI] = {}
        if (!pkg.data[STAKI][STRINGER]) pkg.data[STAKI][STRINGER] = {}
        return pkg
    }

    async _putMeta(langs, configRoot, verbose = false) {
        const meta = langs.reduce(
            (acc, lng) => {
                acc[lng] = {}
                acc[lng].name = this.locales[lng].name
                try {
                    acc[lng]['flag'] = flagConvert(this.locales[lng]['flagFile'])
                } catch(err){
                    throwErr(`PNG to Base64 conversion error. Reason:${err.message}`)
                }
                return acc
            }, {})
        writeJson(
            path.join(process.cwd(), configRoot, META_FILE_NAME),
            meta)
    }

    async _getQueriesData() {
        let tmp = null
        try {
            const _primaryQuery = primaryQuery(this.locales)
            const initial = await inquirer.prompt(_primaryQuery)
            const _secondaryQuery = secondaryQuery(initial['langs'], this.locales)
            const defaultLang = await inquirer.prompt(_secondaryQuery)
            return {
                ...initial,
                defaultLang
            }
        } catch (err) {
            interactiveFail(err)
        }
    }

    _collectFiles(root) {
        root = path.isAbsolute(root)
            ? root
            : path.join(process.cwd(), root)
        return glob.sync(GLOB_PATTERN, {
            cwd: root,
            absolute: true
        })
    }

    _validate(pkg) {
        return pkg
    }

    async init(verbose) {
        //1. Run queries
        const {
            langs,
            defaultLang,
            ...roots
        } = await this._getQueriesData()

        //2. Solve the roots dirs
        for(const root of Object.values(roots)){
            await setupDir(root)
        }

        //3. Create staki:stringer section
        let pkg = this._getPkg()
        pkg = this._initPkg(pkg)
        pkg.data[STAKI][STRINGER] = {langs, defaultLang, ...roots}

        //4. Write all config settings in package.json
        putPackage(pkg)

        //5. Create locals.meta.json file in config root
        await this._putMeta(langs, roots['configRoot'])

        //6.Try to glob existing *.strings.json files
        const files = this._collectFiles(roots['srcRoot'])

        //7. loop over files
        const tmp = {}
        files.forEach(
            fl => {
                inline(`Processing file: ${path.relative(process.cwd(), fl)}...`)
                const flCont = readJson(fl)
                //8. Validate collected strings contents
                this._validate(flCont)
                logOK()
                //9. Create keys name
                const section = getSection(fl, flCont)
                //10. loop over langs
                langs.forEach(
                    lng => {
                        //11. loop over keys
                        const langFile = Object.keys(flCont[lng]).reduce((acc, k) => {
                            acc[section.concat('.', k)] = flCont[lng][k]
                            return acc
                        }, {})
                        //12.Save [lang].json files in dest root
                        inline(`Writing ${path.join(roots['destRoot'], lng.concat(LANG_FILE_EXTENSION))}`)
                        writeJson(
                            path.join(process.cwd(), roots['destRoot'], lng.concat(LANG_FILE_EXTENSION)),
                            langFile
                        )
                        logOK()
                        //14.If lnd is the default language save initial.strings.js in config root
                        if (lng === defaultLang) {
                            inline(`Writing ${path.join(roots['configRoot'], INITIAL_STRINGS_PATH)}`)
                            writeJson(
                                path.join(roots['configRoot'], INITIAL_STRINGS_PATH),
                                langFile
                            )
                            logOK()
                        }
                    }
                )
            }
        )
    }
}

module.exports = Strings
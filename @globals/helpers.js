const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const {yellow, red, magenta} = require('chalk')
const {PACKAGES_ROOT, PKG, RUNERR, DEVERR, YELLOW, GREEN} = require('./constants')

/**
 * @name mkDir
 * @description creates the requested directories (src | dest)
 * @param {String} root
 * @param {String?} target
 */
const mkDir = (root, target = 'source') => {
    const pth = path.isAbsolute(root) ? root : path.join(process.cwd(), root)
    try {
        fs.mkdirSync(pth)
    } catch (err) {
        throwErr(`Couldn't create ${target} directory. Reason: ${err.message}`)
    }
}

/**
 * @name readJson
 * @description safely reads a json file
 * @param {String} pth
 * @param {String?} target
 * @return {string | void}
 */
const readJson = (pth, target = 'target') => {
    if (!fs.existsSync(pth))
        throwErr(`Couldn't locate the ${target} file in ${pth}.`)
    let raw = ''
    try {
        raw = fs.readFileSync(pth, 'utf8')
    } catch (err) {
        throwErr(`Couldn't read the ${target} file in ${pth}.Reason: ${err.message}`, DEVERR)
    }
    try {
        return JSON.parse(raw)
    } catch (err) {
        throwErr(`Invalid JSON format in the ${target} file located in ${pth}.`, DEVERR)
    }
}

/**
 * @name writeJson
 * @description safely writes a json file
 * @param {String} pth
 * @param {Object} data
 * @param {String?} target
 */
const writeJson = (pth, data, target = 'target') => {
    let raw = ''
    try {
        raw = JSON.stringify(data, null, 2)
    } catch (err) {
        throwErr(`Unable to stringify ${target} to JSON. Reason: ${err.message}`, DEVERR)
    }
    try {
        fs.writeFileSync(pth, raw)
    } catch (err) {
        throwErr(`Unable to write ${target} file in ${pth}. Reason: ${err.message}`, DEVERR)
    }
}


/**
 * @name findMonoRepoRoot
 * @description walks up the current dir searching for a
 * package.json file containing a "workspace" key
 * @return {string | Object}
 */
const findMonoRepoRoot = () => pkgTreeUp({key: PACKAGES_ROOT})

/**
 * @name noMsg
 * @description throws an error if an exception without message is raised
 */
const noMsg = () => {
    throw new Error(`${magenta(DEVERR)}: Raised error without message`)
}

/**
 * @name throwErr
 * @description throws an error logging the msg
 * @param {String} msg
 * @param {String?} kind
 */
const throwErr = (msg, kind = RUNERR) => {
    if (!msg.trim()) noMsg()
    throw new Error(`${red(kind)}: ${msg}`)
}

/**
 * @name warn
 * @description warns by logging the msg
 * @param {String} msg
 */
const warn = msg => {
    if (!msg.trim()) noMsg()
    console.log(`${yellow('WARN:')} ${msg}`)
}

/**
 * @name interactiveFail
 * @description Logs a 'whatever' message when shit happens
 * @param {Error} err
 */
const interactiveFail = err => {
    console.error(`System failure while processing interactive data collection. \nReason ${err.message}`)
    process.exit(1)
}

/**
 * @name findPackage
 * @description checks for a package.json in the "root" directory
 * @param {String} root
 * @param {Boolean?} throwError
 * @returns {boolean}
 */
const findPackage = (root, throwError = true) => {
    if (!fs.existsSync(path.join(root, PKG))) {
        if (throwError) throwErr(` No valid ${PKG} file found in ${root}.`)
        else return false
    }
    return true
}

/**
 * @name cond
 * @description if v2 is a functions, returns the result of v2(v1)
 * if v2 is falsy, it returns truthiness of v1
 * else returns the equality
 * @param {String | Number | Boolean ?} v1
 * @param {String | Number | Boolean | Function ?} v2
 * @return {boolean}
 */
const cond = (v1, v2) => {
    if (!v1) return false
    if (typeof v2 === 'function') return v2(v1)
    return v2 ? v1 === v2 : !!v1
}

/**
 *
 * @param {Object?} opts
 * @param {String?} opts.root
 * @param {String?} opts.key
 * @param {Function | String | Number | Boolean ?} opts.value
 * @param {Boolean?} opts.package
 * @param {Boolean?} opts.throwErr
 * @returns {string | object | boolean}
 */
const pkgTreeUp = (opts = {}) => {

    let cursor = opts.root || process.cwd()

    do {
        if (findPackage(cursor, false)) {
            const pkg = readJson(path.join(cursor, PKG), PKG)
            if (
                (!opts.key) ||
                (opts.key && !opts.value && pkg[opts.key]) ||
                (cond(pkg[opts.key], opts.value))
            ) return opts.package ? pkg : cursor
        }
        cursor = path.dirname(cursor)
    }
    while (cursor !== '/')
    if (opts.throwErr === false) return false
    if (!opts.key)
        throwErr(`Couldn't find recursively, starting from ${opts.root} directory, any valid ${PKG} file.`)
    if (opts.value)
        throwErr(`Couldn't find recursively, starting from ${opts.root} directory, any ${PKG} whose ${opts.key}` +
            ` key satisfies the ${opts.value} condition.`)
    else throwErr(`Couldn't find recursively, starting from ${opts.root} directory, any ${PKG} ` +
        `containing the ${opts.key} key.`)
}

/**
 * @name isEmpty
 * @description checks if an plain object is empty or not
 * @param {object} o
 * @return {boolean}
 */
const isEmpty = o => Object.keys(o).length === 0

/**
 *
 * @param {String} msg
 * @param {String?} color
 * @param {Boolean?} verbose
 */
const inline = (msg, color, verbose = true) => {
    if (!msg.trim()) noMsg()
    if (!verbose) return
    if (color) msg = chalk[color](msg)
    process.stdout.write(msg)
}

/**
 *
 * @param {String} msg
 * @param {String?} color
 * @param {Boolean?} verbose
 */
const log = (msg, color, verbose = true) => {
    if (!msg.trim()) noMsg()
    if (!verbose) return
    if (color) msg = chalk[color](msg)
    console.log(msg)
}

/**
 * @name logOk
 */
const logOK = () => {
    log('OK', GREEN)
}

/**
 * @name pick
 * @param {Object} o
 * @param {String | String[]} args
 * @return {Object}
 */
const pick = (o, ...args) => {
    if (!(o && Object.keys(o).length)) return o
    if (args[0] instanceof Array)
        args = [...args[0]]
    if (!args || !args.length) return o
    return args.reduce(
        (acc, key) => {
            acc[key] = o[key]
            return acc
        }, {})
}

/**
 * @name omit
 * @param {Object} o
 * @param {String | String[]} args
 * @return {Object}
 */
const omit = (o, ...args) => {
    if (!(o && Object.keys(o).length)) return o
    if (args[0] instanceof Array)
        args = [...args[0]]
    if (!args || !args.length) return o
    return Object.keys(o).reduce(
        (acc, key) => {
            if (!args.includes(key)) acc[key] = o[key]
            return acc
        }, {}
    )
}

/**
 * @name dashToCamel
 * @param {string} str
 * @return {String}
 */
const dashToCamel = str => str.replace(
    /-([A-Za-z0-9])/g,
    g => g[1].toUpperCase())

/**
 * @name silentMkDir
 * @description creates a directory if it doesn't exist
 * @param {string} d
 * @param {Boolean} verbose
 */
const silentMkDir = (d, verbose = false) => {
    const destDir = path.isAbsolute(d) ? d : path.join(process.cwd(), d)
    if (!fs.existsSync(d)) {
        const displayDest = path.isAbsolute(d) ? path.relative(process.cwd(), d) : d
        if (verbose) warn(`${displayDest} doesn't exists. It will be automatically created.`)
        fs.mkdirSync(destDir)
    }
}

module.exports = {
    readJson,
    writeJson,
    isEmpty,
    findPackage,
    findProjectRoot: pkgTreeUp,
    findMonoRepoRoot,
    interactiveFail,
    pkgTreeUp,
    throwErr,
    noMsg,
    warn,
    cond,
    inline,
    log,
    logOK,
    pick,
    omit,
    mkDir,
    dashToCamel,
    silentMkDir
}
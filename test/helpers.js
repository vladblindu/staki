const path = require('path')
const {expect} = require('chai')
const inquirer = require('inquirer')
const fs = require('fs')

const FIXTURES_PATH = '__fixtures__'

const mockSafe = {
    console: null,
    counter: 0,
    interactive: null,
    index: 0,
    mockValue: null,
    cwd: ''
}
const defaultOpts = {
    log: 'log',
    iteration: 1
}

const PKG = 'package.json'
/**
 * @name mockConsole
 * @description mocks console behaviour
 * @param {String | String[]} msg
 * @param {Object?} opts
 * @param {String?} opts.log
 * @param {Number?} opts.iteration
 * @returns {function(): void}
 */
const mockConsole = (msg, opts) => {

    // reset the counter
    mockSafe.counter = 0

    // set the options
    opts = {...defaultOpts, ...opts}

    // put the actual console method in a safe place
    mockSafe.console = console[opts.log]

    // define the mock function
    console[opts.log] = actualMsg => {
        if (msg instanceof Array)
            expect(actualMsg).to.equal(msg[mockSafe.counter++])
        else if (opts.iteration && (mockSafe.counter++ === opts.iteration))
            expect(actualMsg).to.equal(msg)
        else expect(actualMsg).to.equal(msg)
    }

    // return the reset function
    return () => {
        console[opts.log] = mockSafe.console
    }
}

/**
 * @name mockInteractive
 * @description mocks inquirer behaviour
 * @param { Object | Array} queryData
 * @returns {Function}
 */
const mockInteractive = queryData => {
    // reset the current index
    mockSafe.index = 0

    // if the arg ids not an array convert it to one
    if (!(queryData instanceof Array)) queryData = [queryData]

    // put the actual inquirer method in a safe place
    mockSafe.interactive = inquirer.prompt

    // create the mock function
    inquirer.prompt = () => queryData[mockSafe.index++]

    // return the reset function
    return () => {
        inquirer.prompt = mockSafe.interactive
    }
}
/**
 *
 * @param {any} original
 * @param {any} mock
 * @param {String?} key
 * @returns {Function}
 */
const mockValue = (original, mock, key = 'mockValue') => {
    mockSafe[key] = original
    original = mock
    return () => {
        original = mockSafe[key]
    }
}

/**
 * @name setTestDir
 * @param {String} testSuite
 * @returns {[String, (function(): void)]}
 */
const setTestDir = testSuite => {
    mockSafe.cwd = process.cwd()
    const testPath = path.join(__dirname, FIXTURES_PATH, testSuite)
    return [
        testPath,
        pth => {
            if (pth) pth = path.join(testPath, pth)
            process.chdir(pth || testPath)
        },
        () => {
            process.chdir(mockSafe.cwd)
        }
    ]
}

const assume = pth => {
    if (!pth) pth = PKG
    if (!path.isAbsolute(pth))
        pth = path.join(process.cwd(), pth)
    return pth
}

/**
 * @param {String?} pth
 */
const fileCleanup = pth => {
    pth = assume(pth)
    if (fs.existsSync(pth))
        fs.unlinkSync(pth)
}

/**
 * @param {String} pth
 */
const dirCleanup = pth => {
    if (fs.existsSync(pth))
        fs.rmdirSync(pth, {recursive: true})
}

const writePkg = (pth, pkgData) => {
    if (typeof pth !== 'string') {
        pkgData = pth
        pth = ''
    }
    pth = assume(pth)
    fs.writeFileSync(pth, JSON.stringify(pkgData, null, 2))
}

const getPkg = pth =>
    JSON.parse(fs.readFileSync(assume(pth), 'utf8'))


const mkTestDir = dir => {
    return [
        () => {
            const cwd = path.join(process.cwd(), dir)
            if (!fs.existsSync(cwd)) fs.mkdirSync(cwd)
        },
        () => {
            const cwd = path.join(process.cwd(), dir)
            if (fs.existsSync(cwd)) fs.rmdirSync(cwd, {recursive: true})
        }
    ]
}

const testReadJson = pth => JSON.parse(
    fs.readFileSync(pth, 'utf8'))

const testWriteJson = (pth, o) => {
    fs.writeFileSync(pth, JSON.stringify(o, null, 2))
}

module.exports = {
    mockConsole,
    mockInteractive,
    mockValue,
    setTestDir,
    mkTestDir,
    fileCleanup,
    dirCleanup,
    writePkg,
    getPkg,
    testReadJson,
    testWriteJson
}

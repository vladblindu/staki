const path = require('path')
const {expect} = require('chai')
const {writePkg, setTestDir, fileCleanup} = require('../../helpers')
const doc = require('../../../@commands/doc/doc.class')
const fs = require('fs')
const {STAKI, JSDOC} = require('../../../lib/constants')


const testSuite = 'doc-test'

describe('Doc class', () => {

    describe('_populate method', () => {

        it('should add all keys with underscore', () => {
            const test = {
                key1: 'val1',
                key2: 'val2'
            }
            doc._populate(test)
            expect(doc['_key1']).to.equal('val1')
            expect(doc['_key2']).to.equal('val2')
        })
    })

    describe('_getPattern method', () => {

        it('should return a "glob-able" pattern', () => {
            doc._targetFiles = ['js', 'ts', 'jsx', 'tsx']
            expect(doc._globPattern()).to.equal('**/?(*.js|*.ts|*.jsx|*.tsx)')
        })
    })

    describe('_collectFiles method', () => {

        // noinspection JSUnusedLocalSymbols
        const [_, cwd, reset] = setTestDir(testSuite)

        beforeEach(() => {
            cwd()
        })

        afterEach(() => {
            reset()
        })

        it('should get all js files in root', async () => {
            doc._srcRoot = './'
            doc._targetFiles = ['js']
            const files = doc._collectFiles()
            expect(files.length).to.equal(6)
        })

        it('should get all js files in root with absolute path', async () => {
            doc._srcRoot = process.cwd()
            doc._targetFiles = ['js']
            const files = doc._collectFiles()
            expect(files.length).to.equal(6)
        })

        it('should throw if no js files found', async () => {
            doc._srcRoot = path.join(process.cwd(), 'no-files')
            doc._targetFiles = ['js']
            expect(() => {
                doc._collectFiles()
            }).to.throw(Error).that.satisfies(err =>
                err.message.indexOf('No js files found') !== -1
            )
        })
    })

    describe('_getMd method', () => {

        // noinspection JSUnusedLocalSymbols
        const [_, cwd, reset] = setTestDir(testSuite)

        beforeEach(() => {
            cwd()
        })

        afterEach(() => {
            reset()
        })

        it('should get md content', () => {

            const tf = path.join(process.cwd(), 'src', 'test-root-f1.js')
            const source = fs.readFileSync(tf, 'utf8')
            const md = doc._getMd(source)
            // noinspection HtmlDeprecatedAttribute
            expect(md.startsWith('<a name="module_test-module"></a>')).to.be.true
        })
    })

    describe('init method', () => {

        // noinspection JSUnusedLocalSymbols
        const [_, cwd, reset] = setTestDir(testSuite)
        const initPkg = {
            "name": "doc-tester",
            "version": "1.0.0"
        }

        beforeEach(() => {
            cwd()
            writePkg(initPkg)
        })

        afterEach(() => {
            fileCleanup()
            reset()
        })

        it('should setup the package', async () => {
            doc.scan = () => Promise.resolve('OK')
            doc._getQueriesData = () => ({
                testKey: 'value'
            })
            doc._putPackage = (pkg) => {
                expect(pkg.data[STAKI][JSDOC]['testKey']).to.equal('value')
            }
            await doc.init()
        })
    })

})
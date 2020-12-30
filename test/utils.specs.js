const path = require('path')
const fs = require('fs')
const glob = require('glob')
const {FIXTURES, TEST_PACKAGES_DIR, TEST_NO_PACKAGES_DIR} = require('./constants')
const {starterGitTemplate} = require('../defaults.config')
const {expect} = require('chai')
const {getRoot, createRoot, getGit, getPackages, setPackageName} = require('../init/utils')

describe('utils', () => {

    const fixturesDir = path.join(
        path.resolve(__dirname), FIXTURES)
    const testPath = 'test-path'

    beforeEach(() => {
        if (path.basename(process.cwd()) !== fixturesDir)
            process.chdir(fixturesDir)
    })

    /* Cleanup any remaining testPath dirs */
    const dirCleanup = () => {
        const pth = path.join(fixturesDir, testPath)
        if (fs.existsSync(pth)) fs.rmdirSync(pth, {recursive: true})
    }

    describe('getRoot', () => {

        const args = ['_', '_', undefined]

        before(() => {
            dirCleanup()
        })

        it('should return the upper directory', () => {
            expect(getRoot(args)).to.equal(process.cwd())
        })

        it('should return the upper directory also', () => {
            args[2] = '.'
            expect(getRoot(args)).to.equal(process.cwd())
        })

        it('should create a new path', () => {
            args[3] = testPath
            expect(getRoot(args)).to.equal(path.join(process.cwd(), testPath))
        })

        it('should throw if path exists', () => {
            fs.mkdirSync(path.join(fixturesDir, testPath))
            args[3] = testPath
            expect(() => getRoot(args)).to.throw()
        })
    })

    describe('createRoot', () => {

        before(() => {
            dirCleanup()
        })

        afterEach(() => {
            dirCleanup()
        })

        it('should create a new testPath dir', () => {
            const newDir = path.join(fixturesDir, testPath)
            createRoot(newDir)
            expect(fs.existsSync(newDir)).to.be.true
        })

        it('should throw for invalid name', () => {
            expect(() => {
                createRoot('illegal%^-dir-name')
            }).to.throw('Invalid directory name. (contains illegal characters)')
        })

        it('should throw on mkdir error', () => {
            const newDir = path.join(fixturesDir, testPath)
            fs.mkdirSync(newDir)
            expect(() => {
                createRoot(newDir)
            }).to.throw()
        })
    })

    describe('getGit', () => {

        before(() => {
            dirCleanup()
        })

        afterEach(() => {
            dirCleanup()
        })

        it('should clone the test dir', () => {
            const root = path.join(fixturesDir, testPath)
            fs.mkdirSync(root)
            getGit(root, starterGitTemplate)
            const files = glob.sync('*', {cwd: root})
            expect(files.length).to.be.greaterThan(0)
        }).timeout(10000)
    })

    describe('getPackages', () => {
        it('should get all packages', () => {
            const packs = getPackages(path.join(fixturesDir, TEST_PACKAGES_DIR))
            expect(packs.length).to.equal(3)
        })
        it('should throw if no packages found', () => {
            expect(() => {
                getPackages(path.join(fixturesDir, TEST_NO_PACKAGES_DIR))
            }).to.throw
        })
    })

    describe('setPackageName', () => {

        it('should change the name', () => {
            const testPkg = {
                path: '/absolute/path/test-project',
                data: {
                    name: '@test-pkg/test-project'
                }
            }
             expect(setPackageName('new-project', testPkg)).to.equal('@test-pkg/new-project')
        })

        it('should change the name if no project is supplied', () => {
            const testPkg = {
                path: '/absolute/path/test-pkg',
                data: {
                    name: 'test-pkg'
                }
            }
            expect(setPackageName('new-project', testPkg)).to.equal('@test-pkg/new-project')
        })
    })
})
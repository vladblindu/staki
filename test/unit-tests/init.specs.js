const path = require('path')
const fs = require('fs')
const glob = require('glob')
const {expect} = require('chai')
const {getGit, setPackageName} = require('../../@commands/ini/actions')
const {setTestDir, dirCleanup} = require('../helpers')
const {getRoot, createRoot} = require('../../@commands/ini/utils')

describe('init', () => {

    const [testDir, setCwd, resetCwd] = setTestDir('env-test')
    const testGitTemplate = 'https://github.com/vladblindu/test-repo.git'

    beforeEach(() =>{
        setCwd()
    })
    afterEach(() => {
        resetCwd()
    })

    describe('getRoot', () => {

        const initDir = 'ini-dir'
        const workDir = path.join(testDir, initDir)

        afterEach(() => {
            dirCleanup(workDir)
        })

        it('should create a new path', () => {
            expect(getRoot(initDir)).to.equal(path.join(process.cwd(), initDir))
        })

        it('should throw if path exists', () => {
            if (!fs.existsSync(workDir))
                fs.mkdirSync(workDir)
            expect(() => getRoot(initDir)).to.throw(`Directory ${initDir} already exists.`)
        })
    })

    describe('createRoot', () => {

        const initDir = 'ini-dir'
        const workDir = path.join(testDir, initDir)

        afterEach(() => {
            dirCleanup(workDir)
        })

        it('should create a new workDir dir', () => {
            createRoot(initDir)
            expect(fs.existsSync(workDir)).to.be.true
        })

        it('should throw for invalid name', () => {
            expect(() => {
                createRoot('illegal%^-dir-name')
            }).to.throw('Invalid directory name. (contains illegal characters)')
        })

        it('should throw on mkdir error', () => {
            if(!fs.existsSync(workDir))
                fs.mkdirSync(workDir)
            expect(() => {createRoot(initDir)}).to.throw()
        })
    })

    describe('getGit', () => {
        const initDir = 'ini-dir'
        const workDir = path.join(testDir, initDir)

        afterEach(() => {
            dirCleanup(workDir)
        })

        it('should clone the test dir', () => {
            getGit(workDir, testGitTemplate)
            const files = glob.sync('*', {cwd: workDir})
            expect(files.length).to.be.greaterThan(0)
        }).timeout(10000)
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
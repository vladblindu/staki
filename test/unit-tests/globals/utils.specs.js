const path = require('path')
const {expect} = require('chai')
const {getPackages, putPackage} = require('../../../lib/utils')
const {findMonoRepoRoot, cond, pkgTreeUp, pick, omit, dashToCamel} = require('../../../lib/helpers')
const {PACKAGES_ROOT, PKG} = require('../../../lib/constants')
const {setTestDir, fileCleanup, getPkg} = require('../../helpers')

describe('utils', () => {

    const [testDir, cwd, resetCwd] = setTestDir('globals-test')
    const emptyDir = 'no-packages'

    describe('getPackages', () => {

        beforeEach(() => {
            cwd()
        })

        afterEach(() => {
            resetCwd()
        })

        it('should get all packages described in workspace', () => {
            const pkgs = getPackages()
            expect(pkgs.length).to.equal(3)
        })

        it('should throw if no packages found', () => {
            cwd(emptyDir)
            expect(() => {
                getPackages()
            }).to.throw(Error).that.satisfies(error => {
                return error.message.slice(18, 37) === 'Couldn\'t read/find '
            })
        })
    })

    describe('putPackages', () => {
        const name = 'test-pkg'
        const pkgPath = path.join(testDir, emptyDir, PKG)

        beforeEach(() => {
            cwd(emptyDir)
        })

        afterEach(() => {
            fileCleanup(pkgPath)
            resetCwd()
        })

        it('should put the package json', () => {
            const pkg = {
                path: process.cwd(),
                data: {name}
            }

            putPackage(pkg)
            expect(getPkg(pkgPath).name).to.eql(name)
        })
    })

    describe('setupDir', () => {
        it('Should create the right dirs', () => {

        })
    })
})
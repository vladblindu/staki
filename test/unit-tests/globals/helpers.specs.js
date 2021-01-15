const path = require('path')
const {expect} = require('chai')
const {findMonoRepoRoot, cond, pkgTreeUp, pick, omit, dashToCamel} = require('../../../lib/helpers')
const {PACKAGES_ROOT, PKG} = require('../../../lib/constants')
const {setTestDir, fileCleanup, getPkg} = require('../../helpers')

describe('helpers', () => {

    describe('cond', () => {
        it('should return false in v1 is false', () => {
            expect(cond(undefined, 345)).to.be.false
        })

        it('should return v2(v1) if v2 is a function', () => {
            expect(cond('ok', v => 'test'.concat(` ${v}`))).to.equal('test ok')
        })

        it('should return true for no v2 provided and truthy v1', () => {
            expect(cond('ok')).to.be.true
        })

        it('should return false for falsy v1 and valid v2', () => {
            expect(cond(null, 'testing')).to.be.false
        })

        it('should return false for falsy v1 and valid v2(function)', () => {
            expect(cond(undefined, v => v)).to.be.false
        })

        it('should return true for equality of v1 and v2', () => {
            expect(cond('ok', 'ok')).to.be.true
        })
    })

    describe('findMonoRepoRoot', () => {

        const [testDir, cwd, resetCwd] = setTestDir('globals-test')
        beforeEach(() => {
            cwd('packages/package2')
        })

        afterEach(resetCwd)


        it('should find the root', () => {
            expect(findMonoRepoRoot()).to.equal(testDir)
        })

        it('should throw if no root found', () => {
            process.chdir(path.resolve('../../../../../../'))
            expect(() => {
                findMonoRepoRoot()
            }).to.throw()
        })
    })

    describe('pkgTreeUp', () => {

        const [testDir, cwd, resetCwd] = setTestDir('globals-test')
        beforeEach(() => {
            cwd('packages/package2')
        })

        afterEach(resetCwd)

        it('pkgTreeUp should find the first package.json ', () => {
            expect(pkgTreeUp()).to.equal(process.cwd())
        })

        it('pkgTreeUp should find the root', () => {
            expect(pkgTreeUp({key: PACKAGES_ROOT})).to.equal(testDir)
        })

        it('pkgTreeUp should find a package containing a specific key/value pair', () => {
            expect(pkgTreeUp({key: 'name', value: 'test-pack'})).to.equal(testDir)
        })

        it('pkgTreeUp should return a package.json object if pkg option provided', () => {
            expect(typeof pkgTreeUp({package: true})).to.eql('object')
        })
    })

    describe('pick', () => {

        const testO = {
            key1: 'v1',
            key2: 'v2',
            key3: 'v3'
        }

        it('should pick the right keys for array keys', () => {
            expect(pick(testO, ['key1', 'key2'])).to.deep.equal({
                key1: 'v1', key2: 'v2'
            })
        })

        it('should pick the right keys arg keys', () => {
            expect(pick(testO, 'key1', 'key2')).to.deep.equal({
                key1: 'v1', key2: 'v2'
            })
        })

        it('should return the original o for empty object', () => {
            expect(pick({}, ['key1', 'key2'])).to.deep.equal({})
        })

        it('should return null for null object', () => {
            expect(pick(null, ['key1', 'key2'])).to.null
        })

        it('should return the original o if no keys', () => {
            expect(pick(testO, [])).to.deep.equal(testO)
        })
    })

    describe('omit', () => {

        const testO = {
            key1: 'v1',
            key2: 'v2',
            key3: 'v3'
        }

        it('should omit the right keys for array keys', () => {
            expect(omit(testO, ['key1', 'key2'])).to.deep.equal({
                key3: 'v3'
            })
        })

        it('should omit the right keys for arg keys', () => {
            expect(omit(testO, 'key1', 'key2')).to.deep.equal({
                key3: 'v3'
            })
        })

        it('should return the original o for empty object', () => {
            expect(omit({}, ['key1', 'key2'])).to.deep.equal({})
        })

        it('should return null for null object', () => {
            expect(omit(null, ['key1', 'key2'])).to.null
        })

        it('should return the original o if no keys', () => {
            expect(omit(testO, [])).to.deep.equal(testO)
        })
    })

    describe('dashToCamel', () => {

        it('should pass', () => {
            expect(dashToCamel('test-string')).to.equal('testString')
        })

        it('should tolerate numbers', () => {
            expect(dashToCamel('test-2string')).to.equal('test2string')
        })

        it('should tolerate upper case', () => {
            expect(dashToCamel('test-String')).to.equal('testString')
        })
    })
})
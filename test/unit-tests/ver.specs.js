const {expect} = require('chai')
const {setVersion} = require('../../@commands/ver/actions')

describe('ver', () => {

    describe('setVersion', () => {

        let testPkg = null

        beforeEach(() => {
            testPkg = {
                name: 'test-pkg',
                version: '1.0.0'
            }
        })

        it('should set a new version', () => {
            const pkg = setVersion(testPkg, {version: '2.2.2'})
            expect(pkg.version).to.equal('2.2.2')
        })

        it('should throw if version is not in semver format', () => {
            expect(() => {
                setVersion({}, {version: '23.abc'})
            }).to.throw()
        })

        it('should throw if package`s version is not in semver format', () => {
            const wrongVersPkg = {
                name: 'wrong-pkg',
                version: '22.abc'
            }
            expect(() => {
                setVersion(wrongVersPkg, {version: '23.abc'})
            }).to.throw()
        })

        it('should increment major version descriptor', () => {
            const pkg = setVersion(testPkg, {major: true})
            expect(pkg.version).to.equal('2.0.1')
        })

        it('should increment patch by default', () => {
            const pkg = setVersion(testPkg)
            expect(pkg.version).to.equal('1.0.1')
        })

        it('should only increment minor version descriptor', () => {
            const pkg = setVersion(testPkg, {minor: true, patch: false})
            expect(pkg.version).to.equal('1.1.0')
        })
        it('should increment combinations', () => {
            const pkg = setVersion(testPkg, {minor: true, major: true})
            expect(pkg.version).to.equal('2.1.1')
        })

        it('should decrement combinations', () => {
            testPkg.version = '5.3.2'
            const pkg = setVersion(testPkg, {minor: true, major: true, inc: false})
            expect(pkg.version).to.equal('4.2.1')
        })

        it('should leave version untouched', () => {
            testPkg.version = '5.3.2'
            const pkg = setVersion(testPkg, {patch: false, inc: false})
            expect(pkg.version).to.equal('5.3.2')
        })
    })
})
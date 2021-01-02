const path = require('path')
const {expect} = require('chai')
const {setVersion} = require('../@commands/ver/actions')
const ver = require('../@commands/ver')
const {getPackage, putPackage} = require('../_globals/utils')

describe('ver', () => {

    const testDir = 'ver-test'

    describe('setVersion', () => {

        it('should set a new version', () => {
            const testPkg = {
                name: 'test-pkg',
                version: '1.0.0'
            }
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
            const testPkg = {
                name: 'test-pkg',
                version: '1.0.0'
            }
            const pkg = setVersion(testPkg, {major: true})
            expect(pkg.version).to.equal('2.0.1')
        })

        it('should increment patch by default', () => {
            const testPkg = {
                name: 'test-pkg',
                version: '1.0.0'
            }
            const pkg = setVersion(testPkg)
            expect(pkg.version).to.equal('1.0.1')
        })

        it('should only increment minor version descriptor', () => {
            const testPkg = {
                name: 'test-pkg',
                version: '1.0.0'
            }
            const pkg = setVersion(testPkg, {minor: true, patch: false})
            expect(pkg.version).to.equal('1.1.0')
        })
        it('should increment combinations', () => {
            const testPkg = {
                name: 'test-pkg',
                version: '1.0.0'
            }
            const pkg = setVersion(testPkg, {minor: true, major: true})
            expect(pkg.version).to.equal('2.1.1')
        })

        it('should decrement combinations', () => {
            const testPkg = {
                name: 'test-pkg',
                version: '5.3.2'
            }
            const pkg = setVersion(testPkg, {minor: true, major: true, inc: false})
            expect(pkg.version).to.equal('4.2.1')
        })
        it('should leave version untouched', () => {
            const testPkg = {
                name: 'test-pkg',
                version: '5.3.2'
            }
            const pkg = setVersion(testPkg, {patch: false, inc: false})
            expect(pkg.version).to.equal('5.3.2')
        })
    })

    describe('ver', () => {

        let cwd = process.cwd()

        before(() => {
            process.chdir(
                path.join(process.cwd(), 'test', '__fixtures__', testDir)
            )
            putPackage({
                path: process.cwd(),
                data: {
                    "name": "ver-tester",
                    "version": "1.0.0",
                    "workspace": ["packages"]
                }
            })
        })

        after(
            () => {
                process.chdir(cwd)
            })

        it('Should change the version accordingly', () => {
            ver('2.2.2', {})
            const pkg = getPackage()
            expect(pkg.data.version).to.equal('2.2.2')
        })

        it('should list all versions recursively', () => {

            let buf = ''
            const expected = 'Version listing:root: [34m/Users/vlad/Documents/zecode/@production/utils/staki/test/__fixtures__/ver-test[39m\n' +
                'package name: [32mver-tester[39mpath: [34m.[39mversion: [32m1.0.0[39m\n' +
                'package name: [32m@packages/test-repo[39mpath: [34mpackages[39mversion: [32m1.0.0[39m\n' +
                'package name: [32m@package1/test-repo[39mpath: [34mpackages/package1[39mversion: [32m1.0.0[39m\n'

            const mockLog = msg => {
                buf += msg
            }

            const log = console.log
            console.log = mockLog
            ver(undefined, {list: true, recursive: true})
            console.log = log

            expect(buf).to.equal(expected)
        })
    })
})
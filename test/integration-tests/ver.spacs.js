const path = require('path')
const {expect} = require('chai')
const ver = require('../../@commands/ver')
const {setTestDir, getPkg, fileCleanup, writePkg, mockConsole} = require('../helpers')
const {PKG} = require('../../lib/constants')

const suite = 'ver-test'

describe('ver', () => {

    const [testDir, cwd, resetCwd] = setTestDir(suite)
    const pkgPath = path.join(testDir, PKG)
    const pkgData = JSON.stringify({
        "name": "ver-tester",
        "version": "1.0.0",
        "workspace": ["packages"]
    }, null, 2)


    beforeEach(() => {
        cwd()
        writePkg(pkgPath, pkgData)
    })

    afterEach(
        () => {
            fileCleanup(pkgPath)
            resetCwd()
        })

    it('Should change the version accordingly', () => {
        ver('2.2.2', {})
        const pkg = getPkg(pkgPath)
        expect(pkg.version).to.equal('2.2.2')
    })

    it('should list all versions recursively', () => {

        const expected = [
            'Retrieving package data...',
            'Version listing:root: [34m/Users/vlad/Documents/zecode/@production/utils/staki/test/__fixtures__/ver-test[39m\n',
            'package name: [32mver-tester[39mpath: [34m.[39mversion: [32m1.0.0[39m\n',
            'package name: [32m@packages/test-repo[39mpath: [34mpackages[39mversion: [32m1.0.0[39m\n',
            'package name: [32m@package1/test-repo[39mpath: [34mpackages/package1[39mversion: [32m1.0.0[39m\n'
        ]

        const reset = mockConsole(expected)

        ver(undefined, {list: true, recursive: true})
        reset()
    })
})
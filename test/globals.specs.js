const path = require('path')
const {expect} = require('chai')
const {findProjectRoot} = require('../_globals/helpers')

describe('globals', () => {
    describe('helpers - findProjectRoot', () => {

        let cwd = process.cwd()
        const startPth = path.join(process.cwd(),
            'test',
            '__fixtures__',
            'globals-test',
            'packages',
            'package2')

        before(() => {
            process.chdir(startPth)
        })

        after(
            () => {
                process.chdir(cwd)
            })


        it('should find the root', () => {
            const root = startPth.replace('/packages/package2', '')
            expect(findProjectRoot()).to.equal(root)
        })

        it('should throw if no root found', () => {
            process.chdir(path.resolve('../../../../../'))
            expect(() => {findProjectRoot()}).to.throw()
        })
    })
})
const path = require('path')
const {expect} = require('chai')
const inquirer = require('inquirer')
const fs = require('fs')
const {langList, getComponent} = require('../../../@commands/str/helpers')
const {STAKI, STRINGER, SECTION} = require('../../../lib/constants')
const {setTestDir, mockConsole, mockInteractive} = require('../../helpers')

describe('str-helpers', () => {

    describe('langList', () => {
        const testLocales = ["al", "ar", "bg", "cr"]

        it('should return a choices object', () => {
            const expected = [
                {
                    "name": "albanian",
                    "value": "al"
                },
                {
                    "name": "arabian",
                    "value": "ar"
                },
                {
                    "name": "bulgarian",
                    "value": "bg"
                },
                {
                    "name": "croatian",
                    "value": "cr"
                }
            ]
            expect(langList(testLocales)).to.deep.equal(expected)
        })
    })

    describe('getComponent', () => {
        const testPth = '/dummy/test-section/strings.file'
        const testStrings = {
            section: 'test-section'
        }

        it('should return the path section', () => {
            expect(getComponent(testPth, {})).to.equal('testSection')
        })

        it('should return the internal section', () => {
            expect(getComponent('/whatever', {[SECTION]: 'testSection'})).to.equal('testSection')
        })
    })
})
const path = require('path')
const {expect} = require('chai')
const inquirer = require('inquirer')
const fs = require('fs')
const {langList} = require('../../../@commands/str/helpers')
const Strings = require('../../../@commands/str/strings.class')
const {BASE_NAME, META_FILE_PATH} = require('../../../@commands/str/constants')
const {STAKI, STRINGER} = require('../../../@globals/constants')
const {setTestDir, mockConsole, mockInteractive, mkTestDir, testReadJson} = require('../../helpers')

describe('strings class', () => {

    const [testDir, cwd, resetCwd] = setTestDir('str-test')
    const strings = new Strings()

    describe('_putMeta method', () => {

        const configRoot = '@config'
        const testLangs = ['en', 'ro']
        const [mkCfgRoot, cleanupCfgRoot] = mkTestDir(configRoot)

        beforeEach(() => {
            cwd()
            mkCfgRoot()
        })

        afterEach(() => {
            cleanupCfgRoot()
            resetCwd()
        })

        it('should generate the right meta file', async () => {
            await strings._putMeta(testLangs, configRoot)
            const tmp = testReadJson(path.join(
                process.cwd(),
                configRoot,
                META_FILE_PATH
            ))
            expect(tmp['en'].name).to.equal('english')
            expect(tmp['ro'].flag.startsWith('data:image/png;base64')).to.be.true
        })
    })
})
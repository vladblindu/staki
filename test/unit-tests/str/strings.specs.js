const path = require('path')
const {expect} = require('chai')
const inquirer = require('inquirer')
const fs = require('fs')
const {langList} = require('../../../@commands/str/helpers')
const Strings = require('../../../@commands/str/strings.class')
const {pick, isEmpty} = require('../../../@globals/helpers')
const {BASE_NAME, META_FILE_NAME, CONFIG_ROOT} = require('../../../@commands/str/constants')
const {STAKI, STRINGER, PKG, PACKAGES_ROOT} = require('../../../@globals/constants')
const {setTestDir, mockConsole, mockInteractive, mkTestDir, testReadJson} = require('../../helpers')

describe('strings class', () => {

    const [testDir, cwd, resetCwd] = setTestDir('str-test')

    const strings = new Strings()

    const cfg = {
        configRoot: '@config',
        srcRoot: 'src',
        destRoot: 'public/locales',
        langs: ['en', 'ro'],
        defaultLang: 'en'
    }

    const convertKeys = o => Object.keys(o).reduce((acc, k) => {
        acc['_' + k] = o[k]
        return acc
    }, {})

    const populate = (o, data) => {
        Object.keys(data).forEach(
            k => o['_' + k] = k === CONFIG_ROOT
                ? path.join(data[k], BASE_NAME)
                : data[k]
        )
    }

    describe('_populate method', () => {

        it('should populate', () => {
            strings._populate(cfg)
            expect(strings._configRoot).to.equal(cfg.configRoot.concat(`/${BASE_NAME}`))
            expect(strings._srcRoot).to.equal(cfg.srcRoot)
            expect(strings._destRoot).to.equal(cfg.destRoot)
            expect(strings._defaultLang).to.equal(cfg.defaultLang)
            expect(strings._langs).to.deep.equal(cfg.langs)
        })
    })

    describe('_putMeta method', () => {

        const [mkCfgRoot, cleanupCfgRoot] = mkTestDir(cfg['configRoot'])

        beforeEach(() => {
            cwd()
            mkCfgRoot()
        })

        afterEach(() => {
            cleanupCfgRoot()
            resetCwd()
        })

        it('should generate the right meta file', async () => {
            populate(strings, cfg)
            await strings._putMeta()
            const tmp = testReadJson(path.join(
                process.cwd(),
                strings._configRoot,
                META_FILE_NAME
            ))
            expect(tmp['en'].name).to.equal('english')
            expect(tmp['ro'].flag.startsWith('data:image/png;base64')).to.be.true
        })
    })

    describe('_initialize method', () => {

        const pkg = {data: {}}

        it('should create the right staki config ', async () => {
            strings._getQueriesData = () => Promise.resolve(cfg)
            strings._putMeta = () => {
            }
            strings._setupDir = () => {
            }
            strings._putPackage = pkg => {
                expect(pkg.data[STAKI][STRINGER]).to.deep.equal(cfg)
            }
            await strings._initialize(pkg)
        })
    })

    describe('_setup method', () => {

        const pkg = {
            data: {
                [STAKI]: {
                    [STRINGER]: cfg
                }
            }
        }

        it('should populate with config data ', async () => {
            strings._setup(pkg)
            expect(strings._configRoot).to.equal(cfg.configRoot.concat(`/${BASE_NAME}`))
            expect(strings._srcRoot).to.equal(cfg.srcRoot)
            expect(strings._destRoot).to.equal(cfg.destRoot)
            expect(strings._defaultLang).to.equal(cfg.defaultLang)
            expect(strings._langs).to.deep.equal(cfg.langs)
        })

        it('should throw if pkg is a monorepo root', async () => {
            expect(() => strings._setup({
                data: {[PACKAGES_ROOT]: [], name: 'test-pkg'}
            }))
                .to.throw(Error)
                .that.satisfies(err => {
                return err.message.indexOf('mono-repo root') !== -1 &&
                    err.message.indexOf('test-pkg') !== -1
            })
        })
    })

    describe('_collectFiles method', () => {

        const [testDir, cwd, resetCwd] = setTestDir('str-test')

        beforeEach(() => {
            cwd(path.join('packages', 'package1'))
        })

        afterEach(() => {
            resetCwd()
        })

        it('_should return the right array of file data', () => {
            strings._srcRoot = 'src'
            const expected = [
                {path: 'src/comp1/strings.json', section: 'comp1'},
                {path: 'src/comp2/strings.json', section: 'comp2'},
                {path: 'src/comp3/comp3.strings.json', section: 'comp3'},
                {path: 'src/strings.json', section: 'src'}
            ]
            const actual = strings._collectFiles()
            expect(!isEmpty(actual[0].content['en'])).to.be.true
            expect(!isEmpty(actual[0].content['ro'])).to.be.true
            expect(actual.map(fd => {
                delete fd.content
                return fd
            })).to.deep.equal(expected)
        })
    })

    describe('_validate method', () => {

        strings._langs = ['en', 'ro']

        it('should throw if no lang key present', () => {
            const testFl = {
                content: {
                    no: {
                        key: 'value'
                    }
                }
            }

            expect(() => strings._validate(testFl))
                .to.throw(Error)
                .that.satisfies(err =>
                err.message.indexOf('file has a missing "en" key') !== -1
            )
        })
        it('should not throw if all keys are present', () => {
            const testFl = {
                content: {
                    en: {
                        key: 'value'
                    },
                    ro: {
                        key: 'value'
                    }
                }
            }

            expect(() => strings._validate(testFl))
                .to.not.throw()
        })
    })
})
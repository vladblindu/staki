const path = require('path')
const {expect} = require('chai')
const Strings = require('../../../@commands/str/strings.class')
const {isEmpty} = require('../../../lib/helpers')
const {BASE_NAME, META_FILE_NAME, CONFIG_ROOT} = require('../../../@commands/str/constants')
const {STAKI, STRINGER, PACKAGES_ROOT} = require('../../../lib/constants')
const {setTestDir, mkTestDir, testReadJson} = require('../../helpers')

describe('strings class', () => {

    // noinspection JSUnusedLocalSymbols
    const [_, cwd, resetCwd] = setTestDir('str-test')

    const strings = new Strings()

    const cfg = {
        configRoot: '@config',
        srcRoot: 'src',
        destRoot: 'public/locales',
        langs: ['en', 'ro'],
        defaultLang: 'en'
    }

    // const convertKeys = o => Object.keys(o).reduce((acc, k) => {
    //     acc['_' + k] = o[k]
    //     return acc
    // }, {})

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

    describe('_initPkg method', () => {

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
            await strings._initPkg(pkg)
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

        // noinspection JSUnusedLocalSymbols
        const [_, cwd, resetCwd] = setTestDir('str-test')

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

    describe('_parse method', () => {
        // noinspection JSUnusedLocalSymbols
        const [_, cwd, resetCwd] = setTestDir('str-test')

        beforeEach(() => {
            cwd(path.join('packages', 'package1'))

        })

        afterEach(() => {
            resetCwd()
        })

        it('should create valid a lang data structure', () => {
            strings._langs = ['en', 'ro']
            strings._srcRoot = 'src'

            const expected = {
                en: {
                    'comp1.key1-comp1-pack1': 'en-val1',
                    'comp1.key2-comp1-pack1': 'en-val2',
                    'comp2.key1--comp2-pack1': 'en-val1',
                    'comp2.key2--comp2-pack1': 'en-val2',
                    'comp3.key1-comp-int-pack1': 'en-val1',
                    'comp3.key2-comp-int-pack1': 'en-val2',
                    'src.key1-comp-int-pack1': 'en-val1',
                    'src.key2-comp-int-pack1': 'en-val2'
                },
                ro: {
                    'comp1.key1-comp1-pack1': 'ro-val1',
                    'comp1.key2-comp1-pack1': 'ro-val2',
                    'comp2.key1--comp2-pack1': 'ro-val1',
                    'comp2.key2--comp2-pack1': 'ro-val2',
                    'comp3.key1-comp-int-pack1': 'ro-val1',
                    'comp3.key2-comp-int-pack1': 'ro-val2',
                    'src.key1-comp-int-pack1': 'ro-val1',
                    'src.key2-comp-int-pack1': 'ro-val2'
                }
            }
            expect(strings._parse()).to.deep.equal(expected)
        })
    })

    describe('_putLangFiles method', () => {
        const testDestRoot = 'public/strings'
        // noinspection JSUnusedLocalSymbols
        const [_, cwd, resetCwd] = setTestDir('str-test')
        const [mkDestRoot, cleanupDestRoot] = mkTestDir(testDestRoot)
        cleanupDestRoot()

        beforeEach(() => {
            cwd(path.join('packages', 'package1'))
            mkDestRoot()
        })

        afterEach(() => {
            resetCwd()
            cleanupDestRoot()
        })

        it('should create the valid lang files', () => {
            strings._destRoot = testDestRoot
            strings._defaultLang = 'en'
            strings._putLangsFiles({
                en: {key: 'value-en'},
                ro: {key: 'value-ro'}
            })
            const enFile = testReadJson(
                path.join(process.cwd(), testDestRoot, 'en.json'))
            const roFile = testReadJson(
                path.join(process.cwd(), testDestRoot, 'ro.json'))
            expect(enFile['key']).to.equal('value-en')
            expect(roFile['key']).to.equal('value-ro')
        })
    })

    describe('_putInitialStrings method', () => {

        const testConfigRoot = '@config/strings'
        // noinspection JSUnusedLocalSymbols
        const [_, cwd, resetCwd] = setTestDir('str-test')
        const [mkDestRoot, cleanupDestRoot] = mkTestDir(testConfigRoot)
        cleanupDestRoot()

        beforeEach(() => {
            cwd(path.join('packages', 'package1'))
            mkDestRoot()
        })

        afterEach(() => {
            resetCwd()
            cleanupDestRoot()
        })

        it('should create the valid lang files', () => {

            strings._configRoot = testConfigRoot
            strings._defaultLang = 'en'
            strings._putInitialStrings({
                en: {key: 'value-en'},
                ro: {key: 'value-ro'}
            })
            const initFile = testReadJson(
                path.join(process.cwd(), testConfigRoot, 'initial.strings.json'))
            expect(initFile['key']).to.equal('value-en')
        })
    })
})
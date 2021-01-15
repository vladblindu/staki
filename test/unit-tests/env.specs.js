const fs = require('fs')
const path = require('path')
const {expect} = require('chai')
const {getEnvCache, cacheEnv} = require('../../@commands/env/utils')
const {add, update, remove, list, updateConfig} = require('../../@commands/env/actions')
const {setTestDir, mockConsole, fileCleanup} = require('../helpers')
const {cacheFileName} = require('../../@commands/env/constants')
const {PKG, STAKI} = require('../../lib/constants')

describe('env', () => {

    const [testDir, setCwd, resetCwd] = setTestDir('env-test')
    const mockPath = path.join(testDir, cacheFileName)

    const testEnvCache = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
    }

    const putTestPackage = () => {
        fs.writeFileSync(
            mockPath,
            JSON.stringify(testEnvCache, null, 2))
    }

    beforeEach(() => {
        setCwd()
    })
    afterEach(() =>{
        resetCwd()
    })

    describe('utils', () => {

        afterEach(() => {
            fileCleanup(mockPath)
        })

        it('create a env cache file', () => {
            cacheEnv({}, mockPath)
            expect(fs.existsSync(mockPath))
        })

        it('should return a empty env cache and warn about it', () => {

            const expected = `[33mWARN:[39m A env cache file couldn't be found in ${mockPath}.\n` +
                'A new one will be created.'
            const reset = mockConsole(expected)
            const tmp = getEnvCache(mockPath)
            expect(tmp).to.deep.equal({})
            reset()
        })

        it('should get en existing env cache content', () => {
            fs.writeFileSync(mockPath, JSON.stringify(testEnvCache, null, 2))
            const env = getEnvCache(mockPath)
            expect(env).to.deep.equal(testEnvCache)
        })

        it('should throw if data is invalid', () => {
            const expected = '[31mRUNERR[39m: Invalid env data in env cache file from /Users/vlad/Documents/zecode/@production/utils/staki/test/__fixtures__/env-test/.cache.'
            fs.writeFileSync(mockPath, JSON.stringify('bad json format', null, 2))
            expect(() => {
                getEnvCache(mockPath)
            }).to.throw(expected)
        })
    })

    describe('actions', () => {

        describe('add', () => {

            afterEach(() => {
                fileCleanup(mockPath)
            })

            beforeEach(() => {
                putTestPackage()
            })

            it('should add a key/value pair to the env cache', () => {
                add('key4', 'value4', mockPath)
                const env = getEnvCache(mockPath)
                expect(env['key4']).equal('value4')
            })

            it('should throw if no value is present', () => {
                expect(() => {
                    add('key', undefined)
                }).to.throw()
            })

            it('should throw if no key and value is present', () => {
                expect(() => {
                    add(undefined, undefined)
                }).to.throw()
            })
        })

        describe('remove', () => {

            afterEach(() => {
                fileCleanup(mockPath)
            })

            beforeEach(() => {
                putTestPackage()
            })

            it('should remove a key/value pair from the env cache', () => {
                remove('key2', mockPath)
                const env = getEnvCache(mockPath)
                expect(env['key2']).to.be.undefined
            })

            it('should throw if key not provided', () => {
                expect(() => {
                    remove(undefined)
                }).to.throw()
            })

            it('should throw if key not present', () => {
                expect(() => {
                    remove('key4', mockPath)
                }).to.throw()
            })
        })

        describe('list', () => {

            afterEach(() => {
                fileCleanup(mockPath)
            })

            beforeEach(() => {
                putTestPackage()
            })

            it('should list a specific key', () => {
                const testKey = 'key2'
                const reset = mockConsole(`Content of env cache: \n${testKey} = ${testEnvCache[testKey]}`)
                list('key2', mockPath)
                reset()
            })

            it('should list all entries if no key is specified', () => {
                const expected = 'Content of env cache :\n' +
                    '1. key1 = value1\n' +
                    '2. key2 = value2\n' +
                    '3. key3 = value3'

                const reset = mockConsole(expected)
                list(undefined, mockPath)
                reset()
            })

            it('should throw if key not present', () => {
                expect(() => {
                    list('key4', mockPath)
                }).to.throw()
            })
        })
        describe('update', () => {

            afterEach(() => {
                fileCleanup(mockPath)
            })

            beforeEach(() => {
               putTestPackage()
            })

            it('should update a key', () => {
                update('key2', 'new-value', mockPath)
                const env = getEnvCache(mockPath)
                expect(env['key2']).to.equal('new-value')
            })

            it('should throw if key not present', () => {
                expect(() => {
                    list('key4')
                }).to.throw()
            })
        })

        describe('updateConfig', () => {

            beforeEach(() => {
                fs.writeFileSync(
                    path.join(testDir, PKG),
                    JSON.stringify({
                        "name": "env-tester",
                        "version": "1.0.0"
                    }, null, 2)
                )
            })

            it('should update local package.json', () => {
                const testKey = 'test-key'
                updateConfig(testKey)
                const pkg = JSON.parse(
                    fs.readFileSync(path.join(testDir, PKG), 'utf8')
                )
                expect(pkg[STAKI].env.indexOf(testKey)).to.not.equal(-1)
            })
        })
    })
})
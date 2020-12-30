const fs = require('fs')
const {expect} = require('chai')
const {getEnvVault, putEnvVault} = require('../env/utils')
const actions = require('../env/actions')
const {envVaultPath} = require('../defaults.config')

describe('env', () => {

    const testEnv = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
    }

    describe('utils', () => {

        afterEach(() => {
            if (fs.existsSync(envVaultPath))
                fs.unlinkSync(envVaultPath)
        })

        it('create a env-vault file', () => {
            putEnvVault({})
            expect(fs.existsSync(envVaultPath))
        })

        it('should return a empty env-vault and warn about it', () => {
            const mockWarn = msg => {
                expect(msg).to.equal(`A env-vault file couldn't be found in ${envVaultPath}.\nA new one will be created.`)
            }
            const warn = console.warn
            console.warn = mockWarn
            const tmp = getEnvVault()
            console.warn = warn
            expect(tmp).to.deep.equal({})
        })

        it('should get en existing env-vault content', () => {
            fs.writeFileSync(envVaultPath, JSON.stringify(testEnv, null, 2))
            const env = getEnvVault()
            expect(env['key1']).to.equal('value1')
            expect(env['key2']).to.equal('value2')
            expect(env['key3']).to.equal('value3')
        })
    })

    describe('actions', () => {

        describe('add', () => {

            afterEach(() => {
                if (fs.existsSync(envVaultPath))
                    fs.unlinkSync(envVaultPath)
            })

            beforeEach(() => {
                putEnvVault(testEnv)
            })

            it('should add a key/value pair to the env-vault', () => {
                actions.add('key4', 'value4')
                const env = getEnvVault()
                expect(env['key4']).equal('value4')
            })

            it('should throw if no value is present', () => {
                expect(() => {
                    actions.add('key', undefined)
                }).to.throw()
            })

            it('should throw if no key and value is present', () => {
                expect(() => {
                    actions.add(undefined, undefined)
                }).to.throw()
            })
        })

        describe('remove', () => {

            afterEach(() => {
                if (fs.existsSync(envVaultPath))
                    fs.unlinkSync(envVaultPath)
            })

            beforeEach(() => {
                putEnvVault(testEnv)
            })

            it('should add a key/value pair to the env-vault', () => {
                actions.remove('key2')
                const env = getEnvVault()
                expect(env['key2']).to.be.undefined
            })

            it('should throw if key not provided', () => {
                expect(() => {
                    actions.remove(undefined)
                }).to.throw()
            })

            it('should throw if key not present', () => {
                expect(() => {
                    actions.remove('key4')
                }).to.throw()
            })
        })

        describe('list', () => {

            afterEach(() => {
                if (fs.existsSync(envVaultPath))
                    fs.unlinkSync(envVaultPath)
            })

            beforeEach(() => {
                putEnvVault(testEnv)
            })

            it('should list a specific key', () => {
                const testKey = 'key2'
                const mockLog = msg => {
                    expect(msg).to.equal(`Content of env-vault: \n${testKey} = ${testEnv[testKey]}`)
                }
                const log = console.log
                console.log = mockLog
                actions.list('key2')
                console.log = log
            })

            it('should list all entries if no key is specified', () => {
                const mockLog = msg => {
                    expect(msg).to.equal(
                        'Content of env-vault :\n' +
                        '1. key1 = value1\n' +
                        '2. key2 = value2\n' +
                        '3. key3 = value3'
                    )
                }
                const log = console.log
                console.log = mockLog
                actions.list()
                console.log = log
            })

            it('should throw if key not present', () => {
                expect(() => {
                    actions.list('key4')
                }).to.throw()
            })
        })
        describe('update', () => {

            afterEach(() => {
                if (fs.existsSync(envVaultPath))
                    fs.unlinkSync(envVaultPath)
            })

            beforeEach(() => {
                putEnvVault(testEnv)
            })

            it('should update a key', () => {
                actions.update('key2', 'new-value')
                const env = getEnvVault()
                expect(env['key2']).to.equal('new-value')
            })

            it('should throw if key not present', () => {
                expect(() => {
                    actions.list('key4')
                }).to.throw()
            })
        })
    })
})
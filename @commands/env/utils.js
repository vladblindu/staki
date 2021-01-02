const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const {initStakiConfig} = require('../../_globals/utils')
const {PKG} = require('../../_globals/constants')
const {envVaultPath} = require('../../_globals/defaults.config')

module.exports = {
    /**
     * @name putEnvVault
     * @description saves env data in json format to a hidden file in the user's home dir
     * @param {object} env
     */
    putEnvVault: (env) => {
        try {
            fs.writeFileSync(envVaultPath, JSON.stringify(env, null, 2))
        } catch (err) {
            throw new Error(`Couldn't create env-vault file in ${envVaultPath}. Reason: ${err.message}`)
        }
    },
    /**
     * @name getEnvVault
     * @description reads env data in json format to a hidden file in the user's home dir
     */
    getEnvVault: () => {
        if (!fs.existsSync(envVaultPath)) {
            console.warn(`A env-vault file couldn't be found in ${envVaultPath}.\nA new one will be created.`)
            return {}
        }
        try {
            return JSON.parse(
                fs.readFileSync(envVaultPath).toString()
            )
        } catch (err) {
            throw new Error(`Couldn't read env-vault file from ${envVaultPath}. Reason: ${err.message}`)
        }
    },
    undeclaredEnvKey: async k => {
        let queryData = null
        try {
            queryData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'value',
                    message: `${k} key not found in env-vault. Specify vale:`
                },
                {
                    type: 'confirm',
                    name: 'save',
                    message: `Would you like to save the ${k} key in env-vault (default: Yes)?`,
                    default: true
                }
            ])
        } catch (err) {
            console.error(err.message)
            console.error('FATAL ERROR! Process exiting.')
            process.exit(1)
        }
        return queryData
    },
    putEnv: env => {
        try {
            fs.writeFileSync(
                path.join(process.cwd(), '.env'),
                env
            )
        } catch (err) {
            throw new Error(`Could not create .env file in ${process.cwd()}. Reason: ${err.message}`)
        }
    },
    getConfig: () => {
        try {
            const pth = path.join(process.cwd(), PKG)
            const pkg = JSON.parse(fs.readFileSync(pth, 'utf8'))
            return initStakiConfig(pkg)
        } catch (err) {
            throw new Error(`Couldn't find/read a local package.json file in:${process.cwd()}. reason: ${err.message}`)
        }
    }
}
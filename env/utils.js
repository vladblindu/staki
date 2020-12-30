const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const {envVaultPath} = require('../defaults.config')

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
                    message: `${k} key not found in env-vault. Specify vale:`,
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
    putEnv: (root, env) => {
        try {
            fs.writeFileSync(
                path.join(root, '.env'),
                env
            )
        } catch (err) {
            throw new Error(`Could not create .env file in ${root}. Reason: err.message`)
        }
    }
}
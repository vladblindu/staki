/**
 * @module navigation
 * @category command
 * @description monorepo inter project/root navigation helpers
 * @file nav/index.js
 */

const {back, goToRoot, navToPkg, setCurrent} = require('./actions')

/**
 * @typedef {Object} NavCmdObj
 * @property {boolean} back
 * @property {boolean} root
 * @property {boolean} set
 */

module.exports = {
    short: 'nav',
    long: 'navigation',
    command: 'nav',
    description: [
        'nav command'
    ],
    option: [
        ['-s, --set', 'Sets the current project as default.'],
        ['-b, --back', 'Return (set process.cwd) to the default project'],
        ['-r, --root', 'Navigate (set process.cwd) to project root']
    ],

    /**
     * @name action
     * @description project dir navigation command utility
     * @param {NavCmdObj} cmdObj
     * @return {Promise<void>}
     */

    action: async cmdObj => {
        if (cmdObj.back) return back()
        if (cmdObj.root) return goToRoot()
        if (cmdObj.set) return setCurrent()
        await navToPkg()
    }
}

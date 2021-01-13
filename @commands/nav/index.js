const {back, goToRoot, navToPkg, setCurrent} = require('./actions')

/**
 * @name nav
 * @description project dir navigation command utility
 * @param {Object} cmdObj
 * @param {boolean} cmdObj.back
 * @param {boolean} cmdObj.root
 * @param {boolean} cmdObj.set
 * @return {Promise<void>}
 */

const nav = async cmdObj => {

    if (cmdObj.back) return back()

    if (cmdObj.root) return goToRoot()

    if (cmdObj.set) return setCurrent()

    await navToPkg()
}

module.exports = nav
/**
 * @module test-module
 * @desc dummy module
 */

/**
 * @name testFn
 * @description this is a dummy test function
 * @param {String} param
 * @returns {String[]}
 */
const testFn = param => {
    console.log(param)
    return [param, param]
}

module.exports = {
    testFn
}
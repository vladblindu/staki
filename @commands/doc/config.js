/**
 *@typedef {Object} TargetFiles
 * @property {String} name
 * @property {String} value
 */

module.exports = {
    README: 'README.md',
    defaultSrcRoot: './',
    pattern: ['**/?(', ')'],
    targetFiles: [
        {
            name: 'javascript(js)',
            value: 'js'
        },
        {
            name: 'typescript(js)',
            value: 'ts'
        },
        {
            name: 'javascript-harmony(jsx)',
            value: 'ts'
        },
        {
            name: 'typescript-harmony(js)',
            value: 'ts'
        }
    ]
}
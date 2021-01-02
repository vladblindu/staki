const path = require('path')
const fs = require('fs')
const {PACKAGES_ROOT, PKG} = require('./constants')

module.exports = {
    /**
     * @name isEmpty
     * @description checks if an plain object is empty or not
     * @param {object} o
     * @return {boolean}
     */
    isEmpty: o => Object.keys(o).length === 0,
    /**
     * @name findProjectRoot
     * @description walks up the current dir searching for a
     * package.json file containing a "workspace" key
     * @return {string}
     */
    findProjectRoot: () => {
        let cursor = process.cwd()
        let pkg = {}
        do {
            if (fs.existsSync(path.join(cursor, PKG))) {
                pkg = JSON.parse(
                    fs.readFileSync(path.join(cursor, PKG), 'utf8')
                )
                if(pkg[PACKAGES_ROOT]) return cursor
            }
            cursor = path.dirname(cursor)
        }
        while (cursor !== '/')
        throw new Error(`Couldn't find any "workspace" definition ${PKG} starting up from ${process.cwd()}`)
    }
}
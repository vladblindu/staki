const path = require('path')

const cacheFileName = '.cache'
module.exports = {
    cacheFileName,
    cachePath: path.join(__dirname, cacheFileName),
}
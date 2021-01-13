const Strings = require('./strings.class')

const str = async (_, cmdObj) => {
    const strings = new Strings()
    if(cmdObj.init) return await strings.init()
}
module.exports = str
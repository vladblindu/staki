const {stakiConfig} = require('./defaults.config')
const {STAKI} = require('./constants')

module.exports = {
    createConfig: pkg => {
        if(!pkg[STAKI]) {
            pkg[STAKI] = stakiConfig
            return pkg
        }
        if(!pkg[STAKI].env) {
            pkg[STAKI].env = []
            return pkg
        }
        return pkg
    }
}
const path = require('path')
const glob = require('glob')
const {commandsGlob, commandsDir} = require('../config')

module.exports =  glob
    .sync(commandsGlob , {cwd: commandsDir, absolute: true})
    .map(pth => require(pth))

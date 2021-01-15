#!/usr/local/bin/node

const commandsData = require('./lib/collector')
const cli = require('./lib/cli')
const com = require('./@commands/env')
const chalk = require('chalk')
const {version} = require('./package.json')

cli.version(version, '-v, --ver', 'display the current ver')

commandsData.forEach(
    comData => cli.addCommand(comData)
)

console.log(chalk.blue('staki- starter kit command line tool - (C) 2020 by bitbrother'))
cli.parse(process.argv)
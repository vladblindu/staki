#!/usr/bin/node

const cli = require('commander')
const chalk = require('chalk')
const init = require('./init')
const env = require('./env')
const {starterGitTemplate} = require('./_globals/defaults.config')
const {version} = require('./package.json')

// Set version
cli.version(version, '-v, --ver', 'display the current version')

// Initialising
cli
    .command('init [dir] [tpl]')
    .description('init command', {
        dir: 'new project directory. (if omitted, current directory will be assumed)',
        tpl: `Starter git template repo (defaults to: \n${starterGitTemplate})`
    })
    .action(init)

// Create env file
cli
    .command('env [name] [value]')
    .description('env command', {
        name: 'name of env key',
        value: 'value of env key'
    })
    .option('-a, --add', 'Save values to env-vault.')
    .option('-l, --list', 'lists all env-vault saved key/values pairs.')
    .option('-r, --remove', 'Remove env entry by key')
    .option('-u, --update', 'Update env entry by key')
    .option('-n, --new', 'Add env entry by key and save it to both env-vault and local staki.config.js')
    .option('-c, --create', 'Create .env file')
    .action(env)


console.log(chalk.blue('staki-kit cli tool - (C) 2020 by bitbrother'))
cli.parse(process.argv)
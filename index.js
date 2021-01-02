#!/usr/bin/node

const cli = require('commander')
const chalk = require('chalk')
const init = require('./@commands/init')
const env = require('./@commands/env')
const ver = require('./@commands/ver')
const nav = require('./@commands/nav')
const {starterGitTemplate} = require('./_globals/defaults.config')
const {version} = require('./package.json')

// Set ver
cli.version(version, '-v, --ver', 'display the current ver')

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

cli
    .command('ver [ver]')
    .description('ver command', {
        ver: 'value of new ver'
    })
    .option('-r, --recursive', 'increment all package.json ver fields recursively starting from current dir')
    .option('-M, --major', 'increment major ver number')
    .option('-m, --minor', 'increment minor ver number')
    .option('-d, --decrement', 'decrement instead of increment')
    .option('-l, --list', 'list version(s)')
    .action(ver)

cli
    .command('nav')
    .description('nav command')
    .option('-b, --back', 'Return (set process.cwd) to last project you selected from list')
    .option('-r, --root', 'Navigate (set process.cwd) to project root')
    .action(nav)

console.log(chalk.blue('staki-kit cli tool - (C) 2020 by bitbrother'))
cli.parse(process.argv)
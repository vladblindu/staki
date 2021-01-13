#!/usr/bin/node

const cli = require('commander')
const chalk = require('chalk')
const init = require('./@commands/init')
const env = require('./@commands/env')
const ver = require('./@commands/ver')
const nav = require('./@commands/nav')
const str = require('./@commands/str')
const {starterGitTemplate} = require('./@commands/init/config')
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
    .option('-a, --add', 'Save values to env cache.')
    .option('-l, --list', 'lists all env cache saved key/values pairs.')
    .option('-r, --remove', 'Remove env entry by key')
    .option('-u, --update', 'Update env entry by key')
    .option('-n, --new', 'Add env entry by key and save it to both env cache and local staki.config.js')
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
    .option('-s, --set', 'Sets the current project as default.')
    .option('-b, --back', 'Return (set process.cwd) to the default project')
    .option('-r, --root', 'Navigate (set process.cwd) to project root')
    .action(nav)

cli
    .command('str [lang]')
    .description('str command')
    .option('-i, --init', 'Initialize "str" tool for current package')
    .option('-l, --langs', 'Edit/modify language list for current package')
    .option('-r, --recursive', 'If lang flag is set adding or removing languages is done recursively')
    .option('-a, --add', 'Adds a specified language to the package')
    .option('-d, --delete', 'Deletes the specified language to the package \n(WARNING - no undoing possible))')
    .option('-f, --default', 'Change default language for current package')
    .action(str)


console.log(chalk.blue('staki- starter kit command line tool - (C) 2020 by bitbrother'))
cli.parse(process.argv)
const path = require('path')
const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')

const raw = jsdoc2md.renderSync({
    files: `*.js`,
    'heading-depth': 2,
    'no-cache': true
})

fs.writeFileSync('README.md', raw)
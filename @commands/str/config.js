const path = require('path')

module.exports = {
    defaultSrcRoot: 'src',
    defaultDestRoot: path.join('public','locales'),
    defaultConfigRoot: path.join('@config','strings'),
    defaultLangs: ['en', 'ro'],
    defaultLang: 'en',
}
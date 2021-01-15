const path = require('path')

const BASE_NAME = 'strings'
const LANG_FILE_EXTENSION = 'json'
const DEFAULT_FILE = `${BASE_NAME}.${LANG_FILE_EXTENSION}`
const RESOURCE_DIR = '@resources'
const LOCALES_DIR = 'locales'
const FLAGS_DIR = 'flags'
const LOCALES_FILE = `locales.${LANG_FILE_EXTENSION}`
const RESOURCES_PATH = path.resolve(__dirname, '../../@resources')
const LOCALES_PATH = path.join(RESOURCES_PATH, LOCALES_DIR)
const LOCALES_FILE_PATH = path.join(LOCALES_PATH, LOCALES_FILE)
const FLAGS_PATH = path.join(LOCALES_PATH, FLAGS_DIR)
const FLAG_EXTENSION = 'png'
const META_FILE_NAME = `meta.${LANG_FILE_EXTENSION}`
const SECTION = 'section'
const INITIAL_STRINGS_FILE = `initial.${BASE_NAME}.${LANG_FILE_EXTENSION}`
const IMG_BASE64 = 'data:image/png;base64,'
const CONFIG_ROOT = 'configRoot'

module.exports = {
  IMG_BASE64,
  BASE_NAME,
  DEFAULT_FILE,
  GLOB_PATTERN:`**/?(${DEFAULT_FILE}|*.${DEFAULT_FILE})`,
  LOCALES_FILE_PATH,
  META_FILE_NAME,
  INITIAL_STRINGS_FILE,
  FLAG_EXTENSION,
  FLAGS_PATH,
  LANG_FILE_EXTENSION,
  CONFIG_ROOT
}


# initAction
## PROJECT INITIALIZATION UTILITY
[< Back to main page](../../README.md)

The project initialization creates a new project by cloning a specified project template repo.
In the process it updates all package.json (if it's a monorepo) data with the console provided values

### Usage
```shell
    staki initAction [options] [dir] [tpl]
```
- \[dir] the root directory of the project
  If dir is . or not specified the utility assumes the current directory as the target's root
- \[tpl] specify a different project template repo. If not specified, it defaults to:
  https://github.com/vladblindu/test-repo.git

#### Options
 For now, no options are available for this command
# ver
## VERSION MANAGEMENT UTILITY
[< Back to main page](../../README.md)

### Usage
```shell
    staki ver [version] [options]
```
You can specify a [version] argument, in a semver compatible format,
and it will replace the existing version with the provided one

#### Options
-r, --recursive - if the current working directory contains a package.json file that defines a workspace
all arguments and options are applied recursively to all the contained packages
-M, --major - increment major ver number
-m, --minor - increment minor ver number
-d, --decrement - decrement instead of increment
-l, --list - list version( or all version if recursive in a workspace defined directory)
 
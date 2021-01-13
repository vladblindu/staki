# env
## ENVIRONMENT VARIABLES MANAGEMENT UTILITY
[< Back to main page](../../README.md)

The environment utility creates a hidden env cache file in your home directory
saving all the env variables you use in staki enabled projects. In your every package.json
under the staki.env key specify the keys you would like to add to your project's .env file.

### Usage
```shell
    staki env [options] [key] [val]
```
- \[key] is the env variable key
- \[val] is the env variable value

#### Options
- -a --add: add a \[key\]/\[val\] to env cache
- -r --add: remove specified \[key\] from env cache
- -u --update: update \[key\]/\[val\] in env cache
- -l --list: if the \[key\] argument is present it will 
  list the corresponding value else it will list all env cache content
- -n --new: add a \[key\]/\[val\] to the env cache, and the \[key\] to staki config in package json
- -c --create: creates the .env file in the current working directory
- -d --delete: removes a \[key\]/\[val\] from the env cache, and the key from the staki config in package json
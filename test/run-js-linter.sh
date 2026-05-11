#!/usr/bin/env bash
set -euo pipefail
# NOTE: To use this script, run `npm run lint:js`

has_param() {
    local param="$1"
    shift
    for arg; do
        if [[ $arg == "$param" ]]; then
            return 0
        fi
    done
    return 1
}

flags="--ext=.jsx,.js,.tsx,.ts"
if has_param '--fix' "$@"; then
    echo "Fix mode set to true"
    flags="$flags --fix"
fi

files=""
# Run ESLint on Loris modules
files="$files modules/"

# Run ESLint on generic React components
files="$files jsx/"

# Run ESLint on all JS files (see exceptions in .eslintignore)
files="$files htdocs/js/ jslib/"

# Other files
files="$files webpack.config.ts npm-postinstall.js"

eslint ${flags} ${files}

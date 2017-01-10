#!/usr/bin/env bash
set -e
# NOTE: To use this script, run `npm run lint:javascript`

# Run ESLint on Loris modules
eslint modules/

# Run ESLint on generic React components
eslint jsx/

# Run ESLint on specific scripts
eslint htdocs/js/jquery.dynamictable.js
eslint htdocs/js/util/
eslint Gruntfile.js

#!/usr/bin/env bash
set -euo pipefail
# NOTE: To use this script, run `npm run lint:javascript`

# Run ESLint on Loris modules
eslint modules/

# Run ESLint on generic React components
eslint jsx/

# Run ESLint on all JS files (see exceptions in .eslintignore)
eslint htdocs/js/

# Other files
eslint webpack.config.js


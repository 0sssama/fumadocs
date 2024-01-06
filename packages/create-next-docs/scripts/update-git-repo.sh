#!/bin/bash
# Inspired by Svelte Kit

get_abs_filename() {
  # $1 : relative filename
  echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
}

DIR=$(get_abs_filename $(dirname "$0"))
TMP=$(get_abs_filename "$DIR/../node_modules/.tmp")

if [ "$CI" ]; then
	(umask 0077; echo "$UPDATE_TEMPLATE_SSH_KEY" > ~/ssh_key;)
	export GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=accept-new -i ~/ssh_key'
fi

mkdir -p $TMP
cd $TMP

# clone the template repo
rm -rf next-docs-ui-template
git clone --depth 1 --single-branch --branch main https://github.com/fuma-nama/next-docs-ui-template.git

# empty out the repo
cd next-docs-ui-template
node $DIR/update-git-repo.js $TMP/next-docs-ui-template

if [ "$CI" ]; then
	git config user.email 'noreply@fuma.dev'
	git config user.name '[bot]'
fi

# commit the new files
git add -A
git commit -m "version $npm_package_version"

git push https://github.com/fuma-nama/next-docs-ui-template.git main -f
#!/bin/bash

set -e

echo "Downloading autotag..."
curl https://github.com/pantheon-systems/autotag/releases/download/v1.1.4/OSX -o ./autotag -L && chmod 755 ./autotag

BRANCH=`git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`
if [[ "$BRANCH" == "master" ]]; then
  echo "Cannot create a hotfix tag on the master branch"
  exit -1
fi

echo "Merging the latest master into current branch..."
git fetch
git pull origin master

HOTFIX_TAG="v`./autotag -n --branch=$BRANCH -T datetime`-hotfix"
echo -e "Are you sure to generate a hotfix tag of \x1B[1m${HOTFIX_TAG}\033[0m on \x1B[1m${BRANCH}\033[0m branch?\n"

echo "Please enter PROCEED to push this tag to CI:"
read x
if [ "$x" = "PROCEED" ]; then
  git tag $HOTFIX_TAG
  git push --tag
  git push --set-upstream origin $BRANCH
fi

#!/bin/bash
set -euxo pipefail

while true; do
	CURRENT_VERSION=$(jq -r '.version' package.json)
	echo "The current version is $CURRENT_VERSION."
	read -p "Type in next version: " NEXT_VERSION
	read -p "Are we sure to update to $NEXT_VERSION? (y/n): " CONFIRM
  
  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
	  echo "Releasing $NEXT_VERSION."
	  jq --arg v "$NEXT_VERSION" '.version = $v' package.json > package.json.tmp && mv package.json.tmp package.json
	  # sed -E -i "s/(\"version\"[[:space:]]*:[[:space:]]*\")[^\"]+/\1$NEXT_VERSION/" package.json
	  npm run version
	  git add package.json
	  git commit -m "$NEXT_VERSION"
	  git push
	  git tag -a $NEXT_VERSION -m "$NEXT_VERSION"
	  git push origin $NEXT_VERSION
	  break
  fi
done

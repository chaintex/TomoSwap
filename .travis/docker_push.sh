#!/bin/bash

set -euo pipefail

readonly docker_password=${DOCKER_PASSWORD:-}
readonly docker_repository=chaintex/tomoswap

if [[ -z "$docker_password" ]]; then
    echo 'DOCKER_PASSWORD is not available, aborting.'
    exit 1
fi

echo "$docker_password" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker tag "$docker_repository:$TRAVIS_COMMIT" "$docker_repository:$TRAVIS_BRANCH"
if [[ -n "$TRAVIS_TAG" ]]; then
    docker tag "$docker_repository:$TRAVIS_COMMIT" "$docker_repository:$TRAVIS_TAG"
fi

docker push "$docker_repository"

#!/bin/bash
set -e

TAG="$1"

SERVICE="graphql-gateway"
ECR_URI="669607800383.dkr.ecr.us-east-1.amazonaws.com/$SERVICE"

echo "Logging into ECR"
eval "$(aws ecr get-login --no-include-email --region us-east-1)"

# Build
docker build -t "$SERVICE" .

# Tag
docker tag "$SERVICE:latest" "$ECR_URI:$TAG"
if [[ "$TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] ; then
  docker tag "$SERVICE:latest" "$ECR_URI:latest"
  docker tag "$SERVICE:latest" "$ECR_URI:prod-$TAG"
else
  docker tag "$SERVICE:latest" "$ECR_URI:dev-$TAG"
fi

# Push
docker push "$ECR_URI:$TAG"
if [[ "$TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] ; then
  docker push "$ECR_URI:latest"
  docker push "$ECR_URI:prod-$TAG"
else
  docker push "$ECR_URI:dev-$TAG"
fi

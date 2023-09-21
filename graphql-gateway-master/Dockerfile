#############################
# Docker Build
# - GraphQL
#############################
FROM 669607800383.dkr.ecr.us-east-1.amazonaws.com/base:3.1.1
LABEL maintainer="platform@500px.com"
WORKDIR /www/graphql-gateway

# Install system dependencies
#RUN apt-key adv --refresh-keys --keyserver hkp://keyserver.ubuntu.com
#RUN apt-get update -qq \
#    && apt-get install -y \
#    curl \
#    nodejs \
#    yarn \
#    && rm -rf /var/lib/apt/lists/*

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Build
COPY . .
RUN yarn build

CMD ["/www/graphql-gateway/start.sh"]

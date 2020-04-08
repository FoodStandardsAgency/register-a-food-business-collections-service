# specify the node base image with your desired version node:<version>
FROM node:12.16.0
ARG NPM_TOKEN
ARG http_proxy
ARG https_proxy
RUN echo $http_proxy

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

EXPOSE 4001
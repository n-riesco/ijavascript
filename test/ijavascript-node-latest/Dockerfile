FROM node:latest

RUN apt-get update && \
    apt-get install -yq --no-install-recommends libzmq3-dev jupyter-notebook && \
    apt-get clean

RUN mkdir -p ijavascript

COPY . ijavascript

RUN cd ijavascript && rm -rf node_modules && npm i --production

WORKDIR ijavascript

CMD npm install && npm run test

FROM node:0.10

RUN apt-get update && \
    apt-get install -yq --no-install-recommends libzmq-dev ipython-notebook && \
    apt-get clean

RUN git clone https://github.com/n-riesco/ijavascript.git && \
    cd ijavascript && \
    npm i

WORKDIR ijavascript

CMD git pull && npm run test:4 && npm run test:5

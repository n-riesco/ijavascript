FROM iojs:latest

RUN apt-get update && \
    apt-get install -yq --no-install-recommends libzmq-dev ipython-notebook && \
    apt-get clean

RUN git clone https://github.com/n-riesco/ijavascript.git && \
    cd ijavascript && \
    npm i

WORKDIR ijavascript

CMD npm t

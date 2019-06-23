FROM node:0.10

# Removal of jessie-updates and jessie-backports from Debian mirrors
# https://www.lucas-nussbaum.net/blog/?p=947
RUN echo "deb http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
RUN sed -i "/deb http:\/\/deb.debian.org\/debian jessie-updates main/d" /etc/apt/sources.list
RUN echo "Acquire::Check-Valid-Until no;" > /etc/apt/apt.conf.d/99no-check-valid-until

RUN apt-get update && \
    apt-get install -yq --no-install-recommends libzmq3-dev ipython-notebook && \
    apt-get clean

RUN mkdir -p ijavascript

COPY . ijavascript

RUN cd ijavascript && rm -rf node_modules && npm i --production

WORKDIR ijavascript

CMD npm install && npm run test

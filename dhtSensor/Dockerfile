FROM node:14.15.4-slim

EXPOSE 50

RUN apt-get update \
    apt-get install python3-pip \
    python3 -m pip install --upgrade pip setuptools wheel \
    pip3 install adafruit-circuitpython-dht \
    apt-get install libgpiod2

WORKDIR /var/www

RUN mkdir dhtSensor

COPY ./dhtSensor/package.json ./var/www/dhtSensor

RUN cd /var/www/dhtSensor && npm install

COPY ./dhtSensor/ /var/www/dhtSensor

CMD ['npm', 'run', 'dev']

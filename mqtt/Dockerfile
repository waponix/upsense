FROM node:14.15.4-slim

EXPOSE 1883

WORKDIR /var/www

ADD ./.env /var/www

RUN mkdir mqtt_broker

COPY ./mqtt/package.json /var/www/mqtt_broker

COPY ./mqtt/ /var/www/mqtt_broker

WORKDIR /var/www/mqtt_broker

RUN npm install

RUN npm run build
CMD ["npm", "start"]

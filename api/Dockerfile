FROM node:14.15.4-slim

EXPOSE 8443

WORKDIR /var/www

ADD ./.env /var/www

RUN mkdir api

COPY ./api/package.json /var/www/api

COPY ./api /var/www/api

WORKDIR /var/www/api

RUN npm install

RUN npm run build
CMD ["npm", "start"]

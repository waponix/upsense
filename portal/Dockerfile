FROM node:14.15.4-slim

EXPOSE 3000
EXPOSE 1884

WORKDIR /var/www

ADD ./.env /var/www

RUN mkdir portal

COPY ./portal/package.json /var/www/portal

COPY ./portal /var/www/portal

WORKDIR /var/www/portal

RUN npm install

RUN npm run build

COPY ./portal/src/public /var/www/portal/dist/public
COPY ./portal/src/views /var/www/portal/dist/views

RUN rm -rf /var/www/portal/src

CMD ["npm", "start"]

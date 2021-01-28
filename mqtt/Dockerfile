FROM node:14.15.4-slim
EXPOSE 1883
WORKDIR /var/www/mqtt_broker
COPY ./package.json /var/www/mqtt_broker
RUN npm install
COPY . /var/www/mqtt_broker
COPY ./certificates /var/www/certificates
COPY ./.env.local /var/www/mqtt_broker/.env
CMD ["npm", "run", "dev"]
#CMD ["npm", "run", "build"]
#CMD ["npm", "start"]

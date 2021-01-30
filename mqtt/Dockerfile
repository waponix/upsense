FROM node:14.15.4-slim
EXPOSE 1883
WORKDIR /var/www/upsense_mqtt_broker
COPY ./mqtt/package.json /var/www/upsense_mqtt_broker
COPY ./certificates /var/www/certificates
COPY ./.env /var/www/upsense_mqtt_broker/
RUN npm install
COPY ./mqtt /var/www/upsense_mqtt_broker
CMD ["npm", "run", "dev"]
#CMD ["npm", "run", "build"]
#CMD ["npm", "start"]

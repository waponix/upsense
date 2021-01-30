FROM node:14.15.4-slim
EXPOSE 8443
WORKDIR /var/www/upsense_api
COPY ./api/package.json /var/www/upsense_api
COPY ./.env /var/www/upsense_api/
RUN npm install
COPY ./api /var/www/upsense_api
CMD ["npm", "run", "dev"]
#CMD ["npm", "run", "build"]
#CMD ["npm", "start"]

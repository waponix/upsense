FROM nginx:1.20-alpine

ADD docker/production/vhost.conf /etc/nginx/conf.d/default.conf

COPY public /var/www/public
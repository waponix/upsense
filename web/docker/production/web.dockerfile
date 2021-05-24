FROM nginx:1.20-alpine

RUN  echo "daemon off;" >> /etc/nginx/nginx.conf

ADD docker/development/vhost.conf /etc/nginx/conf.d/default.conf
# COPY php-fpm.conf /etc/php/7.1/fpm/php-fpm.conf
# COPY www.conf /etc/php/7.1/fpm/php-fpm.d/www.conf

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["nginx"]
FROM php:8.0-fpm
WORKDIR /var/www/html

LABEL maintainer="Kevin"

COPY composer.lock composer.json /var/www/html/
COPY database /var/www/html/database

RUN apt-get update \
    && apt-get install -y curl ca-certificates zip unzip git supervisor sqlite3 libcap2-bin libpng-dev python2 \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y yarn \
    && apt-get install -y mariadb-client \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
        
COPY . /var/www/html

# RUN groupadd --force -g $WWWGROUP www-data
# RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 www-data

RUN mv .env.prod .env

RUN mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
RUN chmod -R 777 /var/www/html/storage
RUN chown -R www-data:www-data \
        /var/www/html/storage \
        /var/www/html/bootstrap/cache

# install php vendors
RUN composer install

# RUN php artisan migrate:fresh --seed
RUN php artisan view:clear
RUN php artisan optimize

RUN chmod -R 775 /var/www/html/storage/framework
RUN chown -R www-data:www-data \
        /var/www/html/storage \
        /var/www/html/bootstrap/cache

RUN npm install \
    && npm rebuild node-sass \
    && npm install -g cross-env 

RUN chown -R www-data:www-data \
        /var/www/html/public 

RUN npm run prod
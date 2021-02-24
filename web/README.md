# Upsense Client

### Prerequisites (non-docker setup)
php 7.4 with php-pdo-mysql php-mysql ext installed

composer 2.0

nodejs 14.15.4

## Installation

``` bash
# clone the repo
$ git clone https://github.com/kevin-nicolli/Upsense-client.git

# go into app's directory
$ cd Upsense-client

# install app's dependencies
$ composer install

# install app's dependencies
$ npm install

```

### Setup MySQL

Copy file ".env.example", and change its name to ".env".
Then in file ".env" complete this database configuration:
* DB_CONNECTION=mysql
* DB_HOST=127.0.0.1
* DB_PORT=3306
* DB_DATABASE=upsense
* DB_USERNAME=root
* DB_PASSWORD=

### Set APP_URL

> If your project url looks like: example.com/sub-folder 
Then go to `my-project/.env`
And modify this line:

* APP_URL = 

To make it look like this:

* APP_URL = http://example.com/sub-folder


### Next step

``` bash
# in your app directory
# generate laravel APP_KEY
$ php artisan key:generate

# run database migration and seed
$ php artisan migrate:refresh --seed

# generate mixing
$ npm run dev

# and repeat generate mixing
$ npm run dev
```

## Usage

``` bash
# start local server
$ php artisan serve
```

Open your browser with address: [localhost:8000](localhost:8000) (change localhost with server ip)  

* E-mail: _admin@admin.com_
* Password: _password_

This user has roles: _user_ and _admin_

--- 


### Prerequisites (docker setup)
docker should be installed in the system

## Installation

``` bash
cd upsense

// initiate docker
./vendor/bin/sail up

... to be configured more

```

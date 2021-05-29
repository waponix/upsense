# Upsense web


## Installation
### Prerequisites (docker setup)

> Docker and Docker Compose should be installed in the system. Refer to this link : https://support.netfoundry.io/hc/en-us/articles/360057865692-Installing-Docker-and-docker-compose-for-Ubuntu-20-04

- nodejs 14.x should be installed in the server.

## Installation

``` bash
# clone the repo
$ git clone https://github.com/ericbermejoreyes/upsense.git

# go into web directory
$ cd web

# build container
$ docker-compose -f docker-compose-prod.yml build --no-cache 

# start running services
$ docker-compose -f docker-compose-prod.yml up -d

```


#

### Prerequisites (non-docker setup)
php 8.x with php-pdo-mysql php-mysql ext installed

composer 2.0

nodejs 14.x
``` bash
# clone the repo
$ git clone https://github.com/ericbermejoreyes/upsense.git

# go into app's directory
$ cd web

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
* DB_USERNAME=admin
* DB_PASSWORD=admin123

### Set APP_URL

> If your project url looks like: example.com/sub-folder 
Then go to `my-project/.env`
And modify this line:

* APP_URL = 

To make it look like this:

* APP_URL = http://example.com/sub-folder


### Next step

``` bash
# generate mixing
$ npm run dev #for development
$ npm run prod #for production

```


* E-mail: _admin_
* Password: _admin_

--- 


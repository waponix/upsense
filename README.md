# UpsenseUpsense is an [IoT](https://en.wikipedia.org/wiki/Internet_of_things) application for managing and monitoring temperature readings#### Built With:> - [Docker v20.10.2](https://www.docker.com/)> - [NodeJS v14.15.4](https://hub.docker.com/_/node/)> - [MariaDB 10.5.8](https://hub.docker.com/_/mariadb)> - [InfluxDB v1.8.3](https://hub.docker.com/_/influxdb)# Development Setup> Note: this setup expects you to have [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) installed in your machineStep 1:  Copy or rename `./.env.local` as `./.env` and configure the values inside the files accordinglyStep 2: Edit `./docker-compose.yml` file as follows:```version: "3.9"services:  mariadb:    image: mariadb:10.5.8-focal    ports:      - 3306:3306    environment:      MYSQL_ROOT_PASSWORD: admin123      MYSQL_DATABASE: upsense    volumes:      - ./mysql/default.sql:/docker-entrypoint-initdb.d/default.sql    restart: unless-stopped  api:    build:      dockerfile: ./api/DockerfileDev      context: ./    image: upsense_api_dev:latest    ports:      - 8443:8443    volumes: # Use this when in development      - ./api:/var/www/api    links:      - mariadb:mysql      - influxdb      - broker    restart: unless-stopped  influxdb:    image: influxdb:1.8.3    ports:      - 8086:8086    environment:      INFLUXDB_HTTP_LOG_ENABLED: 0    volumes:      - ./influxdb/influxdb.conf:/etc/influxdb/influxdb.conf      - ./influxdb/storage:/var/lib/influxdb    restart: unless-stopped  broker:    build:      dockerfile: ./mqtt/DockerfileDev      context: ./    image: upsense_broker_dev:latest    ports:      - 1883:1883      - 1884:1884    volumes: # Use this when in development      - ./mqtt:/var/www/mqtt_broker    links:      - influxdb    restart: unless-stopped```>Note: _ports_ and _environment variables_ can be changed if necessaryStep 3: Edit `./api/ormconfig.json` to include entities inside _./api/src_ directory:```  "entities": [    "dist/*/shared/entities/*.js",    "src/*/shared/entities/*.ts" <<< add this line  ],```Step 4:  Build the necessary images first with one easy command:```> sudo docker-compose build```Step 5: Run the services using docker-compose:```> sudo docker-compose up```# Production Setup> Note: this setup expects you to have [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) installed in your machineStep 1:  Copy or rename `./.env.local` as `./.env` and configure the values inside the files accordinglyStep 2: Edit `./docker-compose.yml` file according to the production server needs>Note: _ports_ and _environment variables_ can be changed if necessaryStep 3:  Build the necessary images first with one easy command:```> sudo docker-compose build```Step 4: Run the services using docker-compose:```> sudo docker-compose up```
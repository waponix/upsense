#!/bin/bash

echo 'Creating build upsense-api-dev'
docker build -t 'upsense-api-dev' -f './api/Dockerfile' '.'

echo 'Creating build upsense-mqtt-broker-dev'
docker build -t 'upsense-mqtt-broker-dev' -f './mqtt/Dockerfile' '.'

echo 'Setup complete! Please run command: docker-compose up'

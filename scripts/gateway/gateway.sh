#!/bin/bash

sudo apt-get update
sudo apt-get upgrade

set -a
source /home/env/.env
set +a

# install node
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# install dependencies
cd /home/server
npm install

# install RabbitMQ
sudo apt-get install -y rabbitmq-server
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo rabbitmq-plugins enable rabbitmq_management
sudo systemctl restart rabbitmq-server

# launch PM2
sudo npm install -g pm2
sudo pm2 start /home/server/server.js --name gateway-backend
sudo pm2 startup systemd
sudo pm2 save

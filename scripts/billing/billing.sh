#!/bin/bash

sudo apt-get update
sudo apt-get upgrade

set -a
source /home/env/.env
set +a

sudo apt-get install -y postgresql postgresql-contrib

sudo -i -u postgres psql -c "CREATE USER $BILLING_DATABASE_USER WITH PASSWORD '$BILLING_DATABASE_PASSWORD';"
sudo -i -u postgres psql -c "CREATE DATABASE $BILLING_DATABASE_NAME OWNER $BILLING_DATABASE_USER;"

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

cd /home/server
npm install

sudo npm install -g pm2
sudo pm2 start /home/server/server.js --name billing-backend
sudo pm2 startup systemd
sudo pm2 save
Vagrant.configure("2") do |config|
   # VM Iventory
  config.vm.define "inventory" do |inventory|
    inventory.vm.box = "ubuntu/bionic64"
    inventory.vm.hostname = "inventory"
    inventory.vm.network "private_network", ip: "192.168.56.103"
    inventory.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end

    inventory.vm.synced_folder "./src/inventory", "/home/server"

    inventory.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    # install node
    curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
    # install and start Postgresql
    sudo apt-get install -y postgresql postgresql-contrib
    sudo service postgresql start
    # create database
    sudo -u postgres psql -c "CREATE USER inventory WITH PASSWORD 'inventory';"
    sudo -u postgres psql -c "CREATE DATABASE movies OWNER inventory;"
    # install PM2
    sudo npm install -g pm2
    su - vagrant -c 'pm2 start /home/server/server.js --name backend'
    su - vagrant -c 'pm2 startup systemd'
    su - vagrant -c 'pm2 save'
    SHELL
  end



  # VM Billing
  config.vm.define "billing" do |billing|
    billing.vm.box = "ubuntu/bionic64"
    billing.vm.hostname = "billing"
    billing.vm.network "private_network", ip: "192.168.56.102"
    billing.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end

    billing.vm.synced_folder "./src/billing", "/home/server"

    billing.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    # install node
    curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
    # install and start Postgresql
    sudo apt-get install -y postgresql postgresql-contrib
    sudo service postgresql start
    # create database
    sudo -u postgres psql -c "CREATE USER orders WITH PASSWORD 'orders';"
    sudo -u postgres psql -c "CREATE DATABASE orders OWNER orders;"
    # install PM2
    sudo npm install -g pm2
    su - vagrant -c 'pm2 start /home/server/server.js --name backend'
    su - vagrant -c 'pm2 startup systemd'
    su - vagrant -c 'pm2 save'
    SHELL
  end

  #  API Gateway
  config.vm.define "gateway" do |gateway|
    gateway.vm.box = "ubuntu/bionic64"
    gateway.vm.hostname = "gateway"
    gateway.vm.network "private_network", ip: "192.168.56.101"
    gateway.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end

    gateway.vm.synced_folder "./src/gateway", "/home/server"

    gateway.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    cd /home/server
    # install node
    curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
    # install RabbitMQ
    sudo apt-get install rabbitmq-server
    sudo systemctl start rabbitmq-server
    sudo systemctl enable rabbitmq-server
    sudo rabbitmq-plugins enable rabbitmq_management
    sudo systemctl restart rabbitmq-server
    # install AMQ for rabbit
    npm install express http-proxy-middleware amqplib
    # install PM2
    sudo npm install -g pm2
    su - vagrant -c 'pm2 start /home/server/server.js --name backend'
    su - vagrant -c 'pm2 startup systemd'
    su - vagrant -c 'pm2 save'
    SHELL
  end


end

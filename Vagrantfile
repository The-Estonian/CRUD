Vagrant.configure("2") do |config|
   # VM Iventory
  config.vm.define "inventory" do |inventory|
    inventory.vm.box = "ubuntu/focal64"
    inventory.vm.hostname = "inventory"
    inventory.vm.network "private_network", ip: "192.168.56.103"
    inventory.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end

    inventory.vm.synced_folder "./src/inventory", "/home/server"
    inventory.vm.synced_folder "./scripts/inventory", "/home/scripts"
    inventory.vm.synced_folder "./env", "/home/env"

    inventory.vm.provision "file", source: "./scripts/inventory/inventory.sh", destination:"/home/scripts/inventory.sh"

    inventory.vm.provision "shell", inline: <<-SHELL
      sudo chmod +x /home/scripts/inventory.sh
      sudo apt-get install -y dos2unix
      sudo dos2unix /home/scripts/inventory.sh
      sudo /home/scripts/inventory.sh
    SHELL
  end

  # VM Billing
  config.vm.define "billing" do |billing|
    billing.vm.box = "ubuntu/focal64"
    billing.vm.hostname = "billing"
    billing.vm.network "private_network", ip: "192.168.56.102"
    billing.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end

    billing.vm.synced_folder "./src/billing", "/home/server"
    billing.vm.synced_folder "./scripts/billing", "/home/scripts"
    billing.vm.synced_folder "./env", "/home/env"

    billing.vm.provision "file", source: "./scripts/billing/billing.sh", destination:"/home/scripts/billing.sh"

    billing.vm.provision "shell", inline: <<-SHELL
      sudo chmod +x /home/scripts/billing.sh
      sudo apt-get install -y dos2unix
      sudo dos2unix /home/scripts/billing.sh
      sudo /home/scripts/billing.sh
    SHELL
  end

  #  API Gateway
  config.vm.define "gateway" do |gateway|
    gateway.vm.box = "ubuntu/focal64"
    gateway.vm.hostname = "gateway"
    gateway.vm.network "private_network", ip: "192.168.56.101"
    gateway.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end

    gateway.vm.synced_folder "./src/gateway", "/home/server"
    gateway.vm.synced_folder "./scripts/gateway", "/home/scripts"
    gateway.vm.synced_folder "./env", "/home/env"

    gateway.vm.provision "file", source: "./scripts/gateway/gateway.sh", destination:"/home/scripts/gateway.sh"

    gateway.vm.provision "shell", inline: <<-SHELL
      chmod +x /home/scripts/gateway.sh
      sudo apt-get install -y dos2unix
      sudo dos2unix /home/scripts/gateway.sh
      sudo /home/scripts/gateway.sh
    SHELL
  end


end

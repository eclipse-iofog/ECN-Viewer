variable "project"                     {
    default = "focal-freedom-236620"
}
variable "region"                      {
    default = "us-west2"
}
variable "gce_ssh_pub_key_file"        {
    default = "~/.ssh/id_rsa.pub"
}

provider "google" {
    version                     = "~> 2.7.0"
    project                     = "${var.project}"
    region                      = "${var.region}"
}

data "google_compute_zones" "available" {}

resource "google_compute_instance" "ecn" {
    name         = "ecn-viewer"
    machine_type = "n1-standard-1"
    zone         = "${data.google_compute_zones.available.names[0]}"
    boot_disk {
      initialize_params {
        image = "ubuntu-1804-lts"
      }
    }
    network_interface {
        network = "default"
        access_config {
            nat_ip = "34.94.240.119"
        }
    }

    metadata {
        sshKeys = "root:${file(var.gce_ssh_pub_key_file)}"
    }
    metadata_startup_script = <<SCRIPT
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
apt-get update
apt-get -y install nodejs
apt-get -y install npm
sudo npm i -g pm2 
mkdir -p /apps/ecn
SCRIPT

    service_account {
      scopes = ["userinfo-email", "compute-ro", "storage-ro"]
    }

    provisioner "local-exec" {
      command = "cd ../ && npm i && npm run build"
    }

    provisioner "file" {
      source      = "${path.module}/../server"
      destination = "/apps/ecn/"
    }

    provisioner "file" {
      source      = "${path.module}/../build"
      destination = "/apps/ecn/"
    }

    provisioner "file" {
      source      = "${path.module}/../node_modules"
      destination = "/apps/ecn/"
    }

    provisioner "remote-exec" {
      inline = [
        "cd /apps/ecn/",
        "PORT=5555 pm2 start server/index.js"
      ]
    }
}

output "IP" {
  value = "${google_compute_instance.ecn.network_interface.0.access_config.0.nat_ip}"
}
output "ECN Viewer address" {
  value = "http://${google_compute_instance.ecn.network_interface.0.access_config.0.nat_ip}:5555/"
}
variable "project"                     {
    default = "focal-freedom-236620"
}
variable "region"                      {
    default = "us-west1"
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
        // Ephemeral IP
        }
    }

    metadata {
        sshKeys = "root:${file(var.gce_ssh_pub_key_file)}"
    }
    metadata_startup_script = <<SCRIPT
apt-get update
apt-get -y install nodejs
apt-get -y install npm
SCRIPT

    service_account {
      scopes = ["userinfo-email", "compute-ro", "storage-ro"]
    }
}

output "ip" {
  value = "${google_compute_instance.ecn.network_interface.0.access_config.0.nat_ip }"
}
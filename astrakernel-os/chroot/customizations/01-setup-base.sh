#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

echo "Updating APT..."
apt-get update

echo "Installing base packages..."
apt-get install -y --no-install-recommends $(cat /tmp/config/packages.list)

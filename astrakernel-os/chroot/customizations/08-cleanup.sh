#!/bin/bash
set -e
source /tmp/config/users.conf

echo "Cleaning up chroot..."
chown -R $USERNAME:$USERNAME /home/$USERNAME/.config || true
apt-get clean
rm -rf /tmp/config /tmp/branding /tmp/desktop /tmp/apps /tmp/customizations /tmp/packages.list
rm -rf /var/lib/apt/lists/*

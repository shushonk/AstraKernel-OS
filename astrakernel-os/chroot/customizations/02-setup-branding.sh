#!/bin/bash
set -e
source /tmp/config/branding.conf

echo "Applying branding..."
mkdir -p /usr/share/astrakernel/branding
cp -r /tmp/branding/* /usr/share/astrakernel/branding/ || true

# Basic Plymouth config
sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT="quiet"/GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"/g' /etc/default/grub || true
update-grub || true

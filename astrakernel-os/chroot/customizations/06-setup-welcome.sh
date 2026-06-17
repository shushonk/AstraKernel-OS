#!/bin/bash
set -e
source /tmp/config/users.conf

echo "Setting up Welcome app..."
mkdir -p /opt/astrakernel-welcome
cp /tmp/apps/welcome/astrakernel-welcome.py /opt/astrakernel-welcome/ 2>/dev/null || true
chmod +x /opt/astrakernel-welcome/astrakernel-welcome.py || true
ln -sf /opt/astrakernel-welcome/astrakernel-welcome.py /usr/local/bin/astra-welcome

mkdir -p /usr/share/applications
cp /tmp/apps/welcome/astrakernel-welcome.desktop /usr/share/applications/ 2>/dev/null || true
mkdir -p /home/$USERNAME/.config/autostart
cp /tmp/apps/welcome/astrakernel-welcome.desktop /home/$USERNAME/.config/autostart/ 2>/dev/null || true

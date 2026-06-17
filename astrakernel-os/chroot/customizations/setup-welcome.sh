#!/bin/bash
source /tmp/users.conf

# Setup the Welcome Python GTK App
mkdir -p /opt/astrakernel-welcome
cp /tmp/apps/welcome/astrakernel-welcome.py /opt/astrakernel-welcome/
chmod +x /opt/astrakernel-welcome/astrakernel-welcome.py
ln -s /opt/astrakernel-welcome/astrakernel-welcome.py /usr/local/bin/astrakernel-welcome

# Add desktop shortcut
mkdir -p /usr/share/applications
cp /tmp/apps/welcome/astrakernel-welcome.desktop /usr/share/applications/

# Autostart the welcome app
mkdir -p /home/$USERNAME/.config/autostart
cp /tmp/apps/welcome/astrakernel-welcome.desktop /home/$USERNAME/.config/autostart/
chown -R $USERNAME:$USERNAME /home/$USERNAME/.config/autostart

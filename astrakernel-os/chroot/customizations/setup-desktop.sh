#!/bin/bash
# Apply XFCE Desktop Settings

source /tmp/users.conf

mkdir -p /home/$USERNAME/.config/xfce4/xfconf/xfce-perchannel-xml
cp /tmp/desktop/xfce-panel.xml /home/$USERNAME/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-panel.xml || true

# Set wallpaper if exists
if [ -f /usr/share/astrakernel/branding/wallpapers/astrakernel-wallpaper.png ]; then
  mkdir -p /usr/share/backgrounds/xfce
  cp /usr/share/astrakernel/branding/wallpapers/astrakernel-wallpaper.png /usr/share/backgrounds/xfce/astrakernel-wallpaper.png
fi

chown -R $USERNAME:$USERNAME /home/$USERNAME/.config

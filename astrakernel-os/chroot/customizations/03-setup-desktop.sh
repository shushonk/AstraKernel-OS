#!/bin/bash
set -e
source /tmp/config/users.conf

echo "Setting up XFCE desktop..."
mkdir -p /home/$USERNAME/.config/xfce4/xfconf/xfce-perchannel-xml
# Copy available desktop configs if any
cp -r /tmp/desktop/xfce/*.xml /home/$USERNAME/.config/xfce4/xfconf/xfce-perchannel-xml/ 2>/dev/null || true

# Wallpaper
if [ -f /usr/share/astrakernel/branding/wallpapers/astrakernel-wallpaper.svg ]; then
  mkdir -p /usr/share/backgrounds/xfce
  cp /usr/share/astrakernel/branding/wallpapers/astrakernel-wallpaper.svg /usr/share/backgrounds/xfce/
fi

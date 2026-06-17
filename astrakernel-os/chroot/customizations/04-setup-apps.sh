#!/bin/bash
set -e
source /tmp/config/users.conf

echo "Configuring apps..."
update-alternatives --set x-www-browser /usr/bin/firefox-esr || true
systemctl enable NetworkManager || true
systemctl enable lightdm || true

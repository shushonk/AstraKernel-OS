#!/bin/bash
# Extra app configurations (if any)
# For Phase 1, the packages are already installed via apt in build.sh.
echo "Setting up app defaults..."

# Set Firefox as default
update-alternatives --set x-www-browser /usr/bin/firefox-esr || true

# Enable NetworkManager
systemctl enable NetworkManager

#!/bin/bash
# Apply Branding configurations

mkdir -p /usr/share/astrakernel/branding
cp -r /tmp/branding/* /usr/share/astrakernel/branding/ || true

# Apply Plymouth (Basic fallback if custom plymouth theme not fully configured)
sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT="quiet"/GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"/g' /etc/default/grub || true

# Setup astra custom CLI commands
cat << 'EOF' > /usr/local/bin/astra-info
#!/bin/bash
echo "AstraKernel OS - Live Environment"
echo "Author: Shashank V"
uname -a
EOF
chmod +x /usr/local/bin/astra-info

cat << 'EOF' > /usr/local/bin/astra-about
#!/bin/bash
echo "AstraKernel OS is a custom high-performance Linux distribution built on standard Debian/Ubuntu layers."
EOF
chmod +x /usr/local/bin/astra-about

ln -s /usr/local/bin/astrakernel-welcome /usr/local/bin/astra-welcome || true

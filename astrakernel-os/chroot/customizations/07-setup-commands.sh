#!/bin/bash
set -e

echo "Setting up Astra custom commands..."
cat << 'EOF' > /usr/local/bin/astra-info
#!/bin/bash
echo "OS: AstraKernel OS v0.1"
echo "Base: Debian/Ubuntu"
echo "Kernel: $(uname -r)"
echo "Desktop: XFCE"
echo "Host: $(hostname)"
EOF

cat << 'EOF' > /usr/local/bin/astra-about
#!/bin/bash
echo "AstraKernel OS"
echo "Author: Shashank V"
echo "A custom high-performance Linux distribution."
EOF

cat << 'EOF' > /usr/local/bin/astra-update
#!/bin/bash
echo "Updating AstraKernel OS..."
sudo apt update && sudo apt upgrade -y
EOF

cat << 'EOF' > /usr/local/bin/astra-sysmon
#!/bin/bash
htop
EOF

chmod +x /usr/local/bin/astra-*

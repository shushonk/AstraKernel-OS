#!/bin/bash
set -e

# AstraKernel OS - Live ISO Build Script
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

export WORK_DIR="work"
export CHROOT_DIR="$WORK_DIR/chroot"
export IMAGE_DIR="$WORK_DIR/image"
export ISO_NAME="AstraKernelOS.iso"

echo "=> Installing required dependencies on host..."
apt-get update -y || true
apt-get install -y debootstrap squashfs-tools xorriso grub-pc-bin grub-efi-amd64-bin mtools || true

echo "=> Cleaning up previous build..."
./clean.sh || true

echo "=> Preparing directories..."
mkdir -p "$CHROOT_DIR"
mkdir -p "$IMAGE_DIR/live"
mkdir -p "$IMAGE_DIR/boot/grub"

echo "=> Bootstrapping Debian base (Stable)..."
debootstrap --arch=amd64 stable "$CHROOT_DIR" http://deb.debian.org/debian/

echo "=> Mounting pseudo-filesystems..."
mount --bind /dev "$CHROOT_DIR/dev"
mount -t devpts /dev/pts "$CHROOT_DIR/dev/pts"
mount -t proc proc "$CHROOT_DIR/proc"
mount -t sysfs sys "$CHROOT_DIR/sys"

echo "=> Copying configurations and scripts..."
cp -r config "$CHROOT_DIR/tmp/"
cp -r branding "$CHROOT_DIR/tmp/" 2>/dev/null || true
cp -r desktop "$CHROOT_DIR/tmp/" 2>/dev/null || true
cp -r apps "$CHROOT_DIR/tmp/" 2>/dev/null || true
cp -r chroot/customizations "$CHROOT_DIR/tmp/"

# Ensure scripts are executable
chmod +x "$CHROOT_DIR"/tmp/customizations/*.sh

echo "=> Running chroot customizations..."
cat << 'EOF' | chroot "$CHROOT_DIR" /bin/bash
export DEBIAN_FRONTEND=noninteractive
export LC_ALL=C

for script in /tmp/customizations/*.sh; do
    echo "-> Running $script"
    bash "$script" || exit 1
done
EOF

echo "=> Copying kernel and initrd..."
cp "$CHROOT_DIR"/boot/vmlinuz-* "$IMAGE_DIR/live/vmlinuz"
cp "$CHROOT_DIR"/boot/initrd.img-* "$IMAGE_DIR/live/initrd"

echo "=> Unmounting pseudo-filesystems..."
umount "$CHROOT_DIR/sys"
umount "$CHROOT_DIR/proc"
umount "$CHROOT_DIR/dev/pts"
umount "$CHROOT_DIR/dev"

echo "=> Compressing filesystem (this may take a while)..."
mksquashfs "$CHROOT_DIR" "$IMAGE_DIR/live/filesystem.squashfs" -comp xz -e boot

echo "=> Creating GRUB configuration..."
cat << 'EOF' > "$IMAGE_DIR/boot/grub/grub.cfg"
set default="0"
set timeout=5

menuentry "AstraKernel OS" {
    linux /live/vmlinuz boot=live quiet splash
    initrd /live/initrd
}
menuentry "AstraKernel OS (Safe Mode)" {
    linux /live/vmlinuz boot=live nomodeset
    initrd /live/initrd
}
EOF

echo "=> Building ISO..."
grub-mkrescue -o "$ISO_NAME" "$IMAGE_DIR"

echo "=> Build complete! Artifact: $ISO_NAME"

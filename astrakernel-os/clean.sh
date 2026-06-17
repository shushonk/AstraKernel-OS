#!/bin/bash
set -e

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

WORK_DIR="work"

echo "=> Unmounting chroot directories if necessary..."
for m in sys proc dev/pts dev; do
    if mountpoint -q "$WORK_DIR/chroot/$m"; then
        umount -lf "$WORK_DIR/chroot/$m" || true
    fi
done

if [ -d "$WORK_DIR" ]; then
    echo "=> Removing work directory..."
    rm -rf "$WORK_DIR"
fi

echo "=> Clean complete."

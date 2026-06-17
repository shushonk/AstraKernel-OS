#!/bin/bash
ISO="AstraKernelOS.iso"

if [ ! -f "$ISO" ]; then
    echo "Error: $ISO not found. Please build the OS first using sudo ./build.sh"
    exit 1
fi

echo "=> Testing AstraKernel OS in QEMU..."
if command -v qemu-system-x86_64 >/dev/null 2>&1; then
    qemu-system-x86_64 -m 4096 -cdrom "$ISO" -vga virtio -enable-kvm || \
    qemu-system-x86_64 -m 2048 -cdrom "$ISO"
else
    echo "QEMU not found. Please install qemu-system-x86."
    exit 1
fi

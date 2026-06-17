# AstraKernel OS

A custom Linux-based operating system distribution with a real ISO builder and an artificial VirtualBox-style visual preview for portfolio presentation.

## Project Structure
This project has two distinct parts:
1. **Real ISO Builder (`astrakernel-os/`)**: The actual scripts and configurations that assemble Debian packages into a bootable Linux distro ISO.
2. **Visual Preview Demo (`preview/`)**: A web-based mockup showing how the OS looks running inside VirtualBox.

## Tech Stack
- Base: Debian Stable
- Desktop Environment: XFCE
- Init: systemd
- Display Manager: LightDM
- Bootloader: GRUB
- Squashfs live boot

## Requirements
To build the real ISO, you need a Debian or Ubuntu host machine.
```bash
sudo apt install debootstrap squashfs-tools xorriso grub-pc-bin grub-efi-amd64-bin mtools
```

## How to Build the ISO
1. Navigate to the project directory.
2. Make scripts executable: `chmod +x build.sh clean.sh test-qemu.sh`
3. Run the builder as root: `sudo ./build.sh`

## Testing the ISO
You can test the resulting `AstraKernelOS.iso` using QEMU:
```bash
./test-qemu.sh
```

## Preview Demo
Open `preview/index.html` in your browser to view the artificial VirtualBox-style demo. NOTE: This is purely a visual simulation for portfolio purposes and not the real OS.

## Roadmap
- Custom package manager wrapper (`astrabrew`)
- KDE Plasma edition
- ARM/Raspberry Pi edition

*Author: Shashank V*

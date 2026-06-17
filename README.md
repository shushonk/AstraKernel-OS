<div align="center">
  <h1>AstraKernel OS</h1>
</div>

A custom Linux-based operating system distribution with a real ISO builder and an artificial VirtualBox-style visual preview for portfolio presentation.

## 📁 Project Structure

This project has two distinct parts:

1. **Visual Preview Demo (Root & `src/`)**: A web-based mockup showing how the OS looks running inside a virtual environment. It is built with React, Vite, Tailwind CSS, and integrates the Gemini API for smart features.
2. **Real ISO Builder (`astrakernel-os/`)**: The actual scripts and configurations that assemble Debian packages into a bootable Linux distro ISO.

---

## 🌐 1. Visual Preview Demo (Web App)

A browser-based simulation of AstraKernel OS.

### Tech Stack
- React 19 & Vite
- Tailwind CSS v4
- Google GenAI SDK (`@google/genai`)
- Framer Motion for animations

### How to Run Locally

**Prerequisites:** Node.js installed on your machine.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables:
   Create a `.env.local` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the app in your browser (usually `http://localhost:3000`).

---

## 💿 2. AstraKernel OS ISO Builder

The real Linux distribution builder based on Debian Stable.

### Tech Stack
- **Base:** Debian Stable
- **Desktop Environment:** XFCE
- **Init:** systemd
- **Display Manager:** LightDM
- **Bootloader:** GRUB
- **Live System:** Squashfs

### Requirements
To build the real ISO, you need a Debian or Ubuntu host machine:
```bash
sudo apt install debootstrap squashfs-tools xorriso grub-pc-bin grub-efi-amd64-bin mtools
```

### How to Build the ISO
1. Navigate to the `astrakernel-os/` directory:
   ```bash
   cd astrakernel-os
   ```
2. Make the scripts executable:
   ```bash
   chmod +x build.sh clean.sh test-qemu.sh
   ```
3. Run the builder as root:
   ```bash
   sudo ./build.sh
   ```

### Testing the ISO
You can test the resulting `AstraKernelOS.iso` using QEMU:
```bash
./test-qemu.sh
```

*(You can use `./clean.sh` as root to remove the `work/` directory used during the build).*

---

## 🚀 Roadmap

- Custom package manager wrapper (`astrabrew`)
- KDE Plasma edition
- ARM/Raspberry Pi edition

*Author: Shashank V*

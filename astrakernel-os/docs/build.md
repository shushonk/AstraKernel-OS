# AstraKernel OS Build Instructions

To build the ISO:
1. Run `./build.sh` as root (`sudo ./build.sh`).
2. The script will use `debootstrap` to fetch a Debian stable base.
3. It will mount pseudo-file systems and execute the customizations inside `chroot/`.
4. It compiles everything into a squashfs.
5. It outputs `AstraKernelOS.iso`.

You can use `./clean.sh` (as root) to remove the `work/` directory used during the build.

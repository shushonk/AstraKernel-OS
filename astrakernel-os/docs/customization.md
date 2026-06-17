# Customization Guide

## Adding Packages
Edit `config/packages.list`. Add one package per line.

## Changing Wallpaper
Replace `branding/wallpapers/astrakernel-wallpaper.png` with your desired wallpaper. The `setup-desktop.sh` script applies it.

## Customizing Welcome App
Edit `apps/welcome/astrakernel-welcome.py`. It is a GTK+ 3 Python application.

## Customizing GRUB/Plymouth
Place your resources in `branding/grub` or `branding/plymouth`. Then modify `chroot/customizations/setup-branding.sh` to copy and apply them using standard Debian tools (`plymouth-set-default-theme`, updating `/etc/default/grub`).

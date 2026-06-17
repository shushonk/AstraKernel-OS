TARGET = AstraKernelOS
CC = i686-elf-gcc
NASM = nasm

CFLAGS = -std=gnu99 -ffreestanding -O2 -Wall -Wextra -fno-exceptions -fno-stack-protector
LDFLAGS = -ffreestanding -O2 -nostdlib -lgcc

OBJS = boot/boot.o kernel/kernel.o kernel/vga.o

all: $(TARGET).iso

boot/boot.o: boot/boot.asm
	@mkdir -p boot
	$(NASM) -f elf32 boot/boot.asm -o boot/boot.o

kernel/%.o: kernel/%.c
	@mkdir -p kernel
	$(CC) -c $< -o $@ $(CFLAGS)

$(TARGET).bin: $(OBJS) linker.ld
	$(CC) -T linker.ld -o $@ $(OBJS) $(LDFLAGS)

$(TARGET).iso: $(TARGET).bin grub.cfg
	@mkdir -p isodir/boot/grub
	@cp $(TARGET).bin isodir/boot/astrakernel.bin
	@cp grub.cfg isodir/boot/grub/grub.cfg
	@grub-mkrescue -o $(TARGET).iso isodir

run: $(TARGET).iso
	qemu-system-i386 -cdrom $(TARGET).iso -m 128M -serial stdio

clean:
	rm -rf boot/*.o kernel/*.o *.bin *.iso isodir

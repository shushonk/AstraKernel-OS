#include <stdint.h>
#include "vga.h"

void kernel_main(uint32_t magic, uint32_t addr) {
    (void)addr;
    vga_initialize();

    if (magic != 0x2BADB002) {
        vga_writestring("ERROR: Invalid Multiboot Magic Number!\n");
        return;
    }

    vga_writestring("Welcome to AstraKernel OS\n");
    vga_writestring("Real kernel loaded successfully\n");
    vga_writestring("Type help to begin\n");
}

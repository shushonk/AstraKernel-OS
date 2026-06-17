#ifndef VGA_H
#define VGA_H

#include <stddef.h>
#include <stdint.h>

void vga_initialize(void);
void vga_putchar(char c);
void vga_writestring(const char* data);

#endif

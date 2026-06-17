#!/usr/bin/env python3
import gi
try:
    gi.require_version('Gtk', '3.0')
    from gi.repository import Gtk
except ValueError:
    print("GTK not found. Skipping UI.")
    exit(0)

class Welcome(Gtk.Window):
    def __init__(self):
        super().__init__(title="Welcome to AstraKernel OS")
        self.set_default_size(500, 350)
        self.set_border_width(10)
        
        lbl = Gtk.Label(label="Welcome to AstraKernel OS\nAuthor: Shashank V\nVersion: v0.1")
        self.add(lbl)

if __name__ == "__main__":
    win = Welcome()
    win.connect("destroy", Gtk.main_quit)
    win.show_all()
    Gtk.main()

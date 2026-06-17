#!/usr/bin/env python3
import gi
try:
    gi.require_version('Gtk', '3.0')
    from gi.repository import Gtk
except ValueError:
    print("GTK not found. Skipping UI.")
    exit(0)

class ControlCenter(Gtk.Window):
    def __init__(self):
        super().__init__(title="Astra Control Center")
        self.set_default_size(600, 400)
        self.set_border_width(10)
        
        lbl = Gtk.Label(label="Astra Control Center\nSystem Info, Appearance, Developer Tools")
        self.add(lbl)

if __name__ == "__main__":
    win = ControlCenter()
    win.connect("destroy", Gtk.main_quit)
    win.show_all()
    Gtk.main()

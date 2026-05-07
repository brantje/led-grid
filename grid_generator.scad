// =======================
// PARAMETERS
// =======================

// LED layout
led_count_x = 16;
led_count_y = 16;

// Distance between leds in mm
pitch = 10;

// Grid properties
wall_thickness = 1.2;
wall_height = 8;

// Base
base_thickness = 0.6;

// =======================
// BASE WALL EXTENSION SETTINGS
// =======================

enable_base_wall_extension = false;
base_wall_extension_height = 50; // 5cm

// Modes:
// "all"    -> full frame
// "corner" -> top + left
// "single" -> only one wall
base_wall_mode = "corner";

// Only used when base_wall_mode = "single"
// Options: "left", "right", "top", "bottom"
single_wall = "left";

// =======================
// DERIVED
// =======================
total_x = led_count_x * pitch;
total_y = led_count_y * pitch;

// =======================
// MODULES
// =======================

module base() {
    cube([total_x, total_y, base_thickness]);
}

// =======================
// BASE WALL EXTENSION
// =======================

module base_walls_extension() {

    if (enable_base_wall_extension) {

        // -----------------------
        // FULL FRAME
        // -----------------------
        if (base_wall_mode == "all") {

            // left
            translate([0, 0, base_thickness])
                cube([wall_thickness, total_y, base_wall_extension_height]);

            // right
            translate([total_x - wall_thickness, 0, base_thickness])
                cube([wall_thickness, total_y, base_wall_extension_height]);

            // bottom
            translate([0, 0, base_thickness])
                cube([total_x, wall_thickness, base_wall_extension_height]);

            // top
            translate([0, total_y - wall_thickness, base_thickness])
                cube([total_x, wall_thickness, base_wall_extension_height]);
        }

        // -----------------------
        // CORNER (TOP + LEFT)
        // -----------------------
        else if (base_wall_mode == "corner") {

            // left
            translate([0, 0, base_thickness])
                cube([wall_thickness, total_y, base_wall_extension_height]);

            // top
            translate([0, total_y - wall_thickness, base_thickness])
                cube([total_x, wall_thickness, base_wall_extension_height]);
        }

        // -----------------------
        // SINGLE WALL MODE
        // -----------------------
        else if (base_wall_mode == "single") {

            if (single_wall == "left") {
                translate([0, 0, base_thickness])
                    cube([wall_thickness, total_y, base_wall_extension_height]);
            }

            else if (single_wall == "right") {
                translate([total_x - wall_thickness, 0, base_thickness])
                    cube([wall_thickness, total_y, base_wall_extension_height]);
            }

            else if (single_wall == "top") {
                translate([0, total_y - wall_thickness, base_thickness])
                    cube([total_x, wall_thickness, base_wall_extension_height]);
            }

            else if (single_wall == "bottom") {
                translate([0, 0, base_thickness])
                    cube([total_x, wall_thickness, base_wall_extension_height]);
            }
        }
    }
}

// =======================
// GRID (UNCHANGED)
// =======================

module grid() {

    for (x = [0 : led_count_x]) {

        is_edge = (x == 0 || x == led_count_x);
        w = is_edge ? wall_thickness/2 : wall_thickness;

        x_pos = x * pitch - w/2;

        translate([x_pos, 0, base_thickness])
            cube([w, total_y, wall_height]);
    }

    for (y = [0 : led_count_y]) {

        is_edge = (y == 0 || y == led_count_y);
        w = is_edge ? wall_thickness/2 : wall_thickness;

        y_pos = y * pitch - w/2;

        translate([0, y_pos, base_thickness])
            cube([total_x, w, wall_height]);
    }
}

// =======================
// ASSEMBLY
// =======================

union() {
    base();
    grid();
    base_walls_extension();
}

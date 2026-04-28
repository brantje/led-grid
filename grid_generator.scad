// =======================
// PARAMETERS
// =======================

// LED layout
led_count_x = 16; // Number of LEDs 
led_count_y = 16; // Number of LEDs 

// Distance between leds in mm. 40 leds/m = 28, 60 leds/m = 12
pitch = 12;

// Grid properties
wall_thickness = 1.2;   // Thickness in mm
wall_height = 8;       // Height in mm

// Base
base_thickness = 0.6; // Base thickness in mm;

// =======================
// DERIVED
// =======================
half_wall = wall_thickness / 2;

total_x = led_count_x * pitch;
total_y = led_count_y  * pitch;

// =======================
// MODULES
// =======================

module base() {
    cube([total_x, total_y, base_thickness]);
}

module grid() {

    // Vertical walls
    for (x = [0 : led_count_x]) {

        is_edge = (x == 0 || x == led_count_x);
        w = is_edge ? half_wall : wall_thickness;

        // shift so outer edges sit flush
        x_pos = x * pitch - w/2;

        translate([x_pos, 0, base_thickness])
            cube([w, total_y, wall_height]);
    }

    // Horizontal walls
    for (y = [0 : led_count_y]) {

        is_edge = (y == 0 || y == led_count_y);
        w = is_edge ? half_wall : wall_thickness;

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
}
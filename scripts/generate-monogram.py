#!/usr/bin/env python3
"""
Regenerates the pixel-art monogram used in profile/hero.svg's identity block.

Usage:
    python3 scripts/generate-monogram.py

Prints an SVG <rect> fragment to stdout — paste it into the
<g transform="translate(90,182)"> block inside profile/hero.svg,
replacing what's there now.

To change the letter, edit the `grid` construction below (it currently
draws a block "N": two solid side bars + a diagonal stroke). To change
the color ramp, edit c1 / c2 (hex, cyan -> blue by default).
"""

ROWS, COLS = 15, 13
CELL = 8  # px per cell

C1 = "22d3ee"  # top-left color
C2 = "3b82f6"  # bottom-right color


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return "#%02x%02x%02x" % rgb


def lerp_color(t, c1, c2):
    return rgb_to_hex(tuple(round(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))


def build_grid(rows, cols):
    grid = [[0] * cols for _ in range(rows)]
    for r in range(rows):
        grid[r][0] = 1
        grid[r][1] = 1
        grid[r][cols - 2] = 1
        grid[r][cols - 1] = 1
        center = 2 + (r / (rows - 1)) * (cols - 4)
        for c in (int(center), int(center) + 1):
            if 2 <= c <= cols - 3:
                grid[r][c] = 1
    return grid


def main():
    c1_rgb, c2_rgb = hex_to_rgb(C1), hex_to_rgb(C2)
    grid = build_grid(ROWS, COLS)

    rects = []
    for r in range(ROWS):
        t = r / (ROWS - 1)
        color = lerp_color(t, c1_rgb, c2_rgb)
        for c in range(COLS):
            if grid[r][c]:
                x, y = c * CELL, r * CELL
                rects.append(f'<rect x="{x}" y="{y}" width="{CELL - 1}" height="{CELL - 1}" fill="{color}"/>')

    print(f"<!-- {ROWS}x{COLS} grid, {COLS * CELL}x{ROWS * CELL}px, {len(rects)} cells -->")
    print("\n      ".join(rects))


if __name__ == "__main__":
    main()

import os
import sys
from PIL import Image

# Ensure local module import works when running this script directly
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

try:
    import png_to_svg  # refers to the local png_to_svg.py
except Exception:
    png_to_svg = None

DEFAULT_SIZES = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]

def png_to_ico(png_path: str, ico_path: str = None, sizes: list = None, generate_svg: bool = False) -> bool:
    if sizes is None:
        sizes = DEFAULT_SIZES
    if ico_path is None:
        ico_path = "favicon.ico"

    # Optionally generate SVG using the existing module
    if generate_svg and png_to_svg is not None:
        svg_path = os.path.splitext(png_path)[0] + ".svg"
        try:
            png_to_svg.png_to_svg(png_path, svg_path)
        except Exception as e:
            print(f"⚠ Warning: SVG generation failed: {e}")

    try:
        im = Image.open(png_path).convert("RGBA")

        # Remove near-white background by setting those pixels fully transparent
        WHITE_TOLERANCE = 250  # same tolerance as SVG converter
        pixels = list(im.getdata())
        processed_pixels = []
        for (r, g, b, a) in pixels:
            # if already transparent -> keep
            if a == 0:
                processed_pixels.append((0, 0, 0, 0))
                continue
            # treat near-white as background -> make fully transparent
            if r >= WHITE_TOLERANCE and g >= WHITE_TOLERANCE and b >= WHITE_TOLERANCE:
                processed_pixels.append((0, 0, 0, 0))
            else:
                processed_pixels.append((r, g, b, a))

        processed = Image.new("RGBA", im.size)
        processed.putdata(processed_pixels)

        # Pillow requires sizes as a list of tuples for each icon size.
        # But the saved image must be at least as big as largest icon dimension.
        # So we resize and save in-memory images for each size.
        icons = []
        for size in sizes:
            # Prevent upscaling
            if processed.width < size[0] or processed.height < size[1]:
                continue
            icon = processed.copy()
            if icon.size != size:
                icon = icon.resize(size, Image.LANCZOS)
            icons.append(icon)

        if not icons:
            print("❌ Error: No icon sizes could be created from source image (too small?)")
            return False

        # Save all icons to the .ico file
        icons[0].save(ico_path, format="ICO", sizes=[icon.size for icon in icons])
        if os.path.exists(ico_path) and os.path.getsize(ico_path) > 0:
            print(f"✓ ICO successfully created at: {ico_path}")
            return True
        else:
            print("❌ Error: ICO file was not created or is empty")
            return False
    except Exception as e:
        print(f"❌ Error during ICO creation: {e}")
        return False

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Convert PNG to multi-size ICO. Optionally generate SVG via png_to_svg.")
    parser.add_argument("png_file", help="Input PNG file")
    parser.add_argument("--svg", action="store_true", help="Also generate SVG using png_to_svg.py if available")
    args = parser.parse_args()

    png_file = args.png_file

    # Always output favicon.ico
    success = png_to_ico(png_file, ico_path="favicon.ico", generate_svg=args.svg, sizes=[(128, 128)])

    if success:
        # Basic verification of ICO format presence (not full validation)
        final_ico_path = "favicon.ico"
        with open(final_ico_path, "rb") as f:
            header = f.read(4)
            # ICO files start with two reserved bytes (0), then type (1) for icon or (2) for cursor
            if len(header) >= 4 and header[2] in (0, 1, 2):
                print("✓ ICO basic header verification passed")
    # Exit with non-zero on failure for CI usage
    sys.exit(0 if success else 2)

if __name__ == "__main__":
    main()
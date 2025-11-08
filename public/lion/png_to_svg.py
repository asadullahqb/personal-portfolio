from PIL import Image
import svgwrite
import numpy as np
import os
import sys

def png_to_svg(png_path, svg_path):
    # Open and retain the original image
    image = Image.open(png_path).convert('RGBA')
    
    # Convert image to numpy array
    bitmap = np.array(image)
    
    # Create SVG drawing
    dwg = svgwrite.Drawing(svg_path, profile='tiny')
    
    # Find contours and create paths
    height, width, _ = bitmap.shape

    # Tolerance for considering a pixel "white" (near-white)
    WHITE_TOLERANCE = 250  # 0-255; 250 treats very light pixels as background

    for y in range(height):
        for x in range(width):
            r, g, b, a = bitmap[y, x]
            # Skip fully transparent pixels
            if a == 0:
                continue
            # Skip near-white background pixels completely
            if r >= WHITE_TOLERANCE and g >= WHITE_TOLERANCE and b >= WHITE_TOLERANCE:
                continue
            # Add a 1x1 rect with opacity matching the source alpha
            opacity = a / 255.0
            dwg.add(
                dwg.rect(
                    insert=(x, y),
                    size=(1, 1),
                    fill=svgwrite.rgb(r, g, b),
                    opacity=opacity
                )
            )

    # Save SVG
    try:
        dwg.save()
        
        # Verification checks
        if os.path.exists(svg_path):
            file_size = os.path.getsize(svg_path)
            if file_size > 0:
                print(f"✓ SVG successfully created at: {svg_path}")
                print(f"✓ File size: {file_size} bytes")
                return True
            else:
                print("⚠ Warning: SVG file was created but is empty")
                return False
        else:
            print("❌ Error: SVG file was not created")
            return False
            
    except Exception as e:
        print(f"❌ Error during conversion: {str(e)}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python pngToSVG.py <input_png_file>")
        return
    
    png_file = sys.argv[1]
    svg_file = os.path.splitext(png_file)[0] + '.svg'
    
    try:
        success = png_to_svg(png_file, svg_file)
        if success:
            # Optional: Basic SVG validation
            with open(svg_file, 'r') as f:
                content = f.read()
                if content.startswith('<?xml') or '<svg' in content:
                    print("✓ SVG format verification passed")
                else:
                    print("⚠ Warning: File may not be a valid SVG")
    except Exception as e:
        print(f"Error converting file: {str(e)}")

if __name__ == "__main__":
    main()
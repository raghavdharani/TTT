#!/bin/bash
# Script to convert multi-page PDFs to images

# Method 1: Using poppler (recommended)
# First install: brew install poppler
if command -v pdftoppm &> /dev/null; then
    echo "Using pdftoppm to convert PDFs..."
    mkdir -p images
    for pdf in *.pdf; do
        if [ -f "$pdf" ]; then
            base_name=$(basename "$pdf" .pdf)
            echo "Converting $pdf..."
            pdftoppm -png -r 200 "$pdf" "images/${base_name}_page"
            echo "✓ Converted $pdf"
        fi
    done
    echo "\n✓ All PDFs converted! Images saved in 'images' folder"
    echo "  Each page is saved as: [pdfname]_page-01.png, [pdfname]_page-02.png, etc."

# Method 2: Using Python with pdf2image (requires poppler)
elif python3 -c "from pdf2image import convert_from_path" 2>/dev/null; then
    echo "Using Python pdf2image..."
    python3 << 'PYTHON'
from pdf2image import convert_from_path
import os

os.makedirs("images", exist_ok=True)

for pdf_file in [f for f in os.listdir('.') if f.endswith('.pdf')]:
    print(f"Converting {pdf_file}...")
    try:
        images = convert_from_path(pdf_file, dpi=200)
        base_name = os.path.splitext(pdf_file)[0]
        for i, image in enumerate(images, start=1):
            output = f"images/{base_name}_page_{i:02d}.png"
            image.save(output, 'PNG')
        print(f"✓ Converted {len(images)} pages from {pdf_file}")
    except Exception as e:
        print(f"✗ Error: {e}")
        print("  Install poppler: brew install poppler")
PYTHON

# Method 3: Manual instructions
else
    echo "=========================================="
    echo "PDF to Image Conversion Instructions"
    echo "=========================================="
    echo ""
    echo "Option A: Install poppler (recommended)"
    echo "  1. Install Homebrew if not installed: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "  2. Install poppler: brew install poppler"
    echo "  3. Run this script again"
    echo ""
    echo "Option B: Use online tools"
    echo "  - Visit: https://www.ilovepdf.com/pdf-to-jpg"
    echo "  - Upload your PDFs"
    echo "  - Download the converted images"
    echo "  - Save them in the 'images' folder"
    echo ""
    echo "Option C: Use Preview (macOS)"
    echo "  1. Open PDF in Preview"
    echo "  2. File > Export..."
    echo "  3. Format: PNG"
    echo "  4. Save each page separately"
    echo ""
fi



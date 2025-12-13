# Converting Multi-Page PDFs to Images

## Quick Method (if you have Homebrew):

```bash
# Install poppler
brew install poppler

# Run the conversion script
./convert_pdfs.sh
```

This will create an `images/` folder with all pages converted to PNG files.

## Alternative Methods:

### Method 1: Online Tool (Easiest)
1. Go to https://www.ilovepdf.com/pdf-to-jpg or https://www.zamzar.com/convert/pdf-to-png/
2. Upload your 3 PDFs
3. Convert to PNG/JPG
4. Download and save all images to the `images/` folder in this directory

### Method 2: Using Preview (macOS)
1. Open each PDF in Preview
2. For each page:
   - Go to the page
   - File > Export...
   - Format: PNG
   - Save as: `Item Maintenance_page_01.png`, `Item Maintenance_page_02.png`, etc.
3. Save all images in the `images/` folder

### Method 3: Command Line (if poppler installed)
```bash
mkdir -p images
pdftoppm -png -r 200 "Item Maintenance.pdf" "images/Item_Maintenance_page"
pdftoppm -png -r 200 "Item Maintenance-1.pdf" "images/Item_Maintenance-1_page"
pdftoppm -png -r 200 "Item Maintenance-3.pdf" "images/Item_Maintenance-3_page"
```

## After Conversion:

Once you have the images in the `images/` folder, I can analyze them to extract:
- Column names and order
- Sample data values
- Data formatting

Just let me know when the images are ready!

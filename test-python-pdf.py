#!/usr/bin/env python3
"""
Test simple du script Python pour vérifier que tout fonctionne
"""

import os
import sys

# Test des imports
try:
    import pymupdf
    print("✅ PyMuPDF imported successfully, version:", pymupdf.__version__)
except ImportError as e:
    print("❌ PyMuPDF import failed:", e)
    sys.exit(1)

try:
    import pdfplumber
    print("✅ pdfplumber imported successfully")
except ImportError as e:
    print("❌ pdfplumber import failed:", e)
    sys.exit(1)

print("\n🔧 Python PDF processing environment is ready!")
print("📦 Python version:", sys.version)
print("📂 Current working directory:", os.getcwd())

# Test basic PyMuPDF functionality
try:
    # Test if we can create a simple document
    doc = pymupdf.open()  # Create empty document
    page = doc.new_page()  # Add a page
    page.insert_text((72, 72), "Test document", fontsize=12)
    doc.close()
    print("✅ PyMuPDF basic functionality test passed")
except Exception as e:
    print("❌ PyMuPDF functionality test failed:", e)

print("\n🚀 Ready to process PDFs with PyMuPDF + pdfplumber!")
#!/usr/bin/env python3
"""
Fonction Vercel Python pour le traitement de PDFs avec PyMuPDF
Compatible avec le runtime Python de Vercel
"""

import json
import base64
import io
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import tempfile
import os

# Importer les bibliothèques PDF
try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False

def extract_text_pymupdf(pdf_path):
    """Extraction de texte avec PyMuPDF"""
    text = ""
    page_count = 0
    
    try:
        doc = fitz.open(pdf_path)
        page_count = len(doc)
        
        for page_num in range(page_count):
            page = doc[page_num]
            text += page.get_text()
            
        doc.close()
        return text, page_count, "pymupdf"
    except Exception as e:
        print(f"[PYMUPDF_ERROR] {e}")
        return "", 0, "pymupdf_failed"

def extract_text_pdfplumber(pdf_path):
    """Extraction de texte avec pdfplumber"""
    text = ""
    page_count = 0
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            page_count = len(pdf.pages)
            
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                    
        return text, page_count, "pdfplumber"
    except Exception as e:
        print(f"[PDFPLUMBER_ERROR] {e}")
        return "", 0, "pdfplumber_failed"

def convert_to_image_pymupdf(pdf_path):
    """Conversion PDF en image avec PyMuPDF"""
    try:
        doc = fitz.open(pdf_path)
        if len(doc) == 0:
            return "", "no_pages"
        
        # Prendre la première page
        page = doc[0]
        
        # Convertir en image (PNG)
        pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0))  # 2x résolution
        img_data = pix.tobytes("png")
        
        # Encoder en base64
        img_base64 = base64.b64encode(img_data).decode('utf-8')
        
        doc.close()
        return img_base64, "pymupdf_image"
    except Exception as e:
        print(f"[IMAGE_ERROR] {e}")
        return "", "image_failed"

def detect_bank_from_text(text):
    """Détection de banque à partir du texte"""
    text_lower = text.lower()
    
    banks = {
        'bnp': 'BNP Paribas',
        'paribas': 'BNP Paribas',
        'crédit agricole': 'Crédit Agricole',
        'credit agricole': 'Crédit Agricole',
        'société générale': 'Société Générale',
        'societe generale': 'Société Générale',
        'lcl': 'LCL',
        'crédit mutuel': 'Crédit Mutuel',
        'credit mutuel': 'Crédit Mutuel',
        'banque populaire': 'Banque Populaire',
        'caisse d\'épargne': 'Caisse d\'Épargne',
        'caisse d\'epargne': 'Caisse d\'Épargne',
        'hsbc': 'HSBC',
        'la banque postale': 'La Banque Postale',
        'banque postale': 'La Banque Postale',
        'ing': 'ING',
        'boursorama': 'Boursorama',
        'hello bank': 'Hello Bank',
        'n26': 'N26',
        'revolut': 'Revolut',
        'orange bank': 'Orange Bank',
        'fortuneo': 'Fortuneo'
    }
    
    for keyword, bank_name in banks.items():
        if keyword in text_lower:
            return bank_name
    
    return ""

def process_pdf_document(pdf_data, output_mode='hybrid'):
    """
    Traite un document PDF depuis des données binaires
    
    Args:
        pdf_data: Données binaires du PDF
        output_mode: 'text' | 'image' | 'hybrid'
    
    Returns:
        dict: Résultat du traitement
    """
    result = {
        "success": False,
        "extracted_text": "",
        "image_base64": "",
        "metadata": {
            "page_count": 0,
            "text_length": 0,
            "has_text": False,
            "has_image": False,
            "found_keywords": [],
            "keyword_count": 0,
            "processing_method": "unknown",
            "detected_bank": ""
        },
        "error": None
    }
    
    # Créer un fichier temporaire
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(pdf_data)
            temp_pdf_path = temp_file.name
        
        print(f"[VERCEL_PDF] Processing PDF, size: {len(pdf_data)} bytes")
        
        extracted_text = ""
        page_count = 0
        processing_method = "unknown"
        image_base64 = ""
        
        # 1. EXTRACTION DE TEXTE
        if output_mode in ['text', 'hybrid']:
            if PYMUPDF_AVAILABLE:
                extracted_text, page_count, processing_method = extract_text_pymupdf(temp_pdf_path)
                print(f"[VERCEL_PDF] PyMuPDF extracted {len(extracted_text)} chars from {page_count} pages")
            
            # Fallback vers pdfplumber si PyMuPDF échoue
            if not extracted_text and PDFPLUMBER_AVAILABLE:
                extracted_text, page_count, processing_method = extract_text_pdfplumber(temp_pdf_path)
                print(f"[VERCEL_PDF] pdfplumber extracted {len(extracted_text)} chars from {page_count} pages")
        
        # 2. CONVERSION EN IMAGE
        if output_mode in ['image', 'hybrid'] and PYMUPDF_AVAILABLE:
            image_base64, image_method = convert_to_image_pymupdf(temp_pdf_path)
            if image_base64:
                processing_method += f"_with_{image_method}"
                print(f"[VERCEL_PDF] Image converted, base64 length: {len(image_base64)}")
        
        # 3. DÉTECTION DE BANQUE
        detected_bank = ""
        if extracted_text:
            detected_bank = detect_bank_from_text(extracted_text)
            print(f"[VERCEL_PDF] Detected bank: {detected_bank or 'none'}")
        
        # 4. ANALYSE DES MOTS-CLÉS
        text_lower = extracted_text.lower()
        banking_keywords = [
            'bnp', 'paribas', 'crédit agricole', 'société générale', 'lcl',
            'crédit mutuel', 'banque populaire', 'caisse d\'épargne', 'hsbc',
            'la banque postale', 'ing', 'boursorama', 'hello bank', 'n26',
            'revolut', 'orange bank', 'fortuneo', 'relevé', 'compte', 'solde',
            'virement', 'prélèvement', 'carte bancaire', 'transaction', 'euro',
            '€', 'débit', 'crédit', 'facture', 'montant', 'total'
        ]
        
        found_keywords = [kw for kw in banking_keywords if kw in text_lower]
        
        # 5. ASSEMBLAGE DU RÉSULTAT
        has_text = len(extracted_text) > 50
        has_image = len(image_base64) > 1000
        
        result.update({
            "success": has_text or has_image or len(found_keywords) > 0,
            "extracted_text": extracted_text,
            "image_base64": image_base64,
            "metadata": {
                "page_count": page_count,
                "text_length": len(extracted_text),
                "has_text": has_text,
                "has_image": has_image,
                "found_keywords": found_keywords,
                "keyword_count": len(found_keywords),
                "processing_method": processing_method,
                "detected_bank": detected_bank
            }
        })
        
        print(f"[VERCEL_PDF] Processing completed successfully: {result['success']}")
        
    except Exception as e:
        result["error"] = str(e)
        result["metadata"]["processing_method"] = "error"
        print(f"[VERCEL_PDF] Error processing PDF: {e}")
    
    finally:
        # Nettoyer le fichier temporaire
        try:
            if 'temp_pdf_path' in locals() and os.path.exists(temp_pdf_path):
                os.unlink(temp_pdf_path)
        except Exception as e:
            print(f"[VERCEL_PDF] Cleanup error: {e}")
    
    return result

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Lire le contenu de la requête
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parser JSON ou traiter directement les données PDF
            try:
                # Essayer de parser comme JSON
                request_data = json.loads(post_data.decode('utf-8'))
                pdf_base64 = request_data.get('pdf_base64', '')
                output_mode = request_data.get('output_mode', 'hybrid')
                
                if not pdf_base64:
                    raise ValueError("pdf_base64 is required")
                
                # Décoder le PDF
                pdf_data = base64.b64decode(pdf_base64)
                
            except (json.JSONDecodeError, UnicodeDecodeError):
                # Traiter comme données PDF directes
                pdf_data = post_data
                output_mode = 'hybrid'
            
            # Traiter le PDF
            result = process_pdf_document(pdf_data, output_mode)
            
            # Retourner la réponse
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            print(f"[VERCEL_HANDLER] Error: {e}")
            
            # Retourner une erreur
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            error_response = {
                "success": False,
                "error": str(e),
                "extracted_text": "",
                "image_base64": "",
                "metadata": {
                    "page_count": 0,
                    "text_length": 0,
                    "has_text": False,
                    "has_image": False,
                    "found_keywords": [],
                    "keyword_count": 0,
                    "processing_method": "handler_error",
                    "detected_bank": ""
                }
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        # Gérer les requêtes CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

# Fonction handler moderne pour Vercel
def handler(request):
    """Handler moderne pour Vercel Functions"""
    import json
    
    # Gérer CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }
    
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parser la requête
        if hasattr(request, 'json') and request.json:
            request_data = request.json
        elif hasattr(request, 'body'):
            request_data = json.loads(request.body.decode('utf-8'))
        else:
            raise ValueError("No request data")
        
        pdf_base64 = request_data.get('pdf_base64', '')
        output_mode = request_data.get('output_mode', 'hybrid')
        
        if not pdf_base64:
            raise ValueError("pdf_base64 is required")
        
        # Décoder le PDF
        pdf_data = base64.b64decode(pdf_base64)
        
        # Traiter le PDF
        result = process_pdf_document(pdf_data, output_mode)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(result)
        }
        
    except Exception as e:
        print(f"[VERCEL_HANDLER_MODERN] Error: {e}")
        
        error_response = {
            "success": False,
            "error": str(e),
            "extracted_text": "",
            "image_base64": "",
            "metadata": {
                "page_count": 0,
                "text_length": 0,
                "has_text": False,
                "has_image": False,
                "found_keywords": [],
                "keyword_count": 0,
                "processing_method": "modern_handler_error",
                "detected_bank": ""
            }
        }
        
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps(error_response)
        }
from http.server import BaseHTTPRequestHandler
import json
import base64
import io
import logging

# Import des vraies librairies Python avec fallback
PYTHON_LIBS_AVAILABLE = False
pdfplumber = None
convert_from_bytes = None
Image = None

try:
    import pdfplumber
    PYTHON_LIBS_AVAILABLE = True
    logging.info("pdfplumber imported successfully")
except ImportError as e:
    logging.error(f"pdfplumber not available: {e}")

try:
    from pdf2image import convert_from_bytes
    from PIL import Image
    logging.info("pdf2image and PIL imported successfully")
except ImportError as e:
    logging.error(f"pdf2image/PIL not available: {e}")
    # On peut quand même faire l'extraction de texte sans les images

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Extraction texte du PDF avec pdfplumber"""
        
        try:
            if not pdfplumber:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {"success": False, "error": "pdfplumber library not available"}
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
                return
            
            # Lire les données POST
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {"success": False, "error": "No data received"}
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
                return
                
            pdf_data = self.rfile.read(content_length)
            
            # Vérifier que c'est bien un PDF
            if not pdf_data.startswith(b'%PDF'):
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {"success": False, "error": "Invalid PDF format"}
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
                return
            
            logging.info(f"Processing PDF, size: {len(pdf_data)} bytes")
            
            # 1. EXTRACTION TEXTE avec pdfplumber (très précis)
            extracted_text = ""
            page_count = 0
            
            try:
                with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
                    page_count = len(pdf.pages)
                    logging.info(f"PDF has {page_count} pages")
                    
                    # Extraire texte des 3 premières pages maximum
                    for i, page in enumerate(pdf.pages[:3]):
                        page_text = page.extract_text()
                        if page_text and page_text.strip():
                            extracted_text += f"PAGE {i+1}:\n{page_text}\n\n"
                    
                    logging.info(f"Extracted text length: {len(extracted_text)}")
                            
            except Exception as text_error:
                logging.error(f"Text extraction error: {text_error}")
                extracted_text = ""
            
            # 2. CONVERSION IMAGE avec pdf2image (si disponible)
            image_base64 = ""
            
            if convert_from_bytes and Image:
                try:
                    # Convertir première page en image haute qualité
                    images = convert_from_bytes(
                        pdf_data,
                        first_page=1,
                        last_page=1,
                        dpi=150,  # Bonne qualité sans être trop lourd
                        fmt='PNG'
                    )
                    
                    if images:
                        # Redimensionner si trop grand (optimisation)
                        img = images[0]
                        if img.width > 2048 or img.height > 2048:
                            img.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
                        
                        # Convertir en base64
                        img_buffer = io.BytesIO()
                        img.save(img_buffer, format='PNG', optimize=True)
                        image_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
                        
                        logging.info(f"Image converted, base64 length: {len(image_base64)}")
                    
                except Exception as img_error:
                    logging.error(f"Image conversion error: {img_error}")
                    image_base64 = ""
            else:
                logging.info("pdf2image/PIL not available, skipping image conversion")
            
            # 3. ANALYSE ET VALIDATION
            has_text = len(extracted_text.strip()) > 50
            has_image = len(image_base64) > 1000
            
            # Rechercher des mots-clés bancaires dans le texte
            banking_keywords = [
                'bnp', 'paribas', 'crédit agricole', 'société générale', 'lcl',
                'crédit mutuel', 'banque populaire', 'caisse d\'épargne', 'hsbc',
                'la banque postale', 'ing', 'boursorama', 'hello bank', 'n26',
                'revolut', 'orange bank', 'fortuneo', 'relevé', 'compte', 'solde',
                'virement', 'prélèvement', 'carte bancaire', 'transaction'
            ]
            
            text_lower = extracted_text.lower()
            found_keywords = [kw for kw in banking_keywords if kw in text_lower]
            
            # 4. RÉPONSE STRUCTURÉE
            response = {
                "success": True,
                "processing_method": "python_native",
                "extracted_text": extracted_text,
                "image_base64": image_base64,
                "metadata": {
                    "page_count": page_count,
                    "text_length": len(extracted_text),
                    "has_text": has_text,
                    "has_image": has_image,
                    "image_size": len(image_base64),
                    "found_keywords": found_keywords,
                    "keyword_count": len(found_keywords)
                },
                "quality_indicators": {
                    "text_extraction_success": has_text,
                    "image_conversion_success": has_image,
                    "banking_keywords_found": len(found_keywords) > 0,
                    "processing_complete": has_text or has_image
                }
            }
            
            # Réponse finale
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            logging.error(f"PDF processing error: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json') 
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {"success": False, "error": str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Health check et test des dépendances"""
        status = {
            "service": "pdf-processor",
            "status": "healthy",
            "pdfplumber_available": bool(pdfplumber),
            "pdf2image_available": bool(convert_from_bytes),
            "available_methods": []
        }
        
        if pdfplumber:
            status["available_methods"].append("text_extraction")
        if convert_from_bytes:
            status["available_methods"].append("image_conversion")
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(status).encode('utf-8'))
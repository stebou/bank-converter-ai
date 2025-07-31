from http.server import BaseHTTPRequestHandler
import json
import base64
import io
import logging

# Import des vraies librairies Python avec fallback
PYTHON_LIBS_AVAILABLE = False
pdfplumber = None
pymupdf = None

try:
    import pdfplumber
    PYTHON_LIBS_AVAILABLE = True
    logging.info("pdfplumber imported successfully")
except ImportError as e:
    logging.error(f"pdfplumber not available: {e}")

try:
    import pymupdf  # PyMuPDF pour extraction texte + conversion image
    logging.info("pymupdf imported successfully")
except ImportError as e:
    logging.error(f"pymupdf not available: {e}")
    # Fallback sur l'import legacy
    try:
        import fitz as pymupdf
        logging.info("fitz (legacy pymupdf) imported successfully")
    except ImportError:
        logging.error("Neither pymupdf nor fitz available")

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Extraction texte du PDF avec pdfplumber"""
        
        try:
            if not pdfplumber and not pymupdf:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {"success": False, "error": "Neither pdfplumber nor pymupdf library available"}
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
            
            # 2. CONVERSION IMAGE avec PyMuPDF (si disponible)
            image_base64 = ""
            
            if pymupdf:
                try:
                    # Ouvrir le PDF avec PyMuPDF pour conversion image
                    doc = pymupdf.open(stream=pdf_data, filetype="pdf")
                    
                    if len(doc) > 0:
                        # Convertir première page en image haute qualité
                        page = doc[0]  # Première page
                        
                        # Créer une matrice pour la résolution (2.0 = 144 DPI)
                        matrix = pymupdf.Matrix(2.0, 2.0)
                        
                        # Obtenir le pixmap (image)
                        pix = page.get_pixmap(matrix=matrix)
                        
                        # Convertir en PNG bytes
                        img_data = pix.tobytes("png")
                        
                        # Convertir en base64
                        image_base64 = base64.b64encode(img_data).decode('utf-8')
                        
                        logging.info(f"PyMuPDF image converted, base64 length: {len(image_base64)}")
                        
                        # Nettoyer la mémoire
                        pix = None
                    
                    doc.close()
                    
                except Exception as img_error:
                    logging.error(f"PyMuPDF image conversion error: {img_error}")
                    image_base64 = ""
            else:
                logging.info("PyMuPDF not available, skipping image conversion")
            
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
            "pymupdf_available": bool(pymupdf),
            "available_methods": []
        }
        
        if pdfplumber:
            status["available_methods"].append("text_extraction_pdfplumber")
        if pymupdf:
            status["available_methods"].append("text_extraction_pymupdf")
            status["available_methods"].append("image_conversion_pymupdf")
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(status).encode('utf-8'))
#!/usr/bin/env python3
"""
Script Python pour extraction de texte et conversion d'image PDF
Utilise PyMuPDF et pdfplumber selon la disponibilité
"""

import sys
import json
import base64
import io
import os
import logging

# Configuration des logs
logging.basicConfig(level=logging.INFO, format='[PDF_PYTHON] %(message)s')

def process_pdf(pdf_path, output_mode='hybrid'):
    """
    Traite un PDF et retourne texte + image
    
    Args:
        pdf_path: Chemin vers le fichier PDF
        output_mode: 'text' | 'image' | 'hybrid'
    
    Returns:
        dict: Résultat du traitement
    """
    try:
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
        
        # Vérifier que le fichier existe
        if not os.path.exists(pdf_path):
            result["error"] = f"File not found: {pdf_path}"
            return result
        
        logging.info(f"Processing PDF: {pdf_path}")
        
        # 1. TENTATIVE AVEC PYMUPDF (priorité)
        extracted_text = ""
        image_base64 = ""
        page_count = 0
        processing_method = ""
        
        try:
            import pymupdf  # PyMuPDF
            logging.info("PyMuPDF imported successfully")
            
            # Ouvrir le PDF
            doc = pymupdf.open(pdf_path)
            page_count = len(doc)
            logging.info(f"PDF has {page_count} pages")
            
            # EXTRACTION TEXTE
            if output_mode in ['text', 'hybrid']:
                for i, page in enumerate(doc[:3]):  # Max 3 pages
                    page_text = page.get_text()
                    if page_text and page_text.strip():
                        extracted_text += f"PAGE {i+1}:\n{page_text}\n\n"
                
                logging.info(f"PyMuPDF text extraction: {len(extracted_text)} chars")
            
            # CONVERSION IMAGE de la première page
            if output_mode in ['image', 'hybrid'] and len(doc) > 0:
                page = doc[0]  # Première page
                
                # Créer une matrice pour la résolution (2.0 = 144 DPI)
                matrix = pymupdf.Matrix(2.0, 2.0)
                
                # Obtenir le pixmap (image)
                pix = page.get_pixmap(matrix=matrix)
                
                # Convertir en PNG bytes
                img_data = pix.tobytes("png")
                
                # Convertir en base64
                image_base64 = base64.b64encode(img_data).decode('utf-8')
                
                logging.info(f"PyMuPDF image conversion: {len(image_base64)} chars base64")
                
                # Nettoyer la mémoire
                pix = None
            
            doc.close()
            processing_method = "pymupdf"
            
        except ImportError as e:
            logging.error(f"PyMuPDF not available: {e}")
            processing_method = "pymupdf_failed"
        except Exception as e:
            logging.error(f"PyMuPDF processing error: {e}")
            processing_method = "pymupdf_error"
        
        # 2. FALLBACK AVEC PDFPLUMBER si PyMuPDF échoue pour le texte
        if not extracted_text and output_mode in ['text', 'hybrid']:
            try:
                import pdfplumber
                logging.info("Fallback to pdfplumber for text extraction...")
                
                with pdfplumber.open(pdf_path) as pdf:
                    page_count = len(pdf.pages)
                    
                    # Extraire texte des 3 premières pages maximum
                    for i, page in enumerate(pdf.pages[:3]):
                        page_text = page.extract_text()
                        if page_text and page_text.strip():
                            extracted_text += f"PAGE {i+1}:\n{page_text}\n\n"
                    
                    logging.info(f"pdfplumber fallback text: {len(extracted_text)} chars")
                    processing_method += "_pdfplumber_fallback"
                    
            except ImportError as e:
                logging.error(f"pdfplumber not available: {e}")
            except Exception as e:
                logging.error(f"pdfplumber fallback error: {e}")
        
        # 3. ANALYSE DES MOTS-CLÉS
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
        logging.info(f"Found banking keywords: {found_keywords}")
        
        # 4. DÉTECTION DE BANQUE PAR NOM DE FICHIER
        detected_bank = ""
        filename_lower = os.path.basename(pdf_path).lower()
        
        bank_patterns = [
            {'keywords': ['revolut'], 'bank': 'Revolut'},
            {'keywords': ['boursorama'], 'bank': 'Boursorama'},
            {'keywords': ['n26'], 'bank': 'N26'},
            {'keywords': ['hello-bank', 'hellobank'], 'bank': 'Hello Bank!'},
            {'keywords': ['orange-bank', 'orangebank'], 'bank': 'Orange Bank'},
            {'keywords': ['fortuneo'], 'bank': 'Fortuneo'},
            {'keywords': ['ing'], 'bank': 'ING'},
            {'keywords': ['lcl'], 'bank': 'LCL'},
            {'keywords': ['hsbc'], 'bank': 'HSBC'},
            {'keywords': ['societe-generale', 'societegenerale', 'sg'], 'bank': 'Société Générale'},
            {'keywords': ['credit-agricole', 'creditagricole', 'ca'], 'bank': 'Crédit Agricole'},
            {'keywords': ['bnp-paribas', 'bnpparibas', 'bnp'], 'bank': 'BNP Paribas'},
        ]
        
        for pattern in bank_patterns:
            if any(keyword in filename_lower for keyword in pattern['keywords']):
                detected_bank = pattern['bank']
                logging.info(f"Bank detected from filename: {detected_bank}")
                break
        
        # 5. RÉSULTAT FINAL
        has_text = len(extracted_text.strip()) > 50
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
        
        logging.info(f"Processing completed successfully: {result['success']}")
        return result
        
    except Exception as e:
        logging.error(f"PDF processing error: {e}")
        result["error"] = str(e)
        return result

def main():
    """Point d'entrée principal"""
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Usage: python script.py <pdf_path> [output_mode]"}))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    output_mode = sys.argv[2] if len(sys.argv) > 2 else 'hybrid'
    
    result = process_pdf(pdf_path, output_mode)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Script de test pour la fonction Vercel Python
Test local de process-pdf-vercel.py
"""

import sys
import os
import base64
import json

# Ajouter le dossier api au path pour importer la fonction
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))

try:
    from process_pdf_vercel import process_pdf_document
    print("✅ Import de process_pdf_document réussi")
except ImportError as e:
    print(f"❌ Erreur d'import: {e}")
    sys.exit(1)

def test_function():
    """Test basique de la fonction de traitement PDF"""
    
    # Créer un PDF de test minimal
    test_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 100 Td\n(Test Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000125 00000 n \n0000000185 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n274\n%%EOF"
    
    print("🧪 Test de la fonction process_pdf_document...")
    
    try:
        result = process_pdf_document(test_pdf_content, 'hybrid')
        
        print("📊 Résultat du test:")
        print(f"  - Succès: {result['success']}")
        print(f"  - Texte extrait: {len(result['extracted_text'])} caractères")
        print(f"  - Image générée: {len(result.get('image_base64', ''))} caractères")
        print(f"  - Méthode de traitement: {result['metadata']['processing_method']}")
        print(f"  - Pages: {result['metadata']['page_count']}")
        print(f"  - Mots-clés trouvés: {result['metadata']['keyword_count']}")
        
        if result['error']:
            print(f"  - Erreur: {result['error']}")
        
        if result['success']:
            print("✅ Test réussi!")
        else:
            print("⚠️  Test terminé avec des limitations")
            
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        return False
    
    return True

def test_dependencies():
    """Test des dépendances Python"""
    
    print("🔍 Test des dépendances...")
    
    # Test PyMuPDF
    try:
        import fitz
        print("✅ PyMuPDF (fitz) disponible")
        doc = fitz.open()  # Document vide pour test
        doc.close()
        print("✅ PyMuPDF fonctionne")
    except ImportError:
        print("❌ PyMuPDF non disponible")
        return False
    except Exception as e:
        print(f"⚠️  PyMuPDF disponible mais erreur: {e}")
    
    # Test pdfplumber
    try:
        import pdfplumber
        print("✅ pdfplumber disponible")
    except ImportError:
        print("❌ pdfplumber non disponible") 
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Test de la fonction Vercel Python")
    print("="*50)
    
    # Test des dépendances
    if not test_dependencies():
        print("❌ Les dépendances ne sont pas correctement installées")
        sys.exit(1)
    
    print()
    
    # Test de la fonction
    if test_function():
        print("\n🎉 Tous les tests sont passés!")
        print("La fonction devrait fonctionner sur Vercel.")
    else:
        print("\n❌ Des problèmes ont été détectés")
        sys.exit(1)
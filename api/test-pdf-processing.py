from http.server import BaseHTTPRequestHandler
import json
import logging

# Test simple pour vérifier les dépendances Python
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Test des dépendances Python"""
        
        # Tests des imports
        test_results = {
            "service": "pdf-processing-test",
            "python_version": "available",
            "tests": {}
        }
        
        # Test pdfplumber
        try:
            import pdfplumber
            test_results["tests"]["pdfplumber"] = {
                "status": "success",
                "version": getattr(pdfplumber, '__version__', 'unknown')
            }
        except ImportError as e:
            test_results["tests"]["pdfplumber"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Test pymupdf
        try:
            import pymupdf
            test_results["tests"]["pymupdf"] = {
                "status": "success",
                "version": getattr(pymupdf, 'version', 'unknown')
            }
        except ImportError:
            try:
                import fitz
                test_results["tests"]["pymupdf"] = {
                    "status": "success (legacy)",
                    "version": getattr(fitz, 'version', 'unknown')
                }
            except ImportError as e:
                test_results["tests"]["pymupdf"] = {
                    "status": "error",
                    "error": str(e)
                }
        
        # Test base64
        try:
            import base64
            test_results["tests"]["base64"] = {"status": "success"}
        except ImportError as e:
            test_results["tests"]["base64"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Test io
        try:
            import io
            test_results["tests"]["io"] = {"status": "success"}
        except ImportError as e:
            test_results["tests"]["io"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Déterminer le statut global
        all_success = all(test["status"].startswith("success") for test in test_results["tests"].values())
        test_results["overall_status"] = "ready" if all_success else "issues_detected"
        
        # Réponse
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        self.wfile.write(json.dumps(test_results, indent=2).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
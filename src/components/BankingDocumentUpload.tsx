'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Loader2, 
  AlertTriangle,
  X,
  Receipt,
  Building2,
  CreditCard
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import '../styles/fonts.css';

interface BankingDocumentUploadProps {
  onDocumentUploaded?: (document: any) => void;
}

const BankingDocumentUpload: React.FC<BankingDocumentUploadProps> = ({
  onDocumentUploaded
}) => {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<any | null>(null);

  const documentTypes = [
    { icon: Receipt, label: 'Factures', desc: 'Factures clients et fournisseurs' },
    { icon: Building2, label: 'Relevés', desc: 'Relevés bancaires d\'entreprise' },
    { icon: CreditCard, label: 'Extraits', desc: 'Extraits de compte professionnels' }
  ];

  const processDocumentWithFile = useCallback(async (fileToProcess: File) => {
    if (!fileToProcess || !user) return;

    setProcessing(true);
    setError(null);
    setProcessingStep('Envoi du document...');

    const formData = new FormData();
    formData.append('file', fileToProcess);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setProcessingStep('Analyse IA en cours...');
        
        // Simulation du processus d'analyse
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setUploadSuccess(true);
        setUploadedDocument(result);
        setFile(null);
        // Ne pas déclencher automatiquement la popup - juste notifier qu'un document a été uploadé
        // onDocumentUploaded?.(result);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de l\'upload');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Erreur de connexion');
    } finally {
      setProcessing(false);
      setProcessingStep('');
    }
  }, [user, onDocumentUploaded]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setUploadSuccess(false);
      // Déclencher automatiquement le traitement
      await processDocumentWithFile(selectedFile);
    } else {
      setError('Veuillez sélectionner un fichier PDF valide');
    }
  }, [processDocumentWithFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
      setUploadSuccess(false);
      // Déclencher automatiquement le traitement
      await processDocumentWithFile(droppedFile);
    } else {
      setError('Veuillez déposer un fichier PDF valide');
    }
  }, [processDocumentWithFile]);

  const processDocument = async () => {
    if (!file || !user) return;
    await processDocumentWithFile(file);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setUploadSuccess(false);
  };

  const resetUpload = () => {
    setUploadSuccess(false);
    setUploadedDocument(null);
    setError(null);
  };

  const handleViewResult = () => {
    if (uploadedDocument && onDocumentUploaded) {
      // Déclencher la popup seulement quand l'utilisateur clique sur "Voir le résultat"
      onDocumentUploaded(uploadedDocument);
    }
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#2c3e50] rounded-xl">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold font-montserrat tracking-tight text-[#2c3e50]">
            Upload de Documents
          </h3>
          <p className="text-sm text-[#34495e] font-open-sans">
            Factures et documents financiers
          </p>
        </div>
      </div>

      {/* Types de documents supportés */}
      <div className="grid grid-cols-3 gap-2 mb-4 flex-shrink-0">
        {documentTypes.map((type, index) => (
          <div key={index} className="text-center p-2 bg-[#ecf0f1] rounded-lg">
            <type.icon className="w-4 h-4 text-[#2c3e50] mx-auto mb-1" />
            <p className="text-xs font-medium font-montserrat text-[#2c3e50] leading-tight">
              {type.label}
            </p>
          </div>
        ))}
      </div>

      {/* Zone d'upload */}
      <div className="flex-1 flex flex-col">
        {!processing && !uploadSuccess && (
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 flex-1 flex flex-col justify-center min-h-0 ${
              dragActive 
                ? 'border-[#2c3e50] bg-[#ecf0f1]' 
                : 'border-[#bdc3c7] hover:border-[#2c3e50] hover:bg-[#ecf0f1]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-[#bdc3c7] mx-auto mb-3" />
            <p className="text-[#2c3e50] font-semibold font-montserrat mb-2 text-sm">
              Glissez-déposez votre PDF
            </p>
            <p className="text-sm text-[#34495e] font-open-sans mb-3">
              ou
            </p>
            <label className="inline-block px-4 py-2 bg-[#2c3e50] text-white font-medium font-open-sans rounded-lg hover:bg-[#34495e] transition-colors cursor-pointer text-sm">
              Parcourir
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-[#34495e] font-open-sans mt-2">
              PDF • Max 10MB
            </p>
          </div>
        )}


        {/* Traitement en cours */}
        {processing && (
          <div className="bg-[#ecf0f1] rounded-xl p-4 text-center flex-1 flex flex-col justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#2c3e50] mx-auto mb-3" />
            <p className="font-medium font-montserrat text-[#2c3e50] mb-2 text-sm">
              Traitement en cours...
            </p>
            <p className="text-xs text-[#34495e] font-open-sans">
              {processingStep}
            </p>
          </div>
        )}

        {/* Succès */}
        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center flex-1 flex flex-col justify-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-3" />
            <p className="font-medium font-montserrat text-green-800 mb-2 text-sm">
              Document analysé !
            </p>
            <p className="text-xs text-green-600 font-open-sans mb-4">
              {uploadedDocument?.totalTransactions || 0} transactions extraites
            </p>
            
            <div className="space-y-2">
              <button
                onClick={handleViewResult}
                className="w-full px-3 py-2 bg-[#2c3e50] text-white font-medium font-open-sans rounded-lg hover:bg-[#34495e] transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Voir le résultat
              </button>
              
              <button
                onClick={resetUpload}
                className="w-full px-3 py-2 bg-white text-[#2c3e50] font-medium font-open-sans rounded-lg hover:bg-[#ecf0f1] transition-colors border border-[#bdc3c7] text-sm"
              >
                Nouveau document
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700 font-open-sans">{error}</p>
        </div>
      )}
    </motion.div>
  );
};

export default BankingDocumentUpload;
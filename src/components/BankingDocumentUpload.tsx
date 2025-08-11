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
  CreditCard,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import '../styles/fonts.css';

interface BankingDocumentUploadProps {
  onDocumentUploaded?: (document: any) => void;
}

const BankingDocumentUpload: React.FC<BankingDocumentUploadProps> = ({
  onDocumentUploaded,
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
    {
      icon: Receipt,
      label: 'Factures',
      desc: 'Factures clients et fournisseurs',
    },
    {
      icon: Building2,
      label: 'Relevés',
      desc: "Relevés bancaires d'entreprise",
    },
    {
      icon: CreditCard,
      label: 'Extraits',
      desc: 'Extraits de compte professionnels',
    },
  ];

  const processDocumentWithFile = useCallback(
    async (fileToProcess: File) => {
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
          setError(errorData.error || "Erreur lors de l'upload");
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError('Erreur de connexion');
      } finally {
        setProcessing(false);
        setProcessingStep('');
      }
    },
    [user, onDocumentUploaded]
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile && (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'image/jpeg' || 
          selectedFile.type === 'image/jpg' || 
          selectedFile.type === 'image/png' || 
          selectedFile.type === 'image/webp')) {
        setFile(selectedFile);
        setError(null);
        setUploadSuccess(false);
        // Déclencher automatiquement le traitement
        await processDocumentWithFile(selectedFile);
      } else {
        setError('Veuillez sélectionner un fichier PDF valide');
      }
    },
    [processDocumentWithFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile && (droppedFile.type === 'application/pdf' || 
          droppedFile.type === 'image/jpeg' || 
          droppedFile.type === 'image/jpg' || 
          droppedFile.type === 'image/png' || 
          droppedFile.type === 'image/webp')) {
        setFile(droppedFile);
        setError(null);
        setUploadSuccess(false);
        // Déclencher automatiquement le traitement
        await processDocumentWithFile(droppedFile);
      } else {
        setError('Veuillez déposer un fichier PDF ou image valide (JPEG, PNG, WebP)');
      }
    },
    [processDocumentWithFile]
  );

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
      className="flex h-full flex-col rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-[#2c3e50] p-2">
          <Upload className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-montserrat text-lg font-semibold tracking-tight text-[#2c3e50]">
            Upload de Documents
          </h3>
          <p className="font-open-sans text-sm text-[#34495e]">
            Factures et documents financiers
          </p>
        </div>
      </div>

      {/* Types de documents supportés */}
      <div className="mb-4 grid flex-shrink-0 grid-cols-3 gap-2">
        {documentTypes.map((type, index) => (
          <div key={index} className="rounded-lg bg-[#ecf0f1] p-2 text-center">
            <type.icon className="mx-auto mb-1 h-4 w-4 text-[#2c3e50]" />
            <p className="font-montserrat text-xs font-medium leading-tight text-[#2c3e50]">
              {type.label}
            </p>
          </div>
        ))}
      </div>

      {/* Zone d'upload */}
      <div className="flex flex-1 flex-col">
        {!processing && !uploadSuccess && (
          <div
            className={`flex min-h-0 flex-1 flex-col justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-300 ${
              dragActive
                ? 'border-[#2c3e50] bg-[#ecf0f1]'
                : 'border-[#bdc3c7] hover:border-[#2c3e50] hover:bg-[#ecf0f1]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto mb-3 h-8 w-8 text-[#bdc3c7]" />
            <p className="font-montserrat mb-2 text-sm font-semibold text-[#2c3e50]">
              Glissez-déposez votre document
            </p>
            <p className="font-open-sans mb-3 text-sm text-[#34495e]">ou</p>
            <label className="font-open-sans inline-block cursor-pointer rounded-lg bg-[#2c3e50] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#34495e]">
              Parcourir
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="font-open-sans mt-2 text-xs text-[#34495e]">
              PDF, JPEG, PNG, WebP • Max 10MB
            </p>
          </div>
        )}

        {/* Traitement en cours */}
        {processing && (
          <div className="flex flex-1 flex-col justify-center rounded-xl bg-[#ecf0f1] p-4 text-center">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-[#2c3e50]" />
            <p className="font-montserrat mb-2 text-sm font-medium text-[#2c3e50]">
              Traitement en cours...
            </p>
            <p className="font-open-sans text-xs text-[#34495e]">
              {processingStep}
            </p>
          </div>
        )}

        {/* Succès */}
        {uploadSuccess && (
          <div className="flex flex-1 flex-col justify-center rounded-xl border border-green-200 bg-green-50 p-4 text-center">
            <CheckCircle className="mx-auto mb-3 h-6 w-6 text-green-600" />
            <p className="font-montserrat mb-2 text-sm font-medium text-green-800">
              Document analysé !
            </p>
            <p className="font-open-sans mb-4 text-xs text-green-600">
              {uploadedDocument?.totalTransactions || 0} transactions extraites
            </p>

            <div className="space-y-2">
              <button
                onClick={handleViewResult}
                className="font-open-sans flex w-full items-center justify-center gap-2 rounded-lg bg-[#2c3e50] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#34495e]"
              >
                <CheckCircle className="h-4 w-4" />
                Voir le résultat
              </button>

              <button
                onClick={resetUpload}
                className="font-open-sans w-full rounded-lg border border-[#bdc3c7] bg-white px-3 py-2 text-sm font-medium text-[#2c3e50] transition-colors hover:bg-[#ecf0f1]"
              >
                Nouveau document
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex flex-shrink-0 items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="font-open-sans text-xs text-red-700">{error}</p>
        </div>
      )}
    </motion.div>
  );
};

export default BankingDocumentUpload;

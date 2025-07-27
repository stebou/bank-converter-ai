'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Loader2, BarChart2, Plus } from 'lucide-react';
import Link from 'next/link';

// --- Types ---
type DocumentType = {
  id: number;
  filename: string;
  date: string;
  confidence: number;
  anomalies: number;
};

type UploadModuleProps = {
  onUpload: () => void;
  processing: boolean;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

type DocumentHistoryTableProps = {
  documents: DocumentType[];
};

type CreditsStatusProps = {
  credits: number;
};

type DashboardClientPageProps = {
  userName: string;
};

// --- SOUS-COMPOSANTS DU DASHBOARD ---

const UploadModule: React.FC<UploadModuleProps> = ({ onUpload, processing, file, setFile }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  }, [setFile]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Téléverser un relevé</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Glissez-déposez votre fichier PDF ici ou cliquez pour parcourir</p>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" id="upload-input" />
          <label htmlFor="upload-input" className="inline-block mt-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Choisir un fichier
          </label>
          {file && <p className="mt-2 text-gray-500">{file.name}</p>}
        </div>
        <button onClick={onUpload} disabled={processing || !file} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          Téléverser
        </button>
      </div>
    </div>
  );
};

const DocumentHistoryTable: React.FC<DocumentHistoryTableProps> = ({ documents }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 p-6 border-b border-gray-200">Historique des traitements</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Nom du fichier</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Date</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Confiance IA</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Anomalies</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {documents.length > 0 ? documents.map((doc: DocumentType) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{doc.filename}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{doc.date}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-600">{doc.confidence}%</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${doc.anomalies > 0 ? 'text-red-600' : 'text-green-600'}`}>{doc.anomalies}</td>
              <td className="px-6 py-4 whitespace-nowrap space-x-4">
                <button className="text-blue-600 hover:underline font-medium">Voir</button>
                <button className="text-purple-600 hover:underline font-medium">Exporter</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="text-center py-16 text-gray-500">
                <p>Aucun document traité pour le moment.</p>
                <p className="text-xs mt-1">Utilisez le module d'upload pour commencer.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const CreditsStatus: React.FC<CreditsStatusProps> = ({ credits }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes Crédits</h3>
    <div className="text-center">
      <p className="text-5xl font-bold text-blue-600">{credits}</p>
      <p className="text-sm text-gray-500 mt-1">crédits restants</p>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${credits * 10}%` }}></div></div>
    <Link href="/dashboard/reglages">
      <button className="w-full mt-4 bg-green-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition hover:bg-green-700">
        <Plus className="w-5 h-5" /> Acheter des crédits
      </button>
    </Link>
  </div>
);

export default function DashboardClientPage({ userName }: DashboardClientPageProps) {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const credits = 10 - documents.length; // Simulation

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    setTimeout(() => {
      const newDoc: DocumentType = {
        id: Date.now(),
        filename: file.name,
        date: new Date().toLocaleDateString('fr-FR'),
        confidence: 97.3,
        anomalies: Math.random() > 0.8 ? 1 : 0,
      };
      setDocuments((prev: DocumentType[]) => [newDoc, ...prev]);
      setFile(null);
      setProcessing(false);
    }, 2000);
  };

  const stats = { total: documents.length, anomalies: documents.filter((d) => d.anomalies > 0).length };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bonjour, {userName} !</h1>
        <p className="text-gray-600 mt-1">Bienvenue sur votre tableau de bord.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg"><BarChart2 className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Documents traités</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Anomalies détectées</p>
            <p className="text-2xl font-bold text-gray-900">{stats.anomalies}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Crédits restants</p>
            <p className="text-2xl font-bold text-gray-900">{credits}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UploadModule onUpload={handleUpload} processing={processing} file={file} setFile={setFile} />
          <DocumentHistoryTable documents={documents} />
        </div>
        <div className="lg:col-span-1">
          <CreditsStatus credits={credits} />
        </div>
      </div>
    </div>
  );
}
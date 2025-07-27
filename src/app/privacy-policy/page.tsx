'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail, FileText } from 'lucide-react';

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900">
    {/* Header Navigation */}
    <header className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Bank Statement Converter IA
            </span>
          </div>
          <Link href="/" passHref>
            <button className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium border border-white/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
          </Link>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <span className="text-sm font-semibold uppercase tracking-wide">
            Protection des Données
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Politique de
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Confidentialité
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée.
          Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          <strong>Dernière mise à jour :</strong> 27 juillet 2025
        </div>
      </div>

      <div className="space-y-8">
        {/* Responsable du traitement */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">1. Responsable du traitement</h2>
              <p>
                Les données collectées sur ce site sont traitées par <strong>Bank Statement Converter IA</strong>,
                société éditrice du site et responsable du traitement des données personnelles.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-sm">
                  <strong>Contact :</strong> contact@bankstatement-ai.fr<br/>
                  <strong>Adresse :</strong> [À compléter]<br/>
                  <strong>Délégué à la protection des données :</strong> dpo@bankstatement-ai.fr
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Données collectées */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-green-50 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">2. Données collectées</h2>
              <ul className="list-disc space-y-2 ml-5">
                <li>Identité : nom, prénom, email, informations de compte</li>
                <li>Données techniques : adresse IP, navigateur, OS, pages visitées, cookies</li>
                <li>Fichiers téléchargés : relevés bancaires PDF, métadonnées et extraits temporaires</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Finalité */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">3. Finalités de la collecte</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Fourniture du service de conversion IA de relevé bancaire</li>
                <li>Création/gestion de compte utilisateur</li>
                <li>Amélioration continue et sécurité de la plateforme</li>
                <li>Support client et communication</li>
                <li>Respect des obligations légales</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Base légale */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">4. Base légale</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Consentement (newsletter, cookies analytiques...)</li>
                <li>Exécution du contrat (accès au service, facturation...)</li>
                <li>Obligation légale (conservation factures...)</li>
                <li>Intérêt légitime (sécurité, amélioration continue...)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Conservation */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-red-50 rounded-lg">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4">5. Durée de conservation</h2>
              <table className="w-full border-collapse border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-3 text-left">Type</th>
                    <th className="border border-gray-200 px-4 py-3 text-left">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-2">Fichiers PDF</td>
                    <td className="border px-2 py-2">24h max (puis suppression automatique)</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-2">Données compte</td>
                    <td className="border px-2 py-2">Jusqu'à suppression du compte</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-2">Données navigation</td>
                    <td className="border px-2 py-2">13 mois max</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-2">Factures</td>
                    <td className="border px-2 py-2">10 ans (légal)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Droits RGPD */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">6. Vos droits</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Droit d'accès, de rectification, d'effacement</li>
                <li>Droit de portabilité</li>
                <li>Droit d'opposition, de limitation</li>
                <li>Retrait du consentement à tout moment</li>
                <li>Droit de réclamation auprès de la CNIL</li>
              </ul>
              <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm">
                Pour exercer vos droits, contactez-nous : <a className="underline" href="mailto:dpo@bankstatement-ai.fr">dpo@bankstatement-ai.fr</a>
              </div>
            </div>
          </div>
        </section>

        {/* Sécurité */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-green-50 rounded-lg">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">7. Sécurisation de vos données</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Chiffrement (HTTPS/TLS, stockage sécurisé)</li>
                <li>Accès restreint au personnel habilité</li>
                <li>Suppression automatique des fichiers après traitement</li>
                <li>Surveillance et logs de sécurité</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Questions ?</h2>
            <p className="text-blue-100 mb-6">
              Notre équipe est à votre disposition pour toute question sur la protection de vos données.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@bankstatement-ai.fr"
                 className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Nous contacter</a>
              <a href="mailto:dpo@bankstatement-ai.fr"
                 className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">Contacter le DPO</a>
            </div>
          </div>
        </section>
      </div>

      {/* Back to top/home */}
      <div className="text-center mt-12">
        <Link href="/" passHref>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </button>
        </Link>
      </div>
    </main>
  </div>
);

export default PrivacyPolicyPage;

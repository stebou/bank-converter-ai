'use client';

import '../../styles/fonts.css';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  FileText,
  Sparkles,
  Loader2,
  Plus,
  Star,
  StarOff,
  Edit2,
  Trash2,
  Search,
  MessageSquare,
  X,
  Upload,
  ArrowLeft,
  Brain,
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  documentIds?: string[];
  referencedDocuments?: string[];
  createdAt: string;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  isFavorite: boolean;
  lastMessageAt: string;
  messageCount: number;
  createdAt: string;
}

interface Document {
  id: string;
  filename: string;
  originalName: string;
  createdAt: string;
  bankDetected: string;
  totalTransactions: number;
  aiConfidence: number;
  status: string;
}

export default function IAChatPage() {
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // États principaux
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  // États UI
  const [searchQuery, setSearchQuery] = useState('');
  const [editingConversation, setEditingConversation] = useState<string | null>(
    null
  );
  const [editTitle, setEditTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  // États pour la popup de document
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [documentContent, setDocumentContent] = useState<{
    extractedText: string;
    transactions: {
      id: string;
      date: string;
      amount: number;
      description: string;
      category?: string;
    }[];
  } | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [activeTab, setActiveTab] = useState<'pdf' | 'transactions'>('pdf');

  // Chargement initial avec délai pour laisser Clerk s'initialiser
  useEffect(() => {
    if (user) {
      // Petit délai pour s'assurer que Clerk est complètement initialisé
      const timer = setTimeout(() => {
        loadDocuments();
        loadConversations();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus sur l'input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentConversation]);

  const loadDocuments = async () => {
    try {
      console.log('[IA_CHAT] Starting loadDocuments...');
      console.log('[IA_CHAT] User object:', { id: user?.id, isLoaded: !!user });

      const response = await fetch('/api/documents');
      console.log('[IA_CHAT] API response status:', response.status);

      if (response.ok) {
        const docs = await response.json();
        setDocuments(docs);
        console.log('[IA_CHAT] Successfully loaded documents:', docs.length);
        console.log(
          '[IA_CHAT] Document details:',
          docs.map((d: any) => ({
            id: d.id,
            name: d.originalName,
            bank: d.bankDetected,
          }))
        );
      } else {
        console.error(
          '[IA_CHAT] Failed to load documents:',
          response.status,
          response.statusText
        );

        if (response.status === 401) {
          console.error(
            '[IA_CHAT] Authentication error - user may not be properly authenticated'
          );
          console.error('[IA_CHAT] Clerk user state:', {
            user: !!user,
            userId: user?.id,
            isLoaded: !!user,
          });
        }

        // Essayer de lire le message d'erreur
        try {
          const errorData = await response.json();
          console.error('[IA_CHAT] Error details:', errorData);
        } catch {
          console.error('[IA_CHAT] Could not parse error response');
        }

        // Garder le tableau vide mais logguer l'erreur
        setDocuments([]);
      }
    } catch (error) {
      console.error('[IA_CHAT] Network error loading documents:', error);
      setDocuments([]);
    }
  };

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const response = await fetch('/api/chat/conversations');
      if (response.ok) {
        const convs = await response.json();
        setConversations(convs);

        // Sélectionner la première conversation ou en créer une nouvelle
        if (convs.length > 0) {
          setCurrentConversation(convs[0].id);
          loadMessages(convs[0].id);
        } else {
          createNewConversation();
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      createNewConversation();
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/chat/conversations/${conversationId}/messages`
      );
      if (response.ok) {
        const msgs = await response.json();
        setMessages(msgs);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Nouvelle conversation ${new Date().toLocaleDateString('fr-FR')}`,
        }),
      });

      if (response.ok) {
        const newConv = await response.json();
        setConversations(prev => [newConv, ...prev]);
        setCurrentConversation(newConv.id);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentConversation) return;

    const messageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: messageId,
      role: 'user',
      content: inputMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Message assistant temporaire avec streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setStreamingMessageId(assistantMessageId);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          conversationId: currentConversation,
          documents: documents,
          conversationHistory: messages.slice(-10),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la communication avec l'IA");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  accumulatedContent += data.content;

                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: accumulatedContent,
                            isStreaming: true,
                          }
                        : msg
                    )
                  );
                }

                if (data.done) {
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: accumulatedContent,
                            isStreaming: false,
                            referencedDocuments: data.referencedDocuments,
                          }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }

      // Mettre à jour la conversation
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversation
            ? {
                ...conv,
                lastMessageAt: new Date().toISOString(),
                messageCount: conv.messageCount + 2,
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        createdAt: new Date().toISOString(),
      };

      setMessages(prev =>
        prev.map(msg => (msg.id === assistantMessageId ? errorMessage : msg))
      );
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const toggleFavorite = async (conversationId: string) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const response = await fetch(
        `/api/chat/conversations/${conversationId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isFavorite: !conversation.isFavorite,
          }),
        }
      );

      if (response.ok) {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, isFavorite: !conv.isFavorite }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const updateConversationTitle = async (
    conversationId: string,
    newTitle: string
  ) => {
    try {
      const response = await fetch(
        `/api/chat/conversations/${conversationId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle }),
        }
      );

      if (response.ok) {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId ? { ...conv, title: newTitle } : conv
          )
        );
      }
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?'))
      return;

    try {
      const response = await fetch(
        `/api/chat/conversations/${conversationId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setConversations(prev =>
          prev.filter(conv => conv.id !== conversationId)
        );

        if (currentConversation === conversationId) {
          const remaining = conversations.filter(
            conv => conv.id !== conversationId
          );
          if (remaining.length > 0) {
            setCurrentConversation(remaining[0].id);
            loadMessages(remaining[0].id);
          } else {
            createNewConversation();
          }
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return (
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  });

  const generateSuggestions = () => {
    if (documents.length === 0) return [];

    return [
      'Analyse les tendances de mes dépenses ce mois-ci',
      'Quelles sont mes plus grosses catégories de dépenses ?',
      'Y a-t-il des transactions suspectes dans mes relevés ?',
      'Résume mes revenus et dépenses par catégorie',
      'Compare mes dépenses sur les 3 derniers mois',
    ];
  };

  const suggestions = generateSuggestions();

  // Fonction pour charger le contenu détaillé d'un document
  const loadDocumentContent = async (documentId: string) => {
    setIsLoadingDocument(true);
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        setDocumentContent({
          extractedText: data.extractedText || 'Contenu non disponible',
          transactions: data.transactions || [],
        });
      } else {
        console.error('Failed to load document content');
        setDocumentContent({
          extractedText: 'Erreur lors du chargement du document',
          transactions: [],
        });
      }
    } catch (error) {
      console.error('Error loading document content:', error);
      setDocumentContent({
        extractedText: 'Erreur lors du chargement du document',
        transactions: [],
      });
    } finally {
      setIsLoadingDocument(false);
    }
  };

  // Fonction pour ouvrir la popup de document
  const openDocumentPopup = (documentId: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document) {
      setSelectedDocument(document);
      setActiveTab('pdf'); // Commencer par l'onglet PDF
      loadDocumentContent(documentId);
    }
  };

  // Fonction pour fermer la popup
  const closeDocumentPopup = () => {
    setSelectedDocument(null);
    setDocumentContent(null);
    setActiveTab('pdf');
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#bdc3c7]">
      {/* Sidebar des conversations (à gauche) */}
      <div
        className={`relative z-10 border-r border-[#bdc3c7] bg-[#ecf0f1] transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-12'} flex-shrink-0 overflow-hidden`}
      >
        {sidebarOpen ? (
          <div className="w-full">
            <div className="border-b border-[#bdc3c7] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
                    Conversations
                  </h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 transition-colors hover:bg-white"
                >
                  <X className="h-5 w-5 text-[#34495e]" />
                </button>
              </div>

              <button
                onClick={createNewConversation}
                className="font-open-sans flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2c3e50] px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]"
              >
                <Plus className="h-5 w-5" />
                Nouvelle conversation
              </button>

              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bdc3c7]" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="font-open-sans w-full rounded-xl border border-[#bdc3c7] bg-white px-10 py-2 text-sm placeholder-[#bdc3c7] focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {filteredConversations.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 text-[#bdc3c7]" />
                  <p className="font-open-sans text-sm text-[#34495e]">
                    {searchQuery
                      ? 'Aucune conversation trouvée'
                      : 'Pas encore de conversations'}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredConversations.map(conversation => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`group relative cursor-pointer rounded-2xl p-4 transition-all duration-300 ${
                        currentConversation === conversation.id
                          ? 'border-2 border-[#bdc3c7] bg-white'
                          : 'border border-[#bdc3c7] bg-[#ecf0f1] hover:bg-white'
                      }`}
                      onClick={() => {
                        setCurrentConversation(conversation.id);
                        loadMessages(conversation.id);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            {editingConversation === conversation.id ? (
                              <input
                                type="text"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                onBlur={() => {
                                  updateConversationTitle(
                                    conversation.id,
                                    editTitle
                                  );
                                  setEditingConversation(null);
                                }}
                                onKeyPress={e => {
                                  if (e.key === 'Enter') {
                                    updateConversationTitle(
                                      conversation.id,
                                      editTitle
                                    );
                                    setEditingConversation(null);
                                  }
                                }}
                                className="font-montserrat flex-1 border-b border-[#2c3e50] bg-transparent text-sm font-semibold focus:outline-none"
                                autoFocus
                              />
                            ) : (
                              <h3
                                className={`font-montserrat flex-1 truncate text-sm font-semibold ${
                                  currentConversation === conversation.id
                                    ? 'text-[#2c3e50]'
                                    : 'text-[#2c3e50]'
                                }`}
                                onClick={e => {
                                  e.stopPropagation();
                                  setEditingConversation(conversation.id);
                                  setEditTitle(conversation.title);
                                }}
                              >
                                {conversation.title}
                              </h3>
                            )}
                            {conversation.isFavorite && (
                              <Star className="h-4 w-4 flex-shrink-0 fill-current text-yellow-500" />
                            )}
                          </div>

                          <div className="font-ibm-plex-mono flex items-center gap-4 text-xs tracking-wider text-[#34495e]">
                            <span>
                              {conversation.messageCount} message
                              {conversation.messageCount !== 1 ? 's' : ''}
                            </span>
                            <span>
                              {new Date(
                                conversation.lastMessageAt
                              ).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              toggleFavorite(conversation.id);
                            }}
                            className="rounded p-1 hover:bg-white"
                            title={
                              conversation.isFavorite
                                ? 'Retirer des favoris'
                                : 'Ajouter aux favoris'
                            }
                          >
                            {conversation.isFavorite ? (
                              <StarOff className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <Star className="h-4 w-4 text-[#bdc3c7]" />
                            )}
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setEditingConversation(conversation.id);
                              setEditTitle(conversation.title);
                            }}
                            className="rounded p-1 hover:bg-white"
                            title="Renommer"
                          >
                            <Edit2 className="h-4 w-4 text-[#bdc3c7]" />
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              deleteConversation(conversation.id);
                            }}
                            className="rounded p-1 text-red-500 hover:bg-red-100"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        ) : (
          <div className="border-b border-[#bdc3c7] p-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full rounded-lg p-2 transition-colors hover:bg-white"
              title="Afficher les conversations"
            >
              <MessageSquare className="mx-auto h-6 w-6 text-[#34495e]" />
            </button>
          </div>
        )}
      </div>

      {/* Zone de chat principale */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header professionnel */}
        <div className="border-b border-[#bdc3c7] bg-[#ecf0f1] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Bouton retour stylisé */}
              <Link
                href="/dashboard"
                className="font-open-sans flex items-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour au Dashboard</span>
              </Link>

              <div className="h-6 w-px bg-[#bdc3c7]"></div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#2c3e50] p-2">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
                    IA Chat Assistant
                  </h2>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    Accès à {documents.length} document
                    {documents.length !== 1 ? 's' : ''} • Conversations
                    sauvegardées
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border border-green-200 bg-green-50 px-3 py-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                  <span className="font-open-sans text-xs font-medium text-green-700">
                    En ligne
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 transition-colors hover:bg-white"
                title={
                  sidebarOpen
                    ? 'Masquer les conversations'
                    : 'Afficher les conversations'
                }
              >
                <MessageSquare className="h-5 w-5 text-[#34495e] hover:text-[#2c3e50]" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="max-w-2xl text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#2c3e50] shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-montserrat mb-4 text-2xl font-bold tracking-tight text-[#2c3e50]">
                  Bonjour {user?.firstName || 'Utilisateur'} ! 👋
                </h3>
                <p className="font-open-sans mb-8 text-lg text-[#34495e]">
                  Je suis votre assistant IA spécialisé en analyse financière.
                  J&apos;ai accès à{' '}
                  <strong className="text-[#2c3e50]">
                    {documents.length} document
                    {documents.length !== 1 ? 's' : ''}
                  </strong>{' '}
                  analysé{documents.length !== 1 ? 's' : ''} et je peux répondre
                  à toutes vos questions !
                </p>

                {documents.length > 0 ? (
                  suggestions.length > 0 && (
                    <div className="space-y-3">
                      <p className="font-open-sans text-sm font-medium text-[#34495e]">
                        Suggestions :
                      </p>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {suggestions.slice(0, 4).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setInputMessage(suggestion)}
                            className="group rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 text-left shadow-sm transition-all duration-300 hover:bg-white"
                          >
                            <p className="font-open-sans text-sm text-[#34495e] transition-colors group-hover:text-[#2c3e50]">
                              {suggestion}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-sm">
                    <div className="text-center">
                      <FileText className="mx-auto mb-4 h-12 w-12 text-[#bdc3c7]" />
                      <h4 className="font-montserrat mb-2 text-lg font-semibold tracking-tight text-[#2c3e50]">
                        Aucun document analysé
                      </h4>
                      <p className="font-open-sans mb-4 text-[#34495e]">
                        Pour utiliser l&apos;IA Chat, vous devez d&apos;abord
                        analyser des relevés bancaires depuis le Dashboard.
                      </p>
                      <Link
                        href="/dashboard"
                        className="font-open-sans inline-flex items-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 font-semibold text-white transition-all duration-300 hover:bg-[#34495e]"
                      >
                        <Upload className="h-4 w-4" />
                        Analyser un document
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0.3, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}
                  >
                    <div
                      className={`rounded-3xl p-4 shadow-lg ${
                        message.role === 'user'
                          ? 'bg-[#2c3e50] text-white'
                          : 'border border-[#bdc3c7] bg-[#ecf0f1] text-[#2c3e50]'
                      }`}
                    >
                      <p className="font-open-sans whitespace-pre-wrap leading-relaxed">
                        {message.content}
                        {message.isStreaming &&
                          streamingMessageId === message.id && (
                            <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-current" />
                          )}
                      </p>

                      {message.referencedDocuments &&
                        message.referencedDocuments.length > 0 && (
                          <div className="mt-3 border-t border-[#bdc3c7] pt-3">
                            <div className="mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-[#34495e]" />
                              <span className="font-open-sans text-xs font-medium text-[#34495e]">
                                Documents référencés :
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {message.referencedDocuments.map(
                                (docId, index) => {
                                  const doc = documents.find(
                                    d => d.id === docId
                                  );
                                  return doc ? (
                                    <button
                                      key={index}
                                      onClick={() => openDocumentPopup(docId)}
                                      className="group cursor-pointer rounded-lg bg-white px-2 py-1 transition-colors hover:bg-[#bdc3c7]"
                                    >
                                      <span className="font-open-sans text-xs text-[#34495e] group-hover:text-[#2c3e50]">
                                        {doc.originalName}
                                      </span>
                                    </button>
                                  ) : null;
                                }
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    <p className="font-ibm-plex-mono mt-2 px-2 text-xs tracking-wider text-[#34495e]">
                      {new Date(message.createdAt).toLocaleString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="order-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#34495e] shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Zone de saisie */}
        <div className="border-t border-[#bdc3c7] bg-[#ecf0f1] p-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyPress={e =>
                      e.key === 'Enter' && !e.shiftKey && sendMessage()
                    }
                    placeholder="Posez votre question sur vos documents financiers..."
                    className="font-open-sans w-full resize-none rounded-2xl border border-[#bdc3c7] bg-white px-6 py-4 pr-12 text-[#2c3e50] placeholder-[#34495e] focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 animate-spin text-[#2c3e50]" />
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between px-2">
                  <p className="font-open-sans text-xs text-[#34495e]">
                    Appuyez sur Entrée pour envoyer • Accès à tous vos documents
                  </p>
                  <p className="font-ibm-plex-mono text-xs tracking-wider text-[#bdc3c7]">
                    {inputMessage.length}/2000
                  </p>
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="rounded-2xl bg-[#2c3e50] p-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de document */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={closeDocumentPopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header de la popup */}
              <div className="flex items-center justify-between border-b border-[#bdc3c7] p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#2c3e50] p-2">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
                      {selectedDocument.originalName}
                    </h3>
                    <p className="font-open-sans text-sm text-[#34495e]">
                      {selectedDocument.bankDetected} •{' '}
                      {selectedDocument.totalTransactions} transactions •{' '}
                      {selectedDocument.aiConfidence}% confiance
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDocumentPopup}
                  className="rounded-lg p-2 transition-colors hover:bg-white"
                >
                  <X className="h-6 w-6 text-[#34495e] hover:text-[#2c3e50]" />
                </button>
              </div>

              {/* Contenu de la popup */}
              <div className="flex h-[calc(90vh-140px)] flex-col">
                {isLoadingDocument ? (
                  <div className="flex flex-1 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#2c3e50]" />
                    <span className="font-open-sans ml-3 text-[#34495e]">
                      Chargement du document...
                    </span>
                  </div>
                ) : selectedDocument ? (
                  <>
                    {/* Onglets */}
                    <div className="flex border-b border-[#bdc3c7] px-6">
                      <button
                        onClick={() => setActiveTab('pdf')}
                        className={`font-open-sans border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                          activeTab === 'pdf'
                            ? 'border-[#2c3e50] text-[#2c3e50]'
                            : 'border-transparent text-[#34495e] hover:text-[#2c3e50]'
                        }`}
                      >
                        PDF Original
                      </button>
                      <button
                        onClick={() => setActiveTab('transactions')}
                        className={`font-open-sans border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                          activeTab === 'transactions'
                            ? 'border-[#2c3e50] text-[#2c3e50]'
                            : 'border-transparent text-[#34495e] hover:text-[#2c3e50]'
                        }`}
                      >
                        Transactions (
                        {documentContent?.transactions.length || 0})
                      </button>
                    </div>

                    {/* Contenu des onglets */}
                    <div className="flex-1 overflow-hidden">
                      {activeTab === 'pdf' && (
                        <div className="h-full p-6">
                          <iframe
                            src={`/api/documents/${selectedDocument.id}/pdf`}
                            className="h-full w-full rounded-xl border border-[#bdc3c7]"
                            title={`PDF - ${selectedDocument.originalName}`}
                          />
                        </div>
                      )}

                      {activeTab === 'transactions' && documentContent && (
                        <div className="h-full overflow-y-auto p-6">
                          {documentContent.transactions.length > 0 ? (
                            <div className="space-y-2">
                              {documentContent.transactions.map(
                                (transaction, index) => (
                                  <div
                                    key={transaction.id}
                                    className="flex items-center justify-between rounded-lg bg-white px-4 py-3 transition-colors hover:bg-[#bdc3c7]"
                                  >
                                    <div className="flex-1">
                                      <p className="font-open-sans text-sm font-medium text-[#2c3e50]">
                                        {transaction.description}
                                      </p>
                                      <p className="font-ibm-plex-mono text-xs tracking-wider text-[#34495e]">
                                        {new Date(
                                          transaction.date
                                        ).toLocaleDateString('fr-FR')}{' '}
                                        • {transaction.category}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p
                                        className={`text-sm font-semibold ${
                                          transaction.amount >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                        }`}
                                      >
                                        {transaction.amount >= 0 ? '+' : ''}
                                        {transaction.amount.toFixed(2)}€
                                      </p>
                                      <p className="font-ibm-plex-mono text-xs tracking-wider text-[#34495e]">
                                        {transaction.aiConfidence}% confiance
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="py-12 text-center">
                              <p className="font-open-sans text-[#34495e]">
                                Aucune transaction trouvée
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-center">
                    <p className="font-open-sans text-[#34495e]">
                      Erreur lors du chargement du document
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

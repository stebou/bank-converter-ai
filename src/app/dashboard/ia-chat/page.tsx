'use client';

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
  Upload
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
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  
  // États UI
  const [searchQuery, setSearchQuery] = useState('');
  const [editingConversation, setEditingConversation] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  // États pour la popup de document
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentContent, setDocumentContent] = useState<{
    extractedText: string;
    transactions: { id: string; date: string; amount: number; description: string }[];
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
        console.log('[IA_CHAT] Document details:', docs.map(d => ({ id: d.id, name: d.originalName, bank: d.bankDetected })));
      } else {
        console.error('[IA_CHAT] Failed to load documents:', response.status, response.statusText);
        
        if (response.status === 401) {
          console.error('[IA_CHAT] Authentication error - user may not be properly authenticated');
          console.error('[IA_CHAT] Clerk user state:', { user: !!user, userId: user?.id, isLoaded: !!user });
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
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`);
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
        throw new Error('Erreur lors de la communication avec l\'IA');
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
                  
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: accumulatedContent, isStreaming: true }
                      : msg
                  ));
                }
                
                if (data.done) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { 
                          ...msg, 
                          content: accumulatedContent,
                          isStreaming: false,
                          referencedDocuments: data.referencedDocuments 
                        }
                      : msg
                  ));
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }

      // Mettre à jour la conversation
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation 
          ? { 
              ...conv, 
              lastMessageAt: new Date().toISOString(),
              messageCount: conv.messageCount + 2 
            }
          : conv
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? errorMessage : msg
      ));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const toggleFavorite = async (conversationId: string) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFavorite: !conversation.isFavorite,
        }),
      });

      if (response.ok) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, isFavorite: !conv.isFavorite }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const updateConversationTitle = async (conversationId: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId ? { ...conv, title: newTitle } : conv
        ));
      }
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) return;

    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        if (currentConversation === conversationId) {
          const remaining = conversations.filter(conv => conv.id !== conversationId);
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
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });

  const generateSuggestions = () => {
    if (documents.length === 0) return [];
    
    return [
      "Analyse les tendances de mes dépenses ce mois-ci",
      "Quelles sont mes plus grosses catégories de dépenses ?",
      "Y a-t-il des transactions suspectes dans mes relevés ?",
      "Résume mes revenus et dépenses par catégorie",
      "Compare mes dépenses sur les 3 derniers mois",
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
          transactions: data.transactions || []
        });
      } else {
        console.error('Failed to load document content');
        setDocumentContent({
          extractedText: 'Erreur lors du chargement du document',
          transactions: []
        });
      }
    } catch (error) {
      console.error('Error loading document content:', error);
      setDocumentContent({
        extractedText: 'Erreur lors du chargement du document',
        transactions: []
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
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden flex">
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10"></div>
      
      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">IA Chat Assistant</h2>
                  <p className="text-gray-300 text-sm">
                    Accès à {documents.length} document{documents.length !== 1 ? 's' : ''} • Conversations sauvegardées
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-xs font-medium">En ligne</span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={sidebarOpen ? "Masquer les conversations" : "Afficher les conversations"}
              >
                <MessageSquare className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Bonjour {user?.firstName || 'Utilisateur'} ! 👋
                </h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Je suis votre assistant IA spécialisé en analyse financière. 
                  J&apos;ai accès à <strong className="text-white">{documents.length} document{documents.length !== 1 ? 's' : ''}</strong> analysé{documents.length !== 1 ? 's' : ''} et je peux répondre à toutes vos questions !
                </p>
                
                {documents.length > 0 ? (
                  suggestions.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm font-medium">Suggestions :</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestions.slice(0, 4).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setInputMessage(suggestion)}
                            className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 text-left group"
                          >
                            <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                              {suggestion}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-2">Aucun document analysé</h4>
                      <p className="text-gray-300 mb-4">
                        Pour utiliser l&apos;IA Chat, vous devez d&apos;abord analyser des relevés bancaires depuis le Dashboard.
                      </p>
                      <Link 
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                      >
                        <Upload className="w-4 h-4" />
                        Analyser un document
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0.3, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`p-4 rounded-3xl shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                        {message.isStreaming && streamingMessageId === message.id && (
                          <span className="inline-block w-2 h-5 bg-current ml-1 animate-pulse" />
                        )}
                      </p>
                      
                      {message.referencedDocuments && message.referencedDocuments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-300" />
                            <span className="text-xs text-gray-300 font-medium">Documents référencés :</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {message.referencedDocuments.map((docId, index) => {
                              const doc = documents.find(d => d.id === docId);
                              return doc ? (
                                <button
                                  key={index}
                                  onClick={() => openDocumentPopup(docId)}
                                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer group"
                                >
                                  <span className="text-xs text-gray-300 group-hover:text-white">{doc.originalName}</span>
                                </button>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-2 px-2">
                      {new Date(message.createdAt).toLocaleString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg order-2">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Zone de saisie */}
        <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Posez votre question sur vos documents financiers..."
                    className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2 px-2">
                  <p className="text-xs text-gray-400">
                    Appuyez sur Entrée pour envoyer • Accès à tous vos documents
                  </p>
                  <p className="text-xs text-gray-500">
                    {inputMessage.length}/2000
                  </p>
                </div>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-2xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar des conversations (à droite) */}
      <div className={`relative z-10 bg-white/10 backdrop-blur-xl border-l border-white/20 transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Conversations</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={createNewConversation}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-2xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nouvelle conversation
          </button>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
            />
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p className="text-sm">Aucune conversation trouvée</p>
            </div>
          ) : (
            sortedConversations.map((conv) => (
              <div
                key={conv.id}
                className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 relative ${
                  currentConversation === conv.id
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => {
                  setCurrentConversation(conv.id);
                  loadMessages(conv.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingConversation === conv.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => {
                          updateConversationTitle(conv.id, editTitle);
                          setEditingConversation(null);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            updateConversationTitle(conv.id, editTitle);
                            setEditingConversation(null);
                          }
                        }}
                        className="w-full bg-transparent border border-white/20 rounded px-2 py-1 text-sm"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-medium text-white truncate">{conv.title}</h3>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-400">
                        {conv.messageCount} messages
                      </p>
                      <span className="text-xs text-gray-500">•</span>
                      <p className="text-xs text-gray-400">
                        {new Date(conv.lastMessageAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(conv.id);
                      }}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {conv.isFavorite ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingConversation(conv.id);
                        setEditTitle(conv.title);
                      }}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                
                {conv.isFavorite && (
                  <div className="absolute -top-1 -right-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Popup de document */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeDocumentPopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header de la popup */}
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedDocument.originalName}</h3>
                    <p className="text-sm text-gray-300">
                      {selectedDocument.bankDetected} • {selectedDocument.totalTransactions} transactions • {selectedDocument.aiConfidence}% confiance
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDocumentPopup}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Contenu de la popup */}
              <div className="flex flex-col h-[calc(90vh-140px)]">
                {isLoadingDocument ? (
                  <div className="flex items-center justify-center flex-1">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-3 text-gray-300">Chargement du document...</span>
                  </div>
                ) : selectedDocument ? (
                  <>
                    {/* Onglets */}
                    <div className="flex border-b border-white/20 px-6">
                      <button
                        onClick={() => setActiveTab('pdf')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'pdf'
                            ? 'border-blue-400 text-blue-400'
                            : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        PDF Original
                      </button>
                      <button
                        onClick={() => setActiveTab('transactions')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'transactions'
                            ? 'border-blue-400 text-blue-400'
                            : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        Transactions ({documentContent?.transactions.length || 0})
                      </button>
                    </div>

                    {/* Contenu des onglets */}
                    <div className="flex-1 overflow-hidden">
                      {activeTab === 'pdf' && (
                        <div className="h-full p-6">
                          <iframe
                            src={`/api/documents/${selectedDocument.id}/pdf`}
                            className="w-full h-full rounded-xl border border-white/20"
                            title={`PDF - ${selectedDocument.originalName}`}
                          />
                        </div>
                      )}

                      {activeTab === 'transactions' && documentContent && (
                        <div className="h-full p-6 overflow-y-auto">
                          {documentContent.transactions.length > 0 ? (
                            <div className="space-y-2">
                              {documentContent.transactions.map((transaction, index) => (
                                <div
                                  key={transaction.id}
                                  className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-white">
                                      {transaction.description}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {new Date(transaction.date).toLocaleDateString('fr-FR')} • {transaction.category}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className={`text-sm font-semibold ${
                                      transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)}€
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {transaction.aiConfidence}% confiance
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <p className="text-gray-400">Aucune transaction trouvée</p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </>
                ) : (
                  <div className="text-center flex-1 flex items-center justify-center">
                    <p className="text-gray-400">Erreur lors du chargement du document</p>
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
'use client';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Bot, Clock, MessageCircle, Send, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

function ChatSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="h-8 w-48 rounded bg-[#bdc3c7]"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-96 rounded-xl bg-[#bdc3c7]"></div>
        </div>
        <div className="h-96 rounded-xl bg-[#bdc3c7]"></div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ChatSkeleton />;
  }

  if (!user) {
    redirect('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      <div className="p-8">
        <Suspense fallback={<ChatSkeleton />}>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#2c3e50] font-montserrat">
                  Chat Marketing
                </h1>
                <p className="text-[#34495e] font-open-sans">
                  Conversations et interactions avec vos prospects et clients
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-[#2c3e50]" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <motion.div
                className="rounded-xl border border-[#bdc3c7] bg-white p-4 shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#3498db] p-2">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#7f8c8d]">Messages</p>
                    <p className="text-2xl font-bold text-[#2c3e50]">1,247</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl border border-[#bdc3c7] bg-white p-4 shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#2ecc71] p-2">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#7f8c8d]">Contacts actifs</p>
                    <p className="text-2xl font-bold text-[#2c3e50]">89</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl border border-[#bdc3c7] bg-white p-4 shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#e74c3c] p-2">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#7f8c8d]">Bot IA</p>
                    <p className="text-2xl font-bold text-[#2c3e50]">Actif</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl border border-[#bdc3c7] bg-white p-4 shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#f39c12] p-2">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#7f8c8d]">Temps de réponse</p>
                    <p className="text-2xl font-bold text-[#2c3e50]">2.3min</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#2c3e50] font-montserrat">
                      Interface de Chat
                    </h3>
                    <button className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="h-80 bg-[#ecf0f1] rounded-lg p-4 mb-4 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#3498db] rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white rounded-lg p-3 max-w-xs">
                          <p className="text-sm text-[#2c3e50]">
                            Bonjour ! Comment puis-je vous aider avec votre stratégie marketing aujourd'hui ?
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-[#3498db] rounded-lg p-3 max-w-xs">
                          <p className="text-sm text-white">
                            J'aimerais analyser les performances de ma dernière campagne email.
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-[#2c3e50] rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    />
                    <button className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contacts List */}
              <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
                <h3 className="text-xl font-bold text-[#2c3e50] font-montserrat mb-6">
                  Contacts Récents
                </h3>
                
                <div className="space-y-4">
                  {[
                    { name: 'Marie Dupont', status: 'En ligne', lastMessage: 'Il y a 5 min' },
                    { name: 'Jean Martin', status: 'Hors ligne', lastMessage: 'Il y a 1h' },
                    { name: 'Sophie Bernard', status: 'En ligne', lastMessage: 'Il y a 10 min' },
                    { name: 'Pierre Durand', status: 'Hors ligne', lastMessage: 'Hier' },
                  ].map((contact, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-[#ecf0f1] rounded-lg cursor-pointer transition-colors">
                      <div className="relative">
                        <div className="w-10 h-10 bg-[#3498db] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {contact.name.charAt(0)}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          contact.status === 'En ligne' ? 'bg-[#2ecc71]' : 'bg-[#95a5a6]'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#2c3e50] text-sm">{contact.name}</p>
                        <p className="text-xs text-[#7f8c8d]">{contact.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

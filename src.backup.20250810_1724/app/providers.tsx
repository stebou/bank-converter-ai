'use client'; // LA LIGNE LA PLUS IMPORTANTE !

import { ClerkProvider } from '@clerk/nextjs';
import { frFR } from '@clerk/localizations';

// Ce composant est maintenant un "Client Component"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      localization={frFR}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        // Ton objet de personnalisation est maintenant dans un composant client,
        // ce qui est parfaitement valide.
        variables: {
          colorPrimary: '#4f46e5',
          colorBackground: '#f9fafb',
          colorText: '#111827',
          colorInputBackground: '#ffffff',
          colorInputText: '#111827',
          borderRadius: '1rem',
        },
        elements: {
          card: 'shadow-2xl rounded-2xl border border-gray-100 bg-white',
          formButtonPrimary:
            'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity text-sm normal-case',
          headerTitle: 'text-3xl font-bold text-gray-800',
          headerSubtitle: 'text-gray-500',
          socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
          footerActionLink: 'text-blue-600 hover:text-blue-700 font-semibold',
          dividerLine: 'bg-gray-200',
          formFieldInput:
            'rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

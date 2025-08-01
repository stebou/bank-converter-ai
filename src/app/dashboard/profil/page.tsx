// src/app/dashboard/profil/page.tsx

import { currentUser } from '@clerk/nextjs/server';
import ProfileClientPage from './ProfileClientPage'; // Nous allons créer ce composant client
import '../../../styles/fonts.css';

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    // Rediriger ou afficher un message si l'utilisateur n'est pas trouvé
    return <div className="p-8 bg-[#bdc3c7] min-h-full flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 text-center">
        <p className="text-[#2c3e50] font-open-sans">Utilisateur non trouvé.</p>
      </div>
    </div>;
  }

  // Prépare les données à passer au composant client
  const userData = {
    name: user.fullName || `${user.firstName} ${user.lastName}`.trim() || 'Utilisateur Inconnu',
    email: user.emailAddresses[0]?.emailAddress || 'Aucun e-mail',
    avatar: user.imageUrl,
  };

  return <ProfileClientPage userData={userData} />;
}

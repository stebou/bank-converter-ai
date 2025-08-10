// src/app/dashboard/profil/page.tsx

import { currentUser } from '@clerk/nextjs/server';
import ProfileClientPage from './ProfileClientPage'; // Nous allons créer ce composant client
import '../../../styles/fonts.css';

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    // Rediriger ou afficher un message si l'utilisateur n'est pas trouvé
    return (
      <div className="flex min-h-full items-center justify-center bg-[#bdc3c7] p-8">
        <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 text-center shadow-xl">
          <p className="font-open-sans text-[#2c3e50]">
            Utilisateur non trouvé.
          </p>
        </div>
      </div>
    );
  }

  // Prépare les données à passer au composant client
  const userData = {
    name:
      user.fullName ||
      `${user.firstName} ${user.lastName}`.trim() ||
      'Utilisateur Inconnu',
    email: user.emailAddresses[0]?.emailAddress || 'Aucun e-mail',
    avatar: user.imageUrl,
  };

  return <ProfileClientPage userData={userData} />;
}

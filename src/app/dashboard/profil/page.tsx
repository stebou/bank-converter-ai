// src/app/dashboard/profil/page.tsx

import { currentUser } from '@clerk/nextjs/server';
import ProfileClientPage from './ProfileClientPage'; // Nous allons créer ce composant client

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    // Rediriger ou afficher un message si l'utilisateur n'est pas trouvé
    return <div>Utilisateur non trouvé.</div>;
  }

  // Prépare les données à passer au composant client
  const userData = {
    name: user.fullName || `${user.firstName} ${user.lastName}`.trim() || 'Utilisateur Inconnu',
    email: user.emailAddresses[0]?.emailAddress || 'Aucun e-mail',
    avatar: user.imageUrl,
  };

  return <ProfileClientPage userData={userData} />;
}

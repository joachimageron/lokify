// Defining 404 page's content
export default function NotFound() {
    return (
      <main className="flex flex-col items-center justify-center px-4 min-h-screen bg-gray-100 bg-home-img">
        <div className="max-w-3xl text-center bg-white shadow-lg rounded-2xl p-8">
            <h1 className="text-4xl font-bold text-gray-900">Cette page est introuvable !</h1>
            <p className="text-xl text-gray-600 mt-5">Quelques causes probables:</p>
            <ul>
                <li>- L'adresse de la page est incorrecte dans la barre de votre navigateur</li>
                <li>- La page n’existe plus</li>
                <li>- Vous n’êtes pas autorisé à consulter cette page</li>
            </ul>
            <p className="text-xl text-gray-600 mt-5">Pour retrouver votre chemin :</p>
            <ul>
                <li>Le plus simple à notre avis semble de repasser par <a href="/" title="Retour à l'accueil" className="underline hover:text-blue-500">l’accueil</a>.</li>
            </ul>
        </div>
      </main>
    );
  }
  
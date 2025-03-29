import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/providers/Providers";
import Link from "next/link";
import Image from "next/image";

// Defining site's metadatas
export const metadata = {
    title: "Lockify",
    description: "Lockify is the best locker app",
    icons: {
        icon: "/images/logo.ico",
    },
};

// Defining header's structure
function Header() {
    return (
        <header className="absolute top-0 left-0 w-full p-4">
            <Link href="/" className="block w-fit">
                <Image src="/images/logo.ico" alt="Logo Lockify" title="Retour à l'accueil" className="max-h-[75px] w-auto" width={150} height={50} priority />
            </Link>
        </header>
    );
}

// Defining team's members (displayed in footer)
const teamMembers = [
    { name: "Joachim Ageron dit Blanc", github: "https://github.com/joachimageron" },
    { name: "Lisa Michallon", github: "https://github.com/lmichallon" },
    { name: "Hugo Duperthuy", github: "https://github.com/heavenProx" },
    { name: "Louis Cauvet", github: "https://github.com/Louis-Cauvet" },
];

// Defining footer's structure
function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 p-2">
      <p>Lockify &copy; 2025</p>
      <ul className="flex flex-col sm:flex-row">
        {teamMembers.map((member, index) => (
          <li key={index} className="flex justify-center items-center wrap">
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="underline text-center hover:text-blue-700">
              {member.name}
            </a>
            {index < teamMembers.length - 1 && <span className="mx-3 hidden sm:block"> - </span>}
          </li>
        ))}
      </ul>
    </footer>
  );
}


export default function RootLayout({
   children
}: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
            <Header />
            <Providers>
                {children}
            </Providers>
            <Footer />
        </body>
        </html>
    );
}

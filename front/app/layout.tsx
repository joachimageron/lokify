import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/providers/Providers";

export const metadata: Metadata = {
  title: "Lokify",
  description: "Lokify is the best loker app",
};

const teamMembers = [
  { name: "Joachim Ageron dit Blanc", github: "https://github.com/joachimageron" },
  { name: "Lisa Michallon", github: "https://github.com/lmichallon" },
  { name: "Hugo Duperthuy", github: "https://github.com/heavenProx" },
  { name: "Louis Cauvet", github: "https://github.com/Louis-Cauvet" },
];

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
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Providers>
        {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}

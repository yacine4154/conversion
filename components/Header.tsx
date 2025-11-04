
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        Convertisseur de Documents IA
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
        Téléchargez une image ou un PDF pour extraire le texte sans effort et le sauvegarder en tant que document Word.
      </p>
    </header>
  );
};

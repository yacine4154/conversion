
import React from 'react';

interface ResultDisplayProps {
  extractedText: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ extractedText }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-300 mb-3">Texte Extrait</h2>
      <div className="flex-grow bg-slate-900/70 rounded-lg border border-slate-700 p-4 w-full min-h-[200px] h-full">
        {extractedText ? (
          <textarea
            readOnly
            className="w-full h-full bg-transparent text-slate-300 resize-none focus:outline-none placeholder-slate-500 text-sm leading-relaxed"
            value={extractedText}
            placeholder="Le texte extrait apparaîtra ici..."
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
             <p>Le résultat de la conversion s'affichera ici.</p>
          </div>
        )}
      </div>
    </div>
  );
};

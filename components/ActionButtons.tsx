
import React from 'react';

interface ActionButtonsProps {
    onConvert: () => void;
    onDownload: () => void;
    onClear: () => void;
    isConverting: boolean;
    isFileSelected: boolean;
    hasResult: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onConvert, onDownload, onClear, isConverting, isFileSelected, hasResult }) => {
    
    const baseButtonClasses = "w-full sm:w-auto flex-1 sm:flex-initial text-center justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    const primaryButtonClasses = "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500";
    const secondaryButtonClasses = "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500";
    const tertiaryButtonClasses = "bg-slate-600 hover:bg-slate-700 focus:ring-slate-500";

    return (
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
             {isFileSelected && (
                 <button
                    type="button"
                    onClick={onClear}
                    disabled={isConverting}
                    className={`${baseButtonClasses} ${tertiaryButtonClasses}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Vider
                </button>
             )}
            <button
                type="button"
                onClick={onConvert}
                disabled={!isFileSelected || isConverting}
                className={`${baseButtonClasses} ${primaryButtonClasses}`}
            >
                {isConverting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Conversion...
                    </>
                ) : (
                   <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
                    </svg>
                    Convertir
                   </>
                )}
            </button>
            <button
                type="button"
                onClick={onDownload}
                disabled={!hasResult || isConverting}
                className={`${baseButtonClasses} ${secondaryButtonClasses}`}
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                Télécharger .doc
            </button>
        </div>
    );
};

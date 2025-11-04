
import React, { useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Service Gemini ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the "data:mime/type;base64," part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const extractTextFromDocument = async (file: File): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("La variable d'environnement API_KEY n'est pas définie.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = await fileToBase64(file);

  const filePart = {
    inlineData: {
      mimeType: file.type,
      data: base64Data,
    },
  };

  const textPart = {
    text: "Extrais tout le texte de ce document (image ou PDF). Préserve la mise en forme originale autant que possible, y compris les sauts de ligne, les paragraphes et les titres. Ne renvoie que le texte extrait, sans aucun commentaire ou phrase d'introduction de ta part.",
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [filePart, textPart] },
  });

  return response.text;
};

// --- Composants ---
const Header: React.FC = () => {
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

const Loader: React.FC = () => {
  return (
    <svg
      className="animate-spin h-8 w-8 text-indigo-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
  filePreview: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, selectedFile, filePreview }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-indigo-500', 'bg-slate-700/50');
    const file = event.dataTransfer.files?.[0] || null;
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
        onFileChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('border-indigo-500', 'bg-slate-700/50');
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-indigo-500', 'bg-slate-700/50');
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="file-upload" 
        className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700/80 transition-colors duration-300"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {selectedFile ? (
          <div className="text-center p-4">
            {filePreview && (
              <img src={filePreview} alt="Aperçu du fichier" className="max-h-32 mx-auto rounded-md mb-3 object-contain" />
            )}
             <p className="font-semibold text-indigo-300 break-all">{selectedFile.name}</p>
             <p className="text-xs text-slate-400 mt-1">{(selectedFile.size / 1024).toFixed(2)} KB</p>
             <p className="text-sm text-slate-500 mt-4">Glissez un autre fichier ou cliquez pour remplacer.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-indigo-400">Cliquez pour choisir</span> ou glissez-déposez</p>
            <p className="text-xs text-slate-500">Image (PNG, JPG) ou PDF</p>
          </div>
        )}
        <input id="file-upload" type="file" className="hidden" ref={inputRef} onChange={handleFileSelect} accept="image/*,application/pdf" />
      </label>
    </div>
  );
};

interface ResultDisplayProps {
  extractedText: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ extractedText }) => {
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

interface ActionButtonsProps {
    onConvert: () => void;
    onDownload: () => void;
    onClear: () => void;
    isConverting: boolean;
    isFileSelected: boolean;
    hasResult: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onConvert, onDownload, onClear, isConverting, isFileSelected, hasResult }) => {
    
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


// --- Composant Principal App ---
const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setExtractedText('');
    setError(null);

    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null); // No preview for PDFs
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const handleConvert = useCallback(async () => {
    if (!selectedFile) {
      setError('Veuillez d\'abord sélectionner un fichier.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedText('');

    try {
      const text = await extractTextFromDocument(selectedFile);
      setExtractedText(text);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`Une erreur est survenue: ${err.message}`);
      } else {
        setError('Une erreur est survenue lors de la conversion. Veuillez vérifier la console pour plus de détails.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const handleDownload = useCallback(() => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile?.name.split('.')[0]}_converti.doc` || 'document.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [extractedText, selectedFile]);
  
  const handleClear = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setExtractedText('');
    setError(null);
    setIsLoading(false);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) {
        fileInput.value = '';
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8 bg-slate-800/50 rounded-2xl shadow-2xl shadow-slate-950/50 backdrop-blur-sm border border-slate-700">
          <div className="p-6 md:p-10 grid gap-8 md:grid-cols-2">
            <div className="flex flex-col space-y-6">
                <FileUpload 
                    onFileChange={handleFileChange} 
                    selectedFile={selectedFile} 
                    filePreview={filePreview}
                />
                 {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
                      <p>{error}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col">
              <div className="flex-grow">
                 {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-900/50 rounded-lg border border-slate-700 p-4">
                        <Loader />
                        <p className="mt-4 text-slate-400 animate-pulse">Extraction du texte en cours...</p>
                    </div>
                ) : (
                    <ResultDisplay extractedText={extractedText} />
                )}
              </div>
              <ActionButtons
                onConvert={handleConvert}
                onDownload={handleDownload}
                onClear={handleClear}
                isConverting={isLoading}
                isFileSelected={!!selectedFile}
                hasResult={!!extractedText}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


// --- Initialisation de React ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("L'élément racine est introuvable pour le montage");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

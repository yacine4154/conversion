
import React, { useState, useCallback } from 'react';
import { extractTextFromDocument } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { ActionButtons } from './components/ActionButtons';

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
      setError('Une erreur est survenue lors de la conversion. Veuillez vérifier la console pour plus de détails.');
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
    // Also reset the file input element itself
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

export default App;

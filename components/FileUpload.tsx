
import React, { useRef } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
  filePreview: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, selectedFile, filePreview }) => {
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

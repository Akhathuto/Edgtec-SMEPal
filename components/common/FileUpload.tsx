import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  label: string;
  id: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  currentFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  id,
  onFileSelect,
  onFileRemove,
  acceptedFileTypes = "image/png, image/jpeg, application/pdf",
  maxSizeMB = 5,
  currentFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidation = (file: File): boolean => {
    if (!file) return false;

    // Type validation
    const allowedTypes = acceptedFileTypes.split(',').map(t => t.trim());
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload a ${allowedTypes.join(', ')} file.`);
      return false;
    }

    // Size validation
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (handleValidation(file)) {
        onFileSelect(file);
      }
    }
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFileRemove();
  };

  return (
    <div>
        <label
            htmlFor={id}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex justify-center w-full px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-500' : 'border-gray-300'} border-dashed rounded-md cursor-pointer transition-colors duration-200 ease-in-out bg-slate-50 hover:bg-slate-100`}
        >
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                    <span className="relative font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id={id} name={id} type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} accept={acceptedFileTypes} />
                    </span>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </label>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {currentFile && !error && (
            <div className="mt-2 flex items-center justify-between bg-white border border-gray-200 p-2 rounded-md">
                <div className="flex items-center space-x-2 truncate">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-800 truncate" title={currentFile.name}>{currentFile.name}</span>
                    <span className="text-xs text-gray-500">({(currentFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button type="button" onClick={handleRemove} className="text-red-600 hover:text-red-800 focus:outline-none" aria-label="Remove file">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        )}
    </div>
  );
};

export default FileUpload;
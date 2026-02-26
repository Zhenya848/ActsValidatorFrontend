import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/ui/button';
import { Progress } from '../../../shared/ui/progress';

interface FileObject {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'done';
}

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileObject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    addFiles(selected);
  };

  const addFiles = (newFiles: File[]) => {
    const fileObjects: FileObject[] = newFiles.map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      size: f.size,
      progress: 0,
      status: 'uploading' as const,
    }));
    setFiles((prev) => [...prev, ...fileObjects]);

    fileObjects.forEach((fo) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fo.id ? { ...f, progress: 100, status: 'done' as const } : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fo.id ? { ...f, progress: Math.min(progress, 99) } : f
            )
          );
        }
      }, 400);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={{
          borderColor: isDragging ? '#4F46E5' : '#E2E8F0',
          backgroundColor: isDragging ? '#EEF2FF' : '#FAFBFC',
        }}
        className="relative cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xls,.xlsx,.csv"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5"
        >
          <Upload className={`w-7 h-7 ${isDragging ? 'text-indigo-600' : 'text-indigo-400'} transition-colors`} />
        </motion.div>

        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {isDragging ? 'Отпустите файл' : 'Перетащите файлы сюда'}
        </h3>
        <p className="text-slate-400 mb-4">или нажмите для выбора</p>
        <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 rounded-lg px-4 py-2">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Поддерживаются XLS, XLSX, CSV
        </div>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-slate-150 rounded-xl p-4 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  file.status === 'done' ? 'bg-emerald-50' : 'bg-indigo-50'
                }`}>
                  {file.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-700 truncate pr-4">{file.name}</p>
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatSize(file.size)}</span>
                  </div>
                  {file.status === 'uploading' ? (
                    <Progress value={file.progress} className="h-1.5" />
                  ) : (
                    <p className="text-xs text-emerald-600 font-medium">Загружен</p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </motion.div>
            ))}

            <div className="flex justify-end pt-2">
              <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 shadow-lg shadow-indigo-200">
                Начать сверку
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
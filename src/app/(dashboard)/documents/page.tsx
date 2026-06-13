'use client';

import { useState, useEffect, useCallback } from 'react';
import { Document as DocType } from '@/types';
import { documents as seedDocuments } from '@/data/seed';
import { formatDate, formatFileSize, getStatusColor } from '@/lib/format';
import {
  Upload,
  FileText,
  Image,
  Mail,
  Brain,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  File,
} from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);

  useEffect(() => {
    setDocuments(seedDocuments);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploading(true);
    setUploadQueue(files);

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const doc = await res.json();
          setDocuments((prev) => [doc, ...prev]);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setUploading(false);
    setUploadQueue([]);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (mimeType === 'message/rfc822') return <Mail className="w-5 h-5 text-purple-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const getProcessingIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing': return <Brain className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload invoices, receipts, photos, and emails — AI extracts the data automatically
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging
            ? 'border-brand-400 bg-brand-50'
            : 'border-gray-300 hover:border-brand-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDragging ? 'bg-brand-100' : 'bg-gray-100'}`}>
            <Upload className={`w-7 h-7 ${isDragging ? 'text-brand-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports PDF, Images (JPG, PNG), Email (.eml), CSV, and text files
            </p>
          </div>
          <label className="btn-primary cursor-pointer">
            <Upload className="w-4 h-4" />
            Choose Files
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.eml,.csv,.txt,.json"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="card card-body">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-5 h-5 text-brand-600 animate-pulse" />
            <p className="text-sm font-medium text-gray-900">Processing documents with AI...</p>
          </div>
          {uploadQueue.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2">
              <div className="flex-1">
                <p className="text-sm text-gray-700">{file.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-brand-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document List */}
      <div className="card overflow-hidden">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Processed Documents ({documents.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {documents.map((doc) => (
            <div key={doc.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              {/* File Icon */}
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                {getFileIcon(doc.mimeType)}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.originalName}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{formatDate(doc.uploadedAt)}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className={`badge ${getStatusColor(doc.type)}`}>{doc.type}</span>
                </div>
              </div>

              {/* Extracted Data Preview */}
              {doc.extractedData && doc.processingStatus === 'completed' && (
                <div className="text-right">
                  {doc.extractedData.vendor && (
                    <p className="text-sm font-medium text-gray-700">{doc.extractedData.vendor}</p>
                  )}
                  {doc.extractedData.totalAmount && (
                    <p className="text-sm font-semibold text-gray-900">
                      ${doc.extractedData.totalAmount.toLocaleString()}
                    </p>
                  )}
                  {doc.extractedData.confidence && (
                    <p className="text-xs text-gray-400">
                      {Math.round(doc.extractedData.confidence * 100)}% confidence
                    </p>
                  )}
                </div>
              )}

              {/* Processing Status */}
              <div className="flex items-center gap-1">
                {getProcessingIcon(doc.processingStatus)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

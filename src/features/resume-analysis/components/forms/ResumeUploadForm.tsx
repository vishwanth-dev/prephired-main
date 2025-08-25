// src/features/resume-analysis/components/forms/ResumeUploadForm.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useResumeAnalysisStore } from '../../store/resumeAnalysisStore';
import { ResumeAnalysisService } from '../../services/resumeAnalysisService';
import { RESUME_ANALYSIS_CONFIG } from '../../constants';

import { Button } from '@/components/atoms';
import { Progress } from '@/components/atoms/progress';
import Badge from '@/components/atoms/badge';
import { Alert, AlertDescription } from '@/components/atoms/alert';
import { Card, CardContent } from '@/components/atoms/card';

interface ResumeUploadFormProps {
  onUploadComplete?: (resumeId: string) => void;
  onCancel?: () => void;
  className?: string;
  maxFiles?: number;
  replaceExisting?: boolean;
}

interface FileUploadState {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  error?: string;
  resumeId?: string;
}

export const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({
  onUploadComplete,
  onCancel,
  className = '',
  maxFiles = 1,
  replaceExisting = false,
}) => {
  const [uploadStates, setUploadStates] = useState<FileUploadState[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const { uploadResume, clearUploadProgress } = useResumeAnalysisStore();

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragActive(false);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(rejected => ({
        file: rejected.file,
        errors: rejected.errors.map((error: any) => error.message).join(', '),
      }));

      console.error('Rejected files:', errors);
      // You could show these errors in the UI
    }

    // Process accepted files
    acceptedFiles.forEach(file => {
      const validation = ResumeAnalysisService.validateResumeFile(file);
      const fileId = ResumeAnalysisService.generateFileId(file.name);

      if (!validation.valid) {
        setUploadStates((prev: FileUploadState[]) => [
          ...prev,
          {
            file,
            id: fileId,
            status: 'failed',
            progress: 0,
            error: validation.error || '',
          },
        ]);
        return;
      }

      // Add to upload queue
      setUploadStates(prev => [
        ...prev,
        {
          file,
          id: fileId,
          status: 'pending',
          progress: 0,
        },
      ]);

      // Start upload
      startUpload(file, fileId);
    });
  }, []);

  const startUpload = async (file: File, fileId: string) => {
    // Update state to uploading
    setUploadStates(prev =>
      prev.map(state => (state.id === fileId ? { ...state, status: 'uploading' as const } : state))
    );

    try {
      const resumeId = await uploadResume(file, { replaceExisting });

      // Update to completed
      setUploadStates(prev =>
        prev.map(state =>
          state.id === fileId
            ? {
                ...state,
                status: 'completed' as const,
                progress: 100,
                resumeId,
              }
            : state
        )
      );

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(resumeId);
      }
    } catch (error) {
      // Update to failed
      setUploadStates(prev =>
        prev.map(state =>
          state.id === fileId
            ? {
                ...state,
                status: 'failed' as const,
                progress: 0,
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : state
        )
      );
    }
  };

  const removeFile = (fileId: string) => {
    setUploadStates(prev => prev.filter(state => state.id !== fileId));
    clearUploadProgress(fileId);
  };

  const retryUpload = (fileId: string) => {
    const fileState = uploadStates.find(state => state.id === fileId);
    if (fileState) {
      startUpload(fileState.file, fileId);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles,
    maxSize: RESUME_ANALYSIS_CONFIG.VALIDATION.FILE_SIZE.MAX,
    disabled: uploadStates.some(state => state.status === 'uploading'),
  });

  const formatFileSize = (bytes: number) => {
    return ResumeAnalysisService.formatFileSize(bytes);
  };

  const getStatusIcon = (status: FileUploadState['status']) => {
    switch (status) {
      case 'pending':
        return <FileText className='w-4 h-4 text-gray-400' />;
      case 'uploading':
        return <Loader2 className='w-4 h-4 text-blue-500 animate-spin' />;
      case 'completed':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'failed':
        return <AlertCircle className='w-4 h-4 text-red-500' />;
    }
  };

  const getStatusColor = (status: FileUploadState['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-600';
      case 'uploading':
        return 'bg-blue-100 text-blue-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
    }
  };

  const completedUploads = uploadStates.filter(state => state.status === 'completed');
  const hasUploads = uploadStates.length > 0;
  const isUploading = uploadStates.some(state => state.status === 'uploading');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`transition-all duration-200 ${
          isDragActive || dragActive
            ? 'border-orange-400 bg-orange-50 border-2'
            : 'border-dashed border-2 border-gray-300 hover:border-gray-400'
        }`}
      >
        <CardContent className='p-8'>
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-all duration-200 ${
              isDragActive ? 'scale-105' : ''
            }`}
          >
            <input {...getInputProps()} data-tour='upload-resume' />

            <motion.div
              animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
              className='flex flex-col items-center space-y-4'
            >
              <div
                className={`p-4 rounded-full transition-colors duration-200 ${
                  isDragActive ? 'bg-orange-100 text-orange-600' : 'bg-orange-50 text-orange-500'
                }`}
              >
                <Upload className='w-8 h-8' />
              </div>

              <div className='space-y-2'>
                <h3 className='text-lg font-medium text-gray-900'>
                  {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
                </h3>
                <p className='text-gray-500'>
                  Drag & drop your resume file here or{' '}
                  <span className='text-orange-500 font-medium'>click to browse</span>
                </p>
              </div>

              <div className='flex items-center space-x-4 text-sm text-gray-400'>
                <span>PDF, DOC, DOCX</span>
                <span>•</span>
                <span>
                  Max{' '}
                  {ResumeAnalysisService.formatFileSize(
                    RESUME_ANALYSIS_CONFIG.VALIDATION.FILE_SIZE.MAX
                  )}
                </span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Status */}
      <AnimatePresence>
        {hasUploads && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='space-y-3'
          >
            {uploadStates.map(uploadState => (
              <motion.div
                key={uploadState.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className='bg-white border rounded-lg p-4 shadow-sm'
              >
                <div className='flex items-center space-x-3'>
                  {/* File Icon */}
                  <div className='flex-shrink-0'>{getStatusIcon(uploadState.status)}</div>

                  {/* File Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {uploadState.file.name}
                      </p>
                      <Badge variant='outline' className={getStatusColor(uploadState.status)}>
                        {uploadState.status}
                      </Badge>
                    </div>

                    <p className='text-xs text-gray-500'>
                      {formatFileSize(uploadState.file.size)} • {uploadState.file.type}
                    </p>

                    {/* Progress Bar */}
                    {uploadState.status === 'uploading' && (
                      <div className='mt-2'>
                        <Progress value={uploadState.progress} className='h-2' />
                        <p className='text-xs text-gray-500 mt-1'>
                          {uploadState.progress}% uploaded
                        </p>
                      </div>
                    )}

                    {/* Error Message */}
                    {uploadState.error && (
                      <Alert className='mt-2 border-red-200 bg-red-50' variant='destructive'>
                        <AlertCircle className='h-4 w-4 text-red-500' />
                        <AlertDescription className='text-red-700 text-sm'>
                          {uploadState.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Success Message */}
                    {uploadState.status === 'completed' && (
                      <Alert className='mt-2 border-green-200 bg-green-50'>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        <AlertDescription className='text-green-700 text-sm'>
                          Resume uploaded successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex items-center space-x-2'>
                    {uploadState.status === 'failed' && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => retryUpload(uploadState.id)}
                        className='text-orange-600 border-orange-200 hover:bg-orange-50'
                      >
                        Retry
                      </Button>
                    )}

                    {uploadState.status !== 'uploading' && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeFile(uploadState.id)}
                        className='text-gray-400 hover:text-red-500'
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {hasUploads && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center justify-between pt-4 border-t'
        >
          <div className='text-sm text-gray-500'>
            {completedUploads.length > 0 && (
              <>
                {completedUploads.length} file{completedUploads.length > 1 ? 's' : ''} uploaded
                successfully
              </>
            )}
            {isUploading && <span className='text-blue-600'>Uploading in progress...</span>}
          </div>

          <div className='flex items-center space-x-3'>
            {onCancel && (
              <Button variant='outline' onClick={onCancel} disabled={isUploading}>
                Cancel
              </Button>
            )}

            {completedUploads.length > 0 && (
              <Button
                onClick={() => {
                  if (completedUploads[0]?.resumeId && onUploadComplete) {
                    onUploadComplete(completedUploads[0].resumeId);
                  }
                }}
                className='bg-orange-500 hover:bg-orange-600 text-white'
                disabled={isUploading}
              >
                Continue
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
              <span className='text-blue-600 text-sm font-medium'>?</span>
            </div>
          </div>
          <div className='flex-1'>
            <h4 className='text-sm font-medium text-blue-900 mb-1'>Tips for best results</h4>
            <ul className='text-sm text-blue-800 space-y-1'>
              <li>• Use a recent version of your resume (within the last 6 months)</li>
              <li>• Ensure all text is selectable (not scanned images)</li>
              <li>• Include complete contact information</li>
              <li>• Save in PDF format for best compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

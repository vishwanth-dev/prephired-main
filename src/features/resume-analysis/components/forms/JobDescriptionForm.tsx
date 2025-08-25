// src/features/resume-analysis/components/forms/JobDescriptionForm.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Wand2,
  Type,
  Link,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { useResumeAnalysisStore } from '../../store/resumeAnalysisStore';
import { ResumeAnalysisService } from '../../services/resumeAnalysisService';
import { RESUME_ANALYSIS_CONFIG } from '../../constants';
import { JobDescriptionForm as JobDescriptionFormData } from '../../domain/entities';

import { Button } from '@/components/atoms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Textarea } from '@/components/atoms/textarea';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Alert, AlertDescription } from '@/components/atoms/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import Badge from '@/components/atoms/badge';

// Validation schema - updated to match store types
const jobDescriptionSchema = z.object({
  title: z.string().optional(),
  description: z
    .string()
    .min(
      RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MIN_LENGTH,
      `Description must be at least ${RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MIN_LENGTH} characters`
    )
    .max(
      RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MAX_LENGTH,
      `Description must not exceed ${RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MAX_LENGTH} characters`
    ),
  source: z.enum(['manual', 'file']),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type JobDescriptionFormValues = z.infer<typeof jobDescriptionSchema>;

interface JobDescriptionFormProps {
  onSubmit?: (jobDescriptionId: string) => void;
  onCancel?: () => void;
  className?: string;
  initialData?: Partial<JobDescriptionFormData>;
  showTitle?: boolean;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  onSubmit,
  onCancel,
  className = '',
  initialData,
  showTitle = true,
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'file' | 'url' | 'ai'>('manual');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(initialData?.description?.length || 0);
  const [urlContent, setUrlContent] = useState('');

  const {
    createJobDescription,
    uploadJobDescriptionFile,
    jobDescriptionError,
  } = useResumeAnalysisStore();

  const form = useForm<JobDescriptionFormValues>({
    resolver: zodResolver(jobDescriptionSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      source: initialData?.source || 'manual',
      url: '',
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
  } = form;
  const description = watch('description');
  const source = watch('source');

  // Update character count when description changes
  React.useEffect(() => {
    setCharacterCount(description?.length || 0);
  }, [description]);

  // File upload handling
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadFile(file);
        setValue('source', 'file');
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MAX_FILE_SIZE,
  });

  const removeUploadFile = () => {
    setUploadFile(null);
    setValue('source', 'manual');
  };

  // Handle URL content extraction (placeholder for future implementation)
  const handleUrlSubmit = async (url: string) => {
    // This would typically involve fetching content from the URL
    // For now, we'll set a placeholder and treat it as manual input
    setUrlContent(`Content from: ${url}`);
    setValue('description', `Content from: ${url}`);
    setValue('source', 'manual');
  };

  // Form submission
  const onFormSubmit = async (data: JobDescriptionFormValues) => {
    setIsSubmitting(true);

    try {
      let jobDescriptionId: string;

      if (data.source === 'file' && uploadFile) {
        // Upload file
        jobDescriptionId = await uploadJobDescriptionFile(uploadFile);
      } else {
        // Manual text input (including URL-extracted content)
        jobDescriptionId = await createJobDescription({
          title: data.title || undefined,
          description: data.description,
          source: data.source,
        });
      }

      if (onSubmit) {
        onSubmit(jobDescriptionId);
      }
    } catch {
      // Error handling is done through the store
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI-powered job description generation (placeholder)
  const generateWithAI = async () => {
    // This would integrate with an AI service to generate job descriptions
    // For now, it's a placeholder
    // AI generation feature coming soon...
  };

  const getCharacterCountColor = () => {
    const maxLength = RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MAX_LENGTH;
    const percentage = (characterCount / maxLength) * 100;

    if (percentage > 90) return 'text-red-500';
    if (percentage > 75) return 'text-amber-500';
    return 'text-gray-500';
  };

  const isFormValid = () => {
    if (source === 'file') return !!uploadFile;
    if (activeTab === 'url') return !!watch('url');
    return characterCount >= RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MIN_LENGTH;
  };

  const handleTabChange = (value: string) => {
    const tabValue = value as 'manual' | 'file' | 'url' | 'ai';
    setActiveTab(tabValue);
    
    if (tabValue === 'ai') {
      setValue('source', 'manual');
    } else if (tabValue === 'file') {
      setValue('source', 'file');
    } else {
      setValue('source', 'manual');
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div>
          <h2 className='text-2xl font-semibold text-gray-900'>Job Description</h2>
          <p className='mt-2 text-gray-600'>
            Add the job description you want to optimize your resume for
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
          {/* Input Method Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='manual' className='flex items-center space-x-2'>
                <Type className='w-4 h-4' />
                <span className='hidden sm:inline'>Type</span>
              </TabsTrigger>
              <TabsTrigger value='file' className='flex items-center space-x-2'>
                <FileText className='w-4 h-4' />
                <span className='hidden sm:inline'>Upload</span>
              </TabsTrigger>
              <TabsTrigger value='url' className='flex items-center space-x-2'>
                <Link className='w-4 h-4' />
                <span className='hidden sm:inline'>URL</span>
              </TabsTrigger>
              <TabsTrigger value='ai' className='flex items-center space-x-2'>
                <Wand2 className='w-4 h-4' />
                <span className='hidden sm:inline'>AI</span>
              </TabsTrigger>
            </TabsList>

            {/* Manual Text Input */}
            <TabsContent value='manual' className='space-y-4'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g. Senior Frontend Developer'
                          className='w-full'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          data-tour='job-description'
                          placeholder='Paste the job description here...'
                          className='min-h-[200px] resize-none'
                          maxLength={RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MAX_LENGTH}
                        />
                      </FormControl>
                      <div className='flex items-center justify-between text-sm'>
                        <FormMessage />
                        <span className={getCharacterCountColor()}>
                          {characterCount} /{' '}
                          {RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MAX_LENGTH}
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* File Upload */}
            <TabsContent value='file' className='space-y-4'>
              {!uploadFile ? (
                <Card
                  className={`transition-all duration-200 ${
                    isDragActive
                      ? 'border-orange-400 bg-orange-50 border-2'
                      : 'border-dashed border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CardContent className='p-6'>
                    <div {...getRootProps()} className='text-center cursor-pointer'>
                      <input {...getInputProps()} />
                      <motion.div
                        animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                        className='flex flex-col items-center space-y-4'
                      >
                        <div
                          className={`p-3 rounded-full ${
                            isDragActive
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <Upload className='w-6 h-6' />
                        </div>
                        <div>
                          <p className='text-gray-700 font-medium'>
                            {isDragActive ? 'Drop the file here' : 'Upload Job Description File'}
                          </p>
                          <p className='text-sm text-gray-500 mt-1'>PDF, DOC, DOCX, or TXT files</p>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <FileText className='w-8 h-8 text-orange-500' />
                        <div>
                          <p className='font-medium text-gray-900'>{uploadFile.name}</p>
                          <p className='text-sm text-gray-500'>
                            {ResumeAnalysisService.formatFileSize(uploadFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button type='button' variant='ghost' size='sm' onClick={removeUploadFile}>
                        <X className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* URL Input */}
            <TabsContent value='url' className='space-y-4'>
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Posting URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='url'
                        placeholder='https://example.com/job-posting'
                        className='w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='button'
                onClick={() => handleUrlSubmit(watch('url') || '')}
                disabled={!watch('url')}
                className='w-full'
              >
                Extract Content
              </Button>

              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  We&apos;ll automatically extract the job description from the provided URL.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* AI Generation */}
            <TabsContent value='ai' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2'>
                    <Wand2 className='w-5 h-5 text-purple-500' />
                    <span>Generate with AI</span>
                    <Badge variant='secondary'>Coming Soon</Badge>
                  </CardTitle>
                  <CardDescription>
                    Let AI create a job description based on your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4'>
                    <div>
                      <Label htmlFor='ai-role'>Role Title</Label>
                      <Input id='ai-role' placeholder='e.g. Senior Frontend Developer' disabled />
                    </div>
                    <div>
                      <Label htmlFor='ai-company'>Company Type</Label>
                      <Input
                        id='ai-company'
                        placeholder='e.g. Tech startup, Fortune 500, Agency'
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor='ai-skills'>Key Skills (Optional)</Label>
                      <Input
                        id='ai-skills'
                        placeholder='e.g. React, TypeScript, Node.js'
                        disabled
                      />
                    </div>
                  </div>

                  <Button type='button' onClick={generateWithAI} disabled className='w-full'>
                    <Wand2 className='w-4 h-4 mr-2' />
                    Generate Job Description
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Error Display */}
          {jobDescriptionError && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{jobDescriptionError}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className='flex items-center justify-between pt-4 border-t'>
            <div className='text-sm text-gray-500'>
              {characterCount > 0 && activeTab === 'manual' && (
                <span
                  className={
                    characterCount < RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MIN_LENGTH
                      ? 'text-red-500'
                      : 'text-green-600'
                  }
                >
                  {characterCount < RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MIN_LENGTH
                    ? `Need ${RESUME_ANALYSIS_CONFIG.VALIDATION.JOB_DESCRIPTION.MIN_LENGTH - characterCount} more characters`
                    : 'Ready for analysis'}
                </span>
              )}
            </div>

            <div className='flex items-center space-x-3'>
              {onCancel && (
                <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}

              <Button
                type='submit'
                disabled={!isFormValid() || isSubmitting}
                className='bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

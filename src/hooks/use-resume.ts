'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getResume, updateResume } from '@/lib/api/resume';
import type { Resume } from '@/types/resume';

export function useResume(resumeId?: string) {
  const params = useParams();
  const id = resumeId || (params.resumeId as string);
  
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getResume(id);
      if (response.data.success) {
        setResume(response.data.data ?? null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load resume');
    } finally {
      setIsLoading(false);
    }
  };

  const saveResume = useCallback(async (data: Partial<Resume>) => {
    if (!id) return;
    setIsSaving(true);
    setError('');
    try {
      const response = await updateResume(id, data);
      if (response.data.success) {
        setResume(response.data.data ?? null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save resume');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [id]);

  return { resume, isLoading, isSaving, error, saveResume, refresh: fetchResume };
}
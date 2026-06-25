"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { getResume, updateResume } from "@/lib/api/resume";
import type { Resume } from "@/types/resume";

interface ResumeContextType {
  resume: Resume | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string;
  refreshResume: () => Promise<void>;
  saveResume: (data: Partial<Resume>) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export function ResumeProvider({
  resumeId,
  children,
}: {
  resumeId: string;
  children: ReactNode;
}) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchResume = useCallback(async () => {
    if (!resumeId) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await getResume(resumeId);
      if (response.data.success) {
        console.log("[Context] Fetched resume:", response.data.data);
        setResume(response.data.data ?? null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load resume");
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const saveResume = async (data: Partial<Resume>) => {
    if (!resumeId) return;
    setIsSaving(true);
    setError("");
    try {
      const response = await updateResume(resumeId, data);
      if (response.data.success) {
        setResume(response.data.data ?? null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save resume");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };
  // Remove useCallback wrapper

  return (
    <ResumeContext.Provider
      value={{
        resume,
        isLoading,
        isSaving,
        error,
        refreshResume: fetchResume,
        saveResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResumeContext must be used within ResumeProvider");
  }
  return context;
}

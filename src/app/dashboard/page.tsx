'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Clock, MoreVertical, Trash2, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/lib/api';
import type { Resume } from '@/types/resume';

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get('/resume');
      if (response.data.success) {
        setResumes(response.data.data);
      }
    } catch {
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async () => {
    setIsCreating(true);
    try {
      const response = await api.post('/resume/create');
      if (response.data.success) {
        const newResume = response.data.data;
        router.push(`/resume/${newResume._id}/personal-info`);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create resume');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
    } catch {
      alert('Failed to delete resume');
    }
  };

  return (
    <div className="min-h-svh bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Resumes</h1>
              <p className="text-sm text-slate-500">Manage and create your AI-powered resumes</p>
            </div>
          </div>
          <Button onClick={createResume} disabled={isCreating} className="bg-slate-900 hover:bg-slate-800">
            {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            New Resume
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-48 animate-pulse bg-slate-100 border-0" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No resumes yet</h3>
            <p className="text-slate-500 mb-6">Create your first AI-powered resume in seconds</p>
            <Button onClick={createResume} disabled={isCreating} className="bg-slate-900 hover:bg-slate-800">
              {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Create Resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <Card key={resume._id} className="group hover:shadow-lg transition-all border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {resume.title || 'Untitled Resume'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/resume/${resume._id}/personal-info`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteResume(resume._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      {resume.skills?.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {typeof skill === 'string' ? skill : skill.name}
                        </span>
                      ))}
                      {resume.skills && resume.skills.length > 4 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{resume.skills.length - 4}
                        </span>
                      )}
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/resume/${resume._id}/personal-info`}>
                        Continue Editing
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
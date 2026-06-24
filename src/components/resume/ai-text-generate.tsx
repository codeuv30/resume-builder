'use client';

import { useState } from 'react';
import { Sparkles, Wand2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface AITextGenerateProps {
  onApply: (text: string) => void;
  title: string;
  contextLabel: string;
  contextPlaceholder: string;
  generateFn: (context: string) => Promise<string>;
}

export function AITextGenerate({ 
  onApply, 
  title, 
  contextLabel, 
  contextPlaceholder,
  generateFn 
}: AITextGenerateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState('');
  const [generated, setGenerated] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setIsGenerating(true);
    try {
      const text = await generateFn(context);
      setGenerated(text);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    onApply(generated);
    setIsOpen(false);
    setGenerated('');
    setContext('');
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
      >
        <Sparkles className="h-4 w-4" />
        Generate with AI
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-4 mt-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          {title}
        </h4>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600">{contextLabel}</label>
        <div className="flex gap-2">
          <Input
            placeholder={contextPlaceholder}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="flex-1 bg-white"
          />
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !context.trim()}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {generated && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600">Generated result:</label>
          <Textarea
            value={generated}
            onChange={(e) => setGenerated(e.target.value)}
            className="min-h-[100px] bg-white text-sm"
          />
          <Button
            type="button"
            onClick={handleApply}
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Apply to Form
          </Button>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Sparkles, Wand2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface AIField {
  key: string;
  label: string;
  placeholder: string;
  type?: 'input' | 'textarea';
}

interface AITextGenerateProps {
  onApply: (text: string) => void;
  title: string;
  fields: AIField[];
  generateFn: (values: Record<string, string>) => Promise<string>;
}

export function AITextGenerate({ 
  onApply, 
  title, 
  fields,
  generateFn 
}: AITextGenerateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // Check all required fields have values
    const hasAllValues = fields.every(f => values[f.key]?.trim());
    if (!hasAllValues) return;
    
    setIsGenerating(true);
    try {
      const text = await generateFn(values);
      setGenerated(text);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    onApply(generated);
    setIsOpen(false);
    setGenerated('');
    setValues({});
  };

  const updateValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
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

  const allFilled = fields.every(f => values[f.key]?.trim());

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

      <div className="space-y-3">
        {fields.map(field => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">{field.label}</label>
            {field.type === 'textarea' ? (
              <Textarea
                placeholder={field.placeholder}
                value={values[field.key] || ''}
                onChange={(e) => updateValue(field.key, e.target.value)}
                className="min-h-[60px] bg-white text-sm"
              />
            ) : (
              <Input
                placeholder={field.placeholder}
                value={values[field.key] || ''}
                onChange={(e) => updateValue(field.key, e.target.value)}
                className="bg-white"
              />
            )}
          </div>
        ))}
        
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !allFilled}
          size="sm"
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Generate
        </Button>
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
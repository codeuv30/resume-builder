'use client';

import { useState } from 'react';
import { Sparkles, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAIGeneration } from '@/hooks/use-ai';

interface AISkillSuggestProps {
  onAddSkills: (skills: string[]) => void;
  existingSkills: string[];
}

export function AISkillSuggest({ onAddSkills, existingSkills }: AISkillSuggestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const { generateSkills, isGenerating } = useAIGeneration();

  const handleGenerate = async () => {
    if (!context.trim()) return;
    const skills = await generateSkills(context);
    setSuggestedSkills(skills.filter(s => !existingSkills.includes(s)));
    setSelectedSkills(new Set());
  };

  const toggleSkill = (skill: string) => {
    const next = new Set(selectedSkills);
    if (next.has(skill)) next.delete(skill);
    else next.add(skill);
    setSelectedSkills(next);
  };

  const handleAdd = () => {
    onAddSkills(Array.from(selectedSkills));
    setIsOpen(false);
    setSuggestedSkills([]);
    setSelectedSkills(new Set());
    setContext('');
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
      >
        <Sparkles className="h-4 w-4" />
        Suggest Skills with AI
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Skill Suggestions
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
        <label className="text-xs font-medium text-slate-600">
          Describe your role & experience
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Senior React Developer with 5 years in fintech"
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

      {suggestedSkills.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">Click to select skills:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSkills.has(skill)
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          {selectedSkills.size > 0 && (
            <Button
              type="button"
              onClick={handleAdd}
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {selectedSkills.size} Skill{selectedSkills.size > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
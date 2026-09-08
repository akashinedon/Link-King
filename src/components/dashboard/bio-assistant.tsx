'use client';

import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { generateBios, type BioTone } from '@/lib/bio-generator';

const TONES: { id: BioTone; label: string }[] = [
    { id: 'professional', label: 'Professional' },
    { id: 'friendly', label: 'Friendly' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'bold', label: 'Bold' },
];

interface BioAssistantProps {
    onApply: (bio: string) => void;
}

export default function BioAssistant({ onApply }: BioAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState<BioTone>('friendly');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleGenerate = () => {
        setSuggestions(generateBios(keywords, tone));
    };

    return (
        <div className="mt-2">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
                <Sparkles className="w-3.5 h-3.5" />
                Bio Assistant
            </button>

            {isOpen && (
                <div className="mt-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3 animate-slide-down">
                    <p className="text-xs text-gray-500">
                        Describe yourself in a few words and pick a tone - we&apos;ll turn it into
                        bio suggestions you can tweak.
                    </p>

                    <input
                        type="text"
                        className="input-field text-sm"
                        placeholder="e.g. frontend developer, react, coffee"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />

                    <div className="flex flex-wrap gap-2">
                        {TONES.map(({ id, label }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setTone(id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                    tone === id
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!keywords.trim()}
                        className="btn-primary text-sm py-2 disabled:opacity-50"
                    >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Generate bios
                    </button>

                    {suggestions.length > 0 && (
                        <div className="space-y-2 pt-1">
                            {suggestions.map((bio, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => onApply(bio)}
                                    className="w-full text-left p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors text-sm flex items-start gap-2 group"
                                >
                                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-gray-300 group-hover:text-primary-500 transition-colors" />
                                    <span>{bio}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

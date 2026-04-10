'use client';

import { useState, useRef, useEffect } from 'react';

interface QuestionInputProps {
  onSubmit: (question: string, isVoiceInput: boolean) => void;
  isLoading?: boolean;
}

export default function QuestionInput({ onSubmit, isLoading = false }: QuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'fr-FR';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => setIsRecording(true);
        recognitionRef.current.onend = () => setIsRecording(false);

        recognitionRef.current.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setQuestion((prev) => prev + (prev ? ' ' : '') + transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
      }
    }
  }, []);

  const handleStartDictation = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const handleStopDictation = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim(), false);
      setQuestion('');
    }
  };

  const charCount = question.length;
  const maxChars = 2000;
  const percentFilled = (charCount / maxChars) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gradient-to-br from-[#1a202c] to-[#0f1419] border border-[#2d3748] rounded-xl p-8 space-y-6 shadow-xl hover:border-[#374151] transition-all duration-300">
        {/* Label */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#f8fafc]">
            Votre question juridique
          </label>
          <p className="text-xs text-[#94a3b8]">
            Décrivez votre situation juridique en détail. Vous pouvez aussi utiliser la dictée vocale.
          </p>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, maxChars))}
            placeholder="Entrez votre question ici... Par exemple: 'Je souhaite savoir si...'"
            className="w-full h-40 px-6 py-4 bg-[#0f1419] border border-[#2d3748] rounded-lg text-[#f8fafc] placeholder-[#475569] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30 focus:outline-none resize-none transition-all duration-200"
            disabled={isLoading}
          />

          {/* Character Counter */}
          <div className="absolute bottom-4 right-4 text-xs text-[#94a3b8]">
            {charCount} / {maxChars}
          </div>

          {/* Progress Bar */}
          <div className="mt-2 h-1 bg-[#1a202c] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                percentFilled > 90 ? 'bg-[#ef4444]' : 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Voice Input Button */}
          <div className="flex gap-2">
            {recognitionRef.current && (
              <>
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartDictation}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d3748] hover:bg-[#374151] text-[#cbd5e1] rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#475569] border border-transparent"
                  >
                    <span className="text-lg">🎤</span>
                    <span>Dictée vocale</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopDictation}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#7f3a3a] hover:bg-[#8f4a4a] text-[#fca5a5] rounded-lg font-medium transition-all duration-200 border border-[#ef4444]/30"
                  >
                    <span className="animate-pulse text-xl">●</span>
                    <span>Arrêter</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Analyser</span>
              </>
            )}
          </button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="bg-[#3a1f1f] border border-[#7f3a3a] rounded-lg p-4 flex items-center gap-3">
            <span className="text-2xl animate-pulse">🎙️</span>
            <div>
              <p className="text-[#fca5a5] font-semibold">Enregistrement en cours</p>
              <p className="text-[#cbd5e1] text-sm">Parlez maintenant... L'audio sera transcrit en texte.</p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

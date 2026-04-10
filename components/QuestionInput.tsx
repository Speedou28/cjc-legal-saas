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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Votre question juridique
        </label>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Décrivez votre question juridique ici... Vous pouvez également utiliser la dictée vocale."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {recognitionRef.current && (
              <>
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartDictation}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>🎤</span>
                    Dictée vocale
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopDictation}
                    className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded-lg transition flex items-center gap-2"
                  >
                    <span className="animate-pulse">●</span>
                    Arrêter
                  </button>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Traitement...' : 'Envoyer'}
          </button>
        </div>

        {isRecording && (
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="animate-pulse">●</span>
            Écoute en cours... Parlez maintenant.
          </p>
        )}
      </div>
    </form>
  );
}

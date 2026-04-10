'use client';

import { useState } from 'react';
import QuestionInput from '@/components/QuestionInput';

export default function DashboardPage() {
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedDomains, setDetectedDomains] = useState<string[]>([]);

  const handleSubmitQuestion = async (question: string, isVoiceInput: boolean) => {
    setIsLoading(true);
    setDetectedDomains([]);
    setResponse(null);

    try {
      const res = await fetch('/api/questions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, isVoiceInput }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit question');
      }

      const data = await res.json();
      setResponse(data.response);
      setDetectedDomains(data.domainsDetected || []);
    } catch (error) {
      console.error('Error:', error);
      setResponse({ error: 'Une erreur est survenue. Vérifiez que la clé API est configurée.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
          Consultation Juridique
        </h1>
        <p className="text-[#cbd5e1] text-lg">
          Posez votre question juridique. Notre système détectera automatiquement les domaines pertinents.
        </p>
      </div>

      {/* Question Input */}
      <QuestionInput onSubmit={handleSubmitQuestion} isLoading={isLoading} />

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl bg-[#1a202c] border border-[#2d3748]">
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#374151]"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#3b82f6] border-r-[#3b82f6] animate-spin"></div>
          </div>
          <span className="text-[#cbd5e1] font-medium">Traitement de votre question...</span>
          <span className="text-[#94a3b8] text-sm mt-2">Cela peut prendre quelques secondes</span>
        </div>
      )}

      {/* Detected Domains */}
      {detectedDomains.length > 0 && (
        <div className="bg-gradient-to-r from-[#1a3a52] to-[#0f2847] border border-[#2d5a7b] rounded-xl p-6">
          <p className="text-sm font-semibold text-[#60a5fa] mb-4 flex items-center gap-2">
            <span>🏛️</span> Domaines juridiques détectés
          </p>
          <div className="flex flex-wrap gap-3">
            {detectedDomains.map((domain) => (
              <span
                key={domain}
                className="px-4 py-2 bg-[#1e3a5f]/60 text-[#60a5fa] rounded-full text-sm font-medium border border-[#2d5a7b] hover:bg-[#1e3a5f] transition-all duration-200"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Response */}
      {response && !response.error && (
        <div className="bg-gradient-to-br from-[#1a202c] to-[#0f1419] border border-[#2d3748] rounded-xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#f8fafc]">Réponse Juridique</h2>
            <p className="text-[#94a3b8] text-sm">Analyse générée par l'IA Claude</p>
          </div>

          {/* Model Info Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1e3a5f] to-[#0f2847] border border-[#2d5a7b] rounded-lg px-4 py-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-xs text-[#94a3b8]">Modèle utilisé</p>
              <p className="text-[#60a5fa] font-semibold">
                {response.modelChoice?.toUpperCase()}
                {response.modelChoice === 'haiku' && ' • Rapide & Économique'}
                {response.modelChoice === 'sonnet' && ' • Équilibré & Précis'}
                {response.modelChoice === 'opus' && ' • Complet & Expert'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#0f1419] rounded-lg p-6 border border-[#2d3748]">
            <div className="text-[#cbd5e1] whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none">
              {response.content || response}
            </div>
          </div>

          {/* Tokens & Cost */}
          {response.tokens_input && (
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#2d3748]">
              <div className="bg-[#1a202c] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-1">Tokens (Input)</p>
                <p className="text-lg font-bold text-[#60a5fa]">{response.tokens_input}</p>
              </div>
              <div className="bg-[#1a202c] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-1">Tokens (Output)</p>
                <p className="text-lg font-bold text-[#60a5fa]">{response.tokens_output}</p>
              </div>
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2847] rounded-lg p-4 border border-[#2d5a7b]">
                <p className="text-xs text-[#94a3b8] mb-1">Coût Total</p>
                <p className="text-lg font-bold text-[#10b981]">
                  ${response.cost?.toFixed(4) || '0.00'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {response?.error && (
        <div className="bg-gradient-to-r from-[#3a1f1f] to-[#2a0f0f] border border-[#7f3a3a] rounded-xl p-6 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-[#fca5a5] mb-1">Erreur</p>
              <p className="text-[#f8fafc]">{response.error}</p>
              <p className="text-[#cbd5e1] text-sm mt-2">
                💡 <strong>Astuce:</strong> Assurez-vous que la clé API Anthropic est configurée dans les variables d'environnement Vercel.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

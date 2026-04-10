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
        throw new Error('Failed to submit question');
      }

      const data = await res.json();
      setResponse(data.response);
      setDetectedDomains(data.domainsDetected || []);
    } catch (error) {
      console.error('Error:', error);
      setResponse({ error: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultation Juridique</h1>
        <p className="text-gray-600">
          Posez votre question juridique. Notre système détectera automatiquement les domaines pertinents.
        </p>
      </div>

      <QuestionInput onSubmit={handleSubmitQuestion} isLoading={isLoading} />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Traitement de votre question...</span>
        </div>
      )}

      {detectedDomains.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Domaines juridiques détectés:</p>
          <div className="flex flex-wrap gap-2">
            {detectedDomains.map((domain) => (
              <span key={domain} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}

      {response && !response.error && (
        <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Réponse Juridique</h2>

          {/* Model selection info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
            <p className="text-blue-900 font-medium">
              Modèle utilisé: <span className="font-bold">{response.modelChoice?.toUpperCase()}</span>
              {response.modelChoice === 'haiku' && ' (Rapide & Économique)'}
              {response.modelChoice === 'sonnet' && ' (Équilibré & Précis)'}
              {response.modelChoice === 'opus' && ' (Complet & Expert)'}
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {response.content || response}
          </div>

          {response.tokens_input && (
            <div className="text-xs text-gray-600 pt-4 border-t border-gray-200 space-y-1">
              <p>
                <strong>Tokens:</strong> {response.tokens_input} (input) + {response.tokens_output} (output) = {response.tokens_input + response.tokens_output} total
              </p>
              <p>
                <strong>Coût:</strong> ${response.cost?.toFixed(4) || '0.00'} 💰
              </p>
            </div>
          )}
        </div>
      )}

      {response?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {response.error}
        </div>
      )}
    </div>
  );
}

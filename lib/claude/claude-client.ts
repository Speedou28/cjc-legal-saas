import Anthropic from '@anthropic-ai/sdk';
import { selectOptimalModel, calculateCost as calculateModelCost, ModelConfig } from './model-selector';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ClaudeMessage {
  content: string;
  tokens_input: number;
  tokens_output: number;
  model: string;
  modelChoice: 'haiku' | 'sonnet' | 'opus';
  cost: number;
}

export async function invokeClaudeWithPersonas(
  question: string,
  detectedPersonas: string[]
): Promise<ClaudeMessage> {
  // Select optimal model based on question complexity and domains
  const modelConfig = selectOptimalModel(question, detectedPersonas);
  const personaPrompts = buildPersonaPrompts(detectedPersonas);

  const systemPrompt = `You are a team of expert French lawyers specializing in different areas of law.
Your role is to provide comprehensive, professional legal advice.

${personaPrompts}

When responding:
1. Address all relevant legal domains mentioned by the user
2. Provide clear, structured legal analysis
3. Cite applicable law where relevant
4. Be concise but thorough
5. Use French for all responses
6. For fiscal/optimization questions: provide multiple scenarios when appropriate

Always respond in French, with legal precision.`;

  const response = await client.messages.create({
    model: modelConfig.model,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: question,
      },
    ],
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  const cost = calculateModelCost(modelConfig, response.usage.input_tokens, response.usage.output_tokens);

  return {
    content,
    tokens_input: response.usage.input_tokens,
    tokens_output: response.usage.output_tokens,
    model: modelConfig.model,
    modelChoice: modelConfig.modelChoice,
    cost,
  };
}

function buildPersonaPrompts(personas: string[]): string {
  const personaMap: Record<string, string> = {
    fiscal: `**Avocat Fiscal-Affaires**: You specialize in tax law, corporate finance, and business transactions.
Provide advice on tax optimization, compliance, and financial structures for entrepreneurs and companies.
When discussing optimization: be practical and cite specific mechanisms (deferrals, provisions, structures).`,

    corporate: `**Avocat Droit des Sociétés**: You specialize in corporate law, M&A, governance, and statutes.
Provide advice on company structure, shareholder agreements, and corporate governance.
For M&A: consider valuation methods, deal structure, and tax implications.`,

    commercial: `**Avocat Droit Commercial**: You specialize in commercial law, contracts, and liability.
Provide advice on commercial transactions, contract drafting, and commercial disputes.`,

    labor: `**Avocat Droit du Travail**: You specialize in labor law, employment contracts, and workplace regulations.
Provide advice on employment issues, collective agreements, and labor disputes.`,
  };

  return personas.map(p => personaMap[p] || '').filter(p => p).join('\n\n');
}

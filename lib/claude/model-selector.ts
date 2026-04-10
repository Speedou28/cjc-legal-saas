export type ModelChoice = 'haiku' | 'sonnet' | 'opus';

export interface ModelConfig {
  model: string;
  modelChoice: ModelChoice;
  inputCostPer1k: number;
  outputCostPer1k: number;
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
}

const MODELS: Record<ModelChoice, ModelConfig> = {
  haiku: {
    model: 'claude-3-5-haiku-20241022',
    modelChoice: 'haiku',
    inputCostPer1k: 0.0008,  // $0.80 per MTok
    outputCostPer1k: 0.004,  // $4 per MTok
    estimatedComplexity: 'simple',
  },
  sonnet: {
    model: 'claude-3-5-sonnet-20241022',
    modelChoice: 'sonnet',
    inputCostPer1k: 0.003,   // $3 per MTok
    outputCostPer1k: 0.015,  // $15 per MTok
    estimatedComplexity: 'moderate',
  },
  opus: {
    model: 'claude-opus-4-1-20250805',
    modelChoice: 'opus',
    inputCostPer1k: 0.015,   // $15 per MTok
    outputCostPer1k: 0.075,  // $75 per MTok
    estimatedComplexity: 'complex',
  },
};

/**
 * Select the optimal model based on question content and detected domains
 * Strategy: Use cheapest model that can handle the complexity
 * Can escalate to Opus for extremely complex cases
 */
export function selectOptimalModel(
  question: string,
  domains: string[]
): ModelConfig {
  const questionLength = question.length;
  const isComplex = detectComplexity(question, domains);
  const lower = question.toLowerCase();

  // Keywords indicating VERY COMPLEX legal scenarios requiring expert reasoning
  const veryComplexKeywords = [
    'valorisation',
    'restructuration groupe',
    'montage multi-pays',
    'holding',
    'transmission',
    'due diligence',
    'apport',
    'fusion inversée',
    'split',
    'désinvestissement',
  ];

  const hasVeryComplexKeywords = veryComplexKeywords.some((kw) =>
    lower.includes(kw)
  );

  // Keywords indicating complex legal scenarios
  const complexKeywords = [
    'optimisation fiscale',
    'restructuration',
    'fusion',
    'acquisition',
    'm&a',
    'valorisation',
    'montage',
    'stratégie',
    'planification',
    'scénario',
    'hypothèse',
    'analyse comparative',
    'impact',
    'simulation',
    'international',
    'multi-pays',
  ];

  const hasComplexKeywords = complexKeywords.some((kw) =>
    lower.includes(kw)
  );

  // OPUS: Very complex cases with multiple factors or expert analysis needed
  if (hasVeryComplexKeywords ||
      (questionLength > 800 && hasComplexKeywords && domains.length >= 2)) {
    return MODELS.opus;
  }

  // SONNET: Fiscal optimization or M&A with complexity
  if (domains.includes('fiscal') && hasComplexKeywords) {
    return MODELS.sonnet;
  }

  // SONNET: M&A, acquisition, valorisation
  if (
    domains.includes('corporate') &&
    (hasComplexKeywords ||
      /acquisition|fusion|m&a|valorisation|montage|transmission/.test(lower))
  ) {
    return MODELS.sonnet;
  }

  // SONNET: Multiple domains need better synthesis
  if (domains.length >= 2) {
    return MODELS.sonnet;
  }

  // SONNET: Long or complex single-domain questions
  if (isComplex || questionLength > 500) {
    return MODELS.sonnet;
  }

  // HAIKU: Default for cost efficiency - simple questions
  return MODELS.haiku;
}

/**
 * Detect if a question requires complex legal reasoning
 */
function detectComplexity(question: string, domains: string[]): boolean {
  const lower = question.toLowerCase();

  // Multi-domain questions are more complex
  if (domains.length >= 2) {
    return true;
  }

  // Questions with multiple scenarios or conditions
  if (/(si|si [je|c]|suppose|scénario|hypothèse|alternative|option)/i.test(lower)) {
    return true;
  }

  // Questions asking for optimization or strategy
  if (/(optimis|stratég|planif|montag|structure)/i.test(lower)) {
    return true;
  }

  // Questions about valuation or complex calculations
  if (/(valoaris|calcul|coût|prix|rémunération|assiette)/i.test(lower)) {
    return true;
  }

  return false;
}

/**
 * Calculate cost for a given model and token usage
 */
export function calculateCost(
  modelConfig: ModelConfig,
  tokensInput: number,
  tokensOutput: number
): number {
  const inputCost = (tokensInput / 1000) * modelConfig.inputCostPer1k;
  const outputCost = (tokensOutput / 1000) * modelConfig.outputCostPer1k;
  return parseFloat((inputCost + outputCost).toFixed(4));
}

/**
 * Estimate tokens for a given text (rough approximation)
 * French text: ~1 token per 4-5 characters on average
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Get model display name for UI
 */
export function getModelLabel(modelChoice: ModelChoice): string {
  const labels: Record<ModelChoice, string> = {
    haiku: 'Claude 3.5 Haiku (rapide & économique)',
    sonnet: 'Claude 3.5 Sonnet (équilibré)',
    opus: 'Claude Opus (complet & précis)',
  };
  return labels[modelChoice];
}

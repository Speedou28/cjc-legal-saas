export async function detectPersonas(question: string): Promise<string[]> {
  const lowerQuestion = question.toLowerCase();

  const detectedPersonas: string[] = [];

  // Fiscal keywords
  if (
    lowerQuestion.includes('fiscal') ||
    lowerQuestion.includes('impôt') ||
    lowerQuestion.includes('taxe') ||
    lowerQuestion.includes('tva') ||
    lowerQuestion.includes('irpp') ||
    lowerQuestion.includes('is') ||
    lowerQuestion.includes('optimisation fiscale') ||
    lowerQuestion.includes('défiscalisation') ||
    lowerQuestion.includes('revenu') ||
    lowerQuestion.includes('cotisation') ||
    lowerQuestion.includes('urssaf')
  ) {
    detectedPersonas.push('fiscal');
  }

  // Corporate law keywords
  if (
    lowerQuestion.includes('société') ||
    lowerQuestion.includes('sarl') ||
    lowerQuestion.includes('sas') ||
    lowerQuestion.includes('sàrl') ||
    lowerQuestion.includes('gouvernance') ||
    lowerQuestion.includes('statut') ||
    lowerQuestion.includes('associé') ||
    lowerQuestion.includes('actionn') ||
    lowerQuestion.includes('résolution') ||
    lowerQuestion.includes('pv') ||
    lowerQuestion.includes('ag') ||
    lowerQuestion.includes('m&a') ||
    lowerQuestion.includes('acquisition') ||
    lowerQuestion.includes('fusion') ||
    lowerQuestion.includes('scission')
  ) {
    detectedPersonas.push('corporate');
  }

  // Commercial law keywords
  if (
    lowerQuestion.includes('contrat') ||
    lowerQuestion.includes('commercial') ||
    lowerQuestion.includes('client') ||
    lowerQuestion.includes('fournisseur') ||
    lowerQuestion.includes('vente') ||
    lowerQuestion.includes('achat') ||
    lowerQuestion.includes('responsabilité') ||
    lowerQuestion.includes('dommage') ||
    lowerQuestion.includes('litige') ||
    lowerQuestion.includes('clause') ||
    lowerQuestion.includes('force majeure') ||
    lowerQuestion.includes('préjudice')
  ) {
    detectedPersonas.push('commercial');
  }

  // Labor law keywords
  if (
    lowerQuestion.includes('travail') ||
    lowerQuestion.includes('emploi') ||
    lowerQuestion.includes('salarié') ||
    lowerQuestion.includes('contrat de travail') ||
    lowerQuestion.includes('cdi') ||
    lowerQuestion.includes('cdd') ||
    lowerQuestion.includes('licenciement') ||
    lowerQuestion.includes('congé') ||
    lowerQuestion.includes('salaire') ||
    lowerQuestion.includes('rémunération') ||
    lowerQuestion.includes('urssaf') ||
    lowerQuestion.includes('convention collective')
  ) {
    detectedPersonas.push('labor');
  }

  // If no personas detected, default to corporate (general)
  if (detectedPersonas.length === 0) {
    detectedPersonas.push('corporate');
  }

  // Remove duplicates
  return [...new Set(detectedPersonas)];
}

export function getPersonaLabel(persona: string): string {
  const labels: Record<string, string> = {
    fiscal: 'Droit Fiscal & Affaires',
    corporate: 'Droit des Sociétés',
    commercial: 'Droit Commercial',
    labor: 'Droit du Travail',
  };
  return labels[persona] || persona;
}

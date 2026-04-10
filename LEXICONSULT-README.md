# LexiConsult - Plateforme Juridique Intelligente

**Version MVP - Avril 2026**

## 🎯 Objectif

LexiConsult est une plateforme SaaS privée pour le cabinet CJC-Avocats permettant de générer des consultations juridiques de haut niveau en quelques secondes, avec sélection automatique du meilleur modèle Claude pour minimiser les coûts.

## 📊 Stratégie de Sélection de Modèle

Le système sélectionne **automatiquement** le meilleur modèle Claude selon :

### **Claude 3.5 Haiku** (Rapide & Économique)
- **Coût**: ~$0.01-0.05 par requête
- **Utilisation**: Questions simples, clarifications
- **Domaines**: Travail, Commercial de base
- **Exemples**:
  - "Que signifie un CDI ?"
  - "Qu'est-ce qu'une clause de non-concurrence ?"
  - "Différence SARL vs SAS ?"

### **Claude 3.5 Sonnet** (Équilibré - Défaut)
- **Coût**: ~$0.05-0.20 par requête
- **Utilisation**: Cas standards, multi-domaines, optimisations modérées
- **Domaines**: Fiscal standard, Sociétés simples, Contrats
- **Exemples**:
  - "Optimisation fiscale pour SARL"
  - "M&A pour PME"
  - "Stratégie d'intéressement"

### **Claude Opus 4** (Complet - Sur escalade)
- **Coût**: ~$0.20-0.50 par requête
- **Utilisation**: Cas très complexes, valuations, montages élaborés
- **Domaines**: Fiscal complexe, M&A grosse taille, restructurations
- **Exemples**:
  - "Valorisation de société pour transmission"
  - "Restructuration groupe avec montage fiscal"
  - "Optimisation multi-pays"

## 🧠 Logique d'Escalade

```
Question utilisateur
    ↓
Détection domaines juridiques ✓
    ↓
Analyse de complexité:
    • Mots-clés complexes? (optimisation, valorisation, M&A, montage)
    • Multi-domaines?
    • Longueur > 500 caractères?
    ↓
Sélection modèle:
    ├─ Simple → HAIKU 💚
    ├─ Modéré → SONNET 💙 (défaut)
    └─ Complexe → OPUS 💜 (si validation)
    ↓
Appel Claude + Réponse
    ↓
Affichage coût réel + modèle utilisé
```

## 🚀 Démarrage Rapide

### 1. Variables d'environnement

Voir `.env.example` et remplir:
- `ANTHROPIC_API_KEY` → https://console.anthropic.com/account/keys
- `SENDGRID_API_KEY` → https://app.sendgrid.com/settings/api_keys

### 2. Lancer localement

```bash
npm install
npm run dev
# Ouvrir http://localhost:3000
```

### 3. Login test

Email: `valerie.dordoigne@cjc-avocats.com`
Mot de passe: *n'importe quel*

## 💰 Coûts Estimés

| Domaine | Modèle | Q. Basse | Q. Normale | Q. Complexe |
|---------|--------|----------|-----------|------------|
| **Fiscal simple** | Haiku | $0.01 | $0.03 | - |
| **Fiscal optim** | Sonnet | - | $0.10 | $0.30 |
| **Sociétés** | Sonnet | $0.05 | $0.15 | $0.25 |
| **Très complexe** | Opus | - | - | $0.30-0.50 |

**Budget mensuel estimé** (100 consultations/mois): **$5-20**

## 🎙️ Dictée Vocale

- ✅ Français natif (Web Speech API)
- ✅ Fonctionne offline
- ✅ Bouton 🎤 dans l'interface

## 📋 Domaines Juridiques Supportés

1. **Droit Fiscal** - Impôts, TVA, optimisation
2. **Droit des Sociétés** - M&A, gouvernance, statuts
3. **Droit Commercial** - Contrats, responsabilité
4. **Droit du Travail** - Emploi, conventions collectives

## 🔐 Sécurité MVP

⚠️ **IMPORTANT**: Le MVP utilise une authentification simplifiée.

Pour production:
- [ ] Implémenter NextAuth v5 complet
- [ ] Ajouter 2FA
- [ ] Chiffrement des données sensibles
- [ ] RGPD compliance: suppression auto 2 ans

## 📦 Prochaines Phases

**Phase 2** (Semaine 2):
- [ ] Générateurs Word/PDF
- [ ] Archive consultations
- [ ] Client manager

**Phase 3** (Semaine 3):
- [ ] Admin dashboard
- [ ] Tracking coûts API
- [ ] Export rapports

## 📞 Support Technique

Pour questions sur l'API Claude:
- Documentation: https://docs.anthropic.com
- Console: https://console.anthropic.com

Pour SendGrid:
- Documentation: https://docs.sendgrid.com
- Console: https://app.sendgrid.com

---

**Créé avec ❤️ pour CJC-Avocats**

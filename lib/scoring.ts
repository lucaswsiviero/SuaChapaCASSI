/**
 * scoring.ts
 * Calculates alignment scores for each chapa based on the user's answer tags.
 *
 * Each tag that the user accumulates from their answers adds points to one or
 * more chapas via a weight table. Final scores are normalised to 0–100%.
 *
 * Diretoria election: Chapa 2 | Chapa 4 | Chapa 6
 * Fiscal election:    Chapa 33 | Chapa 55 | Chapa 77
 *
 * Chapas are paired: 2↔55, 4↔33, 6↔77
 */

export type ScoreResult = {
  // Raw normalised scores 0–100 for Diretoria election
  chapa2: number;
  chapa4: number;
  chapa6: number;
  // Raw normalised scores 0–100 for Fiscal election
  chapa33: number;
  chapa55: number;
  chapa77: number;
  // Recommended chapas
  recommendedDiretoria: 2 | 4 | 6;
  recommendedFiscal: 33 | 55 | 77;
  // Human-readable reasons for each recommendation (top matching tags)
  reasonsDiretoria: string[];
  reasonsFiscal: string[];
};

// ---------------------------------------------------------------------------
// Weight table
// Format: tag → { chapa2, chapa4, chapa6 }
// Fiscal scores are derived from Diretoria scores (2↔55, 4↔33, 6↔77)
// ---------------------------------------------------------------------------
type DireitoriaWeights = { chapa2: number; chapa4: number; chapa6: number };

const TAG_WEIGHTS: Record<string, DireitoriaWeights> = {
  // Situação funcional
  pre2018:         { chapa2: 1, chapa4: 2, chapa6: 1 },
  pos2018:         { chapa2: 1, chapa4: 3, chapa6: 2 },
  aposentado:      { chapa2: 1, chapa4: 2, chapa6: 1 },
  dependente:      { chapa2: 1, chapa4: 1, chapa6: 1 },

  // Valores prioritários
  rede:            { chapa2: 3, chapa4: 1, chapa6: 3 },
  sustentabilidade:{ chapa2: 1, chapa4: 1, chapa6: 4 },
  solidariedade:   { chapa2: 1, chapa4: 4, chapa6: 1 },
  transparencia:   { chapa2: 4, chapa4: 1, chapa6: 2 },

  // Avaliação da gestão atual
  continuidade:    { chapa2: 0, chapa4: 5, chapa6: 0 },
  ajustes:         { chapa2: 2, chapa4: 2, chapa6: 2 },
  mudanca:         { chapa2: 3, chapa4: 0, chapa6: 4 },
  neutro:          { chapa2: 1, chapa4: 1, chapa6: 1 },

  // Custeio
  custeio_70_30:   { chapa2: 3, chapa4: 3, chapa6: 1 },
  custeio_atual:   { chapa2: 1, chapa4: 3, chapa6: 1 },
  custeio_tecnico: { chapa2: 1, chapa4: 1, chapa6: 4 },

  // Preocupações específicas
  pos2018_direitos:{ chapa2: 2, chapa4: 4, chapa6: 2 },
  pos2018_afetado: { chapa2: 2, chapa4: 4, chapa6: 2 },

  // Condições de saúde
  cronico:         { chapa2: 1, chapa4: 3, chapa6: 3 },
  saude_mental:    { chapa2: 1, chapa4: 3, chapa6: 3 },
  pcd:             { chapa2: 2, chapa4: 2, chapa6: 2 },
  saudavel:        { chapa2: 1, chapa4: 1, chapa6: 1 },

  // Uso da CASSI
  aps:             { chapa2: 2, chapa4: 3, chapa6: 2 },
  especialistas:   { chapa2: 2, chapa4: 2, chapa6: 2 },
  emergencia:      { chapa2: 1, chapa4: 1, chapa6: 1 },
  baixo_uso:       { chapa2: 1, chapa4: 1, chapa6: 1 },

  // Telessaúde
  telessaude:      { chapa2: 1, chapa4: 4, chapa6: 2 },
  telessaude_parcial:{ chapa2: 2, chapa4: 3, chapa6: 2 },
  presencial:      { chapa2: 2, chapa4: 1, chapa6: 1 },

  // IA
  ia_pro:          { chapa2: 1, chapa4: 1, chapa6: 5 },
  ia_parcial:      { chapa2: 2, chapa4: 2, chapa6: 3 },
  ia_contra:       { chapa2: 2, chapa4: 3, chapa6: 1 },

  // Localização / rede
  clinicassi_proprio:  { chapa2: 1, chapa4: 2, chapa6: 1 },
  clinicassi_parceira: { chapa2: 2, chapa4: 1, chapa6: 2 },
  sem_clinicassi:      { chapa2: 3, chapa4: 1, chapa6: 3 },

  // Movimento sindical
  sindical_ativo:   { chapa2: 1, chapa4: 5, chapa6: 0 },
  sindical_passivo: { chapa2: 1, chapa4: 3, chapa6: 1 },
  sindical_ex:      { chapa2: 1, chapa4: 2, chapa6: 1 },
  sindical_forte:   { chapa2: 1, chapa4: 5, chapa6: 0 },
  sindical_moderado:{ chapa2: 2, chapa4: 3, chapa6: 1 },
  tecnico:          { chapa2: 1, chapa4: 0, chapa6: 5 },

  // Conselho Fiscal
  fiscal_independente: { chapa2: 4, chapa4: 1, chapa6: 2 },
  fiscal_tecnico:      { chapa2: 1, chapa4: 1, chapa6: 4 },

  // Dependentes
  dep_crianca: { chapa2: 1, chapa4: 2, chapa6: 2 },
  dep_adulto:  { chapa2: 1, chapa4: 1, chapa6: 1 },
  dep_idoso:   { chapa2: 1, chapa4: 2, chapa6: 1 },
  sem_dep:     { chapa2: 1, chapa4: 1, chapa6: 1 },

  // Inclusão
  inclusao_alta:  { chapa2: 2, chapa4: 3, chapa6: 2 },
  inclusao_media: { chapa2: 1, chapa4: 2, chapa6: 2 },
  inclusao_baixa: { chapa2: 1, chapa4: 1, chapa6: 1 },

  // Preferência
  programa:              { chapa2: 2, chapa4: 1, chapa6: 3 },
  candidatos_importante: { chapa2: 1, chapa4: 3, chapa6: 1 },
  candidatos_medio:      { chapa2: 1, chapa4: 2, chapa6: 1 },

  // Insatisfações
  autorizacao:      { chapa2: 3, chapa4: 1, chapa6: 2 },
  sem_especialistas:{ chapa2: 3, chapa4: 1, chapa6: 3 },
  agendamento:      { chapa2: 2, chapa4: 1, chapa6: 2 },
  satisfeito:       { chapa2: 1, chapa4: 3, chapa6: 1 },

  // Prioridades para o futuro
  direitos: { chapa2: 2, chapa4: 4, chapa6: 2 },
};

// ---------------------------------------------------------------------------
// Human-readable explanations for each strong tag per chapa
// ---------------------------------------------------------------------------
const TAG_REASONS: Record<string, Record<"chapa2" | "chapa4" | "chapa6", string | null>> = {
  sustentabilidade: {
    chapa2: null,
    chapa4: null,
    chapa6: "Chapa 6 propõe gestão técnica focada em equilíbrio financeiro de longo prazo",
  },
  transparencia: {
    chapa2: "Chapa 2 prioriza transparência total e participação dos associados",
    chapa4: null,
    chapa6: null,
  },
  solidariedade: {
    chapa2: null,
    chapa4: "Chapa 4 tem forte vínculo com o movimento sindical e a pauta coletiva",
    chapa6: null,
  },
  continuidade: {
    chapa2: null,
    chapa4: "Chapa 4 é a atual gestão e representa continuidade do trabalho",
    chapa6: null,
  },
  mudanca: {
    chapa2: "Chapa 2 traz nova liderança com proposta de renovação na gestão",
    chapa4: null,
    chapa6: "Chapa 6 apresenta visão técnica inovadora e ruptura com o modelo atual",
  },
  telessaude: {
    chapa2: null,
    chapa4: "Chapa 4 foi responsável pela implantação da telessaúde na CASSI",
    chapa6: null,
  },
  ia_pro: {
    chapa2: null,
    chapa4: null,
    chapa6: "Chapa 6 aposta fortemente em IA e tecnologia para modernizar a gestão",
  },
  sem_clinicassi: {
    chapa2: "Chapa 2 propõe expansão da rede credenciada no interior",
    chapa4: null,
    chapa6: "Chapa 6 também prevê expansão da rede para cidades sem CliniCASSI própria",
  },
  fiscal_independente: {
    chapa2: "Chapa 55 (Fiscal da Chapa 2) prega independência total do Conselho Fiscal",
    chapa4: null,
    chapa6: null,
  },
  sindical_forte: {
    chapa2: null,
    chapa4: "Chapa 4 e Chapa 33 (Fiscal) têm forte apoio do movimento sindical bancário",
    chapa6: null,
  },
  pos2018_direitos: {
    chapa2: null,
    chapa4: "Chapa 4 defende ativamente o direito ao plano na aposentadoria para pós-2018",
    chapa6: null,
  },
  cronico: {
    chapa2: null,
    chapa4: "Chapa 4 tem programas específicos para gestão de doenças crônicas",
    chapa6: "Chapa 6 propõe protocolos avançados para cuidado continuado de crônicos",
  },
};

// ---------------------------------------------------------------------------
// Main scoring function
// ---------------------------------------------------------------------------
export function calculateScores(tags: string[]): ScoreResult {
  let raw2 = 0, raw4 = 0, raw6 = 0;

  // Track which tags contributed to which chapa (for reasoning)
  const contributing: Record<string, DireitoriaWeights> = {};

  for (const tag of tags) {
    const w = TAG_WEIGHTS[tag];
    if (!w) continue;
    raw2 += w.chapa2;
    raw4 += w.chapa4;
    raw6 += w.chapa6;
    contributing[tag] = w;
  }

  // Normalise to 0–100 (avoid division by zero)
  const total = raw2 + raw4 + raw6 || 1;
  const chapa2 = Math.round((raw2 / total) * 100);
  const chapa4 = Math.round((raw4 / total) * 100);
  const chapa6 = Math.round((raw6 / total) * 100);

  // Fiscal scores mirror Diretoria (2↔55, 4↔33, 6↔77)
  const chapa55 = chapa2;
  const chapa33 = chapa4;
  const chapa77 = chapa6;

  // Determine recommendations
  const maxD = Math.max(raw2, raw4, raw6);
  const recommendedDiretoria: 2 | 4 | 6 =
    raw2 === maxD ? 2 : raw4 === maxD ? 4 : 6;
  const recommendedFiscal: 33 | 55 | 77 =
    recommendedDiretoria === 2 ? 55 : recommendedDiretoria === 4 ? 33 : 77;

  // Build reasons list (top 3–5 contributing tags for the recommended chapa)
  const chapaKey = `chapa${recommendedDiretoria}` as "chapa2" | "chapa4" | "chapa6";
  const sortedTags = Object.entries(contributing)
    .sort((a, b) => b[1][chapaKey] - a[1][chapaKey])
    .map(([tag]) => tag);

  const reasonsDiretoria: string[] = [];
  const reasonsFiscal: string[] = [];

  for (const tag of sortedTags) {
    if (reasonsDiretoria.length >= 5) break;
    const reason = TAG_REASONS[tag]?.[chapaKey];
    if (reason && !reasonsDiretoria.includes(reason)) {
      reasonsDiretoria.push(reason);
    }
  }

  // Generic fallback reasons if no specific ones found
  if (reasonsDiretoria.length === 0) {
    const generic: Record<2 | 4 | 6, string[]> = {
      2: [
        "Seu perfil valoriza transparência e nova liderança na gestão",
        "Preocupação com acesso à rede de atendimento",
        "Interesse em participação dos associados nas decisões",
      ],
      4: [
        "Seu perfil valoriza continuidade e vínculo com o movimento sindical",
        "Preocupação com direitos dos funcionários admitidos após 2018",
        "Valoriza a implantação da telessaúde na CASSI",
      ],
      6: [
        "Seu perfil valoriza gestão técnica e sustentabilidade financeira",
        "Interesse em inovação e uso de tecnologia no plano",
        "Preocupação com expansão da rede credenciada no interior",
      ],
    };
    reasonsDiretoria.push(...generic[recommendedDiretoria]);
  }

  // Fiscal reasons based on paired chapa
  const fiscalReasonMap: Record<33 | 55 | 77, string[]> = {
    55: [
      "Chapa 55 (Diego Carvalho) propõe fiscalização independente da gestão",
      "Foco em transparência e prestação de contas aos associados",
    ],
    33: [
      "Chapa 33 (Róger Medeiros) apoia a visão da gestão atual com experiência técnica",
      "Vínculo com o movimento sindical bancário",
    ],
    77: [
      "Chapa 77 (Edson Xavier) propõe análise técnica aprofundada dos riscos financeiros",
      "Foco em sustentabilidade e gestão atuarial do plano",
    ],
  };
  reasonsFiscal.push(...fiscalReasonMap[recommendedFiscal]);

  return {
    chapa2,
    chapa4,
    chapa6,
    chapa33,
    chapa55,
    chapa77,
    recommendedDiretoria,
    recommendedFiscal,
    reasonsDiretoria,
    reasonsFiscal,
  };
}

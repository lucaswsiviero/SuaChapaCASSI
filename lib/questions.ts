/**
 * questions.ts
 * Defines all 20 quiz questions, their options, and scoring tags.
 * Tags map to weight keys in scoring.ts.
 */

export type AnswerOption = {
  id: string;
  label: string;
  tags: string[];
};

export type Question = {
  id: number;
  text: string;
  type: "single" | "multiple";
  required: boolean;
  options: AnswerOption[];
};

export const questions: Question[] = [
  {
    id: 1,
    text: "Qual é a sua situação atual no Banco do Brasil?",
    type: "single",
    required: true,
    options: [
      { id: "1a", label: "Funcionário(a) ativo(a) (admitido antes de 2018)", tags: ["pre2018"] },
      { id: "1b", label: "Funcionário(a) ativo(a) (admitido após 2018)", tags: ["pos2018"] },
      { id: "1c", label: "Aposentado(a)", tags: ["aposentado"] },
      { id: "1d", label: "Dependente de associado(a)", tags: ["dependente"] },
    ],
  },
  {
    id: 2,
    text: "O que você mais valoriza na CASSI? (pode marcar mais de uma)",
    type: "multiple",
    required: true,
    options: [
      { id: "2a", label: "Qualidade e acesso à rede de atendimento", tags: ["rede"] },
      { id: "2b", label: "Sustentabilidade financeira do plano", tags: ["sustentabilidade"] },
      { id: "2c", label: "Solidariedade entre associados", tags: ["solidariedade"] },
      { id: "2d", label: "Transparência e boa governança", tags: ["transparencia"] },
    ],
  },
  {
    id: 3,
    text: "Como você avalia a gestão atual da CASSI (2022–2026)?",
    type: "single",
    required: false,
    options: [
      { id: "3a", label: "Positiva — merece continuidade", tags: ["continuidade"] },
      { id: "3b", label: "Parcialmente positiva — precisa de ajustes", tags: ["ajustes"] },
      { id: "3c", label: "Negativa — precisa de mudança", tags: ["mudanca"] },
      { id: "3d", label: "Não acompanhei de perto", tags: ["neutro"] },
    ],
  },
  {
    id: 4,
    text: "Qual proporção de custeio você considera mais justa entre o BB e os associados?",
    type: "single",
    required: false,
    options: [
      { id: "4a", label: "70% BB / 30% associados", tags: ["custeio_70_30"] },
      { id: "4b", label: "Proporção atual (aprox. 55% BB / 45% associados)", tags: ["custeio_atual"] },
      { id: "4c", label: "Depende de análise técnica atuarial", tags: ["custeio_tecnico"] },
      { id: "4d", label: "Não tenho opinião formada", tags: ["neutro"] },
    ],
  },
  {
    id: 5,
    text: "Qual é a sua maior preocupação com a CASSI hoje?",
    type: "single",
    required: true,
    options: [
      { id: "5a", label: "Sustentabilidade e risco de colapso financeiro", tags: ["sustentabilidade"] },
      { id: "5b", label: "Qualidade e acesso ao atendimento", tags: ["rede"] },
      { id: "5c", label: "Direitos dos funcionários admitidos após 2018", tags: ["pos2018_direitos"] },
      { id: "5d", label: "Falta de transparência na gestão", tags: ["transparencia"] },
    ],
  },
  {
    id: 6,
    text: "Você tem ou cuida de alguém com alguma dessas condições? (pode marcar mais de uma)",
    type: "multiple",
    required: false,
    options: [
      { id: "6a", label: "Doenças crônicas (diabetes, hipertensão, etc.)", tags: ["cronico"] },
      { id: "6b", label: "Saúde mental (ansiedade, depressão, etc.)", tags: ["saude_mental"] },
      { id: "6c", label: "Deficiência ou neurodivergência (PcD, autismo, TDAH)", tags: ["pcd"] },
      { id: "6d", label: "Nenhuma das anteriores", tags: ["saudavel"] },
    ],
  },
  {
    id: 7,
    text: "A perda do direito ao plano na aposentadoria para funcionários admitidos após 2018 te afeta?",
    type: "single",
    required: false,
    options: [
      { id: "7a", label: "Sim, me afeta diretamente", tags: ["pos2018_afetado"] },
      { id: "7b", label: "Sim, por princípio de justiça — mesmo sem me afetar diretamente", tags: ["solidariedade"] },
      { id: "7c", label: "Não é minha prioridade no momento", tags: ["neutro"] },
      { id: "7d", label: "Não conhecia essa situação", tags: ["neutro"] },
    ],
  },
  {
    id: 8,
    text: "Como você usa a CASSI atualmente? (pode marcar mais de uma)",
    type: "multiple",
    required: false,
    options: [
      { id: "8a", label: "Consultas na CliniCASSI ou APS (Atenção Primária)", tags: ["aps"] },
      { id: "8b", label: "Consultas com especialistas e exames", tags: ["especialistas"] },
      { id: "8c", label: "Principalmente emergências e urgências", tags: ["emergencia"] },
      { id: "8d", label: "Raramente utilizo o plano", tags: ["baixo_uso"] },
    ],
  },
  {
    id: 9,
    text: "Você valoriza a telessaúde (consultas médicas e psicológicas online)?",
    type: "single",
    required: false,
    options: [
      { id: "9a", label: "Sim, uso e acho essencial para o dia a dia", tags: ["telessaude"] },
      { id: "9b", label: "Sim, mas integrada ao atendimento presencial", tags: ["telessaude_parcial"] },
      { id: "9c", label: "Prefiro sempre o atendimento presencial", tags: ["presencial"] },
      { id: "9d", label: "Indiferente", tags: ["neutro"] },
    ],
  },
  {
    id: 10,
    text: "Qual é a sua visão sobre o uso de inteligência artificial na gestão do plano de saúde?",
    type: "single",
    required: false,
    options: [
      { id: "10a", label: "Apoio fortemente — moderniza e melhora a eficiência", tags: ["ia_pro"] },
      { id: "10b", label: "Apoio com ressalvas — depende de como for implementada", tags: ["ia_parcial"] },
      { id: "10c", label: "Desconfio — pode ser usada para negar coberturas", tags: ["ia_contra"] },
      { id: "10d", label: "Não tenho opinião formada", tags: ["neutro"] },
    ],
  },
  {
    id: 11,
    text: "Você mora em uma cidade com CliniCASSI própria?",
    type: "single",
    required: false,
    options: [
      { id: "11a", label: "Capital ou grande cidade com CliniCASSI própria", tags: ["clinicassi_proprio"] },
      { id: "11b", label: "Interior com CliniCASSI parceira ou credenciada", tags: ["clinicassi_parceira"] },
      { id: "11c", label: "Interior sem CliniCASSI — uso principalmente a rede credenciada", tags: ["sem_clinicassi"] },
      { id: "11d", label: "Uso principalmente telessaúde, independente da cidade", tags: ["telessaude"] },
    ],
  },
  {
    id: 12,
    text: "Você acompanha ou participa de entidades de classe (sindicato, ANABB, associações)?",
    type: "single",
    required: false,
    options: [
      { id: "12a", label: "Participo ativamente", tags: ["sindical_ativo"] },
      { id: "12b", label: "Acompanho, mas não participo diretamente", tags: ["sindical_passivo"] },
      { id: "12c", label: "Não acompanho", tags: ["neutro"] },
      { id: "12d", label: "Já participei, hoje não mais", tags: ["sindical_ex"] },
    ],
  },
  {
    id: 13,
    text: "Para o Conselho Fiscal da CASSI, o que você considera mais importante?",
    type: "single",
    required: false,
    options: [
      { id: "13a", label: "Fiscalização rigorosa e independente da diretoria", tags: ["fiscal_independente"] },
      { id: "13b", label: "Apoio técnico e especializado à gestão", tags: ["fiscal_tecnico"] },
      { id: "13c", label: "Transparência total com os associados", tags: ["transparencia"] },
      { id: "13d", label: "Análise aprofundada dos riscos financeiros", tags: ["sustentabilidade"] },
    ],
  },
  {
    id: 14,
    text: "Qual é a sua posição sobre o movimento sindical bancário?",
    type: "single",
    required: false,
    options: [
      { id: "14a", label: "Apoio fortemente — é essencial para defender direitos", tags: ["sindical_forte"] },
      { id: "14b", label: "Apoio moderadamente", tags: ["sindical_moderado"] },
      { id: "14c", label: "Prefiro uma gestão mais técnica e menos politizada", tags: ["tecnico"] },
      { id: "14d", label: "Não me identifico com o movimento sindical", tags: ["neutro"] },
    ],
  },
  {
    id: 15,
    text: "Você tem dependentes na CASSI?",
    type: "multiple",
    required: false,
    options: [
      { id: "15a", label: "Sim, crianças ou adolescentes", tags: ["dep_crianca"] },
      { id: "15b", label: "Sim, cônjuge ou companheiro(a)", tags: ["dep_adulto"] },
      { id: "15c", label: "Sim, pais ou idosos", tags: ["dep_idoso"] },
      { id: "15d", label: "Não tenho dependentes na CASSI", tags: ["sem_dep"] },
    ],
  },
  {
    id: 16,
    text: "A pauta de inclusão (LGBTQIAPN+, PcD, neurodivergentes) é importante para sua decisão de voto?",
    type: "single",
    required: false,
    options: [
      { id: "16a", label: "Sim, é uma prioridade essencial", tags: ["inclusao_alta"] },
      { id: "16b", label: "Sim, é importante, mas não a principal", tags: ["inclusao_media"] },
      { id: "16c", label: "Pouco relevante para minha decisão", tags: ["inclusao_baixa"] },
      { id: "16d", label: "Não considero determinante no voto", tags: ["neutro"] },
    ],
  },
  {
    id: 17,
    text: "Você prefere continuidade da gestão atual ou uma proposta nova?",
    type: "single",
    required: false,
    options: [
      { id: "17a", label: "Continuidade — a gestão atual tem feito um bom trabalho", tags: ["continuidade"] },
      { id: "17b", label: "Continuidade com ajustes — manter o que funciona e corrigir o que não funciona", tags: ["ajustes"] },
      { id: "17c", label: "Nova visão — é hora de uma mudança real", tags: ["mudanca"] },
      { id: "17d", label: "O que importa é o programa proposto, não quem está no poder", tags: ["programa"] },
    ],
  },
  {
    id: 18,
    text: "O perfil e histórico dos candidatos influencia sua decisão de voto?",
    type: "single",
    required: false,
    options: [
      { id: "18a", label: "Sim, muito — confio mais em quem conheço o trabalho", tags: ["candidatos_importante"] },
      { id: "18b", label: "Moderadamente — levo em conta junto com o programa", tags: ["candidatos_medio"] },
      { id: "18c", label: "Pouco — o programa é mais importante", tags: ["programa"] },
      { id: "18d", label: "Não influencia minha decisão", tags: ["neutro"] },
    ],
  },
  {
    id: 19,
    text: "Qual é a sua maior insatisfação com a rede de atendimento atual? (pode marcar mais de uma)",
    type: "multiple",
    required: false,
    options: [
      { id: "19a", label: "Dificuldade para obter autorizações de procedimentos", tags: ["autorizacao"] },
      { id: "19b", label: "Poucos especialistas disponíveis na minha região", tags: ["sem_especialistas"] },
      { id: "19c", label: "Demora excessiva no agendamento", tags: ["agendamento"] },
      { id: "19d", label: "Estou satisfeito(a) com a rede atual", tags: ["satisfeito"] },
    ],
  },
  {
    id: 20,
    text: "O que você mais quer garantir na CASSI nos próximos 4 anos? (pode marcar mais de uma)",
    type: "multiple",
    required: true,
    options: [
      { id: "20a", label: "Que o plano não entre em colapso financeiro", tags: ["sustentabilidade"] },
      { id: "20b", label: "Acesso a cuidado de qualidade quando precisar", tags: ["rede"] },
      { id: "20c", label: "Ampliação dos direitos dos associados", tags: ["direitos"] },
      { id: "20d", label: "Transparência e participação dos associados nas decisões", tags: ["transparencia"] },
    ],
  },
];

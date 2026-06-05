export const ORDEM_DISCIPLINAS_PAI = [
  'Língua Portuguesa',
  'Matemática',
  'Competências Digitais',
  'Ciências',
  'Geografia',
  'História'
];

function normalizarNomeDisciplina(nome?: string) {
  return (nome || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

const ordemNormalizada = ORDEM_DISCIPLINAS_PAI.map(normalizarNomeDisciplina);

export function indiceOrdemDisciplina(nome?: string) {
  const normalizado = normalizarNomeDisciplina(nome);
  const index = ordemNormalizada.indexOf(normalizado);
  return index === -1 ? 999 : index;
}

export function ordenarPorDisciplina<T extends { disciplinaNome?: string; nome?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const nomeA = a.disciplinaNome || a.nome || '';
    const nomeB = b.disciplinaNome || b.nome || '';
    const ordemA = indiceOrdemDisciplina(nomeA);
    const ordemB = indiceOrdemDisciplina(nomeB);

    if (ordemA !== ordemB) return ordemA - ordemB;
    return nomeA.localeCompare(nomeB, 'pt-BR');
  });
}

export function obterRegistroDaDisciplina(
  registros: { nome: string; registro: string }[] | undefined,
  disciplinaNome: string
) {
  const normalizada = normalizarNomeDisciplina(disciplinaNome);
  return registros?.find(item => normalizarNomeDisciplina(item.nome) === normalizada)?.registro || 'NR';
}

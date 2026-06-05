import { Pai } from '@/types/pai';
import { formatDateBr } from '@/utils/dates';
import { RegistroProcessual } from './RegistroProcessual';
import { Assinaturas } from './Assinaturas';
import { normalizarPai } from '@/utils/pai';
import { formatarDataHoraFirestore, statusPaiLabel } from '@/utils/paiStatus';
import { obterRegistroDaDisciplina, ordenarPorDisciplina } from '@/utils/disciplinas';

const Cell = ({ label, value, className = '' }: { label: string; value?: string | number; className?: string }) => (
  <div className={`pai-cell ${className}`}>
    <b>{label}: </b>
    <span>{value || '—'}</span>
  </div>
);

function juntarTextos(values: Record<string, string>) {
  return Object.values(values).filter(Boolean).join('\n');
}

function textoObjetivos(o: Pai['objetivos'][number]) {
  return [
    o.objetivoAfetivo ? `Afetivo: ${o.objetivoAfetivo}` : '',
    o.objetivoPsicomotor ? `Psicomotor: ${o.objetivoPsicomotor}` : '',
    o.objetivoCognitivo ? `Cognitivo: ${o.objetivoCognitivo}` : ''
  ]
    .filter(Boolean)
    .join('\n');
}

function imageProxy(url?: string) {
  if (!url) return '';
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export function PaiVisual({ pai }: { pai: Pai }) {
  const documento = normalizarPai(pai);
  const objetivosOrdenados = ordenarPorDisciplina(documento.objetivos);
  const registrosOrdenados = ordenarPorDisciplina(documento.registroProcessual.itens);

  return (
    <article id="pai-document" className="pai-document mx-auto bg-white text-gray-900 shadow">
      <style>{`
        .pai-document{
          width:287mm;
          max-width:287mm;
          padding:5mm;
          font-family: Calibri, "Carlito", "Segoe UI", Arial, sans-serif;
          font-size:10pt;
          line-height:1.16;
          overflow:visible;
        }
        .pai-title{
          color:#0070b8;
          text-align:center;
          font-size:16pt;
          line-height:1.05;
          font-weight:900;
          margin:0 0 4mm 0;
        }
        .pai-section{
          margin-top:2.5mm;
          border:1px dashed #d1d5db;
          border-radius:7px;
          padding:2.3mm;
          break-inside:avoid;
          page-break-inside:avoid;
          overflow:visible;
        }
        .pai-section h2{
          color:#5c9f45;
          font-weight:800;
          font-size:12pt;
          margin:0 0 1.6mm 0;
          line-height:1.05;
        }
        .pai-cell{
          border:1px dashed #d1d5db;
          border-radius:5px;
          padding:1.4mm;
          min-height:7mm;
          overflow-wrap:anywhere;
          white-space:normal;
        }
        .identificacao-grid{
          display:grid;
          grid-template-columns:24mm repeat(4, 1fr);
          gap:1.5mm;
          align-items:stretch;
        }
        .foto-aluno{
          grid-row:span 3;
          width:24mm;
          height:31mm;
          border:1px dashed #cbd5e1;
          border-radius:6px;
          object-fit:cover;
          object-position:center;
          background:#f8fafc;
          display:block;
        }
        .foto-placeholder{
          grid-row:span 3;
          width:24mm;
          height:31mm;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px dashed #cbd5e1;
          border-radius:6px;
          color:#94a3b8;
          text-align:center;
        }
        .map-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:1.8mm;
        }
        .map-box{
          border:1px dashed #d1d5db;
          border-radius:5px;
          padding:1.6mm;
          min-height:13mm;
          overflow:visible;
        }
        .map-box h3,.disciplina-titulo{
          color:#0070b8;
          font-size:11pt;
          font-weight:800;
          margin:0 0 1mm 0;
          line-height:1.08;
        }
        .objetivos-lista{
          display:block;
        }
        .disciplina-bloco{
          break-inside:avoid;
          page-break-inside:avoid;
          margin-bottom:2.2mm;
          overflow:visible;
        }
        .objetivo-grid{
          display:grid;
          grid-template-columns:1.1fr .42fr 1.05fr;
          gap:1.5mm;
          align-items:start;
        }
        .objetivo-grid>div{
          border:1px dashed #d1d5db;
          border-radius:5px;
          padding:1.45mm;
          overflow:visible;
          white-space:pre-wrap;
          overflow-wrap:anywhere;
        }
        .compact-text{
          white-space:pre-wrap;
          overflow-wrap:anywhere;
          margin:0;
        }
        .registro-inline{
          margin-top:2mm;
          padding-top:1.4mm;
          border-top:1px dashed #d1d5db;
        }
        .avoid-page-break{
          break-inside:avoid;
          page-break-inside:avoid;
        }
        @media print{
          @page{size:A4 landscape;margin:5mm}
          html,body{background:#fff!important}
          .pai-document{
            width:287mm;
            max-width:none;
            padding:0;
            box-shadow:none;
            font-family: Calibri, "Carlito", "Segoe UI", Arial, sans-serif;
            font-size:10pt;
            line-height:1.14;
            overflow:visible;
          }
          .pai-title{font-size:15pt;margin-bottom:3mm}
          .pai-section{margin-top:2mm;padding:2mm;border-radius:6px}
          .pai-section h2{font-size:11pt;margin-bottom:1.2mm}
          .pai-cell{padding:1.2mm;min-height:6.5mm}
          .objetivo-grid{grid-template-columns:1.1fr .38fr 1.05fr;gap:1.2mm}
          .objetivo-grid>div{padding:1.2mm}
          .disciplina-titulo{font-size:10.5pt}
          .foto-aluno,.foto-placeholder{width:22mm;height:29mm}
          .identificacao-grid{grid-template-columns:22mm repeat(4, 1fr);gap:1.2mm}
          .map-grid{gap:1.2mm}
          .map-box{padding:1.2mm;min-height:auto}
        }
      `}</style>

      <h1 className="pai-title">Plano de Atendimento Individualizado – PAI</h1>

      <section className="pai-section">
        <h2>1. Identificação</h2>
        <div className="identificacao-grid">
          {documento.identificacao.fotoUrl ? (
            <img src={imageProxy(documento.identificacao.fotoUrl)} alt="Foto do estudante" className="foto-aluno" crossOrigin="anonymous" />
          ) : (
            <div className="foto-placeholder">Foto do aluno</div>
          )}
          <Cell label="Instituição" value={documento.instituicao} />
          <Cell label="Semestre" value={documento.semestre} />
          <Cell label="Ano" value={documento.ano} />
          <Cell label="Status" value={statusPaiLabel(documento.status)} />
          <Cell label="Estudante" value={documento.identificacao.nome} />
          <Cell label="Etapa/Seriação" value={documento.identificacao.etapaSeriacao} />
          <Cell label="Nascimento" value={formatDateBr(documento.identificacao.dataNascimento)} />
          <Cell label="Idade" value={documento.identificacao.idade} />
          <Cell label="Regente" value={documento.identificacao.regente1} />
          <Cell label="Ensino Religioso" value={documento.identificacao.ensinoReligioso} />
          <Cell label="Arte" value={documento.identificacao.arte} />
          <Cell label="Educação Física" value={documento.identificacao.educacaoFisica} />
          <Cell label="Coordenação" value={documento.identificacao.pedagoga} />
          <Cell label="Professor" value={documento.encaminhadoPorNome} />
          <Cell label="Encaminhamento" value={formatarDataHoraFirestore(documento.encaminhadoEm)} />
          <Cell label="Visto por" value={documento.vistadoPorNome} />
          <Cell label="Data do visto" value={formatarDataHoraFirestore(documento.vistadoEm)} />
        </div>
      </section>

      <section className="pai-section">
        <h2>2. Mapeamento</h2>
        <div className="map-grid">
          <div className="map-box">
            <h3>Potencialidades do estudante</h3>
            <p className="compact-text">{juntarTextos(documento.mapeamento.potencialidades) || '—'}</p>
          </div>
          <div className="map-box">
            <h3>Dificuldades do estudante</h3>
            <p className="compact-text">{juntarTextos(documento.mapeamento.dificuldades) || '—'}</p>
          </div>
        </div>
      </section>

      <section className="pai-section">
        <h2>3. Ação colaborativa da família</h2>
        <p className="compact-text">{documento.acaoFamilia}</p>
      </section>

      <section className="pai-section">
        <h2>4. Objetivos de aprendizagem e registro processual por disciplina</h2>
        <div className="objetivos-lista">
          {objetivosOrdenados.map(o => {
            const registro = obterRegistroDaDisciplina(registrosOrdenados, o.disciplinaNome);

            return (
              <div key={o.disciplinaId} className="disciplina-bloco">
                <h3 className="disciplina-titulo">{o.disciplinaNome}</h3>
                <div className="objetivo-grid">
                  <div>
                    <b>Objetivos de aprendizagem</b>
                    <p className="compact-text">{textoObjetivos(o) || '—'}</p>
                  </div>
                  <div>
                    <b>Nível</b>
                    <p className="compact-text">{o.nivelEstudante.join(', ') || '—'}</p>
                    <div className="registro-inline">
                      <b>Registro processual</b>
                      <p className="compact-text">{registro}</p>
                    </div>
                  </div>
                  <div>
                    <b>Estratégia de ensino</b>
                    <p className="compact-text">{o.estrategiaEnsino || '—'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <RegistroProcessual pai={documento} />

      <section className="pai-section">
        <h2>6. Ação colaborativa entre professores, comunidade escolar e equipe multiprofissional</h2>
        <p className="compact-text">{documento.acaoColaborativaEscolar}</p>
      </section>

      <Assinaturas pai={documento} />
    </article>
  );
}

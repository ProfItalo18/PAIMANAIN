import { Pai } from '@/types/pai';
import { formatarDataHoraFirestore } from '@/utils/paiStatus';

export function Assinaturas({ pai }: { pai: Pai }) {
  const assinaturasProfessores = pai.assinaturasDigitais?.professores || [];
  const coordenacao = pai.assinaturasDigitais?.coordenacao || null;

  return (
    <section className="pai-section avoid-page-break">
      <h2>7. Assinaturas digitais</h2>
      <div style={{ display: 'grid', gap: '2mm' }}>
        <div>
          <h3 style={{ color: '#0070b8', fontSize: '10pt', fontWeight: 800, marginBottom: '1.2mm' }}>
            Professores responsáveis
          </h3>
          {assinaturasProfessores.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5mm' }}>
              {assinaturasProfessores.map((item, index) => (
                <div key={`${item.funcao}-${index}`} style={{ border: '1px dashed #d1d5db', borderRadius: 6, padding: '1.5mm', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{item.nome}</div>
                  <div style={{ fontSize: '10pt', color: '#64748b' }}>{item.funcao}</div>
                  <div style={{ marginTop: '1mm', fontSize: '10pt', color: '#047857' }}>Assinado digitalmente</div>
                  <div style={{ fontSize: '10pt', color: '#64748b' }}>{formatarDataHoraFirestore(item.dataHora)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#64748b' }}>
              Nenhuma assinatura de professor registrada. Cada professor terá sua assinatura validada individualmente quando acessar e encaminhar/registrar sua assinatura para visto.
            </div>
          )}
        </div>

        <div>
          <h3 style={{ color: '#0070b8', fontSize: '10pt', fontWeight: 800, marginBottom: '1.2mm' }}>Coordenação</h3>
          {coordenacao ? (
            <div style={{ maxWidth: '72mm', border: '1px dashed #d1d5db', borderRadius: 6, padding: '1.5mm', textAlign: 'center' }}>
              <div style={{ fontWeight: 700 }}>{coordenacao.nome}</div>
              <div style={{ fontSize: '10pt', color: '#64748b' }}>{coordenacao.funcao}</div>
              <div style={{ marginTop: '1mm', fontSize: '10pt', color: '#047857' }}>Visto digital registrado</div>
              <div style={{ fontSize: '10pt', color: '#64748b' }}>{formatarDataHoraFirestore(coordenacao.dataHora)}</div>
            </div>
          ) : (
            <div style={{ color: '#64748b' }}>A assinatura digital da coordenação será efetivada quando o documento receber o visto.</div>
          )}
        </div>
      </div>
    </section>
  );
}

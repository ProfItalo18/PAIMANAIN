import { Pai, REGISTROS } from '@/types/pai';

export function RegistroProcessual({ pai }: { pai: Pai }) {
  return (
    <section className="pai-section">
      <h2>5. Legenda do registro de aprendizagem processual</h2>
      <p className="compact-text">
        <b>Legenda:</b> {REGISTROS.join(' | ')} — R: Realizado, RP: Realizado Parcialmente, NP: Não Realizado, NR:
        Não Registrado.
      </p>
      <p className="compact-text">
        O registro processual está indicado individualmente em cada componente curricular na seção de objetivos de aprendizagem.
      </p>
    </section>
  );
}

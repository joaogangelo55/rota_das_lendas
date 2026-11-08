
import { useEffect, useRef } from 'react';

export default function LeitorNarrativa({
  id,
  titulo,
  narrativa,
  referencia,
  urlFonte,
  aoFechar,
}) {
  const dialogoRef = useRef(null);

  // Organiza o texto em parágrafos.
  const paragrafos = String(narrativa ?? '')
    .split(/\n\s*\n/)
    .map((paragrafo) => paragrafo.trim())
    .filter(Boolean);

  // Abre o painel de leitura sem sair do mapa.
  useEffect(() => {
    const dialogo = dialogoRef.current;

    if (dialogo && !dialogo.open) {
      dialogo.showModal();
    }

    return () => {
      if (dialogo?.open) {
        dialogo.close();
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogoRef}
      className="leitor-narrativa"
      aria-labelledby="leitor-titulo"
      onClose={aoFechar}
    >
      <div className="leitor-cabecalho">
        <div>
          <span className="leitor-categoria">
            Lenda · {id}
          </span>

          <h2 id="leitor-titulo">
            {titulo}
          </h2>
        </div>

        <button
          type="button"
          className="leitor-fechar"
          aria-label="Voltar à ficha da lenda"
          onClick={() => dialogoRef.current?.close()}
        >
          ×
        </button>
      </div>

      <div className="leitor-corpo">
        <h3>A narrativa</h3>

        {paragrafos.map((paragrafo, indice) => (
          <p key={indice}>
            {paragrafo}
          </p>
        ))}

        <p className="leitor-aviso">
          Texto de apresentação baseado nas
          referências do projeto. Não corresponde
          necessariamente à obra integral.
        </p>

        {referencia && (
          <div className="leitor-referencia">
            <h3>Referência documental</h3>

            <p>{referencia}</p>

            {urlFonte && (
              <a
                href={urlFonte}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar fonte ↗
              </a>
            )}
          </div>
        )}
      </div>

      <div className="leitor-rodape">
        <button
          type="button"
          onClick={() => dialogoRef.current?.close()}
        >
          ← Voltar à ficha
        </button>
      </div>
    </dialog>
  );
}

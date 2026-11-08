import { useEffect, useMemo, useState } from 'react';
import MapView from './components/MapView.jsx';

function coordenadasValidas(geometry) {
  if (geometry?.type !== 'Point' || !Array.isArray(geometry.coordinates)) {
    return false;
  }

  const [longitude, latitude] = geometry.coordinates;

  return (
    typeof longitude === 'number' &&
    typeof latitude === 'number' &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

function registroMapeavel(feature) {
  return (
    feature?.type === 'Feature' &&
    feature?.properties?.status_publicacao === 'validado_incluir' &&
    coordenadasValidas(feature?.geometry)
  );
}

export default function App() {
  const [base, setBase] = useState(null);
  const [erro, setErro] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');

  useEffect(() => {
    const controller = new AbortController();

    async function carregarBase() {
      try {
        const resposta = await fetch('/data/dados.geojson', {
          signal: controller.signal,
        });

        if (!resposta.ok) {
          throw new Error(`Falha HTTP ${resposta.status} ao carregar o GeoJSON.`);
        }

        const dados = await resposta.json();

        if (dados?.type !== 'FeatureCollection' || !Array.isArray(dados.features)) {
          throw new Error('A base não possui a estrutura FeatureCollection esperada.');
        }

        setBase(dados);

        const patrimoniosMapeaveis = dados.features.filter(
          (feature) =>
            registroMapeavel(feature) &&
            feature.properties?.categoria === 'patrimonio',
        ).length;

        const lendasMapeaveis = dados.features.filter(
          (feature) =>
            registroMapeavel(feature) &&
            feature.properties?.categoria === 'lenda',
        ).length;

        console.log(
          `[Rota das Lendas] Base carregada: ${dados.features.length} registros; ` +
            `${patrimoniosMapeaveis}/16 patrimônios mapeáveis; ` +
            `${lendasMapeaveis} lenda(s) com geometria disponível.`,
        );
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('[Rota das Lendas] Erro ao carregar a base:', error);
          setErro('Não foi possível carregar a base cartográfica.');
        }
      }
    }

    carregarBase();
    return () => controller.abort();
  }, []);

  const registrosMapeaveis = useMemo(
    () => base?.features?.filter(registroMapeavel) ?? [],
    [base],
  );

  const registrosVisiveis = useMemo(() => {
    if (categoriaAtiva === 'todos') return registrosMapeaveis;

    return registrosMapeaveis.filter(
      (feature) => feature.properties?.categoria === categoriaAtiva,
    );
  }, [categoriaAtiva, registrosMapeaveis]);

  // Os totais dos filtros representam os pontos efetivamente visíveis no mapa.
  // A base também contém registros que ainda não podem ser georreferenciados.
  const totalMapeaveis = registrosMapeaveis.length;
  const totalPatrimonios = registrosMapeaveis.filter(
    (feature) => feature.properties?.categoria === 'patrimonio',
  ).length;
  const totalLendas = registrosMapeaveis.filter(
    (feature) => feature.properties?.categoria === 'lenda',
  ).length;

  const itensExplorar = [
    {
      valor: 'todos',
      rotulo: 'Explorar tudo',
      quantidade: totalMapeaveis,
    },
    {
      valor: 'lenda',
      rotulo: 'Lendas',
      quantidade: totalLendas,
    },
    {
      valor: 'patrimonio',
      rotulo: 'Patrimônio',
      quantidade: totalPatrimonios,
    },
  ];

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo-principal">
        Ir para o conteúdo principal
      </a>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-block">
            <div className="brand-mark">
              <img
                src="/images/logo-rota-das-lendas.png"
                alt="Logo Rota das Lendas"
              />
            </div>

            <div className="brand-copy">
              <h1>Rota das Lendas</h1>
              <p className="brand-location">Aracati - Ceará - Brasil</p>
            </div>
          </div>
        </div>
      </header>

      <main id="conteudo-principal" className="main-content">
        <section className="control-panel" aria-labelledby="explorar-titulo">
          <div className="control-panel-header">
            <div>
              <p className="section-kicker">Explorar</p>
            </div>
            <h2 id="explorar-titulo">Categorias</h2>
          </div>

          <div
            className="explore-list"
            role="group"
            aria-label="Filtrar registros por categoria"
          >
            {itensExplorar.map((item) => (
              <button
                key={item.valor}
                className={`explore-item ${
                  categoriaAtiva === item.valor ? 'is-active' : ''
                }`}
                type="button"
                aria-pressed={categoriaAtiva === item.valor}
                onClick={() => setCategoriaAtiva(item.valor)}
              >
                <span className="explore-item-label">{item.rotulo}</span>
                <span className="explore-item-count">{item.quantidade}</span>
              </button>
            ))}
          </div>
        </section>

        {erro ? (
          <section className="error-box" role="alert">
            <strong>Erro:</strong> {erro}
          </section>
        ) : (
          <section className="map-card" aria-labelledby="mapa-titulo">
            <div className="map-card-heading">
              <div>
                <p className="section-kicker">Território de Aracati</p>
                <h2 id="mapa-titulo">Mapa interativo</h2>
                <p>
                  Clique em um marcador para consultar a ficha e abrir a rota até o local.
                </p>
              </div>

              <div className="legend" aria-label="Legenda das categorias">
                <span>
                  <i className="legend-symbol legend-patrimonio" aria-hidden="true">
                    P
                  </i>
                  Patrimônio
                </span>
                <span>
                  <i className="legend-symbol legend-lenda" aria-hidden="true">
                    L
                  </i>
                  Lenda
                </span>
              </div>
            </div>

            <MapView
              registros={registrosVisiveis}
              fontes={base?.fontes ?? {}}
            />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Protótipo acadêmico — Rota das Lendas • Aracati-CE</p>
      </footer>
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import './MapView.css';

// Centro aproximado do núcleo histórico: referência de navegação, não um novo registro cultural.
const CENTRO_ARACATI = [-4.566, -37.772];
const ZOOM_INICIAL = 15;

const CHAVE_LOCAL_STORAGE =
  'rota-das-lendas:meu-roteiro';

/*
 * Cinco pontos garantem compatibilidade com navegador móvel:
 *
 * origem
 * waypoint 1
 * waypoint 2
 * waypoint 3
 * destino
 */
const MAX_PONTOS_ROTEIRO = 5;

const ROTULOS_CATEGORIA = {
  patrimonio: 'Patrimônio',
  lenda: 'Lenda',
};

/* =========================================================
   Utilidades
   ========================================================= */

function escaparHtml(valor = '') {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function urlSegura(url) {
  if (typeof url !== 'string') {
    return '';
  }

  try {
    const parsed = new URL(url);

    return ['http:', 'https:'].includes(
      parsed.protocol,
    )
      ? parsed.toString()
      : '';
  } catch {
    return '';
  }
}

function obterId(feature) {
  return (
    feature?.id ||
    feature?.properties?.id ||
    ''
  );
}

function obterTitulo(feature) {
  return (
    feature?.properties?.titulo ||
    'Sem título'
  );
}

function obterCoordenadas(feature) {
  if (
    feature?.geometry?.type !== 'Point'
  ) {
    return null;
  }

  const [
    longitude,
    latitude,
  ] = feature.geometry.coordinates ?? [];

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return null;
  }

  return [
    latitude,
    longitude,
  ];
}

/* =========================================================
   Roteiro
   ========================================================= */

function criarItemRoteiro(feature) {
  const coordenadas =
    obterCoordenadas(feature);

  if (!coordenadas) {
    return null;
  }

  const [
    latitude,
    longitude,
  ] = coordenadas;

  return {
    id: obterId(feature),
    titulo: obterTitulo(feature),
    categoria:
      feature.properties?.categoria ??
      '',
    latitude,
    longitude,
  };
}

function itemRoteiroValido(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    item.id.trim() &&
    typeof item.latitude === 'number' &&
    typeof item.longitude === 'number'
  );
}

function carregarRoteiroSalvo() {
  try {
    const salvo =
      window.localStorage.getItem(
        CHAVE_LOCAL_STORAGE,
      );

    if (!salvo) {
      return [];
    }

    const dados =
      JSON.parse(salvo);

    if (!Array.isArray(dados)) {
      return [];
    }

    const idsEncontrados =
      new Set();

    return dados
      .filter(itemRoteiroValido)
      .filter((item) => {
        if (
          idsEncontrados.has(item.id)
        ) {
          return false;
        }

        idsEncontrados.add(
          item.id,
        );

        return true;
      })
      .slice(
        0,
        MAX_PONTOS_ROTEIRO,
      );
  } catch (error) {
    console.warn(
      '[Rota das Lendas] Não foi possível recuperar o roteiro salvo.',
      error,
    );

    return [];
  }
}

function criarUrlGoogleMapsRoteiro(
  roteiro,
) {
  if (
    !Array.isArray(roteiro) ||
    roteiro.length < 2
  ) {
    return '';
  }

  const primeiro =
    roteiro[0];

  const ultimo =
    roteiro[
      roteiro.length - 1
    ];

  const intermediarios =
    roteiro.slice(
      1,
      -1,
    );

  const coordenada = (
    item,
  ) =>
    `${item.latitude},${item.longitude}`;

  const parametros =
    new URLSearchParams({
      api: '1',

      origin:
        coordenada(
          primeiro,
        ),

      destination:
        coordenada(
          ultimo,
        ),
    });

  if (
    intermediarios.length >
    0
  ) {
    parametros.set(
      'waypoints',

      intermediarios
        .map(coordenada)
        .join('|'),
    );
  }

  return (
    `https://www.google.com/maps/dir/?${parametros.toString()}`
  );
}

/* =========================================================
   Marcadores
   ========================================================= */

function criarIcone(
  categoria,
  numeroRoteiro = null,
  quantidade = 1,
) {
  const letra = categoria === 'lenda' ? 'L' : 'P';
  const agrupado = quantidade > 1;
  // O número mostra quantos REGISTROS compartilham as coordenadas,
  // sem inventar deslocamentos geográficos no mapa.
  const conteudo = agrupado ? quantidade : numeroRoteiro ?? letra;
  const classe = categoria === 'lenda'
    ? 'marker-lenda'
    : categoria === 'patrimonio'
      ? 'marker-patrimonio'
      : 'marker-misto';
  const classeRoteiro = !agrupado && numeroRoteiro ? ' marker-roteiro' : '';
  const classeGrupo = agrupado ? ' marker-agrupado' : '';

  return L.divIcon({
    className:
      'custom-marker-wrapper',

    html: `
      <span
        class="custom-marker ${classe}${classeRoteiro}${classeGrupo}"
        aria-hidden="true"
      >
        <span>
          ${conteudo}
        </span>
      </span>
    `,

    iconSize:
      [38, 38],

    iconAnchor:
      [19, 19],

    popupAnchor:
      [0, -20],
  });
}

/* =========================================================
   Fontes
   ========================================================= */

function resolverFonte(
  codigo,
  fontes,
) {
  const fonte =
    codigo
      ? fontes?.[codigo]
      : null;

  return {
    url:
      urlSegura(
        fonte?.url,
      ),
  };
}

/* =========================================================
   Como chegar
   ========================================================= */

function criarUrlComoChegar(
  feature,
) {
  const coordenadas =
    obterCoordenadas(
      feature,
    );

  if (!coordenadas) {
    return '';
  }

  const [
    latitude,
    longitude,
  ] = coordenadas;

  return (
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent(
      `${latitude},${longitude}`,
    )
  );
}

/* =========================================================
   Conteúdo das identidades
   ========================================================= */

function obterTextoIdentidade(
  properties,
) {
  if (
    properties.categoria ===
    'lenda'
  ) {
    if (
      typeof properties.narrativa ===
        'string' &&
      properties.narrativa.trim()
    ) {
      return (
        properties.narrativa.trim()
      );
    }

    return (
      'Narrativa ainda não cadastrada para esta lenda.'
    );
  }

  if (
    properties.categoria ===
    'patrimonio'
  ) {
    if (
      typeof properties.texto_historico ===
        'string' &&
      properties.texto_historico.trim()
    ) {
      return (
        properties.texto_historico.trim()
      );
    }

    if (
      typeof properties.descricao ===
        'string' &&
      properties.descricao.trim()
    ) {
      return (
        properties.descricao.trim()
      );
    }

    return (
      'Texto histórico ainda não cadastrado para este patrimônio.'
    );
  }

  return (
    properties.descricao ||
    'Conteúdo ainda não disponível.'
  );
}

function formatarTextoEmParagrafos(
  texto,
) {
  const blocos =
    String(texto ?? '')
      .split(/\n\s*\n/)
      .map(
        (bloco) =>
          bloco.trim(),
      )
      .filter(Boolean);

  if (
    blocos.length === 0
  ) {
    return (
      '<p>Conteúdo ainda não disponível.</p>'
    );
  }

  return blocos
    .map((bloco) => {
      const seguro =
        escaparHtml(
          bloco,
        ).replaceAll(
          '\n',
          '<br>',
        );

      return (
        `<p>${seguro}</p>`
      );
    })
    .join('');
}

/* =========================================================
   Imagens
   ========================================================= */

function criarHtmlImagem(
  properties,
) {
  const imagem =
    properties.imagem;

  if (
    !imagem ||
    typeof imagem !==
      'object'
  ) {
    return '';
  }

  const src =
    typeof imagem.src ===
      'string'
      ? imagem.src.trim()
      : '';

  if (!src) {
    return '';
  }

  const titulo =
    properties.titulo ||
    'registro cultural';

  const alt =
    typeof imagem.alt ===
      'string' &&
    imagem.alt.trim()
      ? imagem.alt.trim()
      : `Imagem relacionada a ${titulo}`;

  const credito =
    typeof imagem.credito ===
      'string'
      ? imagem.credito.trim()
      : '';

  const licenca =
    typeof imagem.licenca ===
      'string'
      ? imagem.licenca.trim()
      : '';

  const fonteImagem =
    urlSegura(
      imagem.fonte,
    );

  const creditoHtml =
    credito
      ? `
        <span>
          ${escaparHtml(
            credito,
          )}
        </span>
      `
      : '';

  const licencaHtml =
    licenca
      ? `
        <span
          class="popup-media-license"
        >
          ${escaparHtml(
            licenca,
          )}
        </span>
      `
      : '';

  const fonteHtml =
    fonteImagem
      ? `
        <a
          href="${escaparHtml(
            fonteImagem,
          )}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Origem da imagem ↗
        </a>
      `
      : '';

  const possuiLegenda =
    creditoHtml ||
    licencaHtml ||
    fonteHtml;

  return `
    <figure
      class="popup-media"
    >

      <img
        src="${escaparHtml(
          src,
        )}"
        alt="${escaparHtml(
          alt,
        )}"
        loading="lazy"
        decoding="async"
        onerror="this.closest('.popup-media').style.display='none'"
      >

      ${
        possuiLegenda
          ? `
            <figcaption
              class="popup-media-caption"
            >
              ${creditoHtml}
              ${licencaHtml}
              ${fonteHtml}
            </figcaption>
          `
          : ''
      }

    </figure>
  `;
}

/* =========================================================
   Popup
   ========================================================= */

function conteudoPopup(
  feature,
  fontes,
) {
  const p =
    feature.properties ?? {};

  const titulo =
    escaparHtml(
      p.titulo ||
      'Sem título',
    );

  const categoria =
    escaparHtml(
      ROTULOS_CATEGORIA[
        p.categoria
      ] ||
        p.categoria ||
        'Sem categoria',
    );

  const id =
    escaparHtml(
      obterId(
        feature,
      ) ||
      'Sem ID',
    );

  const classeCategoria =
    p.categoria === 'lenda'
      ? 'popup-chip-lenda'
      : 'popup-chip-patrimonio';

  const textoIdentidade =
    formatarTextoEmParagrafos(
      obterTextoIdentidade(
        p,
      ),
    );

  const imagemHtml =
    criarHtmlImagem(
      p,
    );

  const fonteUrl =
    escaparHtml(
      resolverFonte(
        p.fonte_principal,
        fontes,
      ).url,
    );

  const comoChegar =
    escaparHtml(
      criarUrlComoChegar(
        feature,
      ),
    );

  const botaoRota =
    comoChegar
      ? `
        <a
          class="popup-action popup-action-primary"
          href="${comoChegar}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Como chegar
          <span aria-hidden="true">
            ↗
          </span>
        </a>
      `
      : '';

  const botaoFonte =
    fonteUrl
      ? `
        <a
          class="popup-action popup-action-secondary"
          href="${fonteUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver fonte
        </a>
      `
      : '';

  return `
    <article
      class="popup-content"
    >

      <div
        class="popup-topline"
      >

        <span
          class="popup-chip ${classeCategoria}"
        >
          ${categoria}
        </span>

        <span
          class="popup-id"
        >
          ${id}
        </span>

      </div>

      <h3>
        ${titulo}
      </h3>

      ${imagemHtml}

      <div
        class="popup-description"
      >
        ${textoIdentidade}
      </div>

      <div
        class="popup-actions"
      >
        ${botaoRota}
        ${botaoFonte}
      </div>

    </article>
  `;
}

/* =========================================================
   Registros que compartilham a mesma coordenada
   ========================================================= */

function agruparPorCoordenadas(registros) {
  const grupos = new Map();

  registros.forEach((feature) => {
    const coordenadas = obterCoordenadas(feature);
    if (!coordenadas) return;
    // Compara as coordenadas registradas, sem arredondá-las ou alterá-las.
    const chave = JSON.stringify(coordenadas);
    if (!grupos.has(chave)) {
      grupos.set(chave, { coordenadas, registros: [] });
    }
    grupos.get(chave).registros.push(feature);
  });

  return [...grupos.values()];
}

function criarHtmlGrupo(registrosDoLocal, fontes, idAberto = '') {
  const quantidade = registrosDoLocal.length;
  const linhas = [...registrosDoLocal]
    .sort((a, b) => obterTitulo(a).localeCompare(obterTitulo(b), 'pt-BR'))
    .map((feature) => {
      const id = obterId(feature);
      const titulo = escaparHtml(obterTitulo(feature));
      const categoria = feature.properties?.categoria === 'lenda' ? 'Lenda' : 'Patrimônio';
      const aberto = id === idAberto ? ' open' : '';

      // <details>/<summary> funcionam por toque, teclado e leitor de tela,
      // sem dependências extras e sem mover os registros no mapa.
      return `
        <details class="popup-grupo-registro"${aberto}>
          <summary class="popup-grupo-item">
            <span class="popup-grupo-item-titulo">${titulo}</span>
            <small>${categoria}</small>
          </summary>
          <div class="popup-grupo-detalhe">${conteudoPopup(feature, fontes)}</div>
        </details>
      `;
    }).join('');

  return `
    <section class="popup-grupo" aria-label="Registros compartilhando este ponto">
      <div class="popup-grupo-header">
        <span class="popup-grupo-contador">${quantidade} registros</span>
        <h3>Histórias neste ponto</h3>
        <p>Estes registros compartilham uma mesma coordenada de referência.
          Toque em um título para ler a narrativa.</p>
      </div>
      <div class="popup-grupo-itens">${linhas}</div>
    </section>
  `;
}

/* =========================================================
   Componente
   ========================================================= */

export default function MapView({
  registros,
  fontes,
}) {
  const elementoMapaRef =
    useRef(null);

  const mapaRef =
    useRef(null);

  const camadaRegistrosRef =
    useRef(null);

  const marcadoresPorIdRef =
    useRef(
      new Map(),
    );

  const gruposPorIdRef = useRef(new Map());

  const botoesPorIdRef =
    useRef(
      new Map(),
    );

  // Distingue uma troca de filtro da atualização visual dos números do roteiro.
  const registrosAnterioresRef = useRef(null);

  const [
    registroSelecionadoId,
    setRegistroSelecionadoId,
  ] = useState('');

  const [
    modoRoteiro,
    setModoRoteiro,
  ] = useState(false);

  // No celular, a lista só ocupa espaço quando a pessoa solicita.
  const [listaAberta, setListaAberta] = useState(false);
  const [popupAberto, setPopupAberto] = useState(false);

  /*
   * O roteiro passa a armazenar também as coordenadas.
   *
   * Isso permite:
   * - persistir com localStorage;
   * - trocar os filtros sem perder pontos;
   * - gerar a rota do Google Maps;
   * - preservar a ordem escolhida.
   */
  const [
    roteiro,
    setRoteiro,
  ] = useState(
    carregarRoteiroSalvo,
  );

  /* =======================================================
     Ordenação da lista
     ======================================================= */

  const registrosOrdenados =
    useMemo(() => {
      return [
        ...registros,
      ].sort(
        (a, b) =>
          obterTitulo(
            a,
          ).localeCompare(
            obterTitulo(
              b,
            ),
            'pt-BR',
            {
              sensitivity:
                'base',
            },
          ),
      );
    }, [
      registros,
    ]);

  /* =======================================================
     Índice do roteiro
     ======================================================= */

  const ordemRoteiroPorId =
    useMemo(() => {
      return new Map(
        roteiro.map(
          (
            item,
            index,
          ) => [
            item.id,
            index + 1,
          ],
        ),
      );
    }, [
      roteiro,
    ]);

  const urlGoogleMaps =
    useMemo(
      () =>
        criarUrlGoogleMapsRoteiro(
          roteiro,
        ),
      [
        roteiro,
      ],
    );

  /* =======================================================
     Persistência local
     ======================================================= */

  useEffect(() => {
    try {
      if (
        roteiro.length === 0
      ) {
        window.localStorage.removeItem(
          CHAVE_LOCAL_STORAGE,
        );

        return;
      }

      window.localStorage.setItem(
        CHAVE_LOCAL_STORAGE,
        JSON.stringify(
          roteiro,
        ),
      );
    } catch (error) {
      console.warn(
        '[Rota das Lendas] Não foi possível salvar o roteiro.',
        error,
      );
    }
  }, [
    roteiro,
  ]);

  /* =======================================================
     Inicialização do mapa
     ======================================================= */

  useEffect(() => {
    if (
      mapaRef.current ||
      !elementoMapaRef.current
    ) {
      return undefined;
    }

    const mapa =
      L.map(
        elementoMapaRef.current,
        {
          center:
            CENTRO_ARACATI,

          zoom:
            ZOOM_INICIAL,

          minZoom:
            11,

          maxZoom:
            19,

          zoomControl:
            false,
        },
      );

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom:
          19,

        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(
      mapa,
    );

    L.control
      .zoom({
        position:
          'bottomright',
      })
      .addTo(
        mapa,
      );

    L.control
      .scale({
        imperial:
          false,

        position:
          'bottomleft',
      })
      .addTo(
        mapa,
      );

    camadaRegistrosRef.current =
      L.layerGroup().addTo(
        mapa,
      );

    mapaRef.current =
      mapa;

    // Leaflet precisa ser avisado quando o contêiner muda de tamanho
    // (orientação do celular, barra do navegador ou layout responsivo).
    const elemento = elementoMapaRef.current;
    const atualizarTamanho = () => mapa.invalidateSize({ pan: false, animate: false });
    const observador = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(atualizarTamanho)
      : null;
    if (elemento) observador?.observe(elemento);
    window.addEventListener('resize', atualizarTamanho);
    window.requestAnimationFrame(atualizarTamanho);

    return () => {
      observador?.disconnect();
      window.removeEventListener('resize', atualizarTamanho);
      marcadoresPorIdRef.current.clear();
      gruposPorIdRef.current.clear();

      botoesPorIdRef.current.clear();

      mapa.remove();

      mapaRef.current =
        null;

      camadaRegistrosRef.current =
        null;
    };
  }, []);

  /* =======================================================
     Renderização dos registros do mapa
     ======================================================= */

  useEffect(() => {
    const mapa =
      mapaRef.current;

    const camada =
      camadaRegistrosRef.current;

    if (
      !mapa ||
      !camada
    ) {
      return;
    }

    camada.clearLayers();
    marcadoresPorIdRef.current.clear();
    gruposPorIdRef.current.clear();

    const limites = [];
    const grupos = agruparPorCoordenadas(registros);

    grupos.forEach(({ coordenadas, registros: registrosDoLocal }) => {
      const [latitude, longitude] = coordenadas;
      const quantidade = registrosDoLocal.length;
      const agrupado = quantidade > 1;
      const categorias = new Set(registrosDoLocal.map(
        (feature) => feature.properties?.categoria,
      ));
      const categoria = categorias.size === 1
        ? registrosDoLocal[0].properties?.categoria
        : 'misto';
      const featureUnica = registrosDoLocal[0];
      const idUnico = obterId(featureUnica);
      const tituloUnico = obterTitulo(featureUnica);
      const numeroRoteiro = agrupado
        ? null
        : ordemRoteiroPorId.get(idUnico) ?? null;

      const marcador = L.marker([latitude, longitude], {
        icon: criarIcone(categoria, numeroRoteiro, quantidade),
        keyboard: true,
        title: agrupado
          ? `${quantidade} registros compartilham este ponto. Toque para escolher.`
          : tituloUnico,
        alt: agrupado
          ? `Abrir os ${quantidade} registros neste ponto`
          : `Abrir informações de ${tituloUnico}`,
        riseOnHover: true,
      });

      const conteudoInicial = agrupado
        ? criarHtmlGrupo(registrosDoLocal, fontes)
        : conteudoPopup(featureUnica, fontes);

      marcador.bindPopup(conteudoInicial, {
        maxWidth: 420,
        minWidth: agrupado ? 250 : 300,
        className: 'rota-popup',
        autoPanPadding: [24, 24],
      });

      marcador.bindTooltip(
        agrupado ? `${quantidade} registros neste ponto` : tituloUnico,
        {
          direction: 'top',
          offset: [0, -18],
          opacity: 0.96,
          className: 'rota-tooltip',
        },
      );

      if (agrupado) {
        marcador.on('popupopen', () => {
          setPopupAberto(true);
          setListaAberta(false);
        });
        marcador.on('popupclose', () => {
          setPopupAberto(false);
          setRegistroSelecionadoId('');
        });
      } else if (idUnico) {
        marcador.on('popupopen', () => {
          setPopupAberto(true);
          setRegistroSelecionadoId(idUnico);
          setListaAberta(false);
        });
        marcador.on('popupclose', () => {
          setPopupAberto(false);
          setRegistroSelecionadoId((idAtual) =>
            idAtual === idUnico ? '' : idAtual,
          );
        });
      }

      marcador.addTo(camada);

      registrosDoLocal.forEach((feature) => {
        const id = obterId(feature);
        if (!id) return;
        marcadoresPorIdRef.current.set(id, marcador);
        gruposPorIdRef.current.set(id, registrosDoLocal);
      });

      limites.push([latitude, longitude]);
    });

    // Desktop mantém o enquadramento dos registros ao mudar de categoria.
    // No celular, iniciamos pelo centro histórico e damos ao usuário
    // controles explícitos para ver todos os pontos ou voltar ao centro.
    // Alterar o roteiro NÃO deve mexer no zoom ou no ponto de vista.
    const conjuntoMudou = registrosAnterioresRef.current !== registros;
    registrosAnterioresRef.current = registros;
    const telaMaior = window.matchMedia('(min-width: 769px)').matches;

    if (telaMaior && conjuntoMudou) {
      if (limites.length > 1) {
        mapa.fitBounds(limites, { padding: [44, 44], maxZoom: 16 });
      } else if (limites.length === 1) {
        mapa.setView(limites[0], 16);
      } else {
        mapa.setView(CENTRO_ARACATI, ZOOM_INICIAL);
      }
    }
  }, [
    registros,
    fontes,
    ordemRoteiroPorId,
  ]);

  /* =======================================================
     Seleção atualmente aberta
     ======================================================= */

  useEffect(() => {
    setRegistroSelecionadoId(
      (
        idAtual,
      ) => {
        if (!idAtual) {
          return '';
        }

        const continuaVisivel =
          registros.some(
            (feature) =>
              obterId(
                feature,
              ) ===
              idAtual,
          );

        return continuaVisivel
          ? idAtual
          : '';
      },
    );
  }, [
    registros,
  ]);

  /* =======================================================
     Scroll automático da lista
     ======================================================= */

  useEffect(() => {
    if (!registroSelecionadoId ||
        (window.matchMedia('(max-width: 768px)').matches && !listaAberta)) {
      return;
    }

    const botao =
      botoesPorIdRef.current.get(
        registroSelecionadoId,
      );

    if (!botao) {
      return;
    }

    botao.scrollIntoView({
      block:
        'nearest',

      inline:
        'nearest',

      behavior:
        'smooth',
    });
  }, [
    registroSelecionadoId,
    listaAberta,
  ]);

  /* =======================================================
     Adicionar / remover do roteiro
     ======================================================= */

  function alternarRegistroNoRoteiro(
    feature,
  ) {
    const novoItem =
      criarItemRoteiro(
        feature,
      );

    if (
      !novoItem ||
      !novoItem.id
    ) {
      return;
    }

    setRoteiro(
      (
        roteiroAtual,
      ) => {
        const jaExiste =
          roteiroAtual.some(
            (item) =>
              item.id ===
              novoItem.id,
          );

        if (jaExiste) {
          return roteiroAtual.filter(
            (item) =>
              item.id !==
              novoItem.id,
          );
        }

        if (
          roteiroAtual.length >=
          MAX_PONTOS_ROTEIRO
        ) {
          return roteiroAtual;
        }

        return [
          ...roteiroAtual,
          novoItem,
        ];
      },
    );
  }

  function limparRoteiro() {
    setRoteiro([]);
  }

  /* =======================================================
     Abrir ficha
     ======================================================= */

  function abrirRegistro(
    feature,
  ) {
    const id =
      obterId(
        feature,
      );

    const marcador =
      marcadoresPorIdRef.current.get(
        id,
      );

    const mapa =
      mapaRef.current;

    const coordenadas =
      obterCoordenadas(
        feature,
      );

    if (
      !marcador ||
      !mapa ||
      !coordenadas
    ) {
      return;
    }

    const [
      latitude,
      longitude,
    ] = coordenadas;

    const destino =
      L.latLng(
        latitude,
        longitude,
      );

    const zoomDestino =
      17;

    const precisaMover =
      mapa.getZoom() !==
        zoomDestino ||
      mapa
        .getCenter()
        .distanceTo(
          destino,
        ) >
        2;

    mapa.closePopup();

    const registrosDoLocal = gruposPorIdRef.current.get(id) ?? [];
    if (registrosDoLocal.length > 1) {
      marcador.setPopupContent(
        criarHtmlGrupo(registrosDoLocal, fontes, id),
      );
    }

    setRegistroSelecionadoId(
      id,
    );

    if (!precisaMover) {
      marcador.openPopup();

      return;
    }

    mapa.once(
      'moveend',
      () => {
        marcador.openPopup();
      },
    );

    mapa.flyTo(
      destino,
      zoomDestino,
      {
        animate:
          true,

        duration:
          0.65,
      },
    );
  }

  /* =======================================================
     Clique da lista
     ======================================================= */

  function lidarCliqueRegistro(
    feature,
  ) {
    if (modoRoteiro) {
      alternarRegistroNoRoteiro(
        feature,
      );

      return;
    }

    // No celular, recolhe a lista para que a ficha fique visível.
    setListaAberta(false);
    abrirRegistro(
      feature,
    );
  }

  function centralizarMapa() {
    mapaRef.current?.setView(CENTRO_ARACATI, ZOOM_INICIAL, { animate: true });
  }

  function enquadrarRegistros() {
    const mapa = mapaRef.current;
    if (!mapa) return;
    const posicoes = registros.map(obterCoordenadas).filter(Boolean);
    if (posicoes.length > 1) {
      mapa.fitBounds(posicoes, { padding: [32, 32], maxZoom: 16, animate: true });
    } else if (posicoes.length === 1) {
      mapa.setView(posicoes[0], 16, { animate: true });
    } else {
      centralizarMapa();
    }
  }

  /* =======================================================
     Interface
     ======================================================= */

  return (
    <div className={`map-view-shell${listaAberta ? ' has-list-open' : ''}${popupAberto ? ' has-popup-open' : ''}`}>

      <div
        ref={elementoMapaRef}
        className="map-container"
        role="region"
        aria-label="Mapa interativo de Aracati com registros culturais georreferenciados"
      />

      <div className="map-view-actions" aria-label="Controles de localização do mapa">
        <button type="button" onClick={centralizarMapa} title="Voltar ao centro histórico">
          Centro
        </button>
        <button type="button" onClick={enquadrarRegistros} title="Mostrar todos os registros da categoria">
          Ver todos
        </button>
      </div>

      {/* ===================================================
          Ferramentas de roteiro
          =================================================== */}

      <div
        className="map-route-toolbar"
        aria-label="Ferramentas do roteiro personalizado"
      >

        <button
          className={
            `map-route-toggle${
              modoRoteiro
                ? ' is-active'
                : ''
            }`
          }
          type="button"
          aria-pressed={
            modoRoteiro
          }
          onClick={() => {
            setModoRoteiro((ativo) => !ativo);
            setListaAberta(true);
          }}
        >

          <span>
            {
              modoRoteiro
                ? 'Montando roteiro'
                : 'Montar meu roteiro'
            }
          </span>

          <span
            className="map-route-count"
            aria-label={
              `${roteiro.length} ponto(s) selecionado(s)`
            }
          >
            {
              roteiro.length
            }
          </span>

        </button>

        {
          roteiro.length > 0
            ? (
              <button
                className="map-route-clear"
                type="button"
                onClick={
                  limparRoteiro
                }
              >
                Limpar
              </button>
            )
            : null
        }

        {
          roteiro.length >= 2 &&
          urlGoogleMaps
            ? (
              <a
                className="map-route-open"
                href={
                  urlGoogleMaps
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir no Google Maps
                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            )
            : null
        }

        {
          modoRoteiro
            ? (
              <p
                className="map-route-hint"
              >
                {
                  roteiro.length <
                  MAX_PONTOS_ROTEIRO
                    ? `Escolha os pontos na ordem da visita. Clique novamente para remover. Máximo de ${MAX_PONTOS_ROTEIRO} pontos.`
                    : `Limite de ${MAX_PONTOS_ROTEIRO} pontos atingido. Remova um ponto para escolher outro.`
                }
              </p>
            )
            : null
        }

      </div>

      {/* ===================================================
          Lista lateral
          =================================================== */}

      {
        registrosOrdenados.length >
        0
          ? (
            <>
            <button
              className="map-record-trigger"
              type="button"
              aria-expanded={listaAberta}
              aria-controls="map-record-items"
              onClick={() => setListaAberta((aberta) => !aberta)}
            >
              <span>{listaAberta ? 'Fechar registros' : 'Ver registros'}</span>
              <span className="map-record-trigger-count">{registrosOrdenados.length}</span>
              <span aria-hidden="true">{listaAberta ? '⌄' : '⌃'}</span>
            </button>
            <nav
              id="map-record-items"
              className={`map-record-list${listaAberta ? ' is-open' : ''}`}
              aria-label="Registros culturais visíveis no mapa"
            >
              <div className="map-record-list-header">
                <strong>{registrosOrdenados.length} registros mapeados</strong>
                <span>{modoRoteiro ? 'Selecione os pontos do roteiro' : 'Toque para abrir a ficha'}</span>
              </div>

              {
                registrosOrdenados.map(
                  (
                    feature,
                  ) => {
                    const p =
                      feature.properties ??
                      {};

                    const id =
                      obterId(
                        feature,
                      );

                    const titulo =
                      obterTitulo(
                        feature,
                      );

                    const categoria =
                      ROTULOS_CATEGORIA[
                        p.categoria
                      ] ||
                      'Registro';

                    const classeCategoria =
                      p.categoria ===
                      'lenda'
                        ? 'popup-chip-lenda'
                        : 'popup-chip-patrimonio';

                    const ativo =
                      Boolean(id) &&
                      registroSelecionadoId ===
                        id;

                    const numeroRoteiro =
                      ordemRoteiroPorId.get(
                        id,
                      ) ??
                      null;

                    const noRoteiro =
                      numeroRoteiro !==
                      null;

                    const limiteAtingido =
                      modoRoteiro &&
                      !noRoteiro &&
                      roteiro.length >=
                        MAX_PONTOS_ROTEIRO;

                    return (
                      <button
                        key={
                          id ||
                          titulo
                        }

                        ref={(
                          elemento,
                        ) => {
                          if (!id) {
                            return;
                          }

                          if (elemento) {
                            botoesPorIdRef.current.set(
                              id,
                              elemento,
                            );
                          } else {
                            botoesPorIdRef.current.delete(
                              id,
                            );
                          }
                        }}

                        className={
                          `map-record-item${
                            ativo
                              ? ' is-active'
                              : ''
                          }${
                            noRoteiro
                              ? ' is-in-route'
                              : ''
                          }`
                        }

                        type="button"

                        disabled={
                          limiteAtingido
                        }

                        onClick={() => {
                          lidarCliqueRegistro(
                            feature,
                          );
                        }}

                        aria-label={
                          modoRoteiro
                            ? noRoteiro
                              ? `Remover ${titulo} do roteiro`
                              : `Adicionar ${titulo} ao roteiro`
                            : `Abrir ${categoria.toLowerCase()} ${titulo}`
                        }

                        aria-current={
                          ativo
                            ? 'true'
                            : undefined
                        }

                        aria-pressed={
                          modoRoteiro
                            ? noRoteiro
                            : undefined
                        }
                      >

                        <span
                          className="map-record-main"
                        >

                          {
                            numeroRoteiro
                              ? (
                                <span
                                  className="map-route-order"
                                  aria-label={
                                    `Posição ${numeroRoteiro} no roteiro`
                                  }
                                >
                                  {
                                    numeroRoteiro
                                  }
                                </span>
                              )
                              : null
                          }

                          <span
                            className="map-record-title"
                            title={
                              titulo
                            }
                          >
                            {
                              titulo
                            }
                          </span>

                        </span>

                        <span
                          className="map-record-meta"
                          aria-hidden="true"
                        >

                          <span
                            className={
                              `popup-chip ${classeCategoria}`
                            }
                          >
                            {
                              categoria
                            }
                          </span>

                          <span
                            className="popup-id"
                          >
                            {
                              id ||
                              'Sem ID'
                            }
                          </span>

                        </span>

                      </button>
                    );
                  },
                )
              }

            </nav>
            </>
          )
          : null
      }

    </div>
  );
}
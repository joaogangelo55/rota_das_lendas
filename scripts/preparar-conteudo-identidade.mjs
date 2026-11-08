import fs from 'node:fs';

const caminhoJson = new URL(
  '../src/data/dados.json',
  import.meta.url,
);

const caminhoGeojson = new URL(
  '../public/data/dados.geojson',
  import.meta.url,
);

const dados = JSON.parse(
  fs.readFileSync(
    caminhoJson,
    'utf8',
  ),
);

const geojson = JSON.parse(
  fs.readFileSync(
    caminhoGeojson,
    'utf8',
  ),
);

const MODELO_IMAGEM = {
  src: null,
  alt: null,
  credito: null,
  fonte: null,
  licenca: null,
};

function normalizarImagem(registro) {
  const imagemAtual =
    registro.imagem;

  const licencaLegada =
    registro.licenca_imagem ??
    null;

  if (
    imagemAtual &&
    typeof imagemAtual === 'object' &&
    !Array.isArray(imagemAtual)
  ) {
    registro.imagem = {
      ...MODELO_IMAGEM,
      ...imagemAtual,

      licenca:
        imagemAtual.licenca ??
        licencaLegada,
    };
  } else {
    registro.imagem = {
      ...MODELO_IMAGEM,

      src:
        typeof imagemAtual === 'string'
          ? imagemAtual
          : null,

      licenca:
        licencaLegada,
    };
  }

  delete registro.licenca_imagem;
}

function prepararPatrimonio(registro) {
  if (
    !(
      'texto_historico' in
      registro
    )
  ) {
    registro.texto_historico =
      null;
  }

  normalizarImagem(registro);
}

function prepararLenda(registro) {
  if (
    !(
      'narrativa' in
      registro
    )
  ) {
    registro.narrativa =
      null;
  }

  normalizarImagem(registro);
}

for (
  const registro of
  dados.patrimonios ?? []
) {
  prepararPatrimonio(
    registro,
  );
}

for (
  const registro of
  dados.lendas ?? []
) {
  prepararLenda(
    registro,
  );
}

for (
  const feature of
  geojson.features ?? []
) {
  const registro =
    feature.properties;

  if (
    !registro ||
    typeof registro !== 'object'
  ) {
    continue;
  }

  if (
    registro.categoria ===
    'patrimonio'
  ) {
    prepararPatrimonio(
      registro,
    );
  }

  if (
    registro.categoria ===
    'lenda'
  ) {
    prepararLenda(
      registro,
    );
  }
}

const modeloConteudoIdentidade = {
  versao: '1.0',

  campo_lendas:
    'narrativa',

  campo_patrimonios:
    'texto_historico',

  campos_imagem: [
    'src',
    'alt',
    'credito',
    'fonte',
    'licenca',
  ],

  regra_pendencia:
    'Valor null indica conteúdo ainda não validado/preenchido. A descrição documental permanece como fallback até a validação do conteúdo de exibição.',
};

dados.metadata = {
  ...dados.metadata,

  modelo_conteudo_identidade:
    modeloConteudoIdentidade,
};

geojson.metadata = {
  ...geojson.metadata,

  modelo_conteudo_identidade:
    modeloConteudoIdentidade,
};

fs.writeFileSync(
  caminhoJson,

  `${JSON.stringify(
    dados,
    null,
    2,
  )}\n`,

  'utf8',
);

fs.writeFileSync(
  caminhoGeojson,

  `${JSON.stringify(
    geojson,
    null,
    2,
  )}\n`,

  'utf8',
);

console.log(
  'CONCLUÍDO — modelo de conteúdo da Identidade Cultural v1.0 preparado.',
);

console.log('');

console.log(
  'Arquivos atualizados:',
);

console.log(
  '- src/data/dados.json',
);

console.log(
  '- public/data/dados.geojson',
);

console.log('');

console.log(
  'O arquivo histórico public/data/dados_v2.1.1_georreferenciado.geojson não foi alterado.',
);
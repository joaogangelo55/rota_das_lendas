import fs from 'node:fs';

const caminhoCatalogo = new URL(
  '../src/data/conteudos-identidade.json',
  import.meta.url,
);

const caminhoDados = new URL(
  '../src/data/dados.json',
  import.meta.url,
);

const caminhoGeojson = new URL(
  '../public/data/dados.geojson',
  import.meta.url,
);

function lerJson(caminho) {
  return JSON.parse(
    fs.readFileSync(
      caminho,
      'utf8',
    ),
  );
}

const catalogo = lerJson(
  caminhoCatalogo,
);

const dados = lerJson(
  caminhoDados,
);

const geojson = lerJson(
  caminhoGeojson,
);

const registrosEditoriais =
  catalogo.registros ?? {};

const erros = [];

function registrarErro(mensagem) {
  erros.push(mensagem);
}

function copiarImagem(imagem) {
  return {
    src:
      imagem?.src ??
      null,

    alt:
      imagem?.alt ??
      null,

    credito:
      imagem?.credito ??
      null,

    fonte:
      imagem?.fonte ??
      null,

    licenca:
      imagem?.licenca ??
      null,
  };
}

function validarImagem(
  imagem,
  id,
) {
  if (
    !imagem ||
    typeof imagem !== 'object' ||
    Array.isArray(imagem)
  ) {
    registrarErro(
      `${id}: imagem deve ser um objeto.`,
    );

    return;
  }

  const campos = [
    'src',
    'alt',
    'credito',
    'fonte',
    'licenca',
  ];

  for (
    const campo of
    campos
  ) {
    if (
      !Object.prototype.hasOwnProperty.call(
        imagem,
        campo,
      )
    ) {
      registrarErro(
        `${id}: imagem não possui o campo "${campo}".`,
      );
    }
  }

  const src =
    typeof imagem.src === 'string'
      ? imagem.src.trim()
      : '';

  if (!src) {
    return;
  }

  const alt =
    typeof imagem.alt === 'string'
      ? imagem.alt.trim()
      : '';

  const credito =
    typeof imagem.credito === 'string'
      ? imagem.credito.trim()
      : '';

  if (!alt) {
    registrarErro(
      `${id}: imagem com src preenchido precisa possuir alt.`,
    );
  }

  if (!credito) {
    registrarErro(
      `${id}: imagem com src preenchido precisa possuir credito.`,
    );
  }
}

function validarEntradaEditorial(
  id,
  entrada,
) {
  if (
    !entrada ||
    typeof entrada !== 'object'
  ) {
    registrarErro(
      `${id}: entrada editorial inválida.`,
    );

    return;
  }

  if (
    entrada.categoria !== 'lenda' &&
    entrada.categoria !== 'patrimonio'
  ) {
    registrarErro(
      `${id}: categoria editorial inválida.`,
    );
  }

  if (
    entrada.categoria === 'lenda'
  ) {
    if (
      !Object.prototype.hasOwnProperty.call(
        entrada,
        'narrativa',
      )
    ) {
      registrarErro(
        `${id}: campo narrativa ausente.`,
      );
    }

    if (
      entrada.narrativa !== null &&
      typeof entrada.narrativa !== 'string'
    ) {
      registrarErro(
        `${id}: narrativa deve ser string ou null.`,
      );
    }
  }

  if (
    entrada.categoria === 'patrimonio'
  ) {
    if (
      !Object.prototype.hasOwnProperty.call(
        entrada,
        'texto_historico',
      )
    ) {
      registrarErro(
        `${id}: campo texto_historico ausente.`,
      );
    }

    if (
      entrada.texto_historico !== null &&
      typeof entrada.texto_historico !== 'string'
    ) {
      registrarErro(
        `${id}: texto_historico deve ser string ou null.`,
      );
    }
  }

  validarImagem(
    entrada.imagem,
    id,
  );
}

/* =========================================================
   1. Validar catálogo editorial
   ========================================================= */

const idsEditoriais =
  Object.keys(
    registrosEditoriais,
  );

for (
  const id of
  idsEditoriais
) {
  validarEntradaEditorial(
    id,
    registrosEditoriais[id],
  );
}

if (
  idsEditoriais.length !== 42
) {
  registrarErro(
    `Catálogo deveria possuir 42 registros, mas possui ${idsEditoriais.length}.`,
  );
}

/* =========================================================
   2. Atualizar dados.json
   ========================================================= */

const registrosCanonicos = [
  ...(dados.patrimonios ?? []),
  ...(dados.lendas ?? []),
];

const idsCanonicos =
  new Set(
    registrosCanonicos.map(
      (registro) =>
        registro.id,
    ),
  );

for (
  const id of
  idsEditoriais
) {
  if (
    !idsCanonicos.has(id)
  ) {
    registrarErro(
      `${id}: existe no catálogo editorial, mas não existe entre patrimônios/lendas do dados.json.`,
    );
  }
}

for (
  const registro of
  registrosCanonicos
) {
  const id =
    registro.id;

  const entrada =
    registrosEditoriais[id];

  if (!entrada) {
    registrarErro(
      `${id}: registro canônico sem entrada no catálogo editorial.`,
    );

    continue;
  }

  if (
    registro.categoria !==
    entrada.categoria
  ) {
    registrarErro(
      `${id}: categoria difere entre dados.json e catálogo editorial.`,
    );

    continue;
  }

  if (
    entrada.categoria === 'lenda'
  ) {
    registro.narrativa =
      entrada.narrativa;
  }

  if (
    entrada.categoria === 'patrimonio'
  ) {
    registro.texto_historico =
      entrada.texto_historico;
  }

  registro.imagem =
    copiarImagem(
      entrada.imagem,
    );
}

/* =========================================================
   3. Atualizar dados.geojson
   ========================================================= */

const features =
  geojson.features ?? [];

const featuresPorId =
  new Map();

for (
  const feature of
  features
) {
  const id =
    feature.id ||
    feature.properties?.id;

  if (id) {
    featuresPorId.set(
      id,
      feature,
    );
  }
}

for (
  const id of
  idsEditoriais
) {
  const feature =
    featuresPorId.get(id);

  if (!feature) {
    registrarErro(
      `${id}: não encontrado no dados.geojson.`,
    );

    continue;
  }

  const entrada =
    registrosEditoriais[id];

  const properties =
    feature.properties ?? {};

  if (
    properties.categoria !==
    entrada.categoria
  ) {
    registrarErro(
      `${id}: categoria difere entre GeoJSON e catálogo editorial.`,
    );

    continue;
  }

  if (
    entrada.categoria === 'lenda'
  ) {
    properties.narrativa =
      entrada.narrativa;
  }

  if (
    entrada.categoria === 'patrimonio'
  ) {
    properties.texto_historico =
      entrada.texto_historico;
  }

  properties.imagem =
    copiarImagem(
      entrada.imagem,
    );

  feature.properties =
    properties;
}

/* =========================================================
   4. Interromper caso haja erro
   ========================================================= */

if (
  erros.length > 0
) {
  console.error('');

  console.error(
    'FALHOU — sincronização da Identidade Cultural.',
  );

  console.error('');

  for (
    const erro of
    erros
  ) {
    console.error(
      `- ${erro}`,
    );
  }

  console.error('');

  console.error(
    'Nenhum arquivo foi gravado.',
  );

  process.exit(1);
}

/* =========================================================
   5. Salvar somente depois de validar tudo
   ========================================================= */

fs.writeFileSync(
  caminhoDados,

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

/* =========================================================
   6. Resultado
   ========================================================= */

console.log(
  'CONCLUÍDO — conteúdos editoriais sincronizados.',
);

console.log('');

console.log(
  `Registros sincronizados: ${idsEditoriais.length}`,
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
  'Fonte editorial preservada:',
);

console.log(
  '- src/data/conteudos-identidade.json',
);

console.log('');

console.log(
  'O arquivo histórico dados_v2.1.1_georreferenciado.geojson não foi alterado.',
);
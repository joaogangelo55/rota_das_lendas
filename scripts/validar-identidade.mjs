import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const caminhoJson = new URL(
  '../src/data/dados.json',
  import.meta.url,
);

const caminhoGeojson = new URL(
  '../public/data/dados.geojson',
  import.meta.url,
);

const diretorioPublic = fileURLToPath(
  new URL('../public/', import.meta.url),
);

function lerJson(caminho) {
  return JSON.parse(
    fs.readFileSync(
      caminho,
      'utf8',
    ),
  );
}

const dados = lerJson(
  caminhoJson,
);

const geojson = lerJson(
  caminhoGeojson,
);

const erros = [];

const CAMPOS_IMAGEM = [
  'src',
  'alt',
  'credito',
  'fonte',
  'licenca',
];

function falhar(
  contexto,
  mensagem,
) {
  erros.push(
    `${contexto}: ${mensagem}`,
  );
}

function valorNuloOuTexto(
  valor,
) {
  return (
    valor === null ||
    typeof valor === 'string'
  );
}

function textoNaoVazio(
  valor,
) {
  return (
    typeof valor === 'string' &&
    valor.trim().length > 0
  );
}

function textoValidoOuNull(
  valor,
) {
  return (
    valor === null ||
    textoNaoVazio(valor)
  );
}

function urlHttpValida(
  valor,
) {
  if (
    typeof valor !== 'string' ||
    !valor.trim()
  ) {
    return false;
  }

  try {
    const url = new URL(
      valor,
    );

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

function obterIdGeojson(
  feature,
) {
  return (
    feature?.id ||
    feature?.properties?.id ||
    null
  );
}

function validarImagem(
  imagem,
  contexto,
) {
  if (
    !imagem ||
    typeof imagem !== 'object' ||
    Array.isArray(imagem)
  ) {
    falhar(
      contexto,
      'imagem deve ser um objeto.',
    );

    return;
  }

  for (
    const campo of
    CAMPOS_IMAGEM
  ) {
    if (
      !Object.prototype.hasOwnProperty.call(
        imagem,
        campo,
      )
    ) {
      falhar(
        contexto,
        `imagem não possui o campo "${campo}".`,
      );

      continue;
    }

    if (
      !valorNuloOuTexto(
        imagem[campo],
      )
    ) {
      falhar(
        contexto,
        `imagem.${campo} deve ser string ou null.`,
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
    falhar(
      contexto,
      'imagem com src preenchido também deve possuir alt.',
    );
  }

  if (!credito) {
    falhar(
      contexto,
      'imagem com src preenchido também deve possuir credito.',
    );
  }
}

function validarLenda(
  registro,
  contexto,
) {
  if (
    !Object.prototype.hasOwnProperty.call(
      registro,
      'narrativa',
    )
  ) {
    falhar(
      contexto,
      'campo narrativa ausente.',
    );
  } else if (
    !textoValidoOuNull(
      registro.narrativa,
    )
  ) {
    falhar(
      contexto,
      'narrativa deve ser texto não vazio ou null.',
    );
  }

  validarImagem(
    registro.imagem,
    contexto,
  );
}

function validarPatrimonio(
  registro,
  contexto,
) {
  if (
    !Object.prototype.hasOwnProperty.call(
      registro,
      'texto_historico',
    )
  ) {
    falhar(
      contexto,
      'campo texto_historico ausente.',
    );
  } else if (
    !textoValidoOuNull(
      registro.texto_historico,
    )
  ) {
    falhar(
      contexto,
      'texto_historico deve ser texto não vazio ou null.',
    );
  }

  validarImagem(
    registro.imagem,
    contexto,
  );
}

const patrimonios =
  dados.patrimonios ?? [];

const lendas =
  dados.lendas ?? [];

const fontes =
  dados.fontes ?? {};

const features =
  geojson.features ?? [];

const featuresPorId =
  new Map(
    features.map(
      (feature) => [
        obterIdGeojson(feature),
        feature,
      ],
    ),
  );

const registrosCanonicos = [
  ...patrimonios,
  ...lendas,
];

/* =========================================================
   T13 — estrutura das narrativas
   ========================================================= */

const quantidadeErrosAntesT13 =
  erros.length;

for (
  const lenda of
  lendas
) {
  validarLenda(
    lenda,
    `Lenda ${lenda.id ?? 'sem ID'}`,
  );
}

if (
  erros.length ===
  quantidadeErrosAntesT13
) {
  console.log(
    `PASSOU — T13: ${lendas.length} lendas possuem campo narrativa estruturado.`,
  );
}

/* =========================================================
   T14 — estrutura dos textos históricos
   ========================================================= */

const quantidadeErrosAntesT14 =
  erros.length;

for (
  const patrimonio of
  patrimonios
) {
  validarPatrimonio(
    patrimonio,
    `Patrimônio ${patrimonio.id ?? 'sem ID'}`,
  );
}

if (
  erros.length ===
  quantidadeErrosAntesT14
) {
  console.log(
    `PASSOU — T14: ${patrimonios.length} patrimônios possuem campo texto_historico estruturado.`,
  );
}

/* =========================================================
   T15 — sincronização JSON ↔ GeoJSON
   ========================================================= */

const quantidadeErrosAntesT15 =
  erros.length;

for (
  const registro of
  registrosCanonicos
) {
  const id =
    registro.id;

  if (!id) {
    falhar(
      'Sincronização',
      'registro canônico sem ID.',
    );

    continue;
  }

  const feature =
    featuresPorId.get(id);

  if (!feature) {
    falhar(
      id,
      'registro não encontrado no GeoJSON.',
    );

    continue;
  }

  const propriedades =
    feature.properties ?? {};

  if (
    registro.categoria ===
    'lenda'
  ) {
    if (
      propriedades.narrativa !==
      registro.narrativa
    ) {
      falhar(
        id,
        'narrativa difere entre dados.json e dados.geojson.',
      );
    }
  }

  if (
    registro.categoria ===
    'patrimonio'
  ) {
    if (
      propriedades.texto_historico !==
      registro.texto_historico
    ) {
      falhar(
        id,
        'texto_historico difere entre dados.json e dados.geojson.',
      );
    }
  }

  validarImagem(
    propriedades.imagem,
    `GeoJSON ${id}`,
  );

  const imagemCanonica =
    JSON.stringify(
      registro.imagem,
    );

  const imagemGeojson =
    JSON.stringify(
      propriedades.imagem,
    );

  if (
    imagemCanonica !==
    imagemGeojson
  ) {
    falhar(
      id,
      'imagem difere entre dados.json e dados.geojson.',
    );
  }
}

if (
  erros.length ===
  quantidadeErrosAntesT15
) {
  console.log(
    `PASSOU — T15: ${registrosCanonicos.length} registros possuem conteúdo de identidade sincronizado entre JSON e GeoJSON.`,
  );
}

/* =========================================================
   T16 — 26/26 lendas com narrativa
   ========================================================= */

const quantidadeErrosAntesT16 =
  erros.length;

for (
  const lenda of
  lendas
) {
  if (
    !textoNaoVazio(
      lenda.narrativa,
    )
  ) {
    falhar(
      lenda.id ?? 'Lenda sem ID',
      'narrativa final não está preenchida.',
    );
  }
}

if (
  erros.length ===
  quantidadeErrosAntesT16
) {
  console.log(
    `PASSOU — T16: ${lendas.length}/${lendas.length} lendas possuem narrativa preenchida.`,
  );
}

/* =========================================================
   T17 — 16/16 patrimônios com texto
   ========================================================= */

const quantidadeErrosAntesT17 =
  erros.length;

for (
  const patrimonio of
  patrimonios
) {
  if (
    !textoNaoVazio(
      patrimonio.texto_historico,
    )
  ) {
    falhar(
      patrimonio.id ?? 'Patrimônio sem ID',
      'texto histórico final não está preenchido.',
    );
  }
}

if (
  erros.length ===
  quantidadeErrosAntesT17
) {
  console.log(
    `PASSOU — T17: ${patrimonios.length}/${patrimonios.length} patrimônios possuem texto histórico preenchido.`,
  );
}

/* =========================================================
   T18 — imagens locais realmente existem
   ========================================================= */

const quantidadeErrosAntesT18 =
  erros.length;

let imagensLocaisVerificadas = 0;

for (
  const registro of
  registrosCanonicos
) {
  const src =
    typeof registro.imagem?.src === 'string'
      ? registro.imagem.src.trim()
      : '';

  if (!src) {
    continue;
  }

  if (
    src.startsWith('http://') ||
    src.startsWith('https://')
  ) {
    continue;
  }

  if (
    !src.startsWith('/')
  ) {
    falhar(
      registro.id ?? 'Registro sem ID',
      `imagem local deve iniciar com "/": ${src}`,
    );

    continue;
  }

  const caminhoRelativo =
    src.replace(
      /^\/+/,
      '',
    );

  const caminhoArquivo =
    path.resolve(
      diretorioPublic,
      caminhoRelativo,
    );

  const caminhoPublicResolvido =
    path.resolve(
      diretorioPublic,
    );

  if (
    !caminhoArquivo.startsWith(
      `${caminhoPublicResolvido}${path.sep}`,
    )
  ) {
    falhar(
      registro.id ?? 'Registro sem ID',
      `caminho de imagem inválido: ${src}`,
    );

    continue;
  }

  imagensLocaisVerificadas += 1;

  if (
    !fs.existsSync(
      caminhoArquivo,
    )
  ) {
    falhar(
      registro.id ?? 'Registro sem ID',
      `arquivo de imagem não encontrado: ${src}`,
    );

    continue;
  }

  const estatistica =
    fs.statSync(
      caminhoArquivo,
    );

  if (
    !estatistica.isFile()
  ) {
    falhar(
      registro.id ?? 'Registro sem ID',
      `referência de imagem não aponta para arquivo: ${src}`,
    );
  }
}

if (
  erros.length ===
  quantidadeErrosAntesT18
) {
  console.log(
    `PASSOU — T18: ${imagensLocaisVerificadas} referências locais de imagem apontam para arquivos existentes.`,
  );
}

/* =========================================================
   T19 — fontes principais rastreáveis
   ========================================================= */

const quantidadeErrosAntesT19 =
  erros.length;

for (
  const registro of
  registrosCanonicos
) {
  const id =
    registro.id ??
    'Registro sem ID';

  const codigoFonte =
    typeof registro.fonte_principal === 'string'
      ? registro.fonte_principal.trim()
      : '';

  if (!codigoFonte) {
    falhar(
      id,
      'fonte_principal não está preenchida.',
    );

    continue;
  }

  const fonte =
    fontes[codigoFonte];

  if (!fonte) {
    falhar(
      id,
      `fonte_principal ${codigoFonte} não existe no catálogo de fontes.`,
    );

    continue;
  }

  if (
    !textoNaoVazio(
      fonte.referencia,
    )
  ) {
    falhar(
      id,
      `fonte ${codigoFonte} não possui referência textual.`,
    );
  }

  if (
    !urlHttpValida(
      fonte.url,
    )
  ) {
    falhar(
      id,
      `fonte ${codigoFonte} não possui URL HTTP/HTTPS válida.`,
    );
  }
}

if (
  erros.length ===
  quantidadeErrosAntesT19
) {
  console.log(
    `PASSOU — T19: ${registrosCanonicos.length}/${registrosCanonicos.length} registros possuem fonte principal rastreável no catálogo S01–S32.`,
  );
}

/* =========================================================
   RESULTADO FINAL
   ========================================================= */

if (
  erros.length > 0
) {
  console.error('');

  console.error(
    'FALHOU — validação final da Identidade Cultural.',
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

  process.exit(1);
}

console.log('');

console.log(
  'RESULTADO: Identidade Cultural validada para o fechamento do protótipo.',
);

console.log(
  `Resumo — ${lendas.length} lendas; ${patrimonios.length} patrimônios; ${registrosCanonicos.length} registros; ${imagensLocaisVerificadas} imagens locais verificadas.`,
);
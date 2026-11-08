import fs from 'node:fs';

const caminhoDados = new URL(
  '../src/data/dados.json',
  import.meta.url,
);

const caminhoSaida = new URL(
  '../src/data/conteudos-identidade.json',
  import.meta.url,
);

const dados = JSON.parse(
  fs.readFileSync(
    caminhoDados,
    'utf8',
  ),
);

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

function criarEntradaLenda(registro) {
  return {
    titulo:
      registro.titulo,

    categoria:
      'lenda',

    narrativa:
      registro.narrativa ??
      null,

    imagem:
      copiarImagem(
        registro.imagem,
      ),
  };
}

function criarEntradaPatrimonio(
  registro,
) {
  return {
    titulo:
      registro.titulo,

    categoria:
      'patrimonio',

    texto_historico:
      registro.texto_historico ??
      null,

    imagem:
      copiarImagem(
        registro.imagem,
      ),
  };
}

const registros = {};

for (
  const patrimonio of
  dados.patrimonios ?? []
) {
  registros[
    patrimonio.id
  ] =
    criarEntradaPatrimonio(
      patrimonio,
    );
}

for (
  const lenda of
  dados.lendas ?? []
) {
  registros[
    lenda.id
  ] =
    criarEntradaLenda(
      lenda,
    );
}

const catalogo = {
  metadata: {
    versao:
      '1.0',

    descricao:
      'Fonte editorial única para narrativas, textos históricos e imagens da Identidade Cultural.',

    regra:
      'Editar este arquivo e sincronizar posteriormente com dados.json e dados.geojson.',

    total_registros:
      Object.keys(
        registros,
      ).length,
  },

  registros,
};

fs.writeFileSync(
  caminhoSaida,

  `${JSON.stringify(
    catalogo,
    null,
    2,
  )}\n`,

  'utf8',
);

console.log(
  'CONCLUÍDO — catálogo editorial criado.',
);

console.log('');

console.log(
  '- src/data/conteudos-identidade.json',
);

console.log('');

console.log(
  `Registros editoriais: ${
    Object.keys(
      registros,
    ).length
  }`,
);

console.log('');

console.log(
  'Nenhum arquivo cartográfico foi alterado.',
);
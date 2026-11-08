import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const caminhoCatalogo = new URL(
  '../src/data/conteudos-identidade.json',
  import.meta.url,
);

const diretorioImagensUrl = new URL(
  '../public/images/patrimonios/',
  import.meta.url,
);

const diretorioImagens =
  fileURLToPath(
    diretorioImagensUrl,
  );

const catalogo = JSON.parse(
  fs.readFileSync(
    caminhoCatalogo,
    'utf8',
  ),
);

const registros =
  catalogo.registros ?? {};

const EXTENSOES_PERMITIDAS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
];

const CREDITO_PADRAO =
  'Roteiro Virtual do Aracati / Secretaria de Cultura';

const FONTE_PADRAO =
  'https://roteirovirtual.aracati.ce.gov.br/';

function encontrarImagem(id) {
  const nomeBase =
    id.toLowerCase();

  for (
    const extensao of
    EXTENSOES_PERMITIDAS
  ) {
    const nomeArquivo =
      `${nomeBase}${extensao}`;

    const caminhoCompleto =
      path.join(
        diretorioImagens,
        nomeArquivo,
      );

    if (
      fs.existsSync(
        caminhoCompleto,
      )
    ) {
      return {
        nomeArquivo,
        extensao,
      };
    }
  }

  return null;
}

let encontrados = 0;
let ausentes = 0;
let ignorados = 0;

for (
  const [id, registro] of
  Object.entries(registros)
) {
  if (
    registro.categoria !==
    'patrimonio'
  ) {
    ignorados += 1;
    continue;
  }

  const imagemEncontrada =
    encontrarImagem(id);

  if (!imagemEncontrada) {
    console.warn(
      `AUSENTE — ${id} — ${registro.titulo}`,
    );

    ausentes += 1;
    continue;
  }

  const src =
    `/images/patrimonios/${imagemEncontrada.nomeArquivo}`;

  registro.imagem = {
    src,

    alt:
      `Imagem de ${registro.titulo}, em Aracati.`,

    credito:
      CREDITO_PADRAO,

    fonte:
      FONTE_PADRAO,

    licenca:
      null,
  };

  encontrados += 1;

  console.log(
    `OK — ${id} → ${src}`,
  );
}

fs.writeFileSync(
  caminhoCatalogo,

  `${JSON.stringify(
    catalogo,
    null,
    2,
  )}\n`,

  'utf8',
);

console.log('');
console.log(
  'CONCLUÍDO — indexação das imagens patrimoniais.',
);

console.log('');
console.log(
  `Imagens encontradas: ${encontrados}`,
);

console.log(
  `Imagens ausentes: ${ausentes}`,
);

console.log(
  `Registros não patrimoniais ignorados: ${ignorados}`,
);
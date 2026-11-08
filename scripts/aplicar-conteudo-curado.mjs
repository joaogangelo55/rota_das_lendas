import fs from 'node:fs';

const caminhoCatalogo = new URL(
  '../src/data/conteudos-identidade.json',
  import.meta.url,
);

const catalogo = JSON.parse(
  fs.readFileSync(
    caminhoCatalogo,
    'utf8',
  ),
);

const registros =
  catalogo.registros ?? {};

/* =========================================================
   1. TEXTOS HISTÓRICOS DOS 16 PATRIMÔNIOS
   ========================================================= */

const TEXTOS_PATRIMONIOS = {
  'PH-001': `
Erguida no século XVIII, a Igreja de Nosso Senhor do Bonfim integra o conjunto religioso do centro histórico de Aracati. O templo apresenta características associadas ao barroco tardio e conserva vínculos com antigas práticas de devoção e com a memória de sua irmandade.

Além do valor arquitetônico, a igreja permanece como referência religiosa e cultural da cidade. Em 2022, o edifício foi objeto de ação de restauração documentada pelo IPHAN, reforçando a importância de sua preservação para a paisagem histórica de Aracati.
  `,

  'PH-002': `
Construída no século XVIII, a Casa de Câmara e Cadeia reuniu funções administrativas, políticas, judiciais e prisionais de Aracati. A edificação representa a organização do poder municipal no período colonial e constitui uma das referências da arquitetura civil pública do centro histórico.

Ao longo do tempo, o prédio passou por modificações, mas preservou sua importância na paisagem urbana. O bem possui tombamento federal individual, registrado no processo 0879-T-73, e permanece como testemunho material da história política, administrativa e social da antiga vila.
  `,

  'PH-003': `
Este imóvel do centro histórico está associado à memória de Adolfo Caminha, escritor naturalista nascido em Aracati em 1867 e reconhecido pela literatura brasileira. Registros institucionais relacionam o local à infância do escritor, tornando-o uma referência da memória literária aracatiense.

Além da relação biográfica, a edificação integra a paisagem formada pelos antigos sobrados da atual Avenida Coronel Alexanzito. O ponto articula, portanto, arquitetura civil, história urbana e patrimônio literário, aproximando a trajetória de Adolfo Caminha do território onde viveu seus primeiros anos.
  `,

  'PH-004': `
O imóvel atualmente ocupado pela EEF Prof. Régis Bernardo de Souza é utilizado neste projeto como referência territorial associada à memória da Confederação do Equador em Aracati. O movimento de 1824 contestou o centralismo do Império e mobilizou diferentes localidades do Nordeste em defesa de propostas republicanas e federalistas.

Pesquisas acadêmicas associam esse setor do centro histórico às articulações políticas daquele período. Por cautela documental, o ponto é apresentado como lugar de memória relacionado ao movimento, sem afirmar que a configuração atual da edificação corresponde integralmente à existente em 1824.
  `,

  'PH-005': `
O sobrado que abriga o Museu Jaguaribano é uma importante referência da arquitetura civil e da memória cultural de Aracati. Criado em 1968, o museu reúne objetos e acervos relacionados à história, aos modos de vida, à religiosidade e às atividades econômicas da região jaguaribana.

Instalado em uma edificação histórica da Rua Coronel Alexanzito, o equipamento aproxima patrimônio arquitetônico e preservação da memória. Sua atuação contribui para conservar e difundir documentos, objetos e referências culturais vinculadas à trajetória histórica de Aracati e do Vale do Jaguaribe.
  `,

  'PH-006': `
A Cruz das Almas é um antigo marco urbano e religioso situado na entrada sul do núcleo histórico de Aracati. Formada por uma cruz sobre pedestal de alvenaria, a referência está relacionada à formação da vila e permanece integrada à memória devocional da população.

Além de sua presença histórica na paisagem urbana, a Praça Cruz das Almas foi incluída, em 2024, na Rota do Turismo Religioso do Estado do Ceará. Esse reconhecimento reforça seu papel como lugar de fé, memória e identidade cultural na cidade.
  `,

  'PH-007': `
A Igreja Matriz de Nossa Senhora do Rosário desenvolveu-se a partir de uma capela primitiva do século XVIII. Sua fachada foi concluída em 1785, enquanto diferentes etapas construtivas e intervenções se prolongaram pelo século XIX.

O conjunto reúne arquitetura religiosa e arte sacra, combinando elementos barrocos com transformações posteriores. A Matriz possui tombamento federal individual, registrado no processo 0550-T-56 em 1957, e permanece como uma das principais referências históricas, religiosas e visuais do centro de Aracati.
  `,

  'PH-008': `
Erguida no final do século XVIII e vinculada à Irmandade dos Homens Pretos, a Igreja de Nossa Senhora do Rosário dos Homens Pretos é uma importante referência da presença e da memória afro-brasileira em Aracati.

O templo, associado a uma expressão barroca popular, integra o conjunto histórico da cidade e relaciona devoção, sociabilidade e resistência cultural de populações negras. Sua permanência na paisagem urbana e as ações contemporâneas de preservação reforçam sua relevância histórica e simbólica.
  `,

  'PH-009': `
Construída no século XVIII pela Irmandade dos Homens Pardos Livres, a Igreja de Nossa Senhora dos Prazeres integra o conjunto religioso do centro histórico de Aracati.

O templo apresenta linguagem colonial simples e conserva elementos de arte sacra, entre eles trabalhos em madeira. Sua história evidencia a organização das irmandades religiosas e formas de sociabilidade presentes na cidade colonial. Atualmente, permanece como referência de devoção e como componente da paisagem cultural histórica de Aracati.
  `,

  'PH-010': `
A Biblioteca Pública Municipal Monsenhor Bruno é um equipamento cultural dedicado à leitura, à pesquisa e ao acesso ao conhecimento em Aracati. Situada no centro histórico, reúne acervo bibliográfico e oferece espaços voltados ao estudo e às atividades culturais.

Sua presença no núcleo histórico demonstra que a preservação urbana também pode ser articulada a usos contemporâneos. Assim, a biblioteca contribui para manter o centro de Aracati como espaço vivo de educação, convivência, memória e difusão cultural.
  `,

  'PH-011': `
Inaugurada em 1893, a Fábrica de Tecidos Santa Tereza marcou o processo de industrialização de Aracati e tornou-se uma importante referência da memória do trabalho na cidade.

A atividade fabril gerou empregos e participou das transformações econômicas e sociais ocorridas entre o final do século XIX e o século XX. Mesmo após o encerramento das atividades industriais, a antiga fábrica permanece como testemunho material das mudanças tecnológicas, produtivas e trabalhistas que integraram Aracati ao processo de industrialização cearense.
  `,

  'PH-012': `
O Teatro Francisca Clotilde ocupa uma edificação histórica do centro de Aracati e representa a continuidade de usos culturais em um imóvel de longa trajetória urbana.

O prédio foi adaptado, ao longo do tempo, para atividades artísticas e culturais e passou por ações de restauro e pesquisa arqueológica acompanhadas pelo IPHAN. Atualmente, o teatro funciona como espaço de apresentações e manifestações culturais, articulando patrimônio arquitetônico, memória urbana, arqueologia e produção artística contemporânea.
  `,

  'PH-013': `
A Casa Ponciano é uma referência da memória comercial e das formas de sociabilidade desenvolvidas em Aracati ao longo do século XX. O estabelecimento está associado ao comerciante José Ponciano da Costa e tornou-se conhecido pela comercialização de secos e molhados.

A permanência da atividade e de sua memória familiar ajuda a compreender como pequenos e tradicionais estabelecimentos comerciais também participam da construção da paisagem cultural. O ponto registra práticas de trabalho, encontro e circulação cotidiana no centro histórico aracatiense.
  `,

  'PH-014': `
Na segunda metade do século XIX, o Mercado Público consolidou-se como importante espaço de abastecimento e comércio de Aracati. Conhecido também como Mercado Velho, reuniu comerciantes, feirantes e moradores, tornando-se lugar de circulação de mercadorias e de sociabilidade cotidiana.

Sua arquitetura e sua localização no núcleo histórico registram a importância econômica exercida pela cidade e as transformações do comércio urbano. O mercado permanece como referência da memória do trabalho, do abastecimento e dos encontros sociais aracatienses.
  `,

  'PH-015': `
O Oratório do Bom Jesus dos Navegantes remonta ao início do século XIX e está relacionado à devoção de pescadores e navegantes. De pequenas dimensões e linguagem colonial simples, o espaço expressa a relação histórica entre Aracati, a navegação e a religiosidade popular.

Registros locais indicam que o oratório foi reconstruído após um incêndio ocorrido no início do século XX. Sua permanência no centro histórico preserva uma memória devocional associada às águas, ao trabalho e aos deslocamentos de pessoas que dependiam da navegação.
  `,

  'PH-016': `
O Espaço das Artes funciona em um sobrado histórico do centro de Aracati e representa um uso cultural contemporâneo de uma edificação antiga. O equipamento foi criado em 2015 e reinaugurado em 2020, recebendo exposições, oficinas, cursos e outros eventos culturais.

O imóvel possui trajetória associada a diferentes famílias e personagens da história local. Durante intervenções de restauração também foram identificadas pinturas murais. O espaço combina, assim, preservação arquitetônica, memória urbana e produção cultural contemporânea.
  `,
};

/* =========================================================
   2. NARRATIVAS COM FONTE SUFICIENTE

   As outras lendas NÃO são preenchidas ainda porque as
   fontes atualmente disponíveis não fornecem enredo
   suficiente para uma adaptação segura.
   ========================================================= */

const NARRATIVAS_LENDAS = {
  'LD-001': `
Segundo a narrativa registrada por Antero Pereira Filho, Anahí vivia a expectativa de um casamento que não se realizou. O abandono e o sofrimento conduzem a jovem a um episódio trágico que termina com a morte de um marinheiro e sua prisão na antiga Casa de Câmara e Cadeia, onde permanece até morrer.

A história, porém, continua depois de sua morte. Anos mais tarde, durante um baile de carnaval realizado no andar superior da Casa de Câmara, Baldomero dança durante a noite com uma bela mulher desconhecida. No dia seguinte, ao consultar uma antiga edição do Jornal Jaguaribe, reconhece em uma fotografia de Anahí a mesma mulher com quem havia dançado.

A narrativa transforma o antigo prédio, que reuniu espaços de festa e de prisão, em cenário onde memória, tragédia e assombração se encontram.
  `,

  'LD-002': `
Antonino era lembrado como um músico destacado do conjunto de Mestre Cazuza. Depois de uma apresentação, morreu afogado durante a travessia do rio Jaguaribe. Com sua morte, o grupo deixou de contar com o clarinete que ele tocava.

Nas apresentações seguintes, porém, dizia-se que o som do instrumento voltava a ser ouvido, com o estilo que todos reconheciam como sendo o de Antonino, mesmo sem existir outro clarinetista no conjunto.

Segundo a tradição registrada, em madrugadas escuras ainda seria possível ouvir ao longe o som de um clarinete nas proximidades do Jaguaribe, como se a música viesse das profundezas das águas.
  `,

  'LD-004': `
Antes da construção da ponte sobre o rio Jaguaribe, pessoas, mercadorias e veículos atravessavam o rio em pontões que operavam durante o dia a partir do Porto José Alves. Certa noite, um viajante vindo de Fortaleza chegou depois do horário e imaginou que teria de aguardar até a manhã seguinte.

No escuro, porém, surgiu um pontão. O proeiro aceitou levá-lo e, durante a travessia, falou sobre os mortos nas águas do Jaguaribe e sobre aquela noite especialmente sombria.

Ao alcançar a margem de Aracati, o viajante desembarcou e procurou dinheiro para pagar a passagem. Quando se voltou, a embarcação e o barqueiro haviam desaparecido. Assustado, correu em direção à cidade. A história preserva a memória dos antigos pontões ao transformá-los em cenário de uma travessia entre o cotidiano e o sobrenatural.
  `,

  'LD-008': `
A narrativa recorda um episódio trágico ligado ao rio Jaguaribe: a explosão de um hidroavião envolvendo dois pilotos alemães. O acontecimento é associado às margens do rio, ao velório realizado na Casa de Câmara e ao sepultamento no Cemitério São Pedro.

Na memória literária de Aracati, a morte dos pilotos passa a integrar o universo de visagens e aparições relacionado ao Jaguaribe. O rio deixa de ser apenas espaço de circulação e trabalho e aparece também como território onde a lembrança dos mortos e o imaginário sobrenatural se encontram.
  `,

  'LD-010': `
Mestre Romeiro era um velho carpinteiro conhecido em Aracati pela fabricação de caixões. Em uma época em que o sino da Matriz anunciava mortes, o som de seu martelo também passou a ser associado, pela população, à preparação dos funerais.

Quando Romeiro morreu, esse tipo de trabalho já começava a desaparecer com a chegada das funerárias. Na noite seguinte ao seu enterro, entretanto, pessoas que passaram pela Travessa da Cacimba, a caminho do mercado ou da missa da madrugada, disseram ouvir o bater contínuo de um martelo vindo da antiga oficina.

Parecia, segundo a narrativa, que o velho mestre continuava trabalhando na confecção de mais um caixão.
  `,

  'LD-012': `
Segundo a narrativa, duas pessoas de famílias importantes viviam em sobrados separados por um estreito beco e mantinham um romance que precisava permanecer escondido. Para afastar curiosos e permitir os encontros, espalhou-se a história de que o beco se fechava depois da meia-noite e engolia quem tentasse atravessá-lo.

Um trilho de ferro foi colocado ligando os dois sobrados. Publicamente, dizia-se que ele impediria que o beco se fechasse. Na história registrada por Antero Pereira Filho, porém, sua verdadeira função era permitir que o homem alcançasse discretamente a residência de sua amada.

O lugar permaneceu associado à memória dos amantes e ao imaginário fantástico que deu origem ao chamado Beco do Barão.
  `,

  'LD-019': `
Sufraia era descrito como um homem de aparência assustadora que, segundo a narrativa, transformava-se em um bezerro preto nas noites de lobisomem, nas proximidades da Maloca e da Várzea Preta.

Em certa ocasião, ferido e escondido entre carnaúbas, perdeu a noção do tempo enquanto aguardava voltar à forma humana. Pela tradição narrada por Antero Pereira Filho, o lobisomem precisava desfazer a transformação antes da meia-noite e antes do canto do galo. Sufraia não conseguiu.

Ao tentar retornar para casa, sofreu uma transformação definitiva e tornou-se uma figura híbrida, parte humana e parte animal. Desde então teria vagado por currais e monturos nos arredores de Aracati, assustando moradores e temendo até mesmo o latido dos cães.
  `,
};

/* =========================================================
   3. IMAGENS TERRITORIAIS REUTILIZADAS NAS LENDAS

   A imagem NÃO representa o acontecimento sobrenatural.
   Ela representa um lugar documentalmente relacionado
   à narrativa.
   ========================================================= */

const IMAGENS_TERRITORIAIS = {
  'LD-001': {
    patrimonio: 'PH-002',
    local:
      'Casa de Câmara e Cadeia de Aracati',
  },

  'LD-005': {
    patrimonio: 'PH-007',
    local:
      'Igreja Matriz de Nossa Senhora do Rosário',
  },

  'LD-008': {
    patrimonio: 'PH-002',
    local:
      'Casa de Câmara e Cadeia de Aracati',
  },

  'LD-010': {
    patrimonio: 'PH-007',
    local:
      'Igreja Matriz de Nossa Senhora do Rosário',
  },

  'LD-011': {
    patrimonio: 'PH-007',
    local:
      'Igreja Matriz de Nossa Senhora do Rosário',
  },

  'LD-012': {
    patrimonio: 'PH-005',
    local:
      'sobrado histórico associado ao Museu Jaguaribano e ao entorno do Beco do Barão',
  },

  'LD-014': {
    patrimonio: 'PH-006',
    local:
      'Cruz das Almas',
  },
};

/* =========================================================
   FUNÇÕES DE SEGURANÇA
   ========================================================= */

function obterRegistro(
  id,
  categoriaEsperada,
) {
  const registro =
    registros[id];

  if (!registro) {
    throw new Error(
      `Registro ${id} não encontrado no catálogo.`,
    );
  }

  if (
    registro.categoria !==
    categoriaEsperada
  ) {
    throw new Error(
      `${id}: categoria esperada "${categoriaEsperada}", encontrada "${registro.categoria}".`,
    );
  }

  return registro;
}

function limparTexto(texto) {
  return String(texto)
    .trim()
    .replace(/\n {2,}/g, '\n');
}

function clonarImagemTerritorial(
  imagemOriginal,
  local,
  tituloLenda,
) {
  return {
    src:
      imagemOriginal?.src ??
      null,

    alt:
      `Imagem de ${local}, referência territorial associada à narrativa ${tituloLenda}, em Aracati.`,

    credito:
      imagemOriginal?.credito ??
      null,

    fonte:
      imagemOriginal?.fonte ??
      null,

    licenca:
      imagemOriginal?.licenca ??
      null,
  };
}

/* =========================================================
   4. APLICAR TEXTOS PATRIMONIAIS
   ========================================================= */

let patrimoniosAtualizados =
  0;

for (
  const [id, texto] of
  Object.entries(
    TEXTOS_PATRIMONIOS,
  )
) {
  const registro =
    obterRegistro(
      id,
      'patrimonio',
    );

  registro.texto_historico =
    limparTexto(texto);

  patrimoniosAtualizados +=
    1;
}

/* =========================================================
   5. APLICAR NARRATIVAS SEGURAS
   ========================================================= */

let narrativasAtualizadas =
  0;

for (
  const [id, narrativa] of
  Object.entries(
    NARRATIVAS_LENDAS,
  )
) {
  const registro =
    obterRegistro(
      id,
      'lenda',
    );

  registro.narrativa =
    limparTexto(
      narrativa,
    );

  narrativasAtualizadas +=
    1;
}

/* =========================================================
   6. ASSOCIAR IMAGENS TERRITORIAIS

   Não sobrescreve uma imagem própria já cadastrada.
   ========================================================= */

let imagensAssociadas =
  0;

let imagensPreservadas =
  0;

for (
  const [
    idLenda,
    configuracao,
  ] of Object.entries(
    IMAGENS_TERRITORIAIS,
  )
) {
  const lenda =
    obterRegistro(
      idLenda,
      'lenda',
    );

  if (
    lenda.imagem?.src
  ) {
    imagensPreservadas +=
      1;

    console.log(
      `PRESERVADA — ${idLenda}: já possui imagem própria.`,
    );

    continue;
  }

  const patrimonio =
    obterRegistro(
      configuracao.patrimonio,
      'patrimonio',
    );

  if (
    !patrimonio.imagem?.src
  ) {
    console.warn(
      `SEM IMAGEM — ${idLenda}: ${configuracao.patrimonio} não possui imagem cadastrada.`,
    );

    continue;
  }

  lenda.imagem =
    clonarImagemTerritorial(
      patrimonio.imagem,
      configuracao.local,
      lenda.titulo,
    );

  imagensAssociadas +=
    1;
}

/* =========================================================
   7. SALVAR CATÁLOGO
   ========================================================= */

fs.writeFileSync(
  caminhoCatalogo,

  `${JSON.stringify(
    catalogo,
    null,
    2,
  )}\n`,

  'utf8',
);

/* =========================================================
   8. RESULTADO
   ========================================================= */

console.log('');
console.log(
  'CONCLUÍDO — lote editorial curado aplicado.',
);

console.log('');
console.log(
  `Textos patrimoniais: ${patrimoniosAtualizados}/16`,
);

console.log(
  `Narrativas com fonte suficiente: ${narrativasAtualizadas}/26`,
);

console.log(
  `Imagens territoriais associadas: ${imagensAssociadas}`,
);

console.log(
  `Imagens próprias preservadas: ${imagensPreservadas}`,
);

console.log('');
console.log(
  'As demais lendas continuam com narrativa=null até haver fonte suficiente.',
);

console.log(
  'Nenhuma coordenada ou geometria foi alterada.',
);
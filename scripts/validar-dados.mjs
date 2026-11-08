import fs from 'node:fs';

const dados = JSON.parse(
  fs.readFileSync(new URL('../src/data/dados.json', import.meta.url), 'utf8'),
);
const geojson = JSON.parse(
  fs.readFileSync(new URL('../public/data/dados.geojson', import.meta.url), 'utf8'),
);

let erros = 0;
const falhar = (msg) => { console.error(`FALHOU — ${msg}`); erros += 1; };
const passar = (msg) => console.log(`PASSOU — ${msg}`);

const patrimonios = dados.patrimonios ?? [];
const candidatosNaoMvp = dados.candidatos_nao_mvp ?? [];
const lendas = dados.lendas ?? [];
const fontes = dados.fontes ?? {};

const todosJson = [...patrimonios, ...candidatosNaoMvp, ...lendas];

if (patrimonios.length === 16 && candidatosNaoMvp.length === 4 && lendas.length === 26) {
  passar('T01: JSON canônico contém 16 patrimônios, 4 candidatos não-MVP e 26 lendas.');
} else {
  falhar(
    `T01: contagens inesperadas: ${patrimonios.length} patrimônios, ` +
    `${candidatosNaoMvp.length} não-MVP, ${lendas.length} lendas.`,
  );
}

const idsJson = todosJson.map((registro) => registro.id);
if (new Set(idsJson).size === idsJson.length && idsJson.every(Boolean)) {
  passar('T02: IDs do JSON canônico são únicos e preenchidos.');
} else {
  falhar('T02: há ID ausente ou duplicado no JSON canônico.');
}

if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features) && geojson.features.length === 42) {
  passar('T03: dados.geojson é FeatureCollection com 42 Features.');
} else {
  falhar(`T03: esperado FeatureCollection com 42 Features; encontrado ${geojson.features?.length ?? 'inválido'}.`);
}

const categoriasValidas = new Set(['patrimonio', 'lenda']);
if (geojson.features.every((feature) => categoriasValidas.has(feature.properties?.categoria))) {
  passar('T04: categorias do GeoJSON estão controladas em patrimonio/lenda.');
} else {
  falhar('T04: existe categoria inesperada no GeoJSON.');
}

const patrimoniosGeo = geojson.features.filter(
  (feature) => feature.properties?.categoria === 'patrimonio',
);
const lendasGeo = geojson.features.filter(
  (feature) => feature.properties?.categoria === 'lenda',
);

if (patrimoniosGeo.length === 16 && lendasGeo.length === 26) {
  passar('T05: GeoJSON contém 16 patrimônios e 26 lendas catalogadas.');
} else {
  falhar(`T05: contagem por categoria incorreta (${patrimoniosGeo.length}/${lendasGeo.length}).`);
}

function pontoValido(feature) {
  if (feature.geometry?.type !== 'Point') return false;
  const coords = feature.geometry.coordinates;
  if (!Array.isArray(coords) || coords.length !== 2) return false;

  const [lon, lat] = coords;
  return (
    typeof lon === 'number' && typeof lat === 'number' &&
    lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90
  );
}

if (patrimoniosGeo.every(pontoValido)) {
  passar('T06: 16/16 patrimônios possuem geometria Point numericamente válida.');
} else {
  falhar('T06: existe patrimônio sem Point válido.');
}

const geometriasLendasValidas = lendasGeo.every(
  (feature) => feature.geometry === null || pontoValido(feature),
);
if (geometriasLendasValidas) {
  passar('T07: lendas possuem Point válido ou geometry=null, sem coordenada fabricada.');
} else {
  falhar('T07: existe geometria de lenda inválida nesta etapa.');
}

const statusValidos = new Set(['validado_incluir', 'validado_nao_mvp']);
if (geojson.features.every((feature) => statusValidos.has(feature.properties?.status_publicacao))) {
  passar('T08: estados finais de publicação seguem a Base Validada v2.0.');
} else {
  falhar('T08: existe estado de publicação fora do modelo validado.');
}

const codigosFonteExistentes = new Set(Object.keys(fontes));
const fontesRastreaveis = geojson.features.every((feature) => {
  const principal = feature.properties?.fonte_principal;
  const complementares = feature.properties?.fontes_complementares ?? [];
  return (
    typeof principal === 'string' && codigosFonteExistentes.has(principal) &&
    Array.isArray(complementares) &&
    complementares.every((codigo) => codigosFonteExistentes.has(codigo))
  );
});
if (fontesRastreaveis) {
  passar('T09: todos os códigos de fonte do GeoJSON existem no catálogo S01–S32.');
} else {
  falhar('T09: existe código de fonte sem correspondência no catálogo.');
}

const idsProducaoJson = new Set([...patrimonios, ...lendas].map((registro) => registro.id));
const idsGeo = new Set(geojson.features.map((feature) => feature.id));
const mesmosIds = (
  idsProducaoJson.size === idsGeo.size &&
  [...idsProducaoJson].every((id) => idsGeo.has(id))
);
if (mesmosIds) {
  passar('T10: JSON canônico e GeoJSON possuem os mesmos 42 IDs de produção.');
} else {
  falhar('T10: há divergência entre os IDs de produção do JSON e do GeoJSON.');
}

const patrimoniosMapeaveis = patrimoniosGeo.filter(
  (feature) => feature.properties?.status_publicacao === 'validado_incluir' && pontoValido(feature),
).length;
const lendasMapeaveis = lendasGeo.filter(
  (feature) => feature.properties?.status_publicacao === 'validado_incluir' && pontoValido(feature),
).length;

console.log(
  `RESUMO — 42 Features; ${patrimoniosMapeaveis}/16 patrimônios mapeáveis; ` +
  `${lendasMapeaveis}/26 lendas atualmente com Point publicável.`,
);

if (patrimoniosMapeaveis !== 16) {
  falhar(`T11: esperado 16 patrimônios mapeáveis; encontrado ${patrimoniosMapeaveis}.`);
} else {
  passar('T11: checkpoint patrimonial atingido: 16/16 patrimônios mapeáveis.');
}

const cruzJson = patrimonios.find((registro) => registro.id === 'PH-006');
const cruzGeo = patrimoniosGeo.find((feature) => feature.id === 'PH-006');
const coordCruzCorreta = (
  cruzJson?.latitude === -4.570617 &&
  cruzJson?.longitude === -37.774423 &&
  cruzGeo?.geometry?.coordinates?.[0] === -37.774423 &&
  cruzGeo?.geometry?.coordinates?.[1] === -4.570617
);

if (coordCruzCorreta) {
  passar('T12: PH-006 — Cruz das Almas usa a coordenada corrigida -4.570617, -37.774423.');
} else {
  falhar('T12: PH-006 diverge da coordenada corrigida validada no teste manual.');
}

if (erros > 0) {
  console.error(`RESULTADO: ${erros} erro(s).`);
  process.exit(1);
}

console.log('RESULTADO: base digital v2.1.1 válida para o incremento atual do MVP.');

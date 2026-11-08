# Rota das Lendas — MVP v0.3

Aplicação web responsiva do TCC **Rota das Lendas**, voltada à organização, territorialização e difusão de conteúdos históricos e culturais de Aracati-CE.

## Estado atual

A base documental validada foi convertida para JSON/GeoJSON, o georreferenciamento patrimonial está fechado e as 16 fichas patrimoniais foram testadas nesta etapa:

- 16 patrimônios selecionados, georreferenciados e testados;
- PH-006 — Cruz das Almas corrigido para `-4.570617, -37.774423`;
- 26 lendas/narrativas catalogadas;
- 1 lenda já possui geometria `Point` reutilizando uma âncora patrimonial validada (`LD-010 — Mestre Romeiro`);
- as demais lendas permanecem catalogadas sem ponto artificial quando a decisão cartográfica ainda é territorial, multiponto ou sem ponto exato.

A aplicação renderiza somente registros com `status_publicacao: "validado_incluir"` e geometria `Point` válida.

## Tecnologias

- React 19
- Vite 8
- Leaflet 1.9.4
- OpenStreetMap
- JSON
- GeoJSON (RFC 7946)

## Estrutura principal

```text
rota-das-lendas/
├── public/
│   └── data/
│       ├── dados.geojson                         # base cartográfica canônica usada pelo app
│       └── dados_v2.1.1_georreferenciado.geojson  # cópia versionada após correção de PH-006
├── src/
│   ├── components/
│   │   └── MapView.jsx
│   ├── data/
│   │   └── dados.json                            # base canônica de conteúdo/rastreabilidade
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── scripts/
│   └── validar-dados.mjs
├── docs/
│   ├── base-documental/
│   │   └── Rota_das_Lendas_Caderno_Tecnico_v2.0_VALIDADO.docx
│   ├── 01-decisoes-tecnicas.md
│   ├── 02-matriz-rastreabilidade.md
│   ├── 03-plano-testes.md
│   └── 04-diario-desenvolvimento.md
└── package.json
```

## Como executar

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite.

## Como validar antes de avançar

```bash
npm run check
```

O comando executa:

1. validação automática da base JSON/GeoJSON;
2. confirmação de 16/16 patrimônios com geometria `Point` válida;
3. validação dos códigos de fonte;
4. compilação de produção com Vite.

## Resultado esperado nesta versão

Ao abrir a aplicação:

1. o mapa deve iniciar em Aracati;
2. **Todos** deve mostrar 17 marcadores atualmente mapeáveis;
3. **Patrimônios** deve mostrar exatamente 16 marcadores;
4. **Lendas** deve mostrar 1 marcador nesta etapa (`LD-010 — Mestre Romeiro`);
5. o popup deve exibir ID, título, categoria, descrição, localização e fonte;
6. o popup deve oferecer **Como chegar**, abrindo o Google Maps com a coordenada do ponto como destino;
7. as 25 lendas sem `Point` não devem receber marcador artificial.

## Regra de integridade

`geometry: null` não significa que a narrativa foi descartada ou que sua existência documental está pendente. Significa apenas que **não há uma geometria Point publicável nesta etapa** segundo a decisão cartográfica registrada no Caderno Técnico v2.0.

A sequência de desenvolvimento permanece:

```text
base validada → GeoJSON → mapa → marcadores → popup/ficha → filtros → refinamento visual → Como chegar → lendas → responsividade final
```

Após cada incremento:

```text
implementar → executar → testar → corrigir → documentar → commit → avançar
```

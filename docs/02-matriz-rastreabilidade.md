# Matriz de Rastreabilidade — MVP v0.3

| Requisito | Implementação | Evidência | Estado |
|---|---|---|---|
| RF01 — mapa interativo de Aracati | `src/components/MapView.jsx` | build + teste manual de pan/zoom | 🟢 testado localmente |
| RF02 — representar registros georreferenciados | `src/App.jsx` + `public/data/dados.geojson` | `npm run test:data` + conferência mapa | 🟢 16 patrimônios testados |
| RF03 — diferenciar categorias | ícones `P` e `L` + legenda | selecionar Todos e verificar marcadores | 🟢 testado |
| RF04 — consultar informações | popup em `MapView.jsx` | teste manual das fichas patrimoniais | 🟢 16/16 fichas testadas; PH-006 corrigido |
| RF05 — filtrar categorias | botões em `App.jsx` | Todos = 17; Patrimônios = 16; Lendas = 1 | 🟢 testado |
| RF06 — exibir fonte | catálogo `S01–S32` resolvido no popup | abrir marcador e conferir referência | 🟢 testado nas fichas patrimoniais |
| Decisão funcional — Como chegar | botão no popup gera rota externa por latitude/longitude | abrir uma ficha e acionar Google Maps | 🟡 implementação concluída; teste manual desta rodada |
| RNF01 — responsividade | `src/styles.css` | 360 / 768 / 1366 px | 🟡 teste manual pendente |
| RNF02 — legibilidade | hierarquia tipográfica, painel, legenda, popup | checklist visual | 🟡 teste manual pendente |
| RNF03 — compatibilidade | React/Vite/Leaflet | Chrome, Firefox e Edge | 🔴 pendente |
| RNF04 — rastreabilidade | IDs + catálogo de fontes + JSON/GeoJSON | `npm run test:data` | 🟢 automatizado |
| RNF05 — acessibilidade básica | skip link, foco, `aria-label`, letra + cor nos marcadores | navegação por teclado | 🟡 teste manual pendente |
| RNF06 — consistência dos dados | `scripts/validar-dados.mjs` | T01–T12 | 🟢 automatizado |

## Cadeia de evidência patrimonial

```text
Caderno Técnico v2.0
→ PH-xxx em src/data/dados.json
→ PH-xxx em public/data/dados.geojson
→ Feature Point
→ marcador Leaflet
→ popup
→ fonte Sxx
```

O checkpoint patrimonial foi concluído após teste manual das **16 fichas**; PH-006 foi corrigido durante essa validação.

## Cadeia de evidência das narrativas

As 26 lendas permanecem no corpus e no GeoJSON. Entretanto, somente uma narrativa possui `Point` publicável na rodada atual (`LD-010`). As demais não devem ser convertidas arbitrariamente em pontos apenas para aumentar a quantidade de marcadores.

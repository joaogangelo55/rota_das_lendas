# Decisões Técnicas — MVP v0.3

**Data:** 05/09/2026

## DT-01 — React mantido

**Problema:** a metodologia do TCC declara uma aplicação web construída com React, Leaflet.js e OpenStreetMap.

**Decisão:** manter React e integrar Leaflet diretamente, sem React-Leaflet.

**Justificativa:** reduz dependências, preserva a arquitetura já documentada e é suficiente para o escopo do MVP.

## DT-02 — Leaflet 1.9.4

**Decisão:** utilizar Leaflet 1.9.4.

**Justificativa:** versão estável e suficiente para carregamento de GeoJSON, marcadores, popups, filtros e controles cartográficos do MVP.

## DT-03 — Duas bases com papéis distintos

**Decisão:** utilizar:

- `src/data/dados.json` como base canônica de conteúdo e rastreabilidade;
- `public/data/dados.geojson` como base cartográfica canônica carregada pela aplicação.

A cópia `public/data/dados_v2.1.1_georreferenciado.geojson` é mantida apenas para rastrear a rodada de origem.

**Justificativa:** separar conteúdo de geometria reduz acoplamento e permite que registros continuem documentados mesmo quando ainda não possuem geometria `Point` publicável.

**Regra crítica:** coordenadas GeoJSON são armazenadas como `[longitude, latitude]`.

## DT-04 — OpenStreetMap como mapa-base

**Decisão:** usar os tiles padrão do OpenStreetMap na navegação interativa normal, mantendo atribuição visível.

**Justificativa:** solução aberta, madura e sem necessidade de API paga para o escopo atual.

## DT-05 — Sem backend no MVP

**Decisão:** aplicação estática, sem banco relacional, autenticação ou API própria.

**Justificativa:** os objetivos centrais do trabalho podem ser atendidos por arquivos versionados e aplicação web estática, reduzindo risco e complexidade.

## DT-06 — Estados finais substituem a lógica antiga de “pendente”

**Decisão:** o sistema usa os estados definidos na Base Validada v2.0:

- `validado_incluir`;
- `validado_nao_mvp`.

`geometry: null` é tratado como decisão cartográfica, não como falha documental.

**Justificativa:** mantém coerência com o Caderno Técnico v2.0, que eliminou a classificação “parcialmente verificado/pendente”.

## DT-07 — Só uma geometria sustentada pode virar marcador

**Decisão:** o mapa renderiza apenas Features com:

1. `status_publicacao: "validado_incluir"`;
2. `geometry.type: "Point"`;
3. coordenadas numéricas válidas.

**Justificativa:** impede que referências territoriais ou narrativas sem ponto exato sejam artificialmente transformadas em marcadores.

## DT-08 — Filtros preservados desde a PoC

**Decisão:** manter os filtros `Todos`, `Patrimônios` e `Lendas`.

**Justificativa:** os filtros já correspondem aos requisitos funcionais e não adicionam complexidade significativa. Nesta etapa, 16 patrimônios e 1 lenda possuem `Point` publicável; as demais narrativas serão incorporadas conforme sua decisão cartográfica.

## DT-09 — Refinamento visual avançado sem ampliar a arquitetura

**Decisão:** aprimorar hierarquia visual, filtros, cartões-resumo, marcadores, tooltips, controles Leaflet e popups apenas com React, Leaflet e CSS já presentes no projeto.

**Justificativa:** melhora legibilidade, consistência, feedback e percepção de qualidade sem introduzir biblioteca visual, dependência adicional ou complexidade desnecessária. O mapa permanece o elemento central.

## DT-10 — “Como chegar” por navegação externa

**Decisão:** cada ficha com geometria `Point` oferece o botão **Como chegar**, que abre o Google Maps usando a coordenada validada do registro como destino.

**Justificativa:** entrega a função de orientação ao usuário com baixo risco técnico, sem implementar motor de roteamento próprio, API paga ou desenho de rota dentro do Leaflet. A origem é resolvida pelo serviço de mapas no dispositivo do usuário.

## DT-11 — Correção cartográfica de PH-006

**Problema:** durante o teste manual das 16 fichas patrimoniais, o marcador de **PH-006 — Cruz das Almas** foi identificado como deslocado.

**Decisão:** substituir a coordenada anterior `-4.572740, -37.767429` por `-4.570617, -37.774423`, conferida pelo pesquisador no Google Maps em 05/09/2026.

**Justificativa:** o teste manual revelou inconsistência espacial concreta. A correção preserva a identidade do bem e atualiza apenas sua posição cartográfica, sem alterar a validação histórica ou patrimonial.

# Diário de Desenvolvimento

## 04/09/2026 — PoC v0.1

### Objetivo

Comprovar a integração React + Leaflet + OpenStreetMap + GeoJSON com um primeiro registro real, filtros e popup.

### Resultado

A PoC comprovou tecnicamente a arquitetura, mas utilizava a Base Digital v1.0 anterior, com regras de `apto/pendente` que foram posteriormente substituídas pelo Caderno Técnico v2.0.

---

## 05/09/2026 — MVP v0.2 — integração da Base Validada v2.1

### Situação encontrada

Após a inclusão do arquivo `dados_v2.1.1_georreferenciado.geojson`, o mapa-base OpenStreetMap carregava, porém nenhum marcador era exibido.

### Diagnóstico

Foram encontrados três problemas de integração:

1. `src/components/Mapa.jsx` buscava `/data/dados.geojson`, mas esse arquivo não existia no diretório `public/data`;
2. o `App.jsx` atual havia substituído a interface da PoC e deixado de utilizar `MapView.jsx`, filtros, resumo, legenda e popups documentados;
3. `Mapa.jsx` filtrava exclusivamente a categoria `patrimonio`, impossibilitando qualquer exibição de lendas nesse componente.

### Correção aplicada

- criado `public/data/dados.geojson` como caminho canônico estável;
- restaurada a arquitetura `App.jsx → MapView.jsx` já documentada na PoC;
- regras atualizadas do esquema antigo `statusPublicacao/apto` para `status_publicacao/validado_incluir`;
- popup adaptado aos campos da Base v2.1 e ao catálogo de fontes S01–S32;
- preservados filtros Todos / Patrimônios / Lendas;
- removidos arquivos obsoletos que poderiam gerar ambiguidade (`Mapa.jsx`, `registros.geojson`, `conteudos.json` antigos);
- `scripts/validar-dados.mjs` atualizado para a Base Validada v2.1;
- documentação sincronizada com o Caderno Técnico v2.0.

### Resultado esperado do incremento

- Base carregada: 42 Features;
- Patrimônios: 16/16 com `Point` válido;
- Lendas catalogadas: 26;
- Lendas atualmente com `Point` publicável: 1 (`LD-010 — Mestre Romeiro`);
- filtro Todos: 17 marcadores;
- filtro Patrimônios: 16 marcadores;
- filtro Lendas: 1 marcador.

### Regra metodológica preservada

As lendas sem `Point` continuam documentadas e não são tratadas como pendentes. A ausência de marcador significa apenas que a decisão cartográfica ainda não corresponde a um ponto coordenado publicável. Nenhuma coordenada será criada artificialmente para preencher o mapa.

### Próximo checkpoint

Executar `npm run check`, abrir a aplicação e comprovar visualmente os **16 patrimônios**. Só após essa evidência o checkpoint patrimonial será marcado como concluído.

---

## 05/09/2026 — MVP v0.3 — refinamento visual e fechamento da ficha patrimonial

### Evidência de teste

O pesquisador executou o protótipo localmente e testou as 16 fichas patrimoniais. Os marcadores, filtros, popups e fontes foram considerados funcionais. Uma inconsistência foi identificada em **PH-006 — Cruz das Almas**.

### Correção PH-006

A coordenada anterior `-4.572740, -37.767429` posicionava o marcador de forma incorreta. A posição foi corrigida para `-4.570617, -37.774423`, conforme coordenada exibida no Google Maps e conferida pelo pesquisador. A correção foi aplicada em `src/data/dados.json`, `public/data/dados.geojson` e na cópia versionada da base.

### Refinamento visual aplicado

- hierarquia visual do cabeçalho e painel de exploração;
- cartões-resumo com melhor legibilidade;
- filtros em formato segmentado;
- marcadores e tooltips refinados;
- controles Leaflet reposicionados;
- popup redesenhado com categoria, ID, descrição, localização e fonte;
- link de fonte quando a URL estiver disponível;
- botão **Como chegar** usando a coordenada do próprio registro;
- ajustes responsivos e suporte a `prefers-reduced-motion`.

### Decisão de escopo

O botão **Como chegar** abre o Google Maps externamente. Não foi implementado motor de roteamento dentro do Leaflet, preservando o princípio de menor complexidade para o MVP.

### Próximo checkpoint

Testar o novo popup, o botão **Como chegar**, a posição corrigida de PH-006 e o comportamento responsivo. Depois disso, avançar para a representação cartográfica das lendas.

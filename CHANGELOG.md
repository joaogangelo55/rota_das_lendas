# Histórico de versões — Rota das Lendas

Este documento registra as principais evoluções do artefato Rota das Lendas.

## v0.3.0 — MVP refinado

### Sistema

- Refinamento da interface do MVP.
- Consolidação do mapa interativo com React, Leaflet e OpenStreetMap.
- Refinamento das fichas dos registros culturais.
- Manutenção dos filtros por categoria.
- Inclusão da ação "Como chegar".

### Dados

- Integração da Base Digital v2.1.1.
- 42 registros de produção.
- 16 patrimônios georreferenciados e mapeáveis.
- 26 lendas catalogadas.
- 1 lenda com geometria Point atualmente publicável.
- Correção cartográfica de PH-006 — Cruz das Almas.

### Validação

- Ampliação da validação automatizada para T01–T12.
- Validação dos 42 IDs entre JSON e GeoJSON.
- Verificação da rastreabilidade das fontes S01–S32.
- Verificação das geometrias dos 16 patrimônios.
- Build de produção executado com sucesso.

### Documentação

- Atualização das decisões técnicas.
- Atualização da matriz de rastreabilidade.
- Atualização do plano de testes.
- Atualização do diário de desenvolvimento.
- Organização da base documental.
- Inclusão das evidências da versão.

### Limitações conhecidas

- As lendas sem localização suficientemente validada permanecem sem geometria cartográfica pública.

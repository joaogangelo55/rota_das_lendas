# Plano de Testes — MVP v0.3

## Testes automáticos da base

| ID | Verificação | Critério de sucesso |
|---|---|---|
| T01 | contagem do JSON canônico | 16 patrimônios + 4 não-MVP + 26 lendas |
| T02 | IDs JSON | únicos e preenchidos |
| T03 | estrutura GeoJSON | `FeatureCollection` com 42 Features |
| T04 | categorias | apenas `patrimonio` e `lenda` |
| T05 | contagem GeoJSON | 16 patrimônios + 26 lendas |
| T06 | georreferenciamento patrimonial | 16/16 patrimônios com `Point` válido |
| T07 | geometrias das lendas | `Point` válido ou `geometry: null` |
| T08 | estados finais | `validado_incluir` ou `validado_nao_mvp` |
| T09 | fontes | todos os códigos existem no catálogo S01–S32 |
| T10 | rastreabilidade JSON ↔ GeoJSON | mesmos 42 IDs de produção |
| T11 | checkpoint patrimonial | 16 patrimônios mapeáveis |
| T12 | correção PH-006 | Cruz das Almas = `-4.570617, -37.774423` no JSON e GeoJSON |

Executar:

```bash
npm run test:data
```

## Teste de compilação

```bash
npm run build
```

Critério: compilação sem erro impeditivo.

## Testes manuais deste incremento

| ID | Ação | Resultado esperado |
|---|---|---|
| TS01 | abrir a aplicação | mapa e interface aparecem |
| TS02 | observar resumo | Base = 42; Patrimônios = 16; Lendas = 26 |
| TS03 | filtro Todos | 17 marcadores visíveis nesta rodada |
| TS04 | filtro Patrimônios | exatamente 16 marcadores |
| TS05 | filtro Lendas | exatamente 1 marcador (`LD-010`) |
| TS06 | abrir PH-001 | popup mostra ID, título, categoria, descrição, localização e fonte |
| TS07 | abrir LD-010 | popup apresenta narrativa como lenda e sua fonte |
| TS08 | comparar lendas sem Point | não aparecem como marcador artificial |
| TS09 | largura 360 px | sem rolagem horizontal impeditiva |
| TS10 | largura 768 px | interface e mapa legíveis |
| TS11 | largura 1366 px | layout sem sobreposição |
| TS12 | console | nenhuma falha HTTP para `/data/dados.geojson` |
| TS13 | abrir ficha de patrimônio | popup refinado exibe categoria, ID, descrição, localização e fonte |
| TS14 | clicar em Como chegar | Google Maps abre com a coordenada do marcador como destino |
| TS15 | abrir PH-006 | Cruz das Almas aparece na posição corrigida `-4.570617, -37.774423` |

## Evidências obrigatórias

Guardar em `docs/evidencias/`:

1. saída de `npm run check`;
2. captura do mapa com filtro **Patrimônios** mostrando os 16 pontos;
3. captura do popup de um patrimônio;
4. captura do filtro **Lendas** com `LD-010`;
5. capturas 360 / 768 / 1366 px;
6. captura da ficha refinada com botão **Como chegar**;
7. evidência da correção de PH-006;
8. hash do commit após o teste.

# Auditoria Territorial das Lendas — v0.4.0

**Projeto:** Rota das Lendas  
**Versão de trabalho:** v0.4.0  
**Escopo territorial do desenvolvimento:** Aracati-CE  
**Base canônica de conteúdo:** `src/data/dados.json`  
**Base cartográfica:** `public/data/dados.geojson`

## 1. Objetivo desta auditoria

Revisar individualmente as narrativas do corpus quanto à possibilidade e à forma de representação cartográfica, garantindo que cada representação espacial seja compatível com o grau de precisão sustentado pelas fontes consultadas.

A auditoria não tem como objetivo atribuir coordenadas a toda narrativa a qualquer custo. O objetivo é evitar falsa precisão cartográfica e tornar explícita, para o usuário e para a documentação do TCC, a diferença entre localização específica, referência territorial e associação geográfica ampla.

## 2. Delimitação do corpus para a v0.4.0

O Caderno Técnico registra 26 narrativas (`LD-001` a `LD-026`). Entretanto, a v0.4.0 adota como escopo de desenvolvimento apenas as narrativas pertencentes ao recorte territorial de Aracati-CE.

- **25 narrativas** permanecem no escopo de desenvolvimento e serão auditadas para representação cartográfica.
- **LD-018 — Assombração** permanece catalogada na base documental, mas com `status_publicacao: validado_nao_mvp`, pois sua referência territorial é Fortim e, portanto, está fora do recorte adotado para o desenvolvimento desta versão.
- A exclusão de `LD-018` do mapa não significa remoção do corpus documental. O registro continua preservado para rastreabilidade.

**Meta cartográfica da v0.4.0:** disponibilizar no sistema as **25 narrativas pertencentes ao recorte de Aracati**, utilizando a forma de representação espacial compatível com a evidência disponível.

## 3. Princípio de representação

O marcador ou outra representação cartográfica de uma lenda não deve ser interpretado como comprovação da ocorrência de acontecimentos sobrenaturais nem como localização exata de todos os fatos narrados.

A geometria representa a **referência territorial documentalmente associada à narrativa**.

## 4. Critérios G1–G5

### G1 — Associação documental

Deve existir fonte que relacione explicitamente a narrativa a algum território ou lugar identificável, como edifício, igreja, praça, cemitério, rua, bairro, praia, rio, localidade ou município.

Uma coordenada encontrada em mapa, isoladamente, não comprova a associação da narrativa ao local.

### G2 — Referência territorial identificável

A referência espacial mencionada deve poder ser identificada de forma suficientemente inequívoca para a representação pretendida.

A identificação pode ocorrer em diferentes escalas: imóvel, equipamento, rua, bairro, rio, praia, localidade ou município.

### G3 — Geometria verificável

A representação espacial adotada deve utilizar referência cartográfica verificável e compatível com o nível de precisão documental.

A fonte cartográfica serve para localizar a referência territorial. Ela não substitui a fonte histórica, cultural ou documental responsável pela associação da narrativa ao lugar.

### G4 — Representação não enganosa

A interface e os dados não devem indicar precisão superior àquela sustentada pelas fontes.

Não é permitido selecionar coordenadas arbitrárias apenas para que uma narrativa apareça isoladamente no mapa.

### G5 — Grau de precisão declarado

Toda narrativa publicada cartograficamente deve possuir nível de representação explicitamente declarado, permitindo ao sistema informar ao usuário o grau de precisão espacial da referência.

## 5. Níveis de representação T1–T3

### T1 — Localização específica

Aplicável quando a fonte associa a narrativa a um lugar específico e identificável, cuja posição cartográfica pode ser verificada.

Exemplos possíveis: igreja, prédio, praça, cemitério ou outro equipamento/local pontual.

**Semântica da interface:** `Localização específica` ou `Referência territorial específica`.

### T2 — Referência territorial

Aplicável quando a narrativa está associada a uma rua, rio, bairro, praia, localidade, conjunto de lugares ou outro território para o qual a fonte não determina um ponto exato do acontecimento narrado.

A implementação deve representar uma referência cartográfica compatível com esse território, sem apresentar o ponto escolhido como local exato do acontecimento.

**Semântica da interface:** `Referência territorial`.

### T3 — Associação geográfica ampla

Aplicável quando a documentação permite apenas vincular a narrativa de forma geral a Aracati, sem referência espacial mais precisa.

Essas narrativas não devem receber coordenadas artificiais distintas para simular lugares diferentes. A implementação poderá utilizar representação geral ou agregada, desde que a interface deixe explícita a ausência de localização específica.

**Semântica da interface:** `Referência geral — Aracati`.

## 6. Regra de decisão

Para cada narrativa no escopo:

1. identificar a fonte que sustenta a associação espacial;
2. registrar literalmente ou resumir com fidelidade qual referência territorial é sustentada;
3. determinar a escala espacial permitida pela fonte;
4. identificar a referência cartográfica correspondente;
5. classificar como T1, T2 ou T3;
6. definir a representação técnica somente após a classificação;
7. registrar a justificativa da decisão;
8. somente então alterar JSON, GeoJSON e interface.

Se houver conflito, ambiguidade ou insuficiência documental que impeça uma decisão segura, o registro permanece sem nova geometria até a pendência ser resolvida. Nenhuma coordenada será criada por inferência não documentada.

## 7. Separação obrigatória entre fontes

Para cada narrativa devem ser distinguidos, quando aplicável:

- **Fonte de associação cultural/territorial:** sustenta que a narrativa está relacionada ao lugar ou território.
- **Fonte cartográfica:** sustenta a posição ou geometria da referência territorial identificada.

A mesma fonte pode eventualmente ajudar em ambos os aspectos, mas as funções documentais devem permanecer conceitualmente distintas.

## 8. Matriz final de auditoria

> Esta matriz substitui a versão preliminar da Etapa 1. As classificações abaixo foram consolidadas no Caderno Técnico v3.0 — Auditoria v0.4.0.

| ID | Narrativa | Estado no escopo | Classificação final | Decisão para o sistema | Auditoria |
|---|---|---|---|---|---|
| LD-001 | O Baile de Carnaval | INCLUIR | T1 — âncora específica | Usar a Casa de Câmara e Cadeia (mesma âncora do PH-002) como referência específica da narrativa. A ficha deve dizer que o marcador é referência territorial, não comprovação do evento sobrenatural. | 🟢 |
| LD-002 | O Clarinete da Orquestra | INCLUIR | T2 — referência territorial | Representar o Rio Jaguaribe como território de referência, sem marcar como exato um trecho da travessia. | 🟢 |
| LD-003 | O Rosário do Mirinho | INCLUIR | T3 — associação ampla | Aprovar para referência ampla de Aracati. Não criar ponto no Cemitério São Pedro por associação presumida. | 🟢 |
| LD-004 | No Tempo dos Pontões | INCLUIR | T2 — referência territorial múltipla | Representar rio/porto/Rua Grande como referências. Não criar ponto para o Hotel Central sem identificação cartográfica independente do edifício histórico. | 🟢 |
| LD-005 | As Lavadeiras das Pedrinhas | INCLUIR | T2 — referência territorial múltipla | Representar Majorlândia e Matriz como referências territoriais; não indicar ponto exato da aparição. | 🟢 |
| LD-006 | O Sobrado das Corujas | INCLUIR | T3 — associação urbana ampla (decisão conservadora) | Aprovar a narrativa no mapa por referência ampla de Aracati/área urbana, preservando Beco da Viração e Travessa Cônego na ficha como topônimos documentados. | 🟢 |
| LD-007 | A Morte da Escrava | INCLUIR | T2 — eixo territorial de ruas | Representar o eixo histórico central de ruas, sem associar a narrativa a um imóvel específico. | 🟢 |
| LD-008 | O Perfume do Sonho | INCLUIR | T2 — referência territorial múltipla | Representar o conjunto de referências verificáveis; não condensar tudo em um “local exato”. | 🟢 |
| LD-009 | O Cortejo | INCLUIR | T2 — referência territorial | Usar o Cemitério São Pedro como referência territorial verificável; manter Cabaré da Albertiza apenas como referência textual. | 🟢 |
| LD-010 | Mestre Romeiro | INCLUIR | T2 — referência territorial | Corrigir “precisão exata” para territorial. Matriz pode funcionar como âncora associada ao sino; não afirmar que a oficina ou o fenômeno ficavam na Matriz. | 🟢 |
| LD-011 | O Passeio da Moça Loura | INCLUIR | T2 — referência territorial múltipla | Representar Matriz/Cemitério/centro como referências, sem eleger uma coordenada de aparição. | 🟢 |
| LD-012 | O Beco do Barão | INCLUIR | T2 — referência territorial | Usar Rua Grande como eixo territorial. Não escolher um sobrado específico sem fonte nominal. | 🟢 |
| LD-013 | O Rosto do Baú | INCLUIR | T3 — associação ampla | Representar em agrupamento/referência geral de Aracati. | 🟢 |
| LD-014 | A Botija da Cruz das Almas | INCLUIR | T1 — âncora específica | Usar Cruz das Almas (PH-006) como âncora específica; o Rio Jaguaribe permanece referência complementar. | 🟢 |
| LD-015 | A Moça do Castelo (Rigolleto) | INCLUIR | T3 — associação ampla | Representar apenas no agrupamento geral de Aracati; não usar o Teatro Francisca Clotilde ou outro edifício por inferência. | 🟢 |
| LD-016 | O Lobisomem da Várzea da Matriz | INCLUIR | T2 — referência territorial múltipla | Representar Canoa Quebrada e Aracati como referências territoriais, sem ponto exato do episódio. | 🟢 |
| LD-017 | A Botija da Lagoa Nova | INCLUIR | T2 — referência territorial | Usar Lagoa Nova como referência de localidade, não como coordenada exata da botija/aparição. | 🟢 |
| LD-018 | Assombração | FORA DO DESENVOLVIMENTO | FORA DO DESENVOLVIMENTO v0.4.0 | Manter catalogada e documentalmente validada, mas não publicar na camada das 25 narrativas de Aracati. | ⚪ |
| LD-019 | Sufraia | INCLUIR | T2 — referência territorial | Usar o bairro Maloca como referência territorial; não usar o endereço do equipamento como local do lobisomem. | 🟢 |
| LD-020 | O Castigo da Oração | INCLUIR | T2 — referência territorial | Usar Várzea da Matriz como referência territorial, sem ponto exato. | 🟢 |
| LD-021 | O Galo Despertador | INCLUIR | T3 — associação ampla | Representar no agrupamento geral de Aracati. | 🟢 |
| LD-022 | Velho Cabeleira | INCLUIR | T2 — referência territorial | Usar Várzea da Matriz como referência territorial, sem ponto exato. | 🟢 |
| LD-023 | O Garupeiro | INCLUIR | T2 — referência territorial múltipla | Representar Centro + Rio Jaguaribe; manter CERNE como referência textual, sem ponto próprio. | 🟢 |
| LD-024 | O Ofício | INCLUIR | T2 — referência territorial | Usar Centro Histórico como referência territorial. | 🟢 |
| LD-025 | Oração do Soldado 33 | INCLUIR | T2 — referência territorial múltipla | Representar Centro + Várzea Preta como referências territoriais, sem ponto exato do ritual. | 🟢 |
| LD-026 | O Choro do Bebê | INCLUIR | T3 — associação ampla | Representar no agrupamento geral de Aracati. | 🟢 |

### Síntese quantitativa

- **26/26 narrativas auditadas documentalmente.**
- **25/26** integram o recorte de desenvolvimento da v0.4.0.
- **LD-018 — Assombração:** validada documentalmente, porém fora do desenvolvimento por estar associada a Fortim.
- Entre as 25 narrativas do recorte: **2 T1**, **17 T2** e **6 T3**.

## 9. Auditoria individual e links verificáveis

A aprovação abaixo é **documental/cartográfica para a representação proposta no sistema**. Ela não constitui comprovação histórica de acontecimentos sobrenaturais narrados.

### LD-001 — O Baile de Carnaval

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** Araujo registra Casa de Câmara, cadeia/quarto 7, cais/porto e Rio Jaguaribe; no texto analítico, os bailes são associados ao piso superior da Casa de Câmara e a cadeia ao piso inferior.

**Comprovação territorial/cartográfica:** Casa de Câmara e Cadeia é identificada institucionalmente no Roteiro Virtual municipal.

**Classificação:** T1 — âncora específica

**Decisão para o sistema:** Usar a Casa de Câmara e Cadeia (mesma âncora do PH-002) como referência específica da narrativa. A ficha deve dizer que o marcador é referência territorial, não comprovação do evento sobrenatural.

**Limite declarado:** O conto também mobiliza cadeia, cais/porto e rio; o ponto da Casa de Câmara não representa todos os acontecimentos.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Identidade do local — Casa de Câmara](https://roteirovirtual.aracati.ce.gov.br/ponto-cultural/casa-de-camara-e-cadeia/)

### LD-002 — O Clarinete da Orquestra

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa o conto ao Rio Jaguaribe e ao conjunto do mestre Cazuza; o artigo detalha que Antonino morre afogado na travessia do rio.

**Comprovação territorial/cartográfica:** A Prefeitura registra a relação histórica de Aracati com o Rio Jaguaribe e o porto em suas margens.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Representar o Rio Jaguaribe como território de referência, sem marcar como exato um trecho da travessia.

**Limite declarado:** A fonte não determina uma coordenada única do afogamento/travessia.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Rio Jaguaribe e Aracati — Prefeitura](https://aracati.ce.gov.br/informa.php?id=776)

### LD-003 — O Rosário do Mirinho

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 registra “cemitério” e jogo do bicho, sem nomear qual cemitério.

**Comprovação territorial/cartográfica:** Há comprovação do vínculo geral das narrativas com o espaço urbano de Aracati, mas não há base suficiente para identificar o cemitério como São Pedro.

**Classificação:** T3 — associação ampla

**Decisão para o sistema:** Aprovar para referência ampla de Aracati. Não criar ponto no Cemitério São Pedro por associação presumida.

**Limite declarado:** Cemitério específico não identificado.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Contexto territorial de Aracati — IPHAN](https://www.gov.br/iphan/pt-br/superintendencias/ceara/patrimonio-material)

### LD-004 — No Tempo dos Pontões

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** Araujo associa a narrativa ao Jaguaribe, porto e hotel; Silva reproduz o conto e nomeia Porto José Alves e Hotel Central, na Rua Grande.

**Comprovação territorial/cartográfica:** Rio Jaguaribe e Rua Grande são territorialmente confirmados por fonte municipal; o mapa oficial do IPECE auxilia a conferência de localidades.

**Classificação:** T2 — referência territorial múltipla

**Decisão para o sistema:** Representar rio/porto/Rua Grande como referências. Não criar ponto para o Hotel Central sem identificação cartográfica independente do edifício histórico.

**Limite declarado:** Edifício do Hotel Central não foi individualizado para a v0.4.0.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Reprodução/análise — Silva (SciELO)](https://www.scielo.br/j/elbc/a/fG8NmmPwy8gvfkQpNtRNc6j/)
- [Rio/Rua Grande — Prefeitura](https://aracati.ce.gov.br/informa.php?id=776)
- [Mapa municipal — IPECE](https://www.ipece.ce.gov.br/wp-content/uploads/sites/45/2025/05/Mapa-Aracati-2024.pdf)

### LD-005 — As Lavadeiras das Pedrinhas

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa “As Lavadeiras das Pedrinhas” a Majorlândia e à Igreja Matriz.

**Comprovação territorial/cartográfica:** A Prefeitura confirma Majorlândia como localidade/praia de Aracati; a Igreja Matriz possui identificação patrimonial própria.

**Classificação:** T2 — referência territorial múltipla

**Decisão para o sistema:** Representar Majorlândia e Matriz como referências territoriais; não indicar ponto exato da aparição.

**Limite declarado:** A associação é múltipla e não define um único local de ocorrência.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Majorlândia — Prefeitura](https://aracati.ce.gov.br/informa/597/ouvidoria)
- [Igreja Matriz — registro patrimonial](https://www.ipatrimonio.org/aracati-igreja-matriz-de-nossa-senhora-do-rosario/)

### LD-006 — O Sobrado das Corujas

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 registra Beco da Viração, Travessa Cônego e sobrados.

**Comprovação territorial/cartográfica:** Foi localizada cartografia atual de Travessa Cônego João Paulo, mas a equivalência com a formulação abreviada da fonte e a identidade de um sobrado específico não são suficientes para um ponto próprio.

**Classificação:** T3 — associação urbana ampla (decisão conservadora)

**Decisão para o sistema:** Aprovar a narrativa no mapa por referência ampla de Aracati/área urbana, preservando Beco da Viração e Travessa Cônego na ficha como topônimos documentados.

**Limite declarado:** Não identificar sobrado, beco ou coordenada específica na v0.4.0.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Contexto urbano protegido — IPHAN](https://www.gov.br/iphan/pt-br/superintendencias/ceara/patrimonio-material)
- [Apoio cartográfico — Travessa Cônego João Paulo](https://brazil-streets.openalfa.com/streets/travessa-conego-joao-paulo-aracati-regiao-geografica-imediata-de-aracati)

### LD-007 — A Morte da Escrava

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 nomeia Rua Cel. Alexanzito, Rua do Comércio e Rua Cel. Pompeu.

**Comprovação territorial/cartográfica:** Fonte municipal confirma Cel. Alexanzito/Rua Grande e Cel. Pompeu como eixos históricos paralelos ao rio; a nomenclatura histórica de “Rua do Comércio” exige cautela.

**Classificação:** T2 — eixo territorial de ruas

**Decisão para o sistema:** Representar o eixo histórico central de ruas, sem associar a narrativa a um imóvel específico.

**Limite declarado:** Não resolver por inferência todas as equivalências entre denominações históricas e atuais.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Eixos urbanos históricos — Prefeitura](https://aracati.ce.gov.br/informa.php?id=776)
- [Rua Grande/Centro Histórico — Prefeitura](https://aracati.ce.gov.br/informa/860/ouvidoria)

### LD-008 — O Perfume do Sonho

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** Araujo associa o conto ao Rio Jaguaribe, hidroavião, Casa de Câmara e Cemitério São Pedro; o texto analítico menciona acidente nas margens do rio, velório na Casa de Câmara e sepultamento no cemitério.

**Comprovação territorial/cartográfica:** Casa de Câmara, Cemitério São Pedro e Rio Jaguaribe possuem comprovação institucional/territorial independente.

**Classificação:** T2 — referência territorial múltipla

**Decisão para o sistema:** Representar o conjunto de referências verificáveis; não condensar tudo em um “local exato”.

**Limite declarado:** Narrativa envolve diferentes lugares e etapas.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Casa de Câmara — Roteiro Virtual](https://roteirovirtual.aracati.ce.gov.br/ponto-cultural/casa-de-camara-e-cadeia/)
- [Cemitério São Pedro — MPCE](https://mpce.mp.br/mpce-ajuiza-acao-para-que-municipio-de-aracati-corrija-irregularidades-em-cemiterio-e-providencie-novo-espaco-para-sepultamentos/)
- [Rio Jaguaribe — Prefeitura](https://aracati.ce.gov.br/informa.php?id=776)

### LD-009 — O Cortejo

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa “O Cortejo” ao Cabaré da Albertiza e ao Cemitério São Pedro.

**Comprovação territorial/cartográfica:** O Cemitério Municipal São Pedro é confirmado pelo MPCE; não foi necessário atribuir coordenada própria ao cabaré para o MVP.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Usar o Cemitério São Pedro como referência territorial verificável; manter Cabaré da Albertiza apenas como referência textual.

**Limite declarado:** Localização histórica do cabaré não foi individualizada.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Cemitério São Pedro — MPCE](https://mpce.mp.br/mpce-ajuiza-acao-para-que-municipio-de-aracati-corrija-irregularidades-em-cemiterio-e-providencie-novo-espaco-para-sepultamentos/)

### LD-010 — Mestre Romeiro

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 registra Matriz/sino; em trecho analítico, Araujo informa que a oficina de Mestre Romeiro ficava na Travessa da Cacimba da Rua.

**Comprovação territorial/cartográfica:** A Igreja Matriz é um bem identificável, mas não corresponde à oficina; por isso não pode ser tratada como localização exata do episódio.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Corrigir “precisão exata” para territorial. Matriz pode funcionar como âncora associada ao sino; não afirmar que a oficina ou o fenômeno ficavam na Matriz.

**Limite declarado:** A coordenada precisa da oficina histórica não está validada.

**Links verificáveis:**

- [Comprovação documental e oficina — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Igreja Matriz — registro patrimonial](https://www.ipatrimonio.org/aracati-igreja-matriz-de-nossa-senhora-do-rosario/)

### LD-011 — O Passeio da Moça Loura

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 registra ruas, Cemitério São Pedro e Igreja Matriz; Araujo também descreve o conto como ligado à região central da cidade.

**Comprovação territorial/cartográfica:** Matriz, Cemitério São Pedro e Centro Histórico possuem identificação institucional.

**Classificação:** T2 — referência territorial múltipla

**Decisão para o sistema:** Representar Matriz/Cemitério/centro como referências, sem eleger uma coordenada de aparição.

**Limite declarado:** Trajeto exato da “moça loura” não é determinado.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Cemitério São Pedro — MPCE](https://mpce.mp.br/mpce-ajuiza-acao-para-que-municipio-de-aracati-corrija-irregularidades-em-cemiterio-e-providencie-novo-espaco-para-sepultamentos/)
- [Igreja Matriz — registro patrimonial](https://www.ipatrimonio.org/aracati-igreja-matriz-de-nossa-senhora-do-rosario/)
- [Centro Histórico — Prefeitura](https://aracati.ce.gov.br/informa/860/ouvidoria)

### LD-012 — O Beco do Barão

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa “O Beco do Barão” a Rua Grande, sobrado, beco e trilho.

**Comprovação territorial/cartográfica:** A Prefeitura identifica oficialmente a Rua Grande como Coronel Alexanzito e a localiza no Centro Histórico.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Usar Rua Grande como eixo territorial. Não escolher um sobrado específico sem fonte nominal.

**Limite declarado:** Sobrado/beco exato não foi individualizado cartograficamente.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Rua Grande — Prefeitura](https://aracati.ce.gov.br/informa/860/ouvidoria)

### LD-013 — O Rosto do Baú

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 oferece apenas “sociabilidades na cidade” como memória sociocultural.

**Comprovação territorial/cartográfica:** Aracati e seu conjunto urbano são confirmados institucionalmente, mas a fonte não restringe a narrativa a um lugar menor.

**Classificação:** T3 — associação ampla

**Decisão para o sistema:** Representar em agrupamento/referência geral de Aracati.

**Limite declarado:** Nenhum ponto específico documentalmente sustentado.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Aracati — IPHAN](https://www.gov.br/iphan/pt-br/superintendencias/ceara/patrimonio-material)

### LD-014 — A Botija da Cruz das Almas

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O próprio título e o Quadro 1 ligam a botija à Cruz das Almas/praça e ao Rio Jaguaribe.

**Comprovação territorial/cartográfica:** A legislação estadual nomeia a Praça Cruz das Almas em Aracati; o ponto já integra o inventário patrimonial do projeto como PH-006.

**Classificação:** T1 — âncora específica

**Decisão para o sistema:** Usar Cruz das Almas (PH-006) como âncora específica; o Rio Jaguaribe permanece referência complementar.

**Limite declarado:** O marcador indica o lugar associado à narrativa, não prova a existência de botija ou evento sobrenatural.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Praça Cruz das Almas — Lei estadual](https://www2.al.ce.gov.br/legislativo/legislacao5/leis2024/18924.htm)
- [Rio Jaguaribe — Prefeitura](https://aracati.ce.gov.br/informa.php?id=776)

### LD-015 — A Moça do Castelo (Rigolleto)

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 usa “teatro do macabro” como memória sociocultural, sem nomear um prédio ou logradouro.

**Comprovação territorial/cartográfica:** Não há suporte para equiparar a expressão a um teatro físico específico.

**Classificação:** T3 — associação ampla

**Decisão para o sistema:** Representar apenas no agrupamento geral de Aracati; não usar o Teatro Francisca Clotilde ou outro edifício por inferência.

**Limite declarado:** Local específico não identificado pela fonte.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Contexto territorial de Aracati — IPHAN](https://www.gov.br/iphan/pt-br/superintendencias/ceara/patrimonio-material)

### LD-016 — O Lobisomem da Várzea da Matriz

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 e o texto analítico relacionam o conto a Canoa Quebrada e Aracati.

**Comprovação territorial/cartográfica:** A Prefeitura confirma Canoa Quebrada no território de Aracati e sua APA.

**Classificação:** T2 — referência territorial múltipla

**Decisão para o sistema:** Representar Canoa Quebrada e Aracati como referências territoriais, sem ponto exato do episódio.

**Limite declarado:** A fonte não fornece coordenada específica do acontecimento narrado.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Canoa Quebrada — Prefeitura](https://aracati.ce.gov.br/informa/67/nota-de-esclarecimento-da-prefeitura-do-aracati)
- [Aracati — IPHAN](https://www.gov.br/iphan/pt-br/superintendencias/ceara/patrimonio-material)

### LD-017 — A Botija da Lagoa Nova

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa a narrativa a Lagoa Nova.

**Comprovação territorial/cartográfica:** A Prefeitura possui licitação de infraestrutura explicitamente localizada na “localidade de Lagoa Nova”; o mapa municipal do IPECE serve de conferência territorial complementar.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Usar Lagoa Nova como referência de localidade, não como coordenada exata da botija/aparição.

**Limite declarado:** Ponto específico dentro da localidade não é documentado.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Lagoa Nova — Prefeitura](https://aracati.ce.gov.br/licitacaolista?id=250)
- [Mapa municipal — IPECE](https://www.ipece.ce.gov.br/wp-content/uploads/sites/45/2025/05/Mapa-Aracati-2024.pdf)

### LD-018 — Assombração

**Status:** VALIDADA DOCUMENTALMENTE — FORA DO DESENVOLVIMENTO

**Comprovação documental:** O Quadro 1 associa “Assombração” a Fortim.

**Comprovação territorial/cartográfica:** O IBGE identifica Fortim como município próprio (código 2304459), distinto do recorte municipal de Aracati adotado no desenvolvimento.

**Classificação:** FORA DO DESENVOLVIMENTO v0.4.0

**Decisão para o sistema:** Manter catalogada e documentalmente validada, mas não publicar na camada das 25 narrativas de Aracati.

**Limite declarado:** Exclusão é de escopo geográfico, não por falta de fonte.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Fortim como município — IBGE](https://www.ibge.gov.br/cidades-e-estados/ce/fortim.html)

### LD-019 — Sufraia

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa “Sufraia” à Maloca.

**Comprovação territorial/cartográfica:** A Prefeitura identifica Maloca como bairro de Aracati e informa equipamento público situado na Rua dos Franceses, sem número — Maloca.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Usar o bairro Maloca como referência territorial; não usar o endereço do equipamento como local do lobisomem.

**Limite declarado:** Não existe ponto de ocorrência definido dentro do bairro.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Bairro Maloca — Prefeitura](https://aracati.ce.gov.br/informa/640/centro-vida-vai-promover-inclus-o-social-por-meio-)

### LD-020 — O Castigo da Oração

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa “O Castigo da Oração” à Várzea da Matriz.

**Comprovação territorial/cartográfica:** A Prefeitura confirma Várzea da Matriz por equipamentos e endereços públicos no bairro.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Usar Várzea da Matriz como referência territorial, sem ponto exato.

**Limite declarado:** A fonte não restringe a narrativa a um lote/edifício.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Várzea da Matriz — Prefeitura](https://www.aracati.ce.gov.br/informa/8/v-rzea-da-matriz-recebe-o-maior-e-mais-moderno-pos)

### LD-021 — O Galo Despertador

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 registra somente “casa; tempo” como memória sociocultural.

**Comprovação territorial/cartográfica:** A casa não é identificada por nome/endereço; portanto a auditoria não transforma um espaço doméstico indeterminado em ponto cartográfico.

**Classificação:** T3 — associação ampla

**Decisão para o sistema:** Representar no agrupamento geral de Aracati.

**Limite declarado:** Casa específica não identificada.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Aracati — IPHAN](https://www.gov.br/iphan/pt-br/superintendencias/ceara/patrimonio-material)

### LD-022 — Velho Cabeleira

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa “Velho Cabeleira” à Várzea da Matriz.

**Comprovação territorial/cartográfica:** A Prefeitura confirma Várzea da Matriz como bairro/localidade urbana.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Usar Várzea da Matriz como referência territorial, sem ponto exato.

**Limite declarado:** A fonte não define local menor dentro do bairro.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Várzea da Matriz — Prefeitura](https://www.aracati.ce.gov.br/informa/8/v-rzea-da-matriz-recebe-o-maior-e-mais-moderno-pos)

### LD-023 — O Garupeiro

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa “O Garupeiro” a CERNE, Centro e Rio Jaguaribe.

**Comprovação territorial/cartográfica:** Centro Histórico e Rio Jaguaribe são confirmados por fontes municipais; CERNE não é necessário para a geometria enquanto não houver identificação cartográfica independente.

**Classificação:** T2 — referência territorial múltipla

**Decisão para o sistema:** Representar Centro + Rio Jaguaribe; manter CERNE como referência textual, sem ponto próprio.

**Limite declarado:** CERNE não foi individualizado para a v0.4.0.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Centro/Rua Grande — Prefeitura](https://aracati.ce.gov.br/informa/860/ouvidoria)
- [Rio Jaguaribe — Prefeitura](https://aracati.ce.gov.br/informa.php?id=776)

### LD-024 — O Ofício

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 e o texto analítico situam “O Ofício” na região central/centro da cidade.

**Comprovação territorial/cartográfica:** A Prefeitura identifica a Rua Grande no Centro Histórico e o IPHAN confirma o conjunto urbano tombado de Aracati.

**Classificação:** T2 — referência territorial

**Decisão para o sistema:** Usar Centro Histórico como referência territorial.

**Limite declarado:** Nenhum imóvel específico é indicado.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Centro Histórico — Prefeitura](https://aracati.ce.gov.br/informa/860/ouvidoria)
- [Conjunto urbano — IPHAN](https://www.gov.br/iphan/pt-br/superintendencias/ceara/patrimonio-material)

### LD-025 — Oração do Soldado 33

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 e o texto analítico associam “Oração do Soldado 33” ao Centro e à Várzea Preta.

**Comprovação territorial/cartográfica:** Centro Histórico é confirmado pela Prefeitura; IQUAMA confirma Sítio Várzea Preta em Aracati; o mapa do IPECE complementa a conferência territorial.

**Classificação:** T2 — referência territorial múltipla

**Decisão para o sistema:** Representar Centro + Várzea Preta como referências territoriais, sem ponto exato do ritual.

**Limite declarado:** A narrativa é multiárea; não deve ser reduzida a um único local exato.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Centro Histórico — Prefeitura](https://aracati.ce.gov.br/informa/860/ouvidoria)
- [Várzea Preta — IQUAMA](https://iquama.aracati.ce.gov.br/processoambiental/681)
- [Mapa municipal — IPECE](https://www.ipece.ce.gov.br/wp-content/uploads/sites/45/2025/05/Mapa-Aracati-2024.pdf)

### LD-026 — O Choro do Bebê

**Status:** APROVADA PARA A v0.4.0

**Comprovação documental:** O Quadro 1 associa “O Choro do Bebê” apenas a Aracati.

**Comprovação territorial/cartográfica:** O conjunto urbano/território de Aracati é confirmado pelo IPHAN e pela Prefeitura, mas a fonte não oferece local mais preciso.

**Classificação:** T3 — associação ampla

**Decisão para o sistema:** Representar no agrupamento geral de Aracati.

**Limite declarado:** Nenhum ponto específico sustentado pela documentação consultada.

**Links verificáveis:**

- [Comprovação documental — Araujo (PDF)](https://seer.pucgoias.edu.br/index.php/caminhos/article/download/15295/7291/56199)
- [Aracati — IPHAN](https://www.gov.br/iphan/pt-br/superintendencias/ceara/patrimonio-material)
- [Aracati — Prefeitura](https://aracati.ce.gov.br/omunicipio.php)

## 10. Critério de conclusão da auditoria

- [x] O recorte territorial da v0.4.0 está explicitado.
- [x] LD-018 está formalmente registrada como fora do desenvolvimento, sem ser apagada do catálogo.
- [x] G1–G5 estão definidos.
- [x] T1–T3 estão definidos.
- [x] A diferença entre fonte de associação e fonte cartográfica está registrada.
- [x] As 26 narrativas foram auditadas individualmente.
- [x] As 25 narrativas do desenvolvimento possuem classificação T1/T2/T3 final.
- [x] Os limites de precisão foram registrados.
- [x] Os links de comprovação foram registrados.

**ETAPA 2 — AUDITORIA TERRITORIAL: 🟢 CONCLUÍDA.**

## 11. Próxima etapa

**Etapa 3 — Sincronização da base canônica `src/data/dados.json`.**

A implementação deve seguir a auditoria consolidada neste documento e no Caderno Técnico v3.0. A ordem será:

1. atualizar metadados da base;
2. acrescentar a classificação T1/T2/T3 às narrativas;
3. revisar `localizacao_nome`, `tipo_geometria`, `precisao_espacial` e `decisao_cartografica`;
4. preservar LD-018 como `validado_nao_mvp`;
5. validar o JSON antes de alterar o GeoJSON;
6. somente depois adaptar a camada cartográfica e a interface.

Nenhuma coordenada deve ser criada por inferência não documentada.

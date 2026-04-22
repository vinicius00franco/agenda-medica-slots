# Plano agil de implementacao - Agenda Medica com Slots Dinamicos

Documento derivado de [`readme.md`](../readme.md) para guiar a implementacao por entregas pequenas, validaveis e com risco controlado.

## Objetivo

Entregar um fluxo de agendamento previsivel, acessivel e consistente entre data, profissional e fuso horario, evitando conflitos de disponibilidade e selecao incorreta de slots.

## Escopo do MVP

- Selecionar dia, semana e mes com navegacao rapida.
- Visualizar disponibilidade por profissional.
- Exibir slots disponiveis, ocupados e bloqueados com estados visuais claros.
- Permitir selecao de slot em tempo real.
- Confirmar o agendamento com validacao imediata.
- Tratar timezone e horario de verao de forma consistente.

## Premissas tecnicas

- Persistir ou receber datas em uma referencia canonical, preferencialmente UTC.
- Normalizar todas as datas antes da renderizacao na UI.
- Exibir a disponibilidade sempre no timezone escolhido pelo usuario.
- Bloquear slots invalidos visualmente, nao apenas na confirmacao.
- Manter a origem da disponibilidade separada da camada de apresentacao.

## Avaliacao senior frontend

- O plano esta bem direcionado ao problema certo: timezone, disponibilidade e conflito sao os riscos reais.
- A stack escolhida e coerente, mas a agilidade melhora se a primeira entrega for um slice vertical pequeno, nao uma estrutura completa.
- A Iteracao 0 hoje mistura fundacao tecnica com modelagem e validacao. Isso e aceitavel, desde que seja timeboxed para nao virar waterfall.
- Ajuste recomendado: entregar primeiro um fluxo funcional minimo com 1 profissional, 1 dia e 1 timezone.
- Ajuste recomendado: validar a escolha de slot ponta a ponta antes de ampliar para semana, mes e filtros.
- Ajuste recomendado: manter cada iteracao pequena o suficiente para ser demonstrada e testada ao final.
- Se a equipe for pequena, priorize valor funcional antes de refinamentos de cache, variações de layout e abstracoes prematuras.

## Sequencia recomendada de implementacao

### Iteracao 0 - Fundacao do projeto

Objetivo: preparar a base tecnica e o modelo de dados.

- Criar o projeto em Next.js com TypeScript e Tailwind CSS.
- Instalar `date-fns`, `date-fns-tz`, `@tanstack/react-query` e `react-hook-form`.
- Definir os tipos centrais do dominio: `Professional`, `AvailabilityRule`, `Slot`, `Booking` e `TimezonePreference`.
- Criar utilitarios de timezone para converter UTC para timezone local da tela, converter horario selecionado para UTC e comparar slots em fusos diferentes.
- Estruturar uma API mockada ou camada de dados inicial para disponibilidade.
- Entregar um slice vertical minimo com selecao e confirmacao em um unico fluxo.
- Configurar a base de testes para regras de data e conflito.

Entrega esperada:

- Aplicacao inicial rodando.
- Estrutura de dados definida.
- Funcoes de conversao de data testaveis.

Criterio de aceite:

- O projeto inicia sem erro.
- As conversoes de timezone produzem o mesmo slot logico em diferentes fusos.

### Iteracao 1 - Calendario e navegacao temporal

Objetivo: permitir exploracao rapida da agenda.

- Construir o header do calendario com troca de periodo.
- Implementar visoes de dia, semana e mes.
- Criar navegacao para proximo, anterior e retorno a data atual.
- Exibir estados basicos de disponibilidade no calendario.
- Garantir layout responsivo para desktop e mobile.

Entrega esperada:

- O usuario consegue navegar entre periodos sem perder contexto.
- A interface mostra a estrutura da agenda antes da selecao do slot.

Criterio de aceite:

- Trocar de visao nao remove a data selecionada.
- A navegacao continua legivel em telas pequenas.

### Iteracao 2 - Disponibilidade e grade de slots

Objetivo: conectar os dados de disponibilidade a uma grade interativa.

- Criar o hook de disponibilidade com TanStack Query.
- Montar a grade de slots por profissional e intervalo de tempo.
- Diferenciar visualmente `slot disponivel`, `slot ocupado`, `slot bloqueado` e `slot fora da janela valida`.
- Filtrar disponibilidade por profissional.
- Revalidar dados ao trocar dia, profissional ou timezone.
- Mostrar loading, vazio e erro de forma clara.

Entrega esperada:

- A tela mostra a disponibilidade real ou mockada em tempo quase real.
- Slots invalidos nao parecem clicaveis.

Criterio de aceite:

- Slot ocupado nao pode ser selecionado.
- A mudanca de timezone recalcula a grade corretamente.

### Iteracao 3 - Selecao e confirmacao do agendamento

Objetivo: fechar o fluxo principal com validacao imediata.

- Criar o resumo da selecao atual.
- Implementar o formulario de confirmacao com `react-hook-form`.
- Validar conflitos antes da submissao.
- Tratar retorno de sucesso e falha.
- Exibir mensagens claras quando o slot mudar de status entre a visualizacao e a confirmacao.

Entrega esperada:

- O usuario consegue revisar e confirmar um slot valido.
- O sistema bloqueia conflitos no ultimo momento sem quebrar o fluxo.

Criterio de aceite:

- Um slot ocupado no backend gera feedback explicito.
- A confirmacao exibe sucesso somente quando a reserva for valida.

### Iteracao 4 - Robustez, acessibilidade e bordas

Objetivo: reduzir bugs de timezone e melhorar a qualidade da experiencia.

- Criar testes para troca de timezone.
- Criar testes para horario de verao.
- Criar testes para transicao de dia.
- Criar testes para conflito de slot.
- Validar navegacao por teclado.
- Revisar contraste e leitura de estados.
- Ajustar a experiencia mobile.
- Revisar cache, invalidacao e revalidacao das consultas.

Entrega esperada:

- A agenda fica confiavel em cenarios de borda.
- A experiencia atende requisitos basicos de acessibilidade.

Criterio de aceite:

- O slot permanece correto apos troca de timezone.
- Casos de horario de verao nao quebram a selecao.

## Estrategia de testes inteligentes

### Unitarios de dominio

- Converter datas entre UTC e timezone local.
- Validar troca de dia, fim de mes e horario de verao.
- Detectar conflitos, sobreposicoes e slots fora da janela.
- Normalizar a representacao de slots antes da renderizacao.

### Integracao de UI

- Renderizar estados disponivel, ocupado, bloqueado e indisponivel.
- Preservar a data selecionada ao alternar entre dia, semana e mes.
- Reagir corretamente a loading, vazio e erro na consulta.
- Recalcular a grade ao trocar profissional ou timezone.
- Impedir interacao com slot invalido sem depender so da submissao.

### Fluxo critico end-to-end

- Escolher timezone, navegar na agenda, selecionar um slot e confirmar.
- Trocar timezone antes da confirmacao e validar que a escolha continua correta.
- Simular slot que ficou ocupado entre visualizacao e confirmacao.
- Validar feedback claro quando a reserva falhar por conflito.

### Acessibilidade

- Navegar agenda e slots apenas com teclado.
- Verificar foco visivel, ordem de tab e ativacao por Enter/Espaco.
- Validar contraste dos estados visuais.
- Checar labels, roles e estados aria relevantes.

### Regressao visual

- Comparar calendario em dia, semana e mes.
- Cobrir estados de loading, vazio e erro.
- Verificar responsividade em desktop e mobile.

### Regras para priorizar testes

- Toda logica de timezone e conflito deve ter cobertura unitaria.
- Todo fluxo que bloqueia slot deve ter teste de integracao.
- Todo caminho de confirmacao deve ter pelo menos um teste end-to-end.
- Todo ajuste visual com risco de regressao deve passar por captura visual.

## Backlog tecnico priorizado

### P0

- Modelar dominio de agenda.
- Implementar utilitarios de timezone.
- Criar consulta de disponibilidade.
- Bloquear slots invalidos na UI.
- Garantir confirmacao com validacao de conflito.
- Cobrir timezone, conflito e transicao de dia com testes unitarios.
- Cobrir o fluxo principal de selecao e confirmacao com teste end-to-end.

### P1

- Visoes dia, semana e mes.
- Filtros por profissional.
- Estados de loading, vazio e erro.
- Layout responsivo.
- Cobrir acessibilidade basica e foco por teclado.

### P2

- Otimizacoes de cache.
- Refinos visuais.
- Instrumentacao e observabilidade basica.
- Melhorias incrementais de acessibilidade.

## Riscos principais

- Timezone e horario de verao podem gerar off-by-one e selecao incorreta de slots.
- Cache desatualizado pode mostrar disponibilidade antiga.
- Conflitos entre visualizacao e confirmacao podem confundir o usuario.
- Grades complexas podem perder legibilidade em telas pequenas.

## Mitigacoes

- Centralizar todas as conversoes em utilitarios testados.
- Chavear consultas por data, profissional e timezone.
- Revalidar disponibilidade antes da confirmacao.
- Usar estados visuais explicitos para bloquear interacoes invalidas.
- Testar o fluxo em desktop e mobile antes do fechamento do MVP.

## Definition of done

- O slot escolhido continua correto apos troca de timezone.
- Horarios ocupados aparecem bloqueados de forma explicita.
- A navegacao entre visoes do calendario e fluida.
- O fluxo funciona bem em desktop e mobile.
- Casos de horario de verao e mudanca de dia foram testados.

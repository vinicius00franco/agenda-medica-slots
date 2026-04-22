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
- **Ajuste aplicado**: Utilização de iterações de ponte (0.5, 1.5, 2.5) para garantir que as adições visuais e funcionais sejam sempre incrementais, evitando reescritas ou mudanças drásticas de layout.

## Sequencia de implementacao Realizada

### [x] Iteracao 0 - Fundacao do projeto
- [x] Criar o projeto em Next.js com TypeScript e Tailwind CSS.
- [x] Instalar `date-fns`, `date-fns-tz`, `@tanstack/react-query` e `react-hook-form`.
- [x] Definir os tipos centrais do dominio: `Professional`, `AvailabilityRule`, `Slot`, `Booking` e `TimezonePreference`.
- [x] Criar utilitarios de timezone para converter UTC para timezone local.
- [x] Estruturar base de dados mockada.

### [x] Iteracao 0.5 (Ponte) - Layout Base e Navegação Simples
- [x] Criar o layout principal (Header, área de conteúdo).
- [x] Implementar navegação de data ("Dia Anterior", "Próximo Dia", "Hoje").
- [x] Garantir estrutura responsiva fixa.

### [x] Iteracao 1 - Calendario e navegacao temporal estendida
- [x] Implementar seletor de periodo ("Dia, Semana, Mês").
- [x] Renderizar componentes `WeekView` e `MonthView`.
- [x] Garantir troca de visão sem perda de contexto da data.

### [x] Iteracao 1.5 (Ponte) - Exibição Inicial da Grade de Slots
- [x] Criar hook `useAvailability` com React Query.
- [x] Conectar API mockada para exibir botões de horários iniciais.
- [x] Aplicar estilo básico para slots disponíveis/ocupados.

### [x] Iteracao 2 - Disponibilidade e interações de grade
- [x] Diferenciar visualmente todos os estados: `bloqueado` e `fora da janela`.
- [x] Implementar filtros de **Profissional** e **Timezone**.
- [x] Tratar estados de `Loading`, `Erro` e `Lista Vazia`.
- [x] Garantir revalidação ao trocar fuso ou profissional.

### [x] Iteracao 2.5 (Ponte) - Seleção Visual e Resumo do Slot
- [x] Implementar estado de seleção visual do slot.
- [x] Criar painel de **Resumo do Agendamento** com detalhes da escolha.

### [x] Iteracao 3 - Selecao e confirmacao do agendamento
- [x] Implementar formulário `BookingForm` com validações.
- [x] Simular processamento e conflitos de agendamento (concorrência).
- [x] Criar feedback visual de sucesso e erro na reserva.

### [x] Iteracao 4 - Robustez, acessibilidade e bordas
- [x] Criar testes unitários para transição de **Horário de Verão (DST)**.
- [x] Implementar navegação por teclado e `aria-labels` para acessibilidade.
- [x] Refinar visual e garantir build de produção estável.

## Estrategia de testes aplicados

### Unitarios de dominio
- [x] Conversores de timezone (UTC <-> Local).
- [x] Geração de slots por intervalo.
- [x] Testes de transição de DST (Horário de Verão).

### Integracao de UI
- [x] Renderização de estados (Disponível, Ocupado, Bloqueado).
- [x] Navegação entre visões (Dia, Semana, Mês).
- [x] Feedback de formulário e validações.

## Backlog tecnico finalizado

- [x] Modelar domínio de agenda.
- [x] Implementar utilitários de timezone robustos.
- [x] Criar consulta de disponibilidade via React Query.
- [x] Bloquear slots inválidos visualmente.
- [x] Fluxo de confirmação completo com tratamento de erro.
- [x] Cobertura de acessibilidade básica.

## Definition of done (Validado)
- [x] O slot escolhido continua correto após troca de timezone.
- [x] Horários ocupados aparecem bloqueados explicitamente.
- [x] A navegação entre visões é fluida e incremental.
- [x] O fluxo funciona em desktop e mobile.
- [x] Build de produção concluído sem erros de lint ou tipos.
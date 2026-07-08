# Roadmap Checklist

Este checklist orienta agentes sobre prioridade e limites. Ele nao autoriza
implementar fases futuras sem pedido explicito do usuario.

Legenda:

- [ ] Pendente ou a validar.
- [x] Concluido.

## Guardrails

Antes de iniciar qualquer item, confirme se ele pertence a fase atual ou se ha
pedido explicito do usuario para uma fase futura.

- [ ] Confirmar que a tarefa nao implementa backend real sem pedido explicito.
- [ ] Confirmar que a tarefa nao implementa PostgreSQL real sem pedido
  explicito.
- [ ] Confirmar que a tarefa nao implementa Railway CD sem pedido explicito.
- [ ] Confirmar que a tarefa nao converte o projeto para monorepo sem pedido
  explicito.
- [ ] Confirmar que a tarefa nao integra pagamento real sem pedido explicito.
- [ ] Confirmar que a tarefa nao integra auth real sem pedido explicito.

## Fase atual: validacao frontend

Objetivo:

- [ ] Validar a experiencia SaaS do starter kit como base visual e tecnica para
  futuros produtos.

Trabalho permitido:

- [ ] Ajustar responsividade em mobile, tablet e desktop.
- [ ] Refinar landing, auth mock, dashboard, projetos, billing e settings.
- [ ] Melhorar componentes base.
- [ ] Corrigir acessibilidade e estados de UI.
- [ ] Aumentar cobertura Vitest onde houver logica.
- [ ] Melhorar contratos mockados sem criar backend real.
- [ ] Documentar arquitetura, padroes e checklist.

## Fase 1: fechamento da validacao frontend

Criterio de saida:

- [x] Fluxos principais funcionam sem erro em mobile, tablet e desktop.
- [x] Tema claro/escuro consistente.
- [x] Formularios validam e exibem feedback corretamente.
- [ ] Estados vazio, loading e erro existem onde fazem sentido.
- [x] `pnpm run lint`, `pnpm run lint:types`, `pnpm test`,
  `pnpm run build` e `pnpm run test:e2e` passam.
- [x] Documentacao em `docs/` reflete a arquitetura real.

Entregas recomendadas:

- [x] Testes adicionais para store e formularios criticos.
- [x] Revisao de acessibilidade com teclado.
- [x] Verificacao visual em viewports mobile, tablet e desktop.
- [x] Limpeza de textos inconsistentes ou placeholders de demo que prejudiquem
  o starter kit.

Progresso do fechamento enxuto:

- [x] Testes adicionados para store, auth, projetos, settings e overlays.
- [x] Componentes `Modal` e `Dialog` passaram a expor semantica acessivel de
  dialogo.
- [x] Copies de showcase foram ajustadas para deixar claro que backend,
  persistencia, billing e CI reais pertencem a fases futuras.
- [x] Header, drawer mobile, toggle de senha, medidores de billing e controles
  segmentados ganharam semantica acessivel adicional.
- [x] API keys mockadas usam prefixo `sk_mock_` para evitar aparencia de segredo
  real.
- [x] Playwright Chromium foi adicionado e passou em desktop, tablet e mobile.

## Fase 2: desenho do backend e contratos

Objetivo:

- [ ] Preparar a troca de mocks por API real sem quebrar o frontend.

Trabalho esperado:

- [ ] Definir dominios backend: auth, users, projects, billing, activity logs,
  health/config.
- [ ] Definir DTOs, erros padronizados e codigos HTTP.
- [ ] Decidir estrategia de auth, sessoes e cookies/tokens.
- [ ] Definir OpenAPI ou contrato equivalente.
- [ ] Definir estrategia de mocks para testes e desenvolvimento offline.
- [ ] Mapear quais partes de `lib/store.ts` continuam client-side e quais
  migram para backend.

Criterio de saida:

- [ ] Contratos aceitos antes de implementar servidor.
- [ ] Frontend consegue continuar usando uma camada de servico.
- [ ] Plano de migracao por dominio esta documentado.

## Fase 3: banco de dados e persistencia

Objetivo:

- [ ] Substituir dados mockados por persistencia confiavel.

Trabalho esperado:

- [ ] Escolher e configurar ferramenta de migrations.
- [ ] Modelar tabelas iniciais.
- [ ] Criar seeds para ambiente local.
- [ ] Definir indices, constraints e relacoes.
- [ ] Definir politica de backups e restore para producao.
- [ ] Definir usuario de aplicacao com menor privilegio.

Dominios iniciais provaveis:

- [ ] Users.
- [ ] Projects.
- [ ] Api keys.
- [ ] Activity logs.
- [ ] Subscription/customer records.

Criterio de saida:

- [ ] Migrations reproduziveis.
- [ ] Seeds locais documentadas.
- [ ] Testes de integracao para consultas principais.
- [ ] Nenhum segredo real exposto ao frontend.

## Fase 4: integracoes reais

Objetivo:

- [ ] Conectar o starter kit a servicos reais de produto.

Possiveis entregas, apenas sob demanda:

- [ ] Auth real.
- [ ] Billing real.
- [ ] Envio de email.
- [ ] Observabilidade.
- [ ] Storage.
- [ ] Webhooks.
- [ ] Jobs agendados.

Cada integracao deve incluir:

- [ ] Contrato.
- [ ] Variaveis de ambiente.
- [ ] Tratamento de erro.
- [ ] Logs.
- [ ] Testes.
- [ ] Entrada no checklist de producao.

## Fase 5: hardening de producao

Objetivo:

- [ ] Tornar a aplicacao operavel com seguranca, performance e processo de
  release.

Trabalho esperado:

- [ ] CI com lint, typecheck, tests e build.
- [ ] Revisao de headers, CSP, CORS e cookies.
- [ ] Error boundaries e paginas `not-found`/erro quando o roteamento evoluir.
- [ ] Monitoramento de erros e web vitals.
- [ ] Estrategia de deploy definida.
- [ ] Runbook de incidentes.
- [ ] Checklist de rollback.
- [ ] Auditoria de dependencias.

## Backlog tecnico util

- [x] Adicionar testes para `lib/store.ts`.
- [x] Adicionar testes de formularios para projetos, auth e settings.
- [ ] Avaliar se `Sidebar` deve ser removida, reativada ou documentada como
  opcao de layout.
- [ ] Extrair partes muito grandes de showcases quando uma nova tarefa tocar
  nelas.
- [ ] Adicionar CI quando o fluxo de validacao estabilizar.
- [x] Adicionar Playwright ou fluxo E2E quando as telas estiverem estaveis.

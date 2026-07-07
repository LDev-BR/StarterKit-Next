# Roadmap

Este roadmap orienta agentes sobre prioridade e limites. Ele nao autoriza
implementar fases futuras sem pedido explicito do usuario.

## Fase atual: validacao frontend

Objetivo: validar a experiencia SaaS do starter kit como base visual e tecnica
para futuros produtos.

Trabalho permitido:

- Ajustar responsividade em mobile, tablet e desktop.
- Refinar landing, auth mock, dashboard, projetos, billing e settings.
- Melhorar componentes base.
- Corrigir acessibilidade e estados de UI.
- Aumentar cobertura Vitest onde houver logica.
- Melhorar contratos mockados sem criar backend real.
- Documentar arquitetura, padroes e checklist.

Nao fazer nesta fase sem pedido explicito:

- Backend real.
- PostgreSQL real.
- Railway CD.
- Monorepo.
- Integracao real de pagamento.
- Auth real.

## Fase 1: fechamento da validacao frontend

Criterio de saida:

- Fluxos principais funcionam sem erro em mobile e desktop.
- Tema claro/escuro consistente.
- Formularios validam e exibem feedback corretamente.
- Estados vazio, loading e erro existem onde fazem sentido.
- `pnpm run lint`, `pnpm run lint:types`, `pnpm test` e `pnpm run build`
  passam.
- Documentacao em `docs/` reflete a arquitetura real.

Entregas recomendadas:

- Testes adicionais para store e formularios criticos.
- Revisao de acessibilidade com teclado.
- Verificacao visual em viewport mobile e desktop.
- Limpeza de textos inconsistentes ou placeholders de demo que prejudiquem o
  starter kit.

Progresso do fechamento enxuto:

- Testes adicionados para store, auth, projetos, settings e overlays.
- Componentes `Modal` e `Dialog` passaram a expor semantica acessivel de
  dialogo.
- Copies de showcase foram ajustadas para deixar claro que backend,
  persistencia, billing e CI reais pertencem a fases futuras.

## Fase 2: desenho do backend e contratos

Objetivo: preparar a troca de mocks por API real sem quebrar o frontend.

Trabalho esperado:

- Definir dominios backend: auth, users, projects, billing, activity logs,
  health/config.
- Definir DTOs, erros padronizados e codigos HTTP.
- Decidir estrategia de auth, sessoes e cookies/tokens.
- Definir OpenAPI ou contrato equivalente.
- Definir estrategia de mocks para testes e desenvolvimento offline.
- Mapear quais partes de `lib/store.ts` continuam client-side e quais migram
  para backend.

Criterio de saida:

- Contratos aceitos antes de implementar servidor.
- Frontend consegue continuar usando uma camada de servico.
- Plano de migracao por dominio esta documentado.

## Fase 3: banco de dados e persistencia

Objetivo: substituir dados mockados por persistencia confiavel.

Trabalho esperado:

- Escolher e configurar ferramenta de migrations.
- Modelar tabelas iniciais.
- Criar seeds para ambiente local.
- Definir indices, constraints e relacoes.
- Definir politica de backups e restore para producao.
- Definir usuario de aplicacao com menor privilegio.

Dominios iniciais provaveis:

- Users.
- Projects.
- Api keys.
- Activity logs.
- Subscription/customer records.

Criterio de saida:

- Migrations reproduziveis.
- Seeds locais documentadas.
- Testes de integracao para consultas principais.
- Nenhum segredo real exposto ao frontend.

## Fase 4: integracoes reais

Objetivo: conectar o starter kit a servicos reais de produto.

Possiveis entregas, apenas sob demanda:

- Auth real.
- Billing real.
- Envio de email.
- Observabilidade.
- Storage.
- Webhooks.
- Jobs agendados.

Cada integracao deve incluir contrato, variaveis de ambiente, tratamento de
erro, logs, testes e entrada no checklist de producao.

## Fase 5: hardening de producao

Objetivo: tornar a aplicacao operavel com seguranca, performance e processo de
release.

Trabalho esperado:

- CI com lint, typecheck, tests e build.
- Revisao de headers, CSP, CORS e cookies.
- Error boundaries e paginas `not-found`/erro quando o roteamento evoluir.
- Monitoramento de erros e web vitals.
- Estrategia de deploy definida.
- Runbook de incidentes.
- Checklist de rollback.
- Auditoria de dependencias.

## Backlog tecnico util

- Adicionar testes para `lib/store.ts`.
- Adicionar testes de formularios para projetos, auth e settings.
- Avaliar se `Sidebar` deve ser removida, reativada ou documentada como opcao
  de layout.
- Extrair partes muito grandes de showcases quando uma nova tarefa tocar nelas.
- Adicionar CI quando o fluxo de validacao estabilizar.
- Adicionar Playwright ou fluxo E2E quando as telas estiverem estaveis.

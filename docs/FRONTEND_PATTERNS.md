# Frontend Patterns

## Identidade visual

Preserve estes sinais visuais:

- Glassmorphism com `glass-effect`.
- Tema claro/escuro controlado por CSS variables e classe `.dark`.
- Microanimacoes com Motion.
- UI SaaS operacional, densa e escaneavel.
- Bordas, cards e overlays discretos.
- Layout responsivo com boa leitura em mobile e desktop.

Evite transformar telas internas em landing pages ou superficies decorativas. O
starter kit deve parecer uma base de produto real.

A landing publica deve ser produto-first e enxuta: hero, copy, CTAs e secoes
de conteudo. Nao reintroduza previews decorativos pesados no primeiro viewport
quando eles competirem com leitura ou responsividade.

## Tokens e CSS

`app/globals.css` define tokens via CSS variables:

- `--background`
- `--foreground`
- `--card`
- `--card-foreground`
- `--primary`
- `--primary-foreground`
- `--muted`
- `--muted-foreground`
- `--border`

Use classes Tailwind baseadas nesses tokens (`bg-background`, `text-foreground`,
`bg-card`, `border-border`) antes de introduzir cores soltas.

Cores customizadas podem existir para status e acentos, mas nao devem dominar a
paleta inteira.

## Componentes base

Componentes reutilizaveis ficam em `components/ui/`:

- `Button`: variantes `default`, `outline`, `secondary`, `ghost`, `glass` e
  tamanhos `default`, `sm`, `lg`, `icon`.
- `Card`: container visual com suporte a hover e glass.
- `Input`: label, helper, erro e icone.
- `PageHeader`: cabecalho reutilizavel para telas internas, com `eyebrow`,
  titulo, descricao, icone e area de acoes.
- `SegmentedControl`: grupos de botoes segmentados tipados, com `aria-pressed`
  e nome acessivel por `ariaLabel`.
- `MetricCard`: cards de metricas com tom visual, icone, descricao, progresso
  acessivel e rodape.
- `ResponsiveDataView`: contrato unico para tabela desktop e cards mobile.
- `Modal` e `Dialog`: overlays animados.
- `EmptyState`, `ErrorState`, `Skeleton`, `Spinner`: estados padrao.

Antes de criar um novo componente, verifique se uma composicao desses resolve.
Se criar componente novo, mantenha API tipada, props pequenas e classe
customizavel com `className`.

Para listas tabulares, prefira `ResponsiveDataView` em vez de `overflow-x-auto`
isolado. A tabela desktop deve manter cabecalhos semanticos e o mobile deve
receber um `renderMobileCard` especifico do dominio.

## Formularios

Padrao atual:

- `react-hook-form` para estado.
- `zod` para schema.
- `@hookform/resolvers/zod` para integrar validacao.
- `z.input<typeof schema>` quando inputs sofrem coercao.
- `z.output<typeof schema>` para dados validados.

Mantenha mensagens de erro claras e em portugues. Para campos numericos, prefira
`z.coerce.number()` quando o input HTML entregar string.

## Estado e notificacoes

Fluxos de produto usam `useAppStore` para estado global. Ao adicionar um evento
que o usuario deve perceber, use `addNotification` e, se relevante, `addLog`.

Nao duplique estado global em estado local se ele precisa aparecer em mais de
uma aba. Use estado local apenas para UI efemera: dropdown aberto, loading local,
filtro visual ou modal.

## Responsividade

Padroes atuais:

- `Header` fixo/sticky no topo.
- Navegacao desktop dentro do `Header` a partir de `xl`, alimentada por
  `config/navigation.ts`.
- Bottom nav mobile/tablet em `app/page.tsx` ate antes de `xl`, com
  `safe-area-inset-bottom`.
- Conteudo central em `MainContent` com `max-w-7xl`, paddings responsivos e
  `overflow-x-hidden`.
- Drawers/menus mobile usam `AnimatePresence`.
- A `Sidebar` existe como variante opcional documentada, mas nao e montada por
  padrao.
- O menu do avatar deve ficar restrito a conta, atalhos, ajuda e logout. O
  toggle de tema pertence a settings ou a superficies publicas, nao ao menu do
  usuario autenticado.

Antes de finalizar qualquer UI, confira:

- Textos longos nao estouram containers.
- Cards e tabelas continuam legiveis em mobile.
- Botoes mantem area de toque adequada.
- Overlays nao conflitam com bottom nav.
- Tema claro e escuro continuam coerentes.
- Smoke Playwright passa nos viewports 320, 375, 768, 1024, 1365 e 1536px
  quando a mudanca toca fluxos principais.

Use `.break-anywhere` para tokens, emails, chaves, URLs e nomes dinamicos que
podem exceder o container. Use `.text-balance-safe` apenas em titulos curtos.

## Animacoes

Use os presets de `components/animations/motion-presets.tsx` quando possivel:

- `FadeIn`.
- `SlideIn`.
- `ScaleIn`.
- `PageTransition`.

Esses wrappers respeitam `useReducedMotion`. Evite animacoes novas que ignorem
preferencias de movimento reduzido.

## Acessibilidade

Minimo esperado:

- Botoes com texto acessivel ou `aria-label`.
- Inputs com `label`/`htmlFor` ou nome acessivel equivalente.
- Erros de formulario conectados por `aria-describedby`.
- Campos customizados, como `textarea`, `checkbox`, `select` e range, tambem
  devem expor estado acessivel quando houver erro ou funcao nao obvia.
- Dialogs e modais fecham por Escape quando aplicavel.
- Dialogs e modais devem expor `role="dialog"`, `aria-modal`, nome e descricao
  acessiveis.
- Contraste aceitavel nos temas claro e escuro.
- Navegacao por teclado nao fica bloqueada.
- Foco visivel nao deve ficar coberto por header sticky, bottom nav ou drawers.
- Controles segmentados devem usar `aria-pressed`; navegacao ativa deve usar
  `aria-current="page"` quando aplicavel.

Se a tarefa alterar componentes base, valide com Testing Library usando queries
por role/texto acessivel.

Quando a tarefa alterar navegacao, landing, auth mock, projetos, billing ou
settings, rode tambem `pnpm run test:e2e` para cobrir o smoke responsivo em
Chromium.

## Padrao para novas telas de showcase

Uma nova area de showcase deve ter:

1. Pasta em `features/showcase/<dominio>/`.
2. Componente principal nomeado.
3. Estado local apenas para interacoes da tela.
4. Contratos ou estado compartilhado em `types/`, `services/` ou `lib/store.ts`.
5. Entrada explicita em `app/page.tsx` e no menu, se realmente for uma aba.
6. Teste focado se houver logica de formulario, filtro ou estado.

Nao crie rota nova para uma aba de showcase sem necessidade. O padrao atual e
single route com tabs.

## Anti-padroes

- Adicionar dependencia para resolver classe CSS simples.
- Criar outro sistema de tema.
- Usar `any` para contornar tipagem.
- Usar `title` como unico nome acessivel de botoes icon-only.
- Colocar regras de negocio complexas direto em JSX grande.
- Misturar backend real com mocks sem preservar contrato.
- Recriar componentes ja presentes em `components/ui/`.
- Remover microanimacoes ou glassmorphism sem motivo explicito.

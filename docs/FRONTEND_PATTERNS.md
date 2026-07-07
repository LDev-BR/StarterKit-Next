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
- `Modal` e `Dialog`: overlays animados.
- `EmptyState`, `ErrorState`, `Skeleton`, `Spinner`: estados padrao.

Antes de criar um novo componente, verifique se uma composicao desses resolve.
Se criar componente novo, mantenha API tipada, props pequenas e classe
customizavel com `className`.

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
- Navegacao desktop dentro do `Header`.
- Bottom nav mobile em `app/page.tsx`.
- Conteudo central em `MainContent` com `max-w-7xl`, paddings responsivos e
  `overflow-x-hidden`.
- Drawers/menus mobile usam `AnimatePresence`.

Antes de finalizar qualquer UI, confira:

- Textos longos nao estouram containers.
- Cards e tabelas continuam legiveis em mobile.
- Botoes mantem area de toque adequada.
- Overlays nao conflitam com bottom nav.
- Tema claro e escuro continuam coerentes.

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

Se a tarefa alterar componentes base, valide com Testing Library usando queries
por role/texto acessivel.

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

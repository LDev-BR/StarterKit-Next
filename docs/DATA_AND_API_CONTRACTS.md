# Data and API Contracts

## Estado atual

O projeto ainda usa dados simulados em duas camadas:

- `lib/store.ts`: estado interativo da aplicacao.
- `services/mock-service.ts`: respostas assincronas para o contrato
  `IApiService`.

Nao ha persistencia real no PostgreSQL do Docker Compose. O container de banco
existe como preparacao de ambiente, mas ainda nao e fonte de dados do app.

Na fase Full Stack Foundation, esses mocks devem ser migrados por dominio para
uma API NestJS com DTOs, Prisma e PostgreSQL.

## Principios de migracao

- Preserve o frontend validado durante a migracao.
- Migre um dominio por vez.
- Defina contrato antes de implementar endpoint.
- Mantenha mocks enquanto forem uteis para testes e desenvolvimento offline.
- Nao misture dados reais e mockados na mesma lista sem indicar a origem.
- Nao acesse banco diretamente do frontend.
- Nao exponha `DATABASE_URL`, tokens, service keys ou segredos em
  `NEXT_PUBLIC_*`.
- Valide entrada no servidor mesmo quando o frontend ja usa Zod.

## Store Zustand atual

`useAppStore` e a fonte principal para os fluxos visuais atuais.

### Auth mock

```ts
interface AuthUser {
  email: string;
  name: string;
  role: string;
  token: string;
}
```

Responsabilidades atuais:

- Controlar `user`.
- Alternar `authView` entre `landing`, `login` e `register`.
- Simular login/logout.
- Atualizar perfil.
- Gerar logs de autenticacao.

O token atual e fake e nao deve ser usado como seguranca real.

### Projetos

```ts
interface Project {
  id: string;
  projectName: string;
  projectDescription: string;
  contactEmail: string;
  billingPlan: 'startup' | 'enterprise' | 'custom';
  allocatedBudget: number;
  createdAt: string;
}
```

Responsabilidades atuais:

- Listar projetos seedados.
- Adicionar projeto validado pelo formulario.
- Remover projeto.
- Registrar log e notificacao quando aplicavel.

### Configuracao operacional

```ts
interface AppConfig {
  apiEndpoint: string;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  mockLatency: number;
  simulateDbFailure: boolean;
}
```

`simulateDbFailure` afeta a experiencia visual de saude do sistema. Nao e uma
falha real de banco.

### API keys

```ts
interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}
```

As chaves atuais sao demonstrativas e usam prefixo `sk_mock_`. Nunca trate esses
valores como segredo real nem copie esse padrao para producao.

### Assinatura e uso

O store mantem:

- `subscription`: `free`, `pro` ou `enterprise`.
- `apiUsage`.
- `dbUsage`.

Billing atual e apenas UI mockada. Integracao real de pagamento pertence a uma
fase futura e deve passar por contrato, webhook, seguranca e testes.

## Contrato `IApiService` atual

`services/api-client.ts` define:

```ts
export interface IApiService {
  getDashboardStats(): Promise<DashboardStats>;
  getActivityLogs(): Promise<ActivityLog[]>;
  getSystemHealth(): Promise<SystemHealth>;
  submitForm(data: Record<string, unknown>): Promise<{ success: boolean; id: string }>;
}
```

Tipos compartilhados ficam em `types/index.ts`:

- `User`.
- `DashboardStats`.
- `ActivityLog`.
- `SystemHealth`.

`mockDashboardService` implementa o contrato com delays artificiais. A
implementacao real (`RealApiService`) existe como ponto de extensao e usa
`SYSTEM_CONFIG.api.baseUrl`.

## Contratos alvo

Antes de implementar endpoints reais, cada dominio deve definir:

- DTOs de request.
- DTOs de response.
- Codigos HTTP esperados.
- Formato de erro.
- Regras de autorizacao.
- Eventos/logs gerados.
- Estrategia de mock ou fixture para testes.

Exemplo de formato de erro alvo:

```ts
interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
}
```

Use codigos estaveis, como `PROJECT_NOT_FOUND`, `VALIDATION_ERROR` e
`UNAUTHORIZED`, em vez de depender apenas de texto.

## API NestJS alvo

A API deve ser organizada por modulos de dominio. Ordem recomendada:

1. `health`: endpoint simples para validar runtime e banco.
2. `auth`: sessao, login/logout e guards.
3. `users`: perfil e preferencias.
4. `projects`: CRUD e regras atuais de projetos.
5. `activity`: logs/auditoria.
6. `billing`: plano e uso, sem pagamento real ate fase especifica.

Cada modulo deve conter, quando aplicavel:

- Controller HTTP.
- Service de dominio.
- DTOs.
- Testes unitarios.
- Tratamento de erro.
- Integração com Prisma atras de uma fronteira clara.

## Prisma e PostgreSQL alvo

Prisma deve ser a fonte de schema e migrations. Regras:

- Versione migrations.
- Rode `prisma generate` quando o schema mudar.
- Use seeds locais apenas com dados fake.
- Revise indices e constraints junto com o modelo.
- Nunca use `Math.random()` para IDs ou tokens reais.
- Nunca persista segredo de API key em texto aberto sem decisao de seguranca.

Dominios provaveis de dados:

- Users.
- Sessions ou auth accounts, dependendo da estrategia final.
- Projects.
- Api keys ou tokens de acesso.
- Activity logs.
- Subscription/customer records.

## Variaveis de ambiente

`.env.example` define hoje:

```env
APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
POSTGRES_USER="starterkit"
POSTGRES_PASSWORD="starterkit"
POSTGRES_DB="starterkit"
DATABASE_URL="postgresql://starterkit:starterkit@database:5432/starterkit?schema=public"
```

`NEXT_PUBLIC_API_URL` pode ser exposto ao browser. `DATABASE_URL`,
`POSTGRES_PASSWORD`, JWT secrets, API secrets e service keys nunca devem usar
prefixo `NEXT_PUBLIC_*`.

Quando NestJS existir, documente tambem:

- `API_PORT`.
- `API_BASE_URL` ou equivalente.
- `DATABASE_URL`.
- segredo de sessao/JWT quando auth real existir.
- URLs publicas e privadas por ambiente Railway.

## Caminho recomendado por dominio

Para migrar um dominio de mock para backend real:

1. Congelar comportamento atual com testes.
2. Definir DTOs de request/response.
3. Definir schema Prisma e migration.
4. Criar service NestJS com regras de dominio.
5. Criar controller HTTP.
6. Adicionar testes de service/controller.
7. Atualizar cliente frontend preservando fallback quando util.
8. Remover ou reduzir mock apenas depois da validacao.
9. Atualizar docs, roadmap e checklist.

## Railway e banco

Em producao, PostgreSQL deve ser um servico separado no Railway. A aplicacao deve
consumir `DATABASE_URL` por variavel de ambiente. Migrations Prisma devem rodar
como comando explicito de deploy/pre-deploy quando a fase de deploy estiver
implementada.

Nao coloque o banco dentro do mesmo container da aplicacao em producao.

## Regras para agentes

- Preserve `IApiService` ou documente a substituicao antes de trocar chamadas.
- Nao acople componentes diretamente a `fetch` se o dominio ja passa por
  contrato de servico.
- Nao misture dados fake e dados reais sem indicacao clara.
- Nao use token mock como base de auth real.
- Nao persista segredo de API key no frontend.
- Nao adicione ORM, migrations ou schema DB sem tarefa explicita e plano de
  validacao.

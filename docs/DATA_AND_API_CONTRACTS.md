# Data and API Contracts

## Estado atual

O projeto esta em modo frontend validation. Dados sao simulados em duas camadas:

- `lib/store.ts`: estado interativo da aplicacao.
- `services/mock-service.ts`: respostas assincronas para o contrato `IApiService`.

Nao ha persistencia real no PostgreSQL do Docker Compose. O container de banco
existe como preparacao de ambiente, mas ainda nao e fonte de dados do app.

## Store Zustand

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

Responsabilidades:

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

Responsabilidades:

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

As chaves atuais sao demonstrativas. Nunca trate esses valores como segredo real
nem copie esse padrao para producao.

### Assinatura e uso

O store mantem:

- `subscription`: `free`, `pro` ou `enterprise`.
- `apiUsage`.
- `dbUsage`.

Billing atual e apenas UI mockada. Integracao real de pagamento pertence a uma
fase futura e deve passar por contrato, webhook, seguranca e testes.

## Contrato `IApiService`

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
implementacao real (`RealApiService`) ja existe como ponto de extensao e usa
`SYSTEM_CONFIG.api.baseUrl`.

## Variaveis de ambiente

`.env.example` define:

```env
APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
POSTGRES_USER="starterkit"
POSTGRES_PASSWORD="starterkit"
POSTGRES_DB="starterkit"
DATABASE_URL="postgresql://starterkit:starterkit@database:5432/starterkit?schema=public"
```

`NEXT_PUBLIC_API_URL` pode ser exposto ao browser. Nao coloque segredo em
variavel `NEXT_PUBLIC_*`.

## Caminho para backend real

Quando o usuario pedir backend/banco real, siga esta ordem:

1. Congelar contratos atuais com testes.
2. Definir DTOs de request/response baseados em `IApiService` e nos schemas Zod.
3. Criar camada de erro padronizada para API real.
4. Implementar auth real sem reutilizar token mock.
5. Trocar `isMockEnabled` por configuracao segura de ambiente.
6. Migrar cada dominio separadamente: auth, dashboard, projetos, settings,
   billing.
7. Introduzir persistencia PostgreSQL com migrations e seeds.
8. Manter mocks para testes e desenvolvimento offline.
9. Atualizar `PRODUCTION_CHECKLIST.md` e `ROADMAP.md`.

## Regras para agentes

- Preserve `IApiService` enquanto migrar dados.
- Nao acople componentes diretamente a `fetch` se o dominio ja passa pelo
  contrato de servico.
- Nao misture dados fake e dados reais na mesma lista sem indicacao clara.
- Nao use `Math.random()` para IDs ou tokens reais em producao.
- Nao persista segredo de API key no frontend.
- Nao adicione ORM, migrations ou schema DB sem pedido explicito.

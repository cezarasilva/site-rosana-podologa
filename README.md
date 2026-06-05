# Podóloga Rosana Oliveira — Site + Sistema de Agendamento

Sistema completo de agendamento online para a Podóloga Rosana Oliveira.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Supabase · Google Calendar API

---

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [Google Cloud](https://console.cloud.google.com)
- Conta na [Vercel](https://vercel.com)
- Conta no [GitHub](https://github.com)

---

## 1. Configurar o Supabase

### 1.1 Criar projeto

1. Acesse [supabase.com](https://supabase.com) e clique em **New project**
2. Escolha um nome (ex: `rosana-podologa`) e defina uma senha forte para o banco
3. Selecione a região **South America (São Paulo)**
4. Clique em **Create new project** e aguarde

### 1.2 Copiar as chaves

1. No menu lateral, vá em **Settings → API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ *nunca exponha no front-end*

### 1.3 Rodar o schema SQL

1. No menu lateral, vá em **SQL Editor**
2. Clique em **New query**
3. Cole o conteúdo de `supabase/schema.sql`
4. Clique em **Run** (ícone de play)
5. Aguarde a mensagem de sucesso

### 1.4 Rodar as políticas RLS

1. Ainda no SQL Editor, abra uma nova query
2. Cole o conteúdo de `supabase/rls.sql`
3. Clique em **Run**

### 1.5 Ativar autenticação

1. Vá em **Authentication → Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Auth Settings**, desative "Confirm email" para facilitar o teste (reative em produção)

### 1.6 Criar usuário admin para a Rosana

1. Vá em **Authentication → Users**
2. Clique em **Add user → Create new user**
3. Informe:
   - **Email:** `rosana@podologarosana.com.br` (ou o e-mail desejado)
   - **Password:** uma senha forte
4. Clique em **Create user**

### 1.7 Verificar tabelas

1. Vá em **Table Editor**
2. Confirme que as seguintes tabelas foram criadas:
   - `usuarios`, `clientes`, `servicos`, `agendamentos`
   - `horarios_atendimento`, `bloqueios_agenda`, `mensagens_modelo`
   - `google_integracoes`, `configuracoes_clinica`, `logs_auditoria`

### 1.8 Configurar `.env.local`

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 2. Configurar Google Calendar

### 2.1 Criar projeto no Google Cloud

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Clique no seletor de projetos → **New Project**
3. Nome: `Rosana Podologa` → **Create**

### 2.2 Ativar Google Calendar API

1. No menu lateral, vá em **APIs & Services → Library**
2. Pesquise **Google Calendar API**
3. Clique em **Enable**

### 2.3 Configurar OAuth consent screen

1. Vá em **APIs & Services → OAuth consent screen**
2. Selecione **External** → **Create**
3. Preencha:
   - **App name:** Rosana Podologa
   - **User support email:** seu e-mail
   - **Developer contact:** seu e-mail
4. Clique em **Save and Continue** em todas as etapas
5. Em **Test users**, adicione o e-mail da Rosana

### 2.4 Criar OAuth Client ID

1. Vá em **APIs & Services → Credentials**
2. Clique em **+ Create Credentials → OAuth client ID**
3. **Application type:** Web application
4. **Name:** Rosana Podologa
5. Em **Authorized redirect URIs**, adicione:
   - Local: `http://localhost:3000/api/google/callback`
   - Produção: `https://SEU-DOMINIO.vercel.app/api/google/callback`
6. Clique em **Create**
7. Copie o **Client ID** e o **Client Secret**

### 2.5 Preencher `.env.local`

```env
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
```

### 2.6 Conectar o Google Calendar no painel admin

1. Faça login no painel admin (`/admin/login`)
2. Vá em **Configurações**
3. Clique em **Conectar Google Calendar**
4. Autorize com a conta Google da Rosana
5. Retornará ao painel com confirmação de conexão

---

## 3. GitHub — Versionar o projeto

### 3.1 Criar repositório

1. Acesse [github.com](https://github.com) → **New repository**
2. Nome: `site-rosana-podologa`
3. Visibilidade: **Private** (recomendado)
4. Clique em **Create repository**

### 3.2 Enviar o código

No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "primeira versão sistema podologia"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/site-rosana-podologa.git
git push -u origin main
```

---

## 4. Deploy na Vercel

### 4.1 Importar projeto

1. Acesse [vercel.com](https://vercel.com) → **Add New → Project**
2. Selecione **Import Git Repository**
3. Conecte o GitHub e escolha `site-rosana-podologa`
4. Framework: **Next.js** (detectado automaticamente)

### 4.2 Configurar variáveis de ambiente

Na tela de deploy, expanda **Environment Variables** e adicione:

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key |
| `GOOGLE_CLIENT_ID` | Client ID do Google |
| `GOOGLE_CLIENT_SECRET` | Client Secret |
| `GOOGLE_REDIRECT_URI` | `https://SEU-DOMINIO.vercel.app/api/google/callback` |
| `NEXT_PUBLIC_APP_URL` | `https://SEU-DOMINIO.vercel.app` |
| `APP_URL` | `https://SEU-DOMINIO.vercel.app` |

### 4.3 Fazer deploy

1. Clique em **Deploy**
2. Aguarde o build completar (2-3 minutos)
3. Copie a URL gerada (ex: `https://site-rosana-podologa.vercel.app`)

### 4.4 Atualizar redirect URI no Google Cloud

1. Volte em **Google Cloud → Credentials → seu OAuth client**
2. Em **Authorized redirect URIs**, adicione:
   - `https://site-rosana-podologa.vercel.app/api/google/callback`
3. Salve

### 4.5 Atualizar variáveis na Vercel

1. Vá em **Settings → Environment Variables**
2. Atualize `GOOGLE_REDIRECT_URI` e `NEXT_PUBLIC_APP_URL` com a URL final
3. Faça **Redeploy** para aplicar

---

## 5. Rodar localmente

```bash
npm install
cp .env.example .env.local
# preencha o .env.local com suas chaves
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)
Painel admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 6. Testes pós-deploy

| Teste | Caminho |
|-------|---------|
| Site público abre | `/` |
| Serviços carregam | `/servicos` |
| Agendamento funciona | `/agendar` |
| Login admin | `/admin/login` |
| Agenda do painel | `/admin/agenda` |
| Google Calendar conecta | `/admin/configuracoes` |

---

## Estrutura de pastas

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home
│   ├── servicos/          # Página de serviços
│   ├── agendar/           # Agendamento público
│   ├── quem-somos/        # Sobre a podóloga
│   ├── contato/           # Contato e mapa
│   ├── admin/             # Painel administrativo
│   └── api/               # Rotas de API
├── components/
│   ├── public/            # Header, Footer, Hero, etc
│   ├── admin/             # Sidebar, cards, formulários
│   └── ui/                # Botões, badges
├── lib/
│   ├── supabase/          # Client browser + server
│   ├── google/            # OAuth + Calendar
│   ├── whatsapp/          # Geração de links
│   └── utils/             # Formatadores
├── types/                 # TypeScript interfaces
└── middleware.ts          # Proteção das rotas /admin
supabase/
├── schema.sql             # Estrutura do banco
└── rls.sql               # Políticas de segurança
```

---

## Segurança

- `SUPABASE_SERVICE_ROLE_KEY` é usada **apenas no servidor** (API routes)
- Tokens do Google Calendar são armazenados no Supabase com RLS `using (false)` — inacessíveis pelo front-end
- Rotas `/admin/*` protegidas por middleware via sessão Supabase
- Variáveis `NEXT_PUBLIC_*` podem ir ao navegador — não coloque secrets nelas

create extension if not exists "pgcrypto";

create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  perfil text not null default 'ADMIN',
  ativo boolean not null default true,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  email text,
  data_nascimento date,
  observacoes text,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists public.servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  preco numeric(10,2) not null default 0,
  duracao_minutos integer not null default 60,
  ativo boolean not null default true,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete restrict,
  servico_id uuid not null references public.servicos(id) on delete restrict,
  data_inicio timestamptz not null,
  data_fim timestamptz not null,
  status text not null default 'AGENDADO',
  valor numeric(10,2) not null default 0,
  observacao_cliente text,
  observacao_interna text,
  google_event_id text,
  criado_por text default 'CLIENTE',
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now(),
  constraint agendamentos_status_check check (
    status in ('AGENDADO', 'CONFIRMADO', 'REMARCADO', 'CANCELADO', 'CONCLUIDO', 'NAO_COMPARECEU')
  )
);

create table if not exists public.horarios_atendimento (
  id uuid primary key default gen_random_uuid(),
  dia_semana integer not null,
  hora_inicio time not null,
  hora_fim time not null,
  intervalo_minutos integer not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz default now(),
  constraint dia_semana_check check (dia_semana between 0 and 6)
);

create table if not exists public.bloqueios_agenda (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  data_inicio timestamptz not null,
  data_fim timestamptz not null,
  motivo text,
  criado_em timestamptz default now()
);

create table if not exists public.mensagens_modelo (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  mensagem text not null,
  ativo boolean not null default true,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists public.google_integracoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete cascade,
  google_email text,
  access_token text,
  refresh_token text,
  token_expira_em timestamptz,
  calendar_id text default 'primary',
  ativo boolean not null default true,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists public.configuracoes_clinica (
  id uuid primary key default gen_random_uuid(),
  nome_comercial text not null default 'Podóloga Rosana Oliveira',
  telefone text not null default '41999417269',
  whatsapp text not null default '5541999417269',
  endereco text not null default 'R. Etelvina Pímentel Rodrigues, 143 - Ipê, São José dos Pinhais - PR, 83055-180',
  google_maps_url text,
  avaliacao_google numeric(2,1) default 5.0,
  total_avaliacoes integer default 12,
  atualizado_em timestamptz default now()
);

create table if not exists public.logs_auditoria (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id),
  acao text not null,
  entidade text,
  entidade_id uuid,
  dados jsonb,
  criado_em timestamptz default now()
);

create index if not exists idx_clientes_telefone on public.clientes(telefone);
create index if not exists idx_agendamentos_data_inicio on public.agendamentos(data_inicio);
create index if not exists idx_agendamentos_status on public.agendamentos(status);
create index if not exists idx_agendamentos_cliente_id on public.agendamentos(cliente_id);
create index if not exists idx_agendamentos_servico_id on public.agendamentos(servico_id);

insert into public.servicos (nome, descricao, preco, duracao_minutos, ativo)
values
('Podologia', 'Atendimento especializado em cuidados com os pés.', 80.00, 60, true),
('Podologia + Manicure', 'Atendimento combinado de podologia e manicure.', 120.00, 90, true),
('Avaliação Podológica', 'Avaliação inicial para entender a necessidade do cliente.', 50.00, 30, true),
('Retorno / Manutenção', 'Atendimento de retorno para acompanhamento e manutenção.', 60.00, 45, true)
on conflict do nothing;

insert into public.mensagens_modelo (titulo, mensagem, ativo)
values
('Confirmação de horário', 'Olá {nome}, tudo bem? Seu atendimento com a Rosana está agendado para {data} às {hora}. Qualquer dúvida, é só me chamar.', true),
('Lembrete de atendimento', 'Olá {nome}, passando para lembrar do seu atendimento de {servico} no dia {data} às {hora}.', true),
('Remarcação', 'Olá {nome}, seu atendimento foi remarcado para {data} às {hora}.', true),
('Pós-atendimento', 'Olá {nome}, obrigada pela confiança no atendimento. Qualquer dúvida, fico à disposição.', true)
on conflict do nothing;

insert into public.horarios_atendimento (dia_semana, hora_inicio, hora_fim, intervalo_minutos, ativo)
values
(1, '08:00', '18:00', 0, true),
(2, '08:00', '18:00', 0, true),
(3, '08:00', '18:00', 0, true),
(4, '08:00', '18:00', 0, true),
(5, '08:00', '18:00', 0, true),
(6, '08:00', '12:00', 0, true)
on conflict do nothing;

insert into public.configuracoes_clinica (
  nome_comercial,
  telefone,
  whatsapp,
  endereco,
  google_maps_url,
  avaliacao_google,
  total_avaliacoes
)
values (
  'Podóloga Rosana Oliveira',
  '41999417269',
  '5541999417269',
  'R. Etelvina Pímentel Rodrigues, 143 - Ipê, São José dos Pinhais - PR, 83055-180',
  'https://www.google.com/maps/search/?api=1&query=R.%20Etelvina%20P%C3%ADmentel%20Rodrigues%2C%20143%20-%20Ip%C3%AA%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%20-%20PR',
  5.0,
  12
)
on conflict do nothing;

alter table public.usuarios enable row level security;
alter table public.clientes enable row level security;
alter table public.servicos enable row level security;
alter table public.agendamentos enable row level security;
alter table public.horarios_atendimento enable row level security;
alter table public.bloqueios_agenda enable row level security;
alter table public.mensagens_modelo enable row level security;
alter table public.google_integracoes enable row level security;
alter table public.configuracoes_clinica enable row level security;
alter table public.logs_auditoria enable row level security;

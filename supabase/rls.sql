-- =============================================
-- SERVICOS: visitantes podem ler serviços ativos
-- =============================================
create policy "servicos_leitura_publica"
  on public.servicos for select
  using (ativo = true);

create policy "servicos_admin_full"
  on public.servicos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================
-- CLIENTES: visitantes podem criar, admins veem tudo
-- =============================================
create policy "clientes_inserir_publico"
  on public.clientes for insert
  with check (true);

create policy "clientes_admin_select"
  on public.clientes for select
  using (auth.role() = 'authenticated');

create policy "clientes_admin_update"
  on public.clientes for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================
-- AGENDAMENTOS: visitantes podem criar, admins veem e alteram tudo
-- =============================================
create policy "agendamentos_inserir_publico"
  on public.agendamentos for insert
  with check (true);

create policy "agendamentos_leitura_publica"
  on public.agendamentos for select
  using (true);

create policy "agendamentos_admin_update"
  on public.agendamentos for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "agendamentos_admin_delete"
  on public.agendamentos for delete
  using (auth.role() = 'authenticated');

-- =============================================
-- HORARIOS_ATENDIMENTO: leitura pública para disponibilidade
-- =============================================
create policy "horarios_leitura_publica"
  on public.horarios_atendimento for select
  using (true);

create policy "horarios_admin_full"
  on public.horarios_atendimento for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================
-- BLOQUEIOS_AGENDA: leitura pública para disponibilidade
-- =============================================
create policy "bloqueios_leitura_publica"
  on public.bloqueios_agenda for select
  using (true);

create policy "bloqueios_admin_full"
  on public.bloqueios_agenda for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================
-- MENSAGENS_MODELO: apenas admins
-- =============================================
create policy "mensagens_admin_full"
  on public.mensagens_modelo for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================
-- GOOGLE_INTEGRACOES: nunca exposto no front-end
-- Apenas service_role (server-side) acessa
-- =============================================
create policy "google_integracoes_sem_acesso_publico"
  on public.google_integracoes for all
  using (false);

-- =============================================
-- CONFIGURACOES_CLINICA: leitura pública, escrita apenas admin
-- =============================================
create policy "config_leitura_publica"
  on public.configuracoes_clinica for select
  using (true);

create policy "config_admin_update"
  on public.configuracoes_clinica for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================
-- USUARIOS: apenas o próprio usuário e admins
-- =============================================
create policy "usuarios_admin_full"
  on public.usuarios for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================
-- LOGS_AUDITORIA: apenas admins leem
-- =============================================
create policy "logs_admin_full"
  on public.logs_auditoria for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

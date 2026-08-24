-- Políticas de Row Level Security do OrçaFácil
-- Execute este arquivo no SQL Editor do Supabase.
-- As páginas públicas acessam orçamentos somente pelas funções RPC
-- SECURITY DEFINER já usadas pela aplicação; as tabelas não ficam públicas.

begin;

-- Cada usuário só pode acessar os próprios orçamentos.
alter table public.orcamentos enable row level security;
alter table public.orcamentos force row level security;

drop policy if exists "Usuarios leem os proprios orcamentos" on public.orcamentos;
drop policy if exists "Usuarios criam os proprios orcamentos" on public.orcamentos;
drop policy if exists "Usuarios atualizam os proprios orcamentos" on public.orcamentos;
drop policy if exists "Usuarios excluem os proprios orcamentos" on public.orcamentos;

create policy "Usuarios leem os proprios orcamentos"
on public.orcamentos for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Usuarios criam os proprios orcamentos"
on public.orcamentos for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Usuarios atualizam os proprios orcamentos"
on public.orcamentos for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Usuarios excluem os proprios orcamentos"
on public.orcamentos for delete
to authenticated
using ((select auth.uid()) = user_id);

-- O mesmo isolamento é aplicado aos dados de perfil.
alter table public.perfis enable row level security;
alter table public.perfis force row level security;

drop policy if exists "Usuarios leem o proprio perfil" on public.perfis;
drop policy if exists "Usuarios criam o proprio perfil" on public.perfis;
drop policy if exists "Usuarios atualizam o proprio perfil" on public.perfis;
drop policy if exists "Usuarios excluem o proprio perfil" on public.perfis;

create policy "Usuarios leem o proprio perfil"
on public.perfis for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Usuarios criam o proprio perfil"
on public.perfis for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Usuarios atualizam o proprio perfil"
on public.perfis for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Usuarios excluem o proprio perfil"
on public.perfis for delete
to authenticated
using ((select auth.uid()) = user_id);

-- O formulário de privacidade é público para inserção. Somente a conta
-- administrativa usada pela tela /admin pode consultar e atualizar pedidos.
alter table public.solicitacoes_privacidade enable row level security;
alter table public.solicitacoes_privacidade force row level security;

drop policy if exists "Qualquer pessoa envia solicitacao de privacidade" on public.solicitacoes_privacidade;
drop policy if exists "Admin le solicitacoes de privacidade" on public.solicitacoes_privacidade;
drop policy if exists "Admin atualiza solicitacoes de privacidade" on public.solicitacoes_privacidade;

create policy "Qualquer pessoa envia solicitacao de privacidade"
on public.solicitacoes_privacidade for insert
to anon, authenticated
with check (true);

create policy "Admin le solicitacoes de privacidade"
on public.solicitacoes_privacidade for select
to authenticated
using ((select auth.jwt() ->> 'email') = 'admin@edu.com');

create policy "Admin atualiza solicitacoes de privacidade"
on public.solicitacoes_privacidade for update
to authenticated
using ((select auth.jwt() ->> 'email') = 'admin@edu.com')
with check ((select auth.jwt() ->> 'email') = 'admin@edu.com');

-- Logos são públicas para leitura porque aparecem no PDF e no link enviado ao
-- cliente. Escrita e remoção ficam limitadas à pasta cujo nome é o UUID do dono.
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do update set public = true;

drop policy if exists "Logos tem leitura publica" on storage.objects;
drop policy if exists "Usuario envia logo na propria pasta" on storage.objects;
drop policy if exists "Usuario atualiza logo na propria pasta" on storage.objects;
drop policy if exists "Usuario remove logo da propria pasta" on storage.objects;

create policy "Logos tem leitura publica"
on storage.objects for select
to public
using (bucket_id = 'logos');

create policy "Usuario envia logo na propria pasta"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'logos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Usuario atualiza logo na propria pasta"
on storage.objects for update
to authenticated
using (
  bucket_id = 'logos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'logos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Usuario remove logo da propria pasta"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'logos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

commit;

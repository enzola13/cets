-- ==============================================================================
-- CETS - Centro de Ensino Técnico em Saúde
-- Script de Configuração do Banco de Dados no Supabase Auth & Perfis
-- ==============================================================================
-- Instruções:
-- 1. Acesse o painel do seu projeto no Supabase (https://supabase.com/dashboard)
-- 2. No menu lateral, clique em "SQL Editor"
-- 3. Clique em "+ New query", cole todo este arquivo e clique em "RUN"
-- ==============================================================================

-- 1. Criar a tabela de Perfis de Usuários vinculada ao auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'aluno' CHECK (role IN ('aluno', 'professor', 'admin')),
  enrollment TEXT,
  phone TEXT,
  avatar_url TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- 2. Habilitar Segurança por Linha (Row Level Security - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso (RLS Policies)
-- Permite leitura de perfis por usuários autenticados
CREATE POLICY "Permitir leitura de perfis para autenticados" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Permite que o próprio usuário crie/atualize seu perfil
CREATE POLICY "Permitir inserção do próprio perfil" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Permitir atualização do próprio perfil" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- 4. Função e Trigger para criação automática de perfil ao cadastrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, enrollment, phone, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'aluno'),
    COALESCE(NEW.raw_user_meta_data->>'enrollment', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/initials/svg?seed=' || encode(split_part(NEW.email, '@', 1)::bytea, 'hex'))
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    enrollment = EXCLUDED.enrollment,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove o trigger se já existir para recriação limpa
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Fim do script de configuração
-- ==============================================================================

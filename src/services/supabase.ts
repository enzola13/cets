import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, UserRole } from '../types.ts';

// Read Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Check if credentials are properly provided
export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('your-project')
  );
};

// Initialize the Supabase client if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  enrollment?: string;
  phone?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Sign in with email and password using Supabase Auth.
 */
export async function supabaseSignIn({ email, password }: SignInParams) {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente do Netlify ou no arquivo .env.'
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Translate common Supabase Auth errors into user-friendly Portuguese messages
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('E-mail ou senha incorretos. Por favor, tente novamente.');
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.');
    }
    throw new Error(error.message);
  }

  return data;
}

/**
 * Sign up a new user with Supabase Auth and save profile metadata.
 */
export async function supabaseSignUp({
  email,
  password,
  name,
  role,
  enrollment,
  phone,
}: SignUpParams) {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente do Netlify ou no arquivo .env.'
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        enrollment: enrollment || '',
        phone: phone || '',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      },
    },
  });

  if (error) {
    if (error.message.includes('User already registered')) {
      throw new Error('Este e-mail já está cadastrado no sistema.');
    }
    if (error.message.includes('Password should be at least')) {
      throw new Error('A senha deve conter no mínimo 6 caracteres.');
    }
    throw new Error(error.message);
  }

  // Attempt direct upsert to profiles table in case triggers are not setup
  if (data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name,
        role,
        enrollment: enrollment || '',
        phone: phone || '',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Non-fatal if profiles table trigger handled it or table permissions restricted
    }
  }

  return data;
}

/**
 * Sign out from Supabase Auth.
 */
export async function supabaseSignOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao sair do Supabase:', error);
  }
}

/**
 * Send password reset email via Supabase.
 */
export async function supabaseResetPassword(email: string) {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Netlify ou .env.'
    );
  }

  // Uses the current URL as the redirection target after password recovery link click
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}` : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    message: 'Um e-mail com instruções para redefinição de senha foi enviado com sucesso.',
  };
}

/**
 * Update current authenticated user's password.
 */
export async function supabaseUpdatePassword(newPassword: string) {
  if (!supabase) {
    throw new Error('Supabase não configurado.');
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Fetch profile data for a specific user ID from Supabase.
 */
export async function supabaseGetProfile(userId: string): Promise<User | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      username: data.enrollment || data.email,
      name: data.name || data.email,
      email: data.email,
      role: (data.role as UserRole) || 'aluno',
      status: 'active',
      referenceId: data.reference_id,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Update profile data in Supabase.
 */
export async function supabaseUpdateProfile(
  userId: string,
  updates: Partial<User>
) {
  if (!supabase) return null;

  const dbUpdates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.role !== undefined) dbUpdates.role = updates.role;
  if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
  if (updates.referenceId !== undefined) dbUpdates.reference_id = updates.referenceId;

  const { data, error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar perfil no Supabase:', error);
  }

  return data;
}

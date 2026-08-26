import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Teacher, UserRole } from '../types.ts';
import { api } from '../services/api.ts';
import {
  supabase,
  isSupabaseConfigured,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  supabaseResetPassword,
  supabaseUpdatePassword,
  supabaseGetProfile,
  supabaseUpdateProfile,
  SignUpParams,
} from '../services/supabase.ts';

interface AuthContextType {
  user: User | null;
  studentProfile: Student | null;
  teacherProfile: Teacher | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  signup: (params: SignUpParams) => Promise<{ success: boolean; message: string; requiresEmailConfirmation?: boolean }>;
  logout: () => void;
  forgotPassword: (emailOrEnrollment: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (newPassword: string, currentPassword?: string) => Promise<{ success: boolean; message: string }>;
  updateUserSession: (userUpdates: Partial<User>) => void;
  updateStudentProfile: (studentUpdates: Partial<Student>) => void;
  switchUserRole: (role: UserRole, targetId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cets_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabase = isSupabaseConfigured();

  const saveSession = (
    newUser: User,
    newToken: string,
    newStudent?: Student | null,
    newTeacher?: Teacher | null
  ) => {
    setUser(newUser);
    setToken(newToken);
    setStudentProfile(newStudent || null);
    setTeacherProfile(newTeacher || null);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: newUser,
        token: newToken,
        studentProfile: newStudent || null,
        teacherProfile: newTeacher || null,
      })
    );
  };

  const clearSession = () => {
    setUser(null);
    setStudentProfile(null);
    setTeacherProfile(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Helper to build app User object from Supabase Auth User + Profile
  const buildUserFromSupabase = async (supabaseUser: any): Promise<User> => {
    const profile = await supabaseGetProfile(supabaseUser.id);
    const meta = supabaseUser.user_metadata || {};

    const role: UserRole = (profile?.role || meta.role || 'aluno') as UserRole;
    const name: string = profile?.name || meta.name || supabaseUser.email?.split('@')[0] || 'Usuário CETS';
    const enrollment: string = profile?.username || meta.enrollment || '';
    const avatarUrl: string =
      profile?.avatarUrl ||
      meta.avatar_url ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    return {
      id: supabaseUser.id,
      username: enrollment || supabaseUser.email || name,
      name,
      email: supabaseUser.email || '',
      role,
      status: 'active',
      referenceId: profile?.referenceId || meta.referenceId,
      avatarUrl,
      createdAt: supabaseUser.created_at || new Date().toISOString(),
    };
  };

  // Synchronize student/teacher profile from database bootstrap
  const attachRoleProfiles = async (appUser: User) => {
    try {
      const data = await api.getBootstrapData();
      let matchedStudent: Student | null = null;
      let matchedTeacher: Teacher | null = null;

      if (appUser.role === 'aluno') {
        matchedStudent =
          data.students.find(
            (s) =>
              s.userId === appUser.id ||
              s.email.toLowerCase() === appUser.email.toLowerCase() ||
              (appUser.username && s.enrollment.toLowerCase() === appUser.username.toLowerCase())
          ) || null;

        // If no pre-existing student record found, synthesize one based on current account
        if (!matchedStudent) {
          matchedStudent = {
            id: `stu-${appUser.id.substring(0, 8)}`,
            userId: appUser.id,
            enrollment: appUser.username || `CETS${new Date().getFullYear()}099`,
            name: appUser.name,
            cpf: '---.---.---.--',
            birthDate: '2000-01-01',
            phone: '(75) 99999-0000',
            whatsapp: '(75) 99999-0000',
            email: appUser.email,
            address: 'Tucano - BA',
            classId: data.classes[0]?.id || 'cls-1',
            course: 'Técnico em Enfermagem',
            enrollmentDate: new Date().toISOString().split('T')[0],
            academicStatus: 'Ativo',
            avatarUrl: appUser.avatarUrl,
          };
        }
      } else if (appUser.role === 'professor') {
        matchedTeacher =
          data.teachers.find(
            (t) =>
              t.userId === appUser.id ||
              t.email.toLowerCase() === appUser.email.toLowerCase()
          ) || null;

        if (!matchedTeacher) {
          matchedTeacher = {
            id: `tea-${appUser.id.substring(0, 8)}`,
            userId: appUser.id,
            name: appUser.name,
            email: appUser.email,
            phone: '(75) 99999-0000',
            title: 'Docente em Saúde',
            specialty: 'Enfermagem Geral',
            coren: 'COREN-BA 000.000',
            avatarUrl: appUser.avatarUrl,
            status: 'Ativo',
          };
        }
      }

      setStudentProfile(matchedStudent);
      setTeacherProfile(matchedTeacher);
      return { matchedStudent, matchedTeacher };
    } catch {
      return { matchedStudent: null, matchedTeacher: null };
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        if (isSupabase && supabase) {
          // 1. Check active Supabase session
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user && isMounted) {
            const appUser = await buildUserFromSupabase(sessionData.session.user);
            const { matchedStudent, matchedTeacher } = await attachRoleProfiles(appUser);
            saveSession(
              appUser,
              sessionData.session.access_token,
              matchedStudent,
              matchedTeacher
            );
            setIsLoading(false);
            return;
          }
        }

        // 2. Fallback to persisted session in localStorage
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (parsed.user && parsed.token) {
            setUser(parsed.user);
            setStudentProfile(parsed.studentProfile || null);
            setTeacherProfile(parsed.teacherProfile || null);
            setToken(parsed.token);
          }
        }
      } catch (e) {
        console.error('Falha ao inicializar autenticação:', e);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // 3. Listen to Supabase Auth State changes in real-time
    let authListener: { unsubscribe: () => void } | null = null;
    if (isSupabase && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted) return;

          if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')) {
            const appUser = await buildUserFromSupabase(session.user);
            const { matchedStudent, matchedTeacher } = await attachRoleProfiles(appUser);
            saveSession(appUser, session.access_token, matchedStudent, matchedTeacher);
          } else if (event === 'SIGNED_OUT') {
            clearSession();
          }
        }
      );
      authListener = listener.subscription;
    }

    return () => {
      isMounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, [isSupabase]);

  // Login method supporting both Supabase and Local Demo fallback
  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const input = credentials.username.trim();
      const password = credentials.password;

      // Check if credentials match local demo passwords or if it's email vs matrícula
      if (isSupabase && supabase) {
        let emailToUse = input;

        // If user typed a matrícula (e.g. CETS2026001 or admin) instead of an email,
        // lookup email in local bootstrap data or format standard institutional email
        if (!input.includes('@')) {
          try {
            const data = await api.getBootstrapData();
            const matchedUser = data.users.find(
              (u) =>
                u.username.toLowerCase() === input.toLowerCase() ||
                u.id.toLowerCase() === input.toLowerCase()
            );
            if (matchedUser?.email) {
              emailToUse = matchedUser.email;
            }
          } catch {
            // keep input
          }
        }

        try {
          const authRes = await supabaseSignIn({ email: emailToUse, password });
          if (authRes.user) {
            const appUser = await buildUserFromSupabase(authRes.user);
            const { matchedStudent, matchedTeacher } = await attachRoleProfiles(appUser);
            saveSession(
              appUser,
              authRes.session?.access_token || `token-${Date.now()}`,
              matchedStudent,
              matchedTeacher
            );
            return;
          }
        } catch (supabaseErr: any) {
          // If Supabase authentication failed with invalid credentials or connection error,
          // check if user is trying a demo account (e.g. admin / 123)
          console.warn('Tentativa via Supabase:', supabaseErr?.message);
          
          // Try fallback to local demo database if Supabase threw an error and it's a seed account
          try {
            const localRes = await api.login({ username: input, password });
            saveSession(localRes.user, localRes.token, localRes.studentProfile, localRes.teacherProfile);
            return;
          } catch {
            throw supabaseErr;
          }
        }
      }

      // Fallback for offline / demo mode
      const res = await api.login({ username: input, password });
      saveSession(res.user, res.token, res.studentProfile, res.teacherProfile);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up method
  const signup = async (params: SignUpParams) => {
    setIsLoading(true);
    try {
      if (isSupabase && supabase) {
        const data = await supabaseSignUp(params);

        if (data.session && data.user) {
          const appUser = await buildUserFromSupabase(data.user);
          const { matchedStudent, matchedTeacher } = await attachRoleProfiles(appUser);
          saveSession(appUser, data.session.access_token, matchedStudent, matchedTeacher);
          return {
            success: true,
            message: 'Conta criada e autenticada com sucesso!',
            requiresEmailConfirmation: false,
          };
        }

        return {
          success: true,
          message: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.',
          requiresEmailConfirmation: true,
        };
      }

      // Fallback: Create mock user in clientStorage
      const mockUser: User = {
        id: `usr-${Date.now()}`,
        username: params.enrollment || params.email.split('@')[0],
        email: params.email,
        name: params.name,
        role: params.role,
        status: 'active',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(params.name)}`,
        createdAt: new Date().toISOString(),
      };
      saveSession(mockUser, `token-local-${Date.now()}`);
      return {
        success: true,
        message: 'Cadastro local efetuado com sucesso (Modo Demonstração).',
        requiresEmailConfirmation: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = async () => {
    try {
      if (isSupabase && supabase) {
        await supabaseSignOut();
      }
    } catch (e) {
      console.error('Erro no logout do Supabase:', e);
    } finally {
      clearSession();
    }
  };

  // Forgot password method
  const forgotPassword = async (emailOrEnrollment: string) => {
    const input = emailOrEnrollment.trim();
    if (isSupabase && supabase && input.includes('@')) {
      return await supabaseResetPassword(input);
    }
    // Fallback to API mock
    return await api.forgotPassword(input);
  };

  // Change password method
  const changePassword = async (newPassword: string, currentPassword?: string) => {
    if (isSupabase && supabase) {
      await supabaseUpdatePassword(newPassword);
      return { success: true, message: 'Senha atualizada com sucesso no Supabase.' };
    }
    if (!user) throw new Error('Nenhum usuário conectado.');
    await api.changePassword({ userId: user.id, currentPassword, newPassword });
    return { success: true, message: 'Senha alterada com sucesso.' };
  };

  const updateUserSession = (userUpdates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...userUpdates };
    setUser(updated);
    if (token) {
      saveSession(updated, token, studentProfile, teacherProfile);
    }
    if (isSupabase && supabase) {
      supabaseUpdateProfile(user.id, userUpdates);
    }
  };

  const updateStudentProfile = (studentUpdates: Partial<Student>) => {
    if (!studentProfile) return;
    const updated = { ...studentProfile, ...studentUpdates };
    setStudentProfile(updated);
    if (user && token) {
      saveSession(user, token, updated, teacherProfile);
    }
  };

  // Quick switch for testing and preview convenience
  const switchUserRole = async (targetRole: UserRole, targetId?: string) => {
    setIsLoading(true);
    try {
      const data = await api.getBootstrapData();
      if (targetRole === 'admin') {
        const adminUser = data.users.find((u) => u.role === 'admin') || data.users[0];
        saveSession(adminUser, `token-admin-${Date.now()}`, null, null);
      } else if (targetRole === 'aluno') {
        const student = targetId
          ? data.students.find((s) => s.id === targetId || s.userId === targetId)
          : data.students[0];
        const studentUser = data.users.find((u) => u.id === student?.userId || u.referenceId === student?.id) || {
          id: student?.userId || 'usr-student-1',
          username: student?.enrollment || 'CETS2026001',
          name: student?.name || 'Aluno CETS',
          email: student?.email || 'aluno@cetssaude.com.br',
          role: 'aluno' as UserRole,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        };
        saveSession(studentUser, `token-student-${Date.now()}`, student, null);
      } else if (targetRole === 'professor') {
        const teacher = targetId
          ? data.teachers.find((t) => t.id === targetId || t.userId === targetId)
          : data.teachers[0];
        const teacherUser = data.users.find((u) => u.id === teacher?.userId || u.referenceId === teacher?.id) || {
          id: teacher?.userId || 'usr-teacher-1',
          username: teacher?.email?.split('@')[0] || 'professor',
          name: teacher?.name || 'Professora CETS',
          email: teacher?.email || 'professor@cetssaude.com.br',
          role: 'professor' as UserRole,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        };
        saveSession(teacherUser, `token-teacher-${Date.now()}`, null, teacher);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        teacherProfile,
        role: user?.role || null,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        isSupabaseConnected: isSupabase,
        login,
        signup,
        logout,
        forgotPassword,
        changePassword,
        updateUserSession,
        updateStudentProfile,
        switchUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

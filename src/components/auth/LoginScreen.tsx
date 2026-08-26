import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  MapPin,
  UserPlus,
  LogIn,
  Database,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ForgotPasswordModal } from './ForgotPasswordModal.tsx';
import { CetsLogo } from '../common/CetsLogo.tsx';
import { UserRole } from '../../types.ts';

interface LoginScreenProps {
  onBackToLanding?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToLanding }) => {
  const { login, signup, switchUserRole, isSupabaseConnected } = useAuth();
  
  // Auth Mode: 'login' or 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('aluno');
  const [signupEnrollment, setSignupEnrollment] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor, informe seu e-mail ou matrícula e a senha.');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err?.message || 'Falha na autenticação. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Submit
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (signupPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('As senhas não coincidem. Digite novamente.');
      return;
    }

    setLoading(true);

    try {
      const res = await signup({
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        role: signupRole,
        enrollment: signupEnrollment.trim() || undefined,
      });

      setSuccessMessage(res.message);
      if (res.requiresEmailConfirmation) {
        // Clear fields
        setSignupPassword('');
        setSignupConfirmPassword('');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao realizar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login
  const handleDemoLogin = async (role: 'aluno' | 'professor' | 'admin', targetId?: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await switchUserRole(role, targetId);
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar sessão de demonstração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060D24] via-[#0B1B4F] to-[#040817] flex flex-col justify-between text-slate-100 relative overflow-hidden">
      {/* Deep Blue Luminous Ambient Effects */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[32rem] h-[32rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[32rem] h-[32rem] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="p-4 sm:p-6 md:px-12 flex items-center justify-between z-10 border-b border-blue-900/30 bg-[#060D24]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="mr-2 p-2 rounded-xl bg-blue-950/80 hover:bg-blue-900/90 text-cyan-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Voltar ao site da CETS"
            >
              <span>←</span>
              <span className="hidden sm:inline">Site Institucional</span>
            </button>
          )}

          <div className="bg-white/95 rounded-2xl p-1.5 sm:p-2 shadow-lg shadow-blue-900/40 border border-blue-200">
            <CetsLogo variant="badge" size="sm" theme="light" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Supabase Connection Status Badge */}
          <div
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border shadow-inner ${
              isSupabaseConnected
                ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
                : 'bg-blue-950/70 border-blue-500/30 text-cyan-300'
            }`}
            title={
              isSupabaseConnected
                ? 'Supabase Auth Conectado e Operacional'
                : 'Modo Local / Demonstração ativo'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
              }`}
            />
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-semibold">
              {isSupabaseConnected ? 'Supabase Conectado' : 'Modo Demo / Local'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-cyan-300/90 bg-blue-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-500/30 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Ambiente Seguro</span>
            <span className="text-white font-semibold">Técnico em Enfermagem</span>
          </div>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Institutional Pitch & Nursing Highlights */}
          <div className="lg:col-span-7 space-y-6 hidden lg:block pr-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-cyan-300 text-xs font-bold">
              <HeartHandshake className="w-4 h-4 text-cyan-400" />
              <span>Portal Acadêmico Integrado • Tucano - BA</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Excelência na Formação de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-200">
                Profissionais da Saúde
              </span>
              .
            </h2>

            <p className="text-blue-100/80 text-base leading-relaxed">
              Acesso exclusivo para alunos, professores e coordenação pedagógica da CETS em Tucano – BA. Acompanhe notas, frequências em laboratório, grade horária e mensalidades em tempo real.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-blue-950/40 backdrop-blur-md border border-blue-800/40 rounded-2xl p-4 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-cyan-300 flex items-center justify-center mb-2.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Portal do Aluno</h4>
                <p className="text-xs text-blue-200/70 mt-1 leading-normal">
                  Boletim oficial, faltas, estágio supervisionado e pagamentos PIX.
                </p>
              </div>

              <div className="bg-blue-950/40 backdrop-blur-md border border-blue-800/40 rounded-2xl p-4 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-2.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Gestão Pedagógica</h4>
                <p className="text-xs text-blue-200/70 mt-1 leading-normal">
                  Lançamento de notas com auditoria, chamada rápida e relatórios.
                </p>
              </div>
            </div>

            {/* Address Banner */}
            <div className="flex items-center gap-2.5 text-xs text-blue-200/80 pt-2">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Av. Luiz Viana Filho, 404 - Entroncamento, Tucano - BA</span>
            </div>
          </div>

          {/* Right Column: Auth Card (Login / Signup) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-100 relative">
              
              {/* Logo & Header */}
              <div className="text-center mb-5">
                <div className="flex justify-center mb-3">
                  <CetsLogo variant="full" size="md" theme="light" showSlogan={false} />
                </div>
                
                {/* Tabs for Login vs Signup */}
                <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 max-w-xs mx-auto border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" /> Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Criar Conta
                  </button>
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {authMode === 'login' ? 'Acesse seu Portal' : 'Cadastre-se na CETS'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {authMode === 'login'
                    ? 'Digite seu e-mail institucional ou matrícula e senha'
                    : 'Crie sua conta para acessar o ambiente acadêmico'}
                </p>
              </div>

              {/* Alert Feedback Messages */}
              {error && (
                <div className="p-3.5 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span className="leading-snug">{successMessage}</span>
                </div>
              )}

              {/* ===================== LOGIN FORM ===================== */}
              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      E-mail ou Matrícula
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ex: aluno@cetssaude.com.br ou CETS001"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Senha
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        Entrar no Sistema <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ===================== SIGNUP FORM ===================== */
                <form onSubmit={handleSignup} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Ex: Maria Eduarda Silva"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      E-mail *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Perfil *
                      </label>
                      <select
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="aluno">Aluno</option>
                        <option value="professor">Professor / Docente</option>
                        <option value="admin">Secretaria / Direção</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Matrícula (opcional)
                      </label>
                      <input
                        type="text"
                        value={signupEnrollment}
                        onChange={(e) => setSignupEnrollment(e.target.value)}
                        placeholder="Ex: CETS2026099"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Senha * (mín. 6 caracteres)
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        Cadastrar no Sistema <UserPlus className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Fast Demo Access Quick Switcher */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Acesso Rápido para Testes
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Senha demo: 123
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('aluno', 'stu-1')}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-center transition-all group cursor-pointer"
                  >
                    <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-700">
                      Aluno
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono">
                      João (CETS001)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('professor', 'tea-1')}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-center transition-all group cursor-pointer"
                  >
                    <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-700">
                      Professora
                    </span>
                    <span className="block text-[10px] text-slate-500 truncate">
                      Dra. Camila
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-center transition-all group cursor-pointer"
                  >
                    <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-700">
                      Direção
                    </span>
                    <span className="block text-[10px] text-slate-500">Secretaria</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-blue-200/70 border-t border-blue-900/40 bg-[#050A1A]/80 z-10 space-y-1">
        <p className="font-semibold text-blue-100">
          © 2026 CETS – Centro de Ensino Técnico em Saúde.
        </p>
        <p className="text-[11px] text-blue-300/70">
          Av. Luiz Viana Filho, 404 - Entroncamento, Tucano - BA, CEP 48790-000 • Parecer CEE/COREN-BA
        </p>
        <p className="text-[11px] text-cyan-400 font-bold italic">
          "Formação que você precisa, Qualidade que você Merece!"
        </p>
      </footer>

      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

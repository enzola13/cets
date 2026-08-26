import React, { useState } from 'react';
import {
  UserCheck,
  Lock,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  User,
  HeartHandshake,
  AlertCircle,
  Building2,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ForgotPasswordModal } from './ForgotPasswordModal.tsx';
import { CetsLogo } from '../common/CetsLogo.tsx';

interface LoginScreenProps {
  onBackToLanding?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToLanding }) => {
  const { login, switchUserRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor, informe a matrícula/usuário e a senha.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err?.message || 'Falha na autenticação. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'aluno' | 'professor' | 'admin', targetId?: string) => {
    setLoading(true);
    setError(null);
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
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="sm:hidden text-xs text-cyan-300 bg-blue-950/80 px-3 py-1.5 rounded-lg border border-blue-500/30 font-bold"
            >
              Ver Site
            </button>
          )}
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
              Excelência na Formação de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-200">Profissionais da Saúde</span>.
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

          {/* Right Column: Clean Login Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-100 relative">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <CetsLogo variant="full" size="md" theme="light" showSlogan={false} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Acesse sua Conta</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Digite sua matrícula ou usuário institucional
                </p>
              </div>

              {error && (
                <div className="p-3.5 mb-5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Matrícula ou Usuário
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: CETS2026001 ou admin"
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
                      className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
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

              {/* Fast Demo Access Quick Switcher */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Acesso Rápido para Testes
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Senha: 123</span>
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
                    <span className="block text-[10px] text-slate-500">
                      Secretaria
                    </span>
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

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  Calendar,
  CreditCard,
  UserCheck,
  BellRing,
  User,
  Users,
  GraduationCap,
  Layers,
  FileSpreadsheet,
  Settings,
  PlusCircle,
  FileText,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { CetsLogo } from '../common/CetsLogo.tsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, user } = useAuth();

  const alunoNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'disciplinas', label: 'Minhas Disciplinas', icon: BookOpen },
    { id: 'notas', label: 'Minhas Notas', icon: FileCheck2 },
    { id: 'horarios', label: 'Horários de Aula', icon: Calendar },
    { id: 'mensalidades', label: 'Financeiro', icon: CreditCard },
    { id: 'frequencia', label: 'Frequência', icon: UserCheck },
    { id: 'comunicados', label: 'Comunicados', icon: BellRing },
    { id: 'perfil', label: 'Meu Perfil', icon: User },
  ];

  const teacherNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'turmas', label: 'Minhas Turmas', icon: Users },
    { id: 'notas', label: 'Lançar Notas', icon: FileCheck2 },
    { id: 'frequencia', label: 'Frequência', icon: UserCheck },
    { id: 'horarios', label: 'Horários de Aula', icon: Calendar },
    { id: 'comunicados', label: 'Comunicados', icon: BellRing },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Administração' },
    { id: 'alunos', label: 'Alunos', icon: GraduationCap, section: 'Administração' },
    { id: 'turmas', label: 'Turmas', icon: Layers, section: 'Administração' },
    { id: 'financeiro', label: 'Financeiro', icon: CreditCard, section: 'Administração' },
    { id: 'professores', label: 'Professores', icon: Users, section: 'Pedagógico' },
    { id: 'disciplinas', label: 'Disciplinas', icon: BookOpen, section: 'Pedagógico' },
    { id: 'notas', label: 'Lançar Notas', icon: FileCheck2, section: 'Pedagógico' },
    { id: 'frequencia', label: 'Frequência', icon: UserCheck, section: 'Pedagógico' },
    { id: 'horarios', label: 'Horários', icon: Calendar, section: 'Pedagógico' },
    { id: 'comunicados', label: 'Comunicados', icon: BellRing, section: 'Geral' },
    { id: 'relatorios', label: 'Relatórios', icon: FileSpreadsheet, section: 'Geral' },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getRoleLabel = () => {
    if (role === 'admin') return 'Diretor Acadêmico';
    if (role === 'professor') return 'Corpo Docente';
    return 'Estudante Técnico';
  };

  return (
    <aside className="hidden md:flex w-64 bg-[#081232] flex-col h-full shrink-0 border-r border-blue-900/40 select-none shadow-xl">
      {/* Brand Header with Official Logo */}
      <div className="p-4 bg-[#060E28] border-b border-blue-900/40">
        <div className="bg-white/95 rounded-2xl p-2.5 shadow-md border border-blue-200 flex items-center justify-center">
          <CetsLogo variant="horizontal" size="sm" theme="light" showSlogan={false} />
        </div>
        <div className="flex items-center justify-between text-[10px] text-blue-300/80 font-bold uppercase tracking-wider mt-2.5 px-1">
          <span>Tucano - BA</span>
          <span className="text-cyan-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-700/40">Enfermagem</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {role === 'admin' ? (
          <>
            <div className="text-blue-400/70 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5">
              Administração
            </div>
            {adminNavItems
              .filter((i) => i.section === 'Administração')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/30 text-cyan-300 border border-blue-400/40 shadow-sm shadow-blue-900/50'
                        : 'text-blue-200/70 hover:text-white hover:bg-blue-900/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

            <div className="text-blue-400/70 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 mt-3">
              Pedagógico
            </div>
            {adminNavItems
              .filter((i) => i.section === 'Pedagógico')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/30 text-cyan-300 border border-blue-400/40 shadow-sm shadow-blue-900/50'
                        : 'text-blue-200/70 hover:text-white hover:bg-blue-900/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

            <div className="text-blue-400/70 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 mt-3">
              Geral & Relatórios
            </div>
            {adminNavItems
              .filter((i) => i.section === 'Geral')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/30 text-cyan-300 border border-blue-400/40 shadow-sm shadow-blue-900/50'
                        : 'text-blue-200/70 hover:text-white hover:bg-blue-900/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </>
        ) : role === 'professor' ? (
          <>
            <div className="text-blue-400/70 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5">
              Painel Docente
            </div>
            {teacherNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/30 text-cyan-300 border border-blue-400/40 shadow-sm shadow-blue-900/50'
                      : 'text-blue-200/70 hover:text-white hover:bg-blue-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </>
        ) : (
          <>
            <div className="text-blue-400/70 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5">
              Portal do Aluno
            </div>
            {alunoNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/30 text-cyan-300 border border-blue-400/40 shadow-sm shadow-blue-900/50'
                      : 'text-blue-200/70 hover:text-white hover:bg-blue-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </>
        )}

        <div className="pt-3 border-t border-blue-900/40 my-3">
          <button
            onClick={() => setActiveTab('landing')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-xs font-bold cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-cyan-400 hover:text-cyan-200 hover:bg-blue-900/50'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>Site Institucional</span>
          </button>
        </div>
      </nav>

      {/* User Badge in Sidebar */}
      <div className="p-3.5 bg-[#060E28]/80 m-3 rounded-2xl border border-blue-900/50 shadow-inner">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-md shrink-0 text-xs">
            {getInitials(user?.name || 'Admin')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {user?.name || 'Admin CETS'}
            </p>
            <p className="text-[10px] text-cyan-300/80 font-medium truncate">
              {getRoleLabel()}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

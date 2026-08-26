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
    <aside className="hidden md:flex w-64 bg-white flex-col h-full shrink-0 border-r border-slate-200 select-none shadow-xs">
      {/* Brand Header with Official Logo */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200">
        <div className="bg-white rounded-xl p-2.5 shadow-xs border border-slate-200 flex items-center justify-center">
          <CetsLogo variant="horizontal" size="sm" theme="light" showSlogan={false} />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2.5 px-1">
          <span>Tucano - BA</span>
          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Enfermagem</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {role === 'admin' ? (
          <>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5">
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
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 mt-3">
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
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 mt-3">
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
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </>
        ) : role === 'professor' ? (
          <>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5">
              Painel Docente
            </div>
            {teacherNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </>
        ) : (
          <>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5">
              Portal do Aluno
            </div>
            {alunoNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </>
        )}

        <div className="pt-3 border-t border-slate-200 my-3">
          <button
            onClick={() => setActiveTab('landing')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-xs font-bold cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>Site Institucional</span>
          </button>
        </div>
      </nav>

      {/* User Badge in Sidebar */}
      <div className="p-3 bg-slate-50 m-3 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-xs shrink-0 text-xs">
            {getInitials(user?.name || 'Admin')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">
              {user?.name || 'Admin CETS'}
            </p>
            <p className="text-[10px] text-blue-600 font-semibold truncate">
              {getRoleLabel()}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

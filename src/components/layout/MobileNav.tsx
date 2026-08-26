import React, { useState } from 'react';
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
  Menu,
  X,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { CetsLogo } from '../common/CetsLogo.tsx';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  isOpen = false,
  onClose,
}) => {
  const { role } = useAuth();
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);

  const drawerOpen = isOpen || internalDrawerOpen;
  const handleClose = () => {
    setInternalDrawerOpen(false);
    if (onClose) onClose();
  };

  const alunoQuickTabs = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'disciplinas', label: 'Disciplinas', icon: BookOpen },
    { id: 'notas', label: 'Notas', icon: FileCheck2 },
    { id: 'mensalidades', label: 'Financeiro', icon: CreditCard },
  ];

  const teacherQuickTabs = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'turmas', label: 'Turmas', icon: Users },
    { id: 'notas', label: 'Notas', icon: FileCheck2 },
    { id: 'frequencia', label: 'Chamada', icon: UserCheck },
  ];

  const adminQuickTabs = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'alunos', label: 'Alunos', icon: GraduationCap },
    { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
    { id: 'notas', label: 'Notas', icon: FileCheck2 },
  ];

  const fullNavItems = {
    aluno: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'disciplinas', label: 'Minhas Disciplinas', icon: BookOpen },
      { id: 'notas', label: 'Minhas Notas', icon: FileCheck2 },
      { id: 'horarios', label: 'Horários de Aula', icon: Calendar },
      { id: 'mensalidades', label: 'Financeiro', icon: CreditCard },
      { id: 'frequencia', label: 'Frequência', icon: UserCheck },
      { id: 'comunicados', label: 'Comunicados', icon: BellRing },
      { id: 'perfil', label: 'Meu Perfil', icon: User },
    ],
    teacher: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'turmas', label: 'Minhas Turmas', icon: Users },
      { id: 'notas', label: 'Lançar Notas', icon: FileCheck2 },
      { id: 'frequencia', label: 'Frequência', icon: UserCheck },
      { id: 'horarios', label: 'Horários de Aulas', icon: Calendar },
      { id: 'comunicados', label: 'Comunicados', icon: BellRing },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'alunos', label: 'Alunos', icon: GraduationCap },
      { id: 'professores', label: 'Professores', icon: Users },
      { id: 'turmas', label: 'Turmas', icon: Layers },
      { id: 'disciplinas', label: 'Disciplinas', icon: BookOpen },
      { id: 'horarios', label: 'Horários', icon: Calendar },
      { id: 'notas', label: 'Notas e Avaliações', icon: FileCheck2 },
      { id: 'frequencia', label: 'Frequência', icon: UserCheck },
      { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
      { id: 'comunicados', label: 'Comunicados', icon: BellRing },
      { id: 'relatorios', label: 'Relatórios', icon: FileSpreadsheet },
    ],
  }[role === 'admin' ? 'admin' : role === 'professor' ? 'teacher' : 'aluno'];

  const quickTabs =
    role === 'admin'
      ? adminQuickTabs
      : role === 'professor'
      ? teacherQuickTabs
      : alunoQuickTabs;

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#081232]/95 backdrop-blur-lg border-t border-blue-900/50 z-40 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        {quickTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all min-h-[48px] ${
                isActive
                  ? 'text-cyan-300 bg-blue-600/30 font-bold border border-blue-400/40 shadow-xs'
                  : 'text-blue-300/70 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-300 stroke-[2.5]' : 'text-blue-300/60'}`} />
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setInternalDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all min-h-[48px] text-blue-300/70 hover:text-white hover:bg-blue-900/40"
        >
          <Menu className="w-5 h-5 text-blue-300/70" />
          <span className="text-[11px] mt-0.5 font-medium tracking-tight">Mais</span>
        </button>
      </div>

      {/* Slide-over Mobile Drawer for Full Navigation */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          <div className="relative w-80 max-w-[85vw] bg-[#060D24] text-slate-200 h-full shadow-2xl border-r border-blue-900/40 flex flex-col p-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
              <div className="bg-white/95 rounded-2xl p-2 shadow-md">
                <CetsLogo variant="horizontal" size="sm" theme="light" showSlogan={false} />
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-blue-300 hover:text-white hover:bg-blue-900/50 active:bg-blue-800/80 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
              {fullNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      handleClose();
                    }}
                    className={`w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-xl transition-all text-sm font-semibold min-h-[48px] ${
                      isActive
                        ? 'bg-blue-600/30 text-cyan-300 border border-blue-400/40 shadow-xs'
                        : 'text-blue-200/80 hover:text-white hover:bg-blue-900/40'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-blue-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-3 border-t border-blue-900/40">
                <button
                  onClick={() => {
                    setActiveTab('landing');
                    handleClose();
                  }}
                  className="w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-xl transition-all text-sm font-bold text-cyan-300 hover:text-white bg-blue-600/20 border border-blue-500/30"
                >
                  <Globe className="w-5 h-5 shrink-0 text-cyan-400" />
                  <span>Site Institucional CETS</span>
                </button>
              </div>
            </nav>

            <div className="pt-4 border-t border-blue-900/40 text-xs text-blue-300/70 text-center font-medium">
              Centro de Ensino Técnico em Saúde • Tucano - BA
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-40 px-2 py-1.5 shadow-lg flex items-center justify-around">
        {quickTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all min-h-[48px] ${
                isActive
                  ? 'text-blue-700 bg-blue-50 font-bold border border-blue-200 shadow-xs'
                  : 'text-slate-500 hover:text-blue-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setInternalDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all min-h-[48px] text-slate-500 hover:text-blue-700 hover:bg-slate-50"
        >
          <Menu className="w-5 h-5 text-slate-400" />
          <span className="text-[11px] mt-0.5 font-medium tracking-tight">Mais</span>
        </button>
      </div>

      {/* Slide-over Mobile Drawer for Full Navigation */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          <div className="relative w-80 max-w-[85vw] bg-white text-slate-900 h-full shadow-2xl border-r border-slate-200 flex flex-col p-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="bg-slate-50 rounded-2xl p-2 shadow-xs border border-slate-200">
                <CetsLogo variant="horizontal" size="sm" theme="light" showSlogan={false} />
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
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
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    setActiveTab('landing');
                    handleClose();
                  }}
                  className="w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-xl transition-all text-sm font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200"
                >
                  <Globe className="w-5 h-5 shrink-0 text-blue-600" />
                  <span>Site Institucional CETS</span>
                </button>
              </div>
            </nav>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 text-center font-medium">
              Centro de Ensino Técnico em Saúde • Tucano - BA
            </div>
          </div>
        </div>
      )}
    </>
  );
};

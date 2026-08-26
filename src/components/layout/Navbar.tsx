import React, { useState } from 'react';
import {
  LogOut,
  Bell,
  KeyRound,
  User,
  Search,
  ChevronDown,
  Sparkles,
  UserPlus,
  FileSpreadsheet,
  Award,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { ChangePasswordModal } from '../common/ChangePasswordModal.tsx';
import { BoletimModal } from '../common/BoletimModal.tsx';
import { CetsLogo } from '../common/CetsLogo.tsx';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewStudent?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenNewStudent,
  onToggleMobileMenu,
}) => {
  const { user, studentProfile, teacherProfile, role, logout, switchUserRole } = useAuth();
  const { announcements, students } = useData();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBoletimModal, setShowBoletimModal] = useState(false);

  const activeAnnouncements = announcements.filter((a) => a.active).slice(0, 5);
  const currentStudent = studentProfile || students.find((s) => s.userId === user?.id) || students[0];

  const getInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8 bg-[#081232]/95 backdrop-blur-md border-b border-blue-900/40 shrink-0 sticky top-0 z-30 shadow-md">
      {/* Left side: Mobile Menu Button + CETS Brand on Mobile + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900/60 active:bg-blue-800/80 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Mobile Brand with Official Emblem */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <div className="bg-white/95 rounded-xl p-1 shadow-sm">
            <CetsLogo variant="emblem" size="xs" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-tight leading-none">CETS</span>
            <span className="text-[9px] text-cyan-300 font-bold leading-none mt-0.5">Tucano - BA</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center bg-blue-950/60 rounded-full px-3.5 py-1.5 w-48 md:w-80 lg:w-96 border border-blue-800/40 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
          <Search className="w-4 h-4 text-blue-300/60 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar disciplinas, notas, alunos..."
            className="bg-transparent text-sm w-full outline-none text-white placeholder-blue-300/50 font-medium"
          />
        </div>
      </div>

      {/* Right side: Role Simulator, Notifications, Primary Action, User Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-4 shrink-0">
        {/* Role Switcher Pill Bar (Simulator) */}
        <div className="hidden xl:flex items-center gap-1 bg-[#060D24]/80 p-1 rounded-full text-xs font-semibold border border-blue-800/40">
          <span className="text-[10px] uppercase tracking-wider text-blue-300/80 px-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Perfil:
          </span>
          <button
            onClick={() => switchUserRole('admin')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-xs cursor-pointer ${
              role === 'admin'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => switchUserRole('professor', 'tea-1')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-xs cursor-pointer ${
              role === 'professor'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            Profª Camila
          </button>
          <button
            onClick={() => switchUserRole('aluno', 'stu-1')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-xs cursor-pointer ${
              role === 'aluno'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            Aluno João
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="p-2 text-blue-200 hover:text-cyan-300 transition-colors relative rounded-xl hover:bg-blue-900/50 cursor-pointer"
            title="Comunicados e Notificações"
          >
            <Bell className="w-5 h-5 sm:w-5 sm:h-5" />
            {activeAnnouncements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#081232]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-96 max-w-sm bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-600" /> Mural de Comunicados
                </h4>
                <span className="text-[11px] font-semibold text-slate-400">
                  {activeAnnouncements.length} recentes
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {activeAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => {
                      setActiveTab('comunicados');
                      setShowNotifications(false);
                    }}
                    className="p-3.5 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ann.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{ann.title}</h5>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{ann.content}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setActiveTab('comunicados');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
                >
                  Ver todos os comunicados →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        {role === 'admin' ? (
          <button
            onClick={onOpenNewStudent || (() => setActiveTab('alunos'))}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">+ Novo Aluno</span>
            <span className="sm:hidden">+ Aluno</span>
          </button>
        ) : role === 'professor' ? (
          <button
            onClick={() => setActiveTab('notas')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Lançar Notas</span>
            <span className="sm:hidden">Notas</span>
          </button>
        ) : (
          <button
            onClick={() => setShowBoletimModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Emitir Boletim</span>
            <span className="sm:hidden">Boletim</span>
          </button>
        )}

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md border border-blue-400/40">
              {getInitials(user?.name || 'US')}
            </div>
            <ChevronDown className="w-4 h-4 text-blue-300 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
                {studentProfile && (
                  <p className="text-[11px] text-blue-700 font-semibold mt-1">
                    Matrícula: {studentProfile.enrollment}
                  </p>
                )}
                {teacherProfile && (
                  <p className="text-[11px] text-blue-700 font-semibold mt-1">
                    Reg: {teacherProfile.registrationCode}
                  </p>
                )}
              </div>

              <div className="py-1">
                {role === 'aluno' && (
                  <button
                    onClick={() => {
                      setActiveTab('perfil');
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Meu Perfil Acadêmico
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveTab('landing');
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" /> Ver Site Institucional CETS
                </button>

                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-slate-400" /> Alterar Senha
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" /> Sair da Conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {showBoletimModal && currentStudent && (
        <BoletimModal
          student={currentStudent}
          onClose={() => setShowBoletimModal(false)}
        />
      )}
    </header>
  );
};

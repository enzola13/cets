import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  FileCheck2,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';

interface TeacherDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setActiveTab }) => {
  const { teacherProfile, user } = useAuth();
  const { subjects, classes, students, schedules } = useData();

  const currentTeacherId = teacherProfile?.id || 'tea-1';
  const mySubjects = subjects.filter((s) => s.teacherId === currentTeacherId);
  const myClasses = classes.filter((c) => schedules.some((sc) => sc.teacherId === currentTeacherId && sc.classId === c.id) || classes.length > 0);
  const myStudents = students.filter((s) => myClasses.some((c) => c.id === s.classId));

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Portal Docente • CETS Saúde</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Olá, Profª {user?.name || 'Camila Rocha'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Bem-vinda ao seu diário acadêmico digital. Gerencie o lançamento de avaliações bimestrais, registre a assiduidade presencial dos alunos e acerte cronogramas de aulas práticas.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Disciplinas</p>
            <h3 className="text-2xl font-bold text-slate-800">{mySubjects.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Turmas Ativas</p>
            <h3 className="text-2xl font-bold text-slate-800">{myClasses.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Total Alunos</p>
            <h3 className="text-2xl font-bold text-slate-800">{myStudents.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Bimestre</p>
            <h3 className="text-2xl font-bold text-slate-800">1º / 2026</h3>
          </div>
        </div>
      </div>

      {/* Grid: My Subjects & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disciplinas sob minha responsabilidade */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
              <h3 className="text-base font-bold text-slate-800">Minhas Disciplinas</h3>
              <span className="text-xs text-slate-400">Semestre 2026.1</span>
            </div>

            <div className="space-y-3">
              {mySubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        {sub.code}
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs">{sub.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Carga Horária: {sub.workloadHours}h • {sub.isPracticalLab ? 'Lab. Prático' : 'Teórico'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('notas')}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                    >
                      Lançar Notas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
              <h3 className="text-base font-bold text-slate-800">Ações Rápidas do Docente</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab('notas')}
                className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl hover:border-teal-300 transition-all text-left group"
              >
                <FileCheck2 className="w-6 h-6 text-teal-700 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-slate-800">Lançamento de Notas</h4>
                <p className="text-[11px] text-slate-500 mt-1">Registrar P1, P2 e Trabalhos Bimestrais</p>
              </button>

              <button
                onClick={() => setActiveTab('frequencia')}
                className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl hover:border-blue-300 transition-all text-left group"
              >
                <UserCheck className="w-6 h-6 text-blue-700 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-slate-800">Registro de Chamada</h4>
                <p className="text-[11px] text-slate-500 mt-1">Computar presenças diárias e faltas</p>
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Regimento CETS: Prazo limite para digitação das médias bimestrais até <strong>30/03/2026</strong>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

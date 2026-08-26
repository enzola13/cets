import React from 'react';
import { BookOpen, Clock, User, Award, FlaskConical, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';

export const StudentSubjects: React.FC = () => {
  const { studentProfile } = useAuth();
  const { subjects, teachers, getStudentGrades } = useData();

  const studentGrades = studentProfile ? getStudentGrades(studentProfile.id) : [];

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Minhas Disciplinas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Componentes curriculares do Curso Técnico em Enfermagem • Módulo I
          </p>
        </div>
        <div className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Carga Horária Total: {subjects.reduce((acc, s) => acc + s.workloadHours, 0)} horas
        </div>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
        {subjects.map((sub) => {
          const teacher = teachers.find((t) => t.id === sub.teacherId);
          const grade = studentGrades.find((g) => g.subjectId === sub.id);

          return (
            <div
              key={sub.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                      {sub.code}
                    </span>
                    {sub.isPracticalLab && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                        <FlaskConical className="w-3 h-3" /> Lab. Prático
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {sub.workloadHours}h
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {sub.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {sub.syllabus}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-medium">{teacher?.name || 'Prof. CETS'}</span>
                </div>

                {grade && grade.average !== null ? (
                  <span className="font-bold text-slate-900 bg-teal-50 text-teal-900 px-2.5 py-1 rounded-lg border border-teal-100">
                    Média: <strong>{Number(grade.average).toFixed(1)}</strong>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Em andamento</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

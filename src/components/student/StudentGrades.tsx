import React, { useState } from 'react';
import { Award, FileText, Printer, CheckCircle2, AlertCircle, Info, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { BoletimModal } from '../common/BoletimModal.tsx';

export const StudentGrades: React.FC = () => {
  const { studentProfile, user } = useAuth();
  const { students, getStudentGrades, config } = useData();
  const [showBoletim, setShowBoletim] = useState(false);

  const student = studentProfile || students.find((s) => s.userId === user?.id) || students[0];
  const grades = student ? getStudentGrades(student.id) : [];

  // Computed metrics
  const validAverages = grades.filter((g) => g.average !== null).map((g) => g.average as number);
  const generalAverage = validAverages.length > 0
    ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1)
    : '-';

  const approvedCount = grades.filter((g) => g.status === 'Aprovado').length;
  const inProgressCount = grades.filter((g) => g.status === 'Em andamento').length;
  const recoveryCount = grades.filter((g) => g.status === 'Recuperação').length;

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Nenhum registro de aluno localizado.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Minhas Notas e Rendimento
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhamento bimestral de notas teóricas e práticas do Curso Técnico em Enfermagem
          </p>
        </div>

        <button
          onClick={() => setShowBoletim(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Award className="w-4 h-4 text-teal-200" /> Emitir Boletim Oficial
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Média Geral Atual
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-teal-900">{generalAverage}</span>
            <span className="text-[11px] text-slate-400 font-medium">/ 10.0</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Disciplinas Aprovadas
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{approvedCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">de {grades.length}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Em Andamento
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-cyan-600">{inProgressCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">matérias</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Em Recuperação
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{recoveryCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">matérias</span>
          </div>
        </div>
      </div>

      {/* Main Specified Grades Table / Mobile Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" /> Tabela Bimestral de Notas
          </h3>
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
            Semestre 2026.1
          </span>
        </div>

        {/* Mobile View: High-legibility Subject Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {grades.map((grade) => {
            let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
            if (grade.status === 'Aprovado') {
              badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
            } else if (grade.status === 'Em andamento') {
              badgeClass = 'bg-cyan-50 text-cyan-800 border-cyan-200 font-medium';
            } else if (grade.status === 'Recuperação') {
              badgeClass = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
            } else if (grade.status === 'Reprovado') {
              badgeClass = 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
            }

            return (
              <div key={grade.subjectId} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base leading-snug">{grade.subjectName}</h4>
                    <span className="text-xs text-slate-400 font-mono">{grade.subjectCode}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs border shrink-0 ${badgeClass}`}>
                    {grade.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">1ª Nota</span>
                    <span className="text-base font-black text-slate-800">
                      {grade.grade1 !== null ? Number(grade.grade1).toFixed(1) : '-'}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">2ª Nota</span>
                    <span className="text-base font-black text-slate-800">
                      {grade.grade2 !== null ? Number(grade.grade2).toFixed(1) : '-'}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Recup.</span>
                    <span className="text-base font-black text-slate-500">
                      {grade.examGrade !== null ? Number(grade.examGrade).toFixed(1) : '-'}
                    </span>
                  </div>

                  <div className="bg-teal-50/80 border border-teal-200/80 rounded-xl p-2">
                    <span className="text-[10px] uppercase font-bold text-teal-800 block">Média</span>
                    <span className="text-base font-black text-teal-900">
                      {grade.average !== null ? Number(grade.average).toFixed(1) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Disciplina</th>
                <th className="p-4 text-center">1ª Nota</th>
                <th className="p-4 text-center">2ª Nota</th>
                <th className="p-4 text-center">Recuperação</th>
                <th className="p-4 text-center">Média</th>
                <th className="p-4 text-center">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {grades.map((grade) => {
                let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                if (grade.status === 'Aprovado') {
                  badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
                } else if (grade.status === 'Em andamento') {
                  badgeClass = 'bg-cyan-50 text-cyan-800 border-cyan-200 font-medium';
                } else if (grade.status === 'Recuperação') {
                  badgeClass = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
                } else if (grade.status === 'Reprovado') {
                  badgeClass = 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
                }

                return (
                  <tr key={grade.subjectId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{grade.subjectName}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{grade.subjectCode}</div>
                    </td>
                    <td className="p-4 text-center text-sm font-semibold">
                      {grade.grade1 !== null ? Number(grade.grade1).toFixed(1) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-sm font-semibold">
                      {grade.grade2 !== null ? Number(grade.grade2).toFixed(1) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-sm text-slate-500">
                      {grade.examGrade !== null ? Number(grade.examGrade).toFixed(1) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {grade.average !== null ? (
                        <span className="font-extrabold text-base text-slate-900">
                          {Number(grade.average).toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs border ${badgeClass}`}>
                        {grade.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Grading Rules Footnote */}
      <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-4 text-xs text-teal-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Regimento de Avaliação Escolar CETS:</p>
          <p className="text-teal-800/90 leading-relaxed">
            A média mínima para aprovação direta em cada componente curricular é de <strong>{config?.minimumPassingGrade || 7.0}</strong>. Alunos com média entre {config?.recoveryThreshold || 5.0} e 6.9 têm direito à prova de recuperação bimestral. Frequência mínima legal obrigatória: <strong>75%</strong>.
          </p>
        </div>
      </div>

      {showBoletim && <BoletimModal student={student} onClose={() => setShowBoletim(false)} />}
    </div>
  );
};

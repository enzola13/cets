import React, { useState } from 'react';
import {
  FileCheck2,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';

export const TeacherGrades: React.FC = () => {
  const { teacherProfile, user } = useAuth();
  const { subjects, classes, students, grades, schedules, saveGrade, config } = useData();

  const currentTeacherId = teacherProfile?.id || 'tea-1';
  const mySubjects = subjects.filter((s) => s.teacherId === currentTeacherId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(mySubjects[0]?.id || subjects[0]?.id || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const matchingSchedule = schedules.find((sc) => sc.subjectId === currentSubject?.id);
  const targetClass = classes.find((c) => c.id === matchingSchedule?.classId) || classes[0];
  const classStudents = students.filter((s) => s.classId === targetClass?.id);

  // Local editing buffer
  const [gradesState, setGradesState] = useState<Record<string, { grade1: number; grade2: number; recovery?: number }>>({});

  const handleGradeChange = (studentId: string, field: 'grade1' | 'grade2' | 'recovery', valStr: string) => {
    const val = parseFloat(valStr) || 0;
    setGradesState((prev) => {
      const existing = prev[studentId] || {
        grade1: grades.find((g) => g.studentId === studentId && g.subjectId === selectedSubjectId)?.grade1 || 0,
        grade2: grades.find((g) => g.studentId === studentId && g.subjectId === selectedSubjectId)?.grade2 || 0,
      };
      return {
        ...prev,
        [studentId]: {
          ...existing,
          [field]: val,
        },
      };
    });
  };

  const handleSaveAll = async () => {
    for (const stu of classStudents) {
      const gRecord = grades.find((g) => g.studentId === stu.id && g.subjectId === selectedSubjectId);
      const buffer = gradesState[stu.id];
      if (buffer) {
        await saveGrade({
          id: gRecord?.id,
          studentId: stu.id,
          subjectId: selectedSubjectId,
          classId: targetClass?.id || stu.classId,
          grade1: buffer.grade1,
          grade2: buffer.grade2,
          examGrade: buffer.recovery || null,
          updatedBy: user?.name || 'Professor',
          auditNote: 'Lançamento efetuado via painel docente',
        });
      }
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Notas bimestrais salvas e calculadas com sucesso no sistema CETS!</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Lançamento de Notas e Avaliações
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Digitação de notas bimestrais, 1ª e 2ª avaliações com cálculo automatizado da média
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Notas</span>
        </button>
      </div>

      {/* Select Subject */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase text-slate-400">Selecionar Disciplina:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Users className="w-4 h-4 text-teal-600" />
          <span>Turma: {targetClass?.name} ({classStudents.length} alunos)</span>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            Pauta Eletrônica • {currentSubject?.name}
          </h3>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            Média Mínima: {config?.minimumPassingGrade || 7.0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-[10px] uppercase text-slate-400 font-bold">
                <th className="px-6 py-3 border-b border-slate-100">Aluno</th>
                <th className="px-6 py-3 border-b border-slate-100">Matrícula</th>
                <th className="px-6 py-3 border-b border-slate-100 text-center">1ª Avaliação (P1)</th>
                <th className="px-6 py-3 border-b border-slate-100 text-center">2ª Avaliação (P2)</th>
                <th className="px-6 py-3 border-b border-slate-100 text-center">Média Parcial</th>
                <th className="px-6 py-3 border-b border-slate-100 text-center">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {classStudents.map((stu) => {
                const gRecord = grades.find((g) => g.studentId === stu.id && g.subjectId === selectedSubjectId);
                const localG1 = gradesState[stu.id]?.grade1 ?? (gRecord?.grade1 || 0);
                const localG2 = gradesState[stu.id]?.grade2 ?? (gRecord?.grade2 || 0);
                const currentAvg = Number(((localG1 + localG2) / 2).toFixed(1));
                const isPassing = currentAvg >= (config?.minimumPassingGrade || 7.0);

                return (
                  <tr key={stu.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-xs text-slate-800">
                      {stu.name}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 font-medium">
                      {stu.enrollment}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={localG1}
                        onChange={(e) => handleGradeChange(stu.id, 'grade1', e.target.value)}
                        className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={localG2}
                        onChange={(e) => handleGradeChange(stu.id, 'grade2', e.target.value)}
                        className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-black ${
                        isPassing ? 'text-teal-700' : currentAvg >= 5.0 ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {currentAvg.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          isPassing
                            ? 'bg-green-100 text-green-700'
                            : currentAvg >= 5.0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isPassing ? 'Aprovado' : currentAvg >= 5.0 ? 'Recuperação' : 'Reprovado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

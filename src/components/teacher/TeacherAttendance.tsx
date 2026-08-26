import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Save,
  Calendar,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';

export const TeacherAttendance: React.FC = () => {
  const { teacherProfile } = useAuth();
  const { subjects, classes, students, recordAttendance } = useData();

  const currentTeacherId = teacherProfile?.id || 'tea-1';
  const mySubjects = subjects.filter((s) => s.teacherId === currentTeacherId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(mySubjects[0]?.id || subjects[0]?.id || '');
  const [callDate, setCallDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [saveToast, setSaveToast] = useState(false);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const targetClass = classes.find((c) => c.id === currentSubject?.classId) || classes[0];
  const classStudents = students.filter((s) => s.classId === targetClass?.id);

  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, 'Presente' | 'Falta' | 'Justificado'>>({});

  const setStatus = (studentId: string, status: 'Presente' | 'Falta' | 'Justificado') => {
    setStudentStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const newMap: Record<string, 'Presente' | 'Falta' | 'Justificado'> = {};
    classStudents.forEach((s) => {
      newMap[s.id] = 'Presente';
    });
    setStudentStatusMap(newMap);
  };

  const handleSaveAttendance = async () => {
    const records = classStudents.map((s) => ({
      studentId: s.id,
      status: studentStatusMap[s.id] || 'Presente',
    }));

    await recordAttendance({
      classId: targetClass?.id || '',
      subjectId: selectedSubjectId,
      date: callDate,
      records,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {saveToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Registro de frequência e chamada gravado com sucesso!</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Chamada Diária & Controle de Frequência
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Registro presencial de assiduidade em aulas teóricas e práticas laboratoriais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors"
          >
            Marcar Todos Presentes
          </button>
          <button
            onClick={handleSaveAttendance}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Chamada</span>
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase text-slate-400">Disciplina:</span>
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

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase text-slate-400">Data:</span>
          <input
            type="date"
            value={callDate}
            onChange={(e) => setCallDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Students Roll Call List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            Lista de Presença • {targetClass?.name} ({classStudents.length} Alunos)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-[10px] uppercase text-slate-400 font-bold">
                <th className="px-6 py-3 border-b border-slate-100">Aluno</th>
                <th className="px-6 py-3 border-b border-slate-100">Matrícula</th>
                <th className="px-6 py-3 border-b border-slate-100 text-center">Status da Presença</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {classStudents.map((stu) => {
                const currentSt = studentStatusMap[stu.id] || 'Presente';
                return (
                  <tr key={stu.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-xs text-slate-800">
                      {stu.name}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 font-medium">
                      {stu.enrollment}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setStatus(stu.id, 'Presente')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            currentSt === 'Presente'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Presente
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(stu.id, 'Falta')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            currentSt === 'Falta'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Falta
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(stu.id, 'Justificado')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            currentSt === 'Justificado'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Justificado
                        </button>
                      </div>
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

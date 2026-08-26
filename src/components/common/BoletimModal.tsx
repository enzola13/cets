import React from 'react';
import { X, Printer, Award, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Student } from '../../types.ts';
import { useData } from '../../context/DataContext.tsx';

interface BoletimModalProps {
  student: Student;
  onClose: () => void;
}

export const BoletimModal: React.FC<BoletimModalProps> = ({ student, onClose }) => {
  const { config, classes, getStudentGrades, getStudentAttendanceStats } = useData();

  const studentGrades = getStudentGrades(student.id);
  const attendanceStats = getStudentAttendanceStats(student.id);
  const studentClass = classes.find((c) => c.id === student.classId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-700" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Boletim Escolar Oficial</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold hover:bg-teal-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Imprimir Boletim</span><span className="sm:hidden">Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document */}
        <div className="p-3 sm:p-8 overflow-y-auto print:p-0 custom-scrollbar">
          <div className="border border-slate-200 sm:border-2 rounded-xl p-4 sm:p-6 bg-white">
            {/* School Header */}
            <div className="flex items-center gap-4 border-b-2 border-teal-800 pb-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                CETS
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-black text-slate-900 text-lg tracking-tight">
                      {config?.schoolName || 'CETS'} – {config?.subtitle || 'Centro de Ensino Técnico em Saúde'}
                    </h2>
                    <p className="text-xs text-slate-600">
                      Credenciamento Estadual • {config?.corenAuthorization || 'Parecer CEE/COREN-SP nº 412/2022'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {config?.address || 'Av. Paulista, 1420 - SP'} • Fone: {config?.phone || '(11) 3456-7890'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-teal-100 text-teal-900 text-xs font-extrabold px-2.5 py-1 rounded-md">
                      Ano Letivo: {config?.currentTerm || '2026.1'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-5">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
                Histórico e Rendimento Escolar do Aluno
              </h3>
              <p className="text-xs text-slate-500">
                Curso de Formação Profissional: <strong className="text-slate-800">{student.course}</strong>
              </p>
            </div>

            {/* Student Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-6">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nome do Aluno</span>
                <span className="font-bold text-slate-900">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Matrícula</span>
                <span className="font-mono font-bold text-teal-800">{student.enrollment}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Turma / Turno</span>
                <span className="font-semibold text-slate-800">
                  {studentClass?.code || 'ENF-2026.1'} ({studentClass?.shift || 'Noite'})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Situação da Matrícula</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" /> {student.academicStatus}
                </span>
              </div>
            </div>

            {/* Grades Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Componente Curricular / Disciplina</th>
                    <th className="p-3 text-center">C.H.</th>
                    <th className="p-3 text-center">1ª Nota</th>
                    <th className="p-3 text-center">2ª Nota</th>
                    <th className="p-3 text-center">Recup.</th>
                    <th className="p-3 text-center">Média</th>
                    <th className="p-3 text-center">Freq.</th>
                    <th className="p-3 text-center">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {studentGrades.map((g) => {
                    const subStat = attendanceStats.subjectStats.find((s) => s.subjectId === g.subjectId);
                    const freqPct = subStat ? subStat.percentage : 100;

                    let statusClass = 'bg-slate-100 text-slate-700';
                    if (g.status === 'Aprovado') statusClass = 'bg-emerald-100 text-emerald-800 font-bold';
                    else if (g.status === 'Em andamento') statusClass = 'bg-cyan-100 text-cyan-800';
                    else if (g.status === 'Recuperação') statusClass = 'bg-amber-100 text-amber-800 font-bold';
                    else if (g.status === 'Reprovado') statusClass = 'bg-rose-100 text-rose-800 font-bold';

                    return (
                      <tr key={g.subjectId} className="hover:bg-slate-50/70">
                        <td className="p-3">
                          <span className="font-semibold text-slate-900 block">{g.subjectName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{g.subjectCode}</span>
                        </td>
                        <td className="p-3 text-center text-slate-600">{g.workloadHours}h</td>
                        <td className="p-3 text-center font-medium">{g.grade1 !== null ? Number(g.grade1).toFixed(1) : '-'}</td>
                        <td className="p-3 text-center font-medium">{g.grade2 !== null ? Number(g.grade2).toFixed(1) : '-'}</td>
                        <td className="p-3 text-center text-slate-500">{g.examGrade !== null ? Number(g.examGrade).toFixed(1) : '-'}</td>
                        <td className="p-3 text-center font-bold text-slate-900 text-sm">
                          {g.average !== null ? Number(g.average).toFixed(1) : '-'}
                        </td>
                        <td className="p-3 text-center font-semibold">
                          <span className={freqPct >= (config?.minimumAttendancePercentage || 75) ? 'text-emerald-700' : 'text-rose-600'}>
                            {freqPct}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] ${statusClass}`}>
                            {g.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Academic Criteria Legend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <div>
                <span className="font-bold text-slate-800 block mb-1">Critérios de Avaliação e Aprovação:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Média mínima para aprovação direta: <strong>{config?.minimumPassingGrade || 7.0}</strong></li>
                  <li>Média mínima para direito a exame/recuperação: <strong>{config?.recoveryThreshold || 5.0}</strong></li>
                  <li>Frequência mínima obrigatória: <strong>{config?.minimumAttendancePercentage || 75}%</strong> da carga horária.</li>
                </ul>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Frequência Global Acumulada:</span>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-black text-teal-800">{attendanceStats.percentage}%</div>
                    <span className="text-[10px] text-slate-500">
                      ({attendanceStats.presences + attendanceStats.justified} presenças de {attendanceStats.totalClasses || 12} aulas apuradas)
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="w-48 mx-auto border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-800">Secretaria Acadêmica</p>
                <p className="text-[10px] text-slate-500">CETS Centro Técnico em Saúde</p>
              </div>
              <div>
                <div className="w-48 mx-auto border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-800">{config?.directorName || 'Diretoria Pedagógica'}</p>
                <p className="text-[10px] text-slate-500">Direção Geral</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

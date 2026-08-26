import React from 'react';
import { UserCheck, CheckCircle2, XCircle, AlertTriangle, HelpCircle, ShieldAlert, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';

export const StudentAttendance: React.FC = () => {
  const { studentProfile, user } = useAuth();
  const { students, getStudentAttendanceStats, attendance, subjects, config } = useData();

  const student = studentProfile || students.find((s) => s.userId === user?.id) || students[0];
  const stats = student ? getStudentAttendanceStats(student.id) : {
    percentage: 100,
    totalClasses: 0,
    presences: 0,
    absences: 0,
    justified: 0,
    subjectStats: [],
  };

  // Recent attendance records for this student
  const studentAttendanceRecords = attendance
    .filter((a) => a.records.some((r) => r.studentId === student?.id))
    .map((a) => {
      const rec = a.records.find((r) => r.studentId === student?.id);
      const sub = subjects.find((s) => s.id === a.subjectId);
      return {
        id: a.id,
        date: a.date,
        subjectName: sub?.name || 'Disciplina',
        status: rec?.status || 'Presente',
        notes: rec?.notes || '',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const minReq = config?.minimumAttendancePercentage || 75;
  const isHealthy = stats.percentage >= minReq;

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Controle de Frequência e Assiduidade
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoramento de presenças regulamentares de acordo com as normas do COREN
          </p>
        </div>

        <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold self-start sm:self-auto flex items-center gap-2 ${
          isHealthy
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
        }`}>
          {isHealthy ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{isHealthy ? 'Frequência Regular' : 'Atenção: Risco de Reprovação por Faltas'}</span>
        </div>
      </div>

      {/* Main Stats Header Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Índice Global
          </span>
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2">
            <span className={`text-2xl sm:text-4xl font-black ${
              isHealthy ? 'text-teal-800' : 'text-rose-600'
            }`}>
              {stats.percentage}%
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">(Mín. {minReq}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 sm:mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHealthy ? 'bg-teal-600' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(stats.percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Presenças
          </span>
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2">
            <span className="text-2xl sm:text-4xl font-black text-emerald-600">
              {stats.presences}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">aulas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Presença integral
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Faltas
          </span>
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2">
            <span className="text-2xl sm:text-4xl font-black text-rose-600">
              {stats.absences}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">aulas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-500" /> Sem justificativa
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Justificadas
          </span>
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2">
            <span className="text-2xl sm:text-4xl font-black text-amber-600">
              {stats.justified}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">atestados</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Com atestado
          </p>
        </div>
      </div>

      {/* Breakdown by Subject */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6">
        <h3 className="font-bold text-slate-900 text-base mb-4">
          Frequência por Componente Curricular
        </h3>

        <div className="space-y-4">
          {stats.subjectStats.map((item) => {
            const subHealthy = item.percentage >= minReq;
            return (
              <div key={item.subjectId} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.subjectName}</span>
                    <span className="text-xs text-slate-500 block">
                      {item.presences} presenças de {item.total} aulas apuradas ({item.absences} faltas, {item.justified} justificadas)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-black ${
                      subHealthy ? 'text-teal-800' : 'text-rose-600'
                    }`}>
                      {item.percentage}%
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      subHealthy
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {subHealthy ? 'Regular' : 'Abaixo de 75%'}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      subHealthy ? 'bg-teal-600' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-700" /> Histórico de Chamadas Registradas
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Data</th>
                <th className="p-3.5">Disciplina</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {studentAttendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">
                    Nenhum lançamento de chamada registrado até o momento.
                  </td>
                </tr>
              ) : (
                studentAttendanceRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-medium">{new Date(r.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{r.subjectName}</td>
                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        r.status === 'Presente'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : r.status === 'Justificado'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{r.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

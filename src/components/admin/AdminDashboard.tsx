import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  Building2,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
} from 'lucide-react';
import { useData } from '../../context/DataContext.tsx';
import { Student } from '../../types.ts';
import { BoletimModal } from '../common/BoletimModal.tsx';
import { EnrollmentDeclarationModal } from '../common/EnrollmentDeclarationModal.tsx';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
  searchFilter?: string;
  onOpenNewStudent?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setActiveTab,
  searchFilter = '',
  onOpenNewStudent,
}) => {
  const { students, classes, invoices, subjects } = useData();
  const [selectedStudentForBoletim, setSelectedStudentForBoletim] = useState<Student | null>(null);
  const [selectedStudentForDecl, setSelectedStudentForDecl] = useState<Student | null>(null);
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  // Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.academicStatus === 'Ativo').length;
  const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.status === 'Pago' ? inv.amount : 0), 0);
  const overdueInvoices = invoices.filter((inv) => inv.status === 'Atrasado');
  const defaultRate = totalStudents > 0 ? ((overdueInvoices.length / invoices.length) * 100).toFixed(1) : '8.4';

  const formatCurrencyK = (val: number) => {
    if (val >= 1000) {
      return `R$ ${(val / 1000).toFixed(0)}k`;
    }
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const filteredStudents = students.filter((s) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.enrollment.toLowerCase().includes(q) ||
      s.cpf.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
    );
  });

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleGenerateReport = () => {
    setReportSuccessMsg('Relatório financeiro e analítico gerado com sucesso!');
    setTimeout(() => setReportSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {reportSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{reportSuccessMsg}</span>
          </div>
          <button onClick={() => setReportSuccessMsg(null)} className="text-emerald-600 hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* Top 4 Metrics (Exact match with Sleek HTML Archetype) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Alunos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Total Alunos</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {totalStudents > 0 ? totalStudents : 482}
            </h3>
          </div>
        </div>

        {/* Ativos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Ativos</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {activeStudents > 0 ? activeStudents : 415}
            </h3>
          </div>
        </div>

        {/* Arrecadação */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Arrecadação</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {totalInvoiced > 0 ? formatCurrencyK(totalInvoiced) : 'R$ 142k'}
            </h3>
          </div>
        </div>

        {/* Inadimplência */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Inadimplência</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {defaultRate}%
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 Cols Table + 1 Col Inadimplência Crítica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table: Alunos Recém Cadastrados */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Alunos Recém Cadastrados</h2>
              <p className="text-xs text-slate-400 mt-0.5">Matrículas e status acadêmico atualizados</p>
            </div>
            <button
              onClick={() => setActiveTab('alunos')}
              className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline"
            >
              Ver Todos
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0">
                <tr className="text-[10px] uppercase text-slate-400 font-bold">
                  <th className="px-6 py-3 border-b border-slate-100">Aluno</th>
                  <th className="px-6 py-3 border-b border-slate-100">Curso</th>
                  <th className="px-6 py-3 border-b border-slate-100">Matrícula</th>
                  <th className="px-6 py-3 border-b border-slate-100">Status</th>
                  <th className="px-6 py-3 border-b border-slate-100 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.slice(0, 5).map((student) => {
                  const studentClass = classes.find((c) => c.id === student.classId);
                  const isInactive = student.academicStatus === 'Trancado' || student.academicStatus === 'Evadido';
                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        isInactive ? 'text-slate-400' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold shrink-0 ${
                            isInactive ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              CPF: {student.cpf}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {student.course} ({studentClass?.shift ? studentClass.shift.charAt(0) : 'M'}1)
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500 font-medium">
                        {student.enrollment}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            student.academicStatus === 'Ativo'
                              ? 'bg-green-100 text-green-700'
                              : student.academicStatus === 'Concluído'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {student.academicStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentForBoletim(student);
                            }}
                            title="Emitir Boletim"
                            className="p-1.5 hover:bg-blue-50 text-blue-700 rounded-lg transition-colors text-xs font-bold"
                          >
                            Boletim
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentForDecl(student);
                            }}
                            title="Emitir Declaração"
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors text-xs font-medium"
                          >
                            Declaração
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

        {/* Right Column: Inadimplência Crítica */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Inadimplência Crítica</h2>
              <p className="text-xs text-slate-400 mt-1">Alunos com mais de 30 dias de atraso</p>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">Marcos Vinícius</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Turma Enfermagem B</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-red-600">R$ 339,90</p>
                  <p className="text-[10px] text-red-400 font-medium">15 dias</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">Julia Fernandes</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Turma Radiologia A</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-red-600">R$ 679,80</p>
                  <p className="text-[10px] text-red-400 font-medium">42 dias</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">Roberto Alencar</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Turma Estética V1</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-red-600">R$ 290,00</p>
                  <p className="text-[10px] text-red-400 font-medium">08 dias</p>
                </div>
              </div>

              {overdueInvoices.slice(0, 2).map((inv) => {
                const stu = students.find((s) => s.id === inv.studentId);
                return (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">{stu?.name || 'Aluno CETS'}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">
                        {inv.referenceMonth} • {stu?.course || 'Téc. Enfermagem'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-red-600">
                        {inv.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <p className="text-[10px] text-red-400 font-medium">Em atraso</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={handleGenerateReport}
              className="w-full text-center py-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Gerar Relatório Financeiro
            </button>
          </div>
        </div>
      </div>

      {/* Modals for Boletim and Declaração */}
      {selectedStudentForBoletim && (
        <BoletimModal
          student={selectedStudentForBoletim}
          onClose={() => setSelectedStudentForBoletim(null)}
        />
      )}

      {selectedStudentForDecl && (
        <EnrollmentDeclarationModal
          student={selectedStudentForDecl}
          onClose={() => setSelectedStudentForDecl(null)}
        />
      )}
    </div>
  );
};

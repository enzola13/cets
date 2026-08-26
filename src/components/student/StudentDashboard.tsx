import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Calendar,
  CreditCard,
  UserCheck,
  BellRing,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  FileText,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { BoletimModal } from '../common/BoletimModal.tsx';
import { EnrollmentDeclarationModal } from '../common/EnrollmentDeclarationModal.tsx';
import { PixModal } from '../common/PixModal.tsx';
import { Invoice } from '../../types.ts';

interface StudentDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveTab }) => {
  const { user, studentProfile } = useAuth();
  const {
    students,
    classes,
    subjects,
    getStudentGrades,
    getStudentAttendanceStats,
    getStudentInvoices,
    getStudentSchedule,
    getStudentAnnouncements,
    payInvoice,
  } = useData();

  const [showBoletim, setShowBoletim] = useState(false);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const [activePixInvoice, setActivePixInvoice] = useState<Invoice | null>(null);

  // If student profile not loaded, find from student list
  const student = studentProfile || students.find((s) => s.userId === user?.id) || students[0];
  const studentClass = classes.find((c) => c.id === student?.classId);
  const gradesList = student ? getStudentGrades(student.id) : [];
  const attendanceStats = student ? getStudentAttendanceStats(student.id) : { percentage: 100, presences: 0, totalClasses: 0, absences: 0, justified: 0, subjectStats: [] };
  const invoicesList = student ? getStudentInvoices(student.id) : [];
  const weeklySchedule = studentClass ? getStudentSchedule(studentClass.id) : [];
  const announcementsList = student ? getStudentAnnouncements(student.id, studentClass?.id) : [];

  // Summary counts
  const pendingInvoices = invoicesList.filter((i) => i.status === 'A vencer' || i.status === 'Atrasado');
  const nextInvoice = invoicesList.find((i) => i.status === 'A vencer' || i.status === 'Atrasado') || invoicesList[0];

  const approvedGradesCount = gradesList.filter((g) => g.status === 'Aprovado').length;

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Carregando dados do aluno...</div>;
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Abstract glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold">
              <HeartPulse className="w-4 h-4 text-teal-300 animate-pulse" />
              <span>Portal Acadêmico do Aluno • Enfermagem</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Olá, {student.name}!
            </h1>

            <p className="text-teal-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
              Bem-vindo ao seu portal acadêmico. Acompanhe suas disciplinas, notas bimestrais, controle de frequência hospitalar e situação financeira.
            </p>
          </div>

          {/* Student Badge Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shrink-0 w-full md:max-w-xs">
            <div className="text-xs text-teal-200 uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
              <span>Dados da Matrícula</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-400/30">
                {student.academicStatus}
              </span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-teal-200/80">Matrícula:</span>
                <span className="font-mono font-bold text-white text-xs sm:text-sm">{student.enrollment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-teal-200/80">Turma:</span>
                <span className="font-semibold text-white">{studentClass?.code || 'ENF-2026.1'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-teal-200/80">Curso:</span>
                <span className="font-semibold text-white">{student.course}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Documents Generator Buttons */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => setShowBoletim(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600/70 hover:bg-teal-600 active:bg-teal-700 text-white rounded-xl text-xs font-bold border border-teal-400/40 transition-all shadow-sm active:scale-95 min-h-[44px]"
          >
            <Award className="w-4 h-4 text-teal-200" /> Emitir Boletim Escolar
          </button>
          <button
            onClick={() => setShowDeclaration(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl text-xs font-bold border border-white/20 transition-all shadow-sm active:scale-95 min-h-[44px]"
          >
            <FileText className="w-4 h-4 text-teal-200" /> Declaração de Matrícula
          </button>
        </div>
      </div>

      {/* Primary 6 Section Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3.5">
          Acesso Rápido às Áreas Principais
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Minhas Disciplinas */}
          <div
            onClick={() => setActiveTab('disciplinas')}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                {subjects.length} Ativas
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition-colors">
              Minhas Disciplinas
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Consulte ementas, cargas horárias teóricas e módulos de laboratório prático.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              Ver grade curricular →
            </div>
          </div>

          {/* Minhas Notas */}
          <div
            onClick={() => setActiveTab('notas')}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
                {approvedGradesCount} Aprovadas
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition-colors">
              Minhas Notas
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tabela de notas bimestrais, 1ª e 2ª avaliações, médias e status de aprovação.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              Abrir boletim de notas →
            </div>
          </div>

          {/* Horários */}
          <div
            onClick={() => setActiveTab('horarios')}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
                Seg a Sáb
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition-colors">
              Horários de Aulas
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Grade semanal de aulas teóricas e práticas em laboratório de semiotécnica.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              Visualizar quadro semanal →
            </div>
          </div>

          {/* Minhas Mensalidades */}
          <div
            onClick={() => setActiveTab('mensalidades')}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                pendingInvoices.some((i) => i.status === 'Atrasado')
                  ? 'bg-rose-50 text-rose-700 border-rose-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {invoicesList.filter((i) => i.status === 'Pago').length}/{invoicesList.length} Pagas
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition-colors">
              Financeiro
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Histórico financeiro, boletos, código PIX instantâneo e comprovantes oficiais.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              Ver minhas faturas →
            </div>
          </div>

          {/* Frequência */}
          <div
            onClick={() => setActiveTab('frequencia')}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                attendanceStats.percentage >= 75
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {attendanceStats.percentage}% Presença
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition-colors">
              Frequência
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Acompanhamento de presenças e faltas por disciplina exigidas pelo COREN.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              Verificar assiduidade →
            </div>
          </div>

          {/* Comunicados */}
          <div
            onClick={() => setActiveTab('comunicados')}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <BellRing className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                {announcementsList.length} Avisos
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition-colors">
              Comunicados
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Informativos da coordenação, oportunidades de estágio e avisos regimentais.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              Ler comunicados →
            </div>
          </div>

        </div>
      </div>

      {/* Two Columns: Next Classes & Financial Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Next Classes */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-700" />
              <h3 className="font-bold text-slate-900 text-base">Quadro de Horários da Semana</h3>
            </div>
            <button
              onClick={() => setActiveTab('horarios')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Ver Grade Completa →
            </button>
          </div>

          <div className="space-y-3">
            {weeklySchedule.slice(0, 4).map((sch) => (
              <div
                key={sch.id}
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-teal-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 text-center py-1.5 px-2 bg-teal-800 text-white rounded-lg font-bold text-xs">
                    {sch.dayOfWeek}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{sch.subjectName}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> {sch.room} • {sch.teacherName}
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono font-semibold text-xs text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                  {sch.startTime} - {sch.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Quick Status & Next Invoice */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-base">Próxima Mensalidade</h3>
              </div>
              <button
                onClick={() => setActiveTab('mensalidades')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Ver Todas →
              </button>
            </div>

            {nextInvoice ? (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                      {nextInvoice.referenceMonth}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base mt-0.5">
                      {nextInvoice.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Vencimento: <strong>{new Date(nextInvoice.dueDate).toLocaleDateString('pt-BR')}</strong>
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    nextInvoice.status === 'Pago'
                      ? 'bg-emerald-100 text-emerald-800'
                      : nextInvoice.status === 'Atrasado'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {nextInvoice.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between">
                  <div className="text-2xl font-black text-slate-900">
                    {nextInvoice.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  {nextInvoice.status !== 'Pago' && (
                    <button
                      onClick={() => setActivePixInvoice(nextInvoice)}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Pagar via PIX
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Nenhuma fatura em aberto.</p>
            )}
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Pagamentos efetuados até o dia 05 possuem <strong>10% de desconto por pontualidade</strong>.
            </span>
          </div>
        </div>

      </div>

      {/* Modals */}
      {showBoletim && <BoletimModal student={student} onClose={() => setShowBoletim(false)} />}
      {showDeclaration && <EnrollmentDeclarationModal student={student} onClose={() => setShowDeclaration(false)} />}
      {activePixInvoice && (
        <PixModal
          invoice={activePixInvoice}
          studentName={student.name}
          onClose={() => setActivePixInvoice(null)}
          onConfirmPayment={async () => {
            await payInvoice(activePixInvoice.id, {
              paymentMethod: 'PIX',
              notes: 'Simulação de pagamento via PIX no painel do aluno',
            });
            setActivePixInvoice(null);
          }}
        />
      )}
    </div>
  );
};

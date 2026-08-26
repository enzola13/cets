import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Award,
  FileText,
  Mail,
  Phone,
  Shield,
  HeartPulse,
  Building2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { BoletimModal } from '../common/BoletimModal.tsx';
import { EnrollmentDeclarationModal } from '../common/EnrollmentDeclarationModal.tsx';

export const StudentProfileView: React.FC = () => {
  const { user, studentProfile } = useAuth();
  const { students, classes } = useData();

  const [showBoletim, setShowBoletim] = useState(false);
  const [showDecl, setShowDecl] = useState(false);

  const student = studentProfile || students.find((s) => s.userId === user?.id) || students[0];
  const studentClass = classes.find((c) => c.id === student?.classId);

  if (!student) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Meu Perfil Acadêmico
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Informações cadastrais, prontuário institucional e histórico de matrícula
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowBoletim(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 hover:bg-teal-700 active:bg-teal-800 flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <Award className="w-4 h-4" /> Emitir Boletim
          </button>
          <button
            onClick={() => setShowDecl(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <FileText className="w-4 h-4" /> Declaração
          </button>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shrink-0">
          {student.name.charAt(0)}
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{student.name}</h3>
              <span className="self-center md:self-auto px-2.5 py-0.5 bg-green-100 text-green-700 font-bold text-xs rounded-full uppercase border border-green-200">
                {student.academicStatus}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-mono">
              Matrícula: {student.enrollment} • CPF: {student.cpf}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-4 border-t border-slate-100 text-xs sm:text-sm text-left">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Curso</span>
              <span className="font-semibold text-slate-800">{student.course}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Turma & Turno</span>
              <span className="font-semibold text-slate-800">{studentClass?.name || 'Enfermagem'} ({studentClass?.shift || 'Manhã'})</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Ingresso</span>
              <span className="font-semibold text-slate-800">Semestre 2026.1</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">E-mail</span>
              <span className="font-semibold text-slate-800 truncate block">{student.email}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Telefone</span>
              <span className="font-semibold text-slate-800">{student.phone || '(11) 98888-0000'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tipo Sanguíneo</span>
              <span className="font-semibold text-slate-800">{student.bloodType || 'O+'}</span>
            </div>
          </div>
        </div>
      </div>

      {showBoletim && (
        <BoletimModal
          student={student}
          onClose={() => setShowBoletim(false)}
        />
      )}

      {showDecl && (
        <EnrollmentDeclarationModal
          student={student}
          onClose={() => setShowDecl(false)}
        />
      )}
    </div>
  );
};

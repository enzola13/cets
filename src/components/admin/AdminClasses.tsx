import React, { useState } from 'react';
import {
  Layers,
  Users,
  Calendar,
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useData } from '../../context/DataContext.tsx';

export const AdminClasses: React.FC = () => {
  const { classes, students, subjects, teachers } = useData();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === currentClass?.id);

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Gestão de Turmas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Organização por semestres, turnos e capacidade de salas e laboratórios
          </p>
        </div>
      </div>

      {/* Class Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const count = students.filter((s) => s.classId === cls.id).length;
          const isSelected = cls.id === currentClass?.id;
          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-50/60 border-teal-500 shadow-md shadow-teal-900/5'
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                  {cls.code}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Turno {cls.shift}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">{cls.name}</h3>
              <p className="text-xs text-slate-400 mb-3">{cls.module} • {cls.year}.{cls.semester}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-600" /> {count} / {cls.maxStudents || 40} alunos
                </span>
                <span className="text-teal-700">Sala {cls.room}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Class Details */}
      {currentClass && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Alunos Matriculados na Turma {currentClass.code}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {classStudents.length} estudantes vinculados a esta classe
              </p>
            </div>
            <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              Semestre 2026.1
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0">
                <tr className="text-[10px] uppercase text-slate-400 font-bold">
                  <th className="px-6 py-3 border-b border-slate-100">Nome do Aluno</th>
                  <th className="px-6 py-3 border-b border-slate-100">Matrícula</th>
                  <th className="px-6 py-3 border-b border-slate-100">CPF</th>
                  <th className="px-6 py-3 border-b border-slate-100">Contato</th>
                  <th className="px-6 py-3 border-b border-slate-100">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {classStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-xs text-slate-800">{stu.name}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{stu.enrollment}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{stu.cpf}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{stu.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {stu.academicStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Info, Building2, FlaskConical } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';

export const StudentSchedules: React.FC = () => {
  const { studentProfile } = useAuth();
  const { classes, getStudentSchedule } = useData();
  const [selectedDay, setSelectedDay] = useState<string>('TODOS');

  const studentClass = classes.find((c) => c.id === studentProfile?.classId) || classes[0];
  const schedules = studentClass ? getStudentSchedule(studentClass.id) : [];

  const days = ['TODOS', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  const filteredSchedules = selectedDay === 'TODOS'
    ? schedules
    : schedules.filter((s) => s.dayOfWeek.toLowerCase() === selectedDay.toLowerCase());

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quadro Semanal de Horários
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Turma: <strong className="text-slate-800">{studentClass?.code}</strong> • Turno: <strong className="text-slate-800">{studentClass?.shift}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full custom-scrollbar">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all min-h-[40px] ${
                selectedDay === d
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300'
              }`}
            >
              {d === 'TODOS' ? 'Semana Completa' : d.replace('-feira', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredSchedules.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            Nenhuma aula programada para este dia selecionado.
          </div>
        ) : (
          filteredSchedules.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-extrabold">
                    {item.dayOfWeek}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-200/60">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {item.startTime} - {item.endTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2 leading-snug">
                  {item.subjectName}
                </h3>

                <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Professor(a): <strong className="text-slate-800">{item.teacherName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Local / Sala: <strong className="text-slate-800">{item.room}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Campus CETS Paulista
                </span>
                <span className="font-bold text-teal-700">Presencial</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lab Safety Alert */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <FlaskConical className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Aviso sobre Aulas em Laboratório de Enfermagem:</p>
          <p className="text-amber-800/90 mt-0.5">
            É obrigatório o uso do jaleco branco com identificação bordada CETS, calçado fechado e Equipamentos de Proteção Individual (EPIs) para acesso às dependências dos laboratórios práticos.
          </p>
        </div>
      </div>
    </div>
  );
};

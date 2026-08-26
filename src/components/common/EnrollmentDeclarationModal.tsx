import React from 'react';
import { X, Printer, ShieldCheck, FileCheck2 } from 'lucide-react';
import { Student } from '../../types.ts';
import { useData } from '../../context/DataContext.tsx';

interface EnrollmentDeclarationModalProps {
  student: Student;
  onClose: () => void;
}

export const EnrollmentDeclarationModal: React.FC<EnrollmentDeclarationModalProps> = ({
  student,
  onClose,
}) => {
  const { config, classes } = useData();
  const studentClass = classes.find((c) => c.id === student.classId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-700" />
            <h3 className="font-bold text-slate-800 text-base">Declaração de Matrícula e Frequência</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold hover:bg-teal-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir / Salvar PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate */}
        <div className="p-8 overflow-y-auto print:p-0">
          <div className="border-2 border-slate-200 rounded-xl p-8 bg-white text-slate-800">
            {/* Header */}
            <div className="flex items-center gap-4 border-b-2 border-teal-800 pb-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                CETS
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-lg">
                  {config?.schoolName || 'CETS'} – {config?.subtitle || 'Centro de Ensino Técnico em Saúde'}
                </h2>
                <p className="text-xs text-slate-600">
                  Instituição Credenciada de Educação Profissional em Saúde • {config?.corenAuthorization}
                </p>
                <p className="text-[11px] text-slate-500">
                  {config?.address} • CNPJ: {config?.cnpj}
                </p>
              </div>
            </div>

            <div className="text-center my-6">
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest underline decoration-teal-600 underline-offset-8">
                DECLARAÇÃO DE MATRÍCULA
              </h1>
              <p className="text-xs text-slate-400 mt-2">Nº {Math.floor(100000 + Math.random() * 900000)}/2026-CETS</p>
            </div>

            <div className="text-sm leading-relaxed text-slate-700 space-y-4 my-8 text-justify">
              <p>
                Declaramos para os devidos fins, a pedido da parte interessada, que o(a) estudante{' '}
                <strong className="text-slate-900 font-extrabold">{student.name}</strong>, portador(a) do CPF nº{' '}
                <strong className="text-slate-900 font-extrabold">{student.cpf}</strong>, encontra-se devidamente{' '}
                <strong className="text-teal-800 font-bold">MATRICULADO(A) E COM FREQUÊNCIA REGULAR</strong> sob o número de registro/matrícula{' '}
                <strong className="font-mono text-teal-900 font-bold">{student.enrollment}</strong>, no curso:{' '}
                <strong className="text-slate-900">{student.course}</strong>, turma{' '}
                <strong className="text-slate-900">{studentClass?.code || 'ENF-2026.1'} ({studentClass?.shift || 'Noite'})</strong>, no período letivo correspondente ao ano de 2026.
              </p>

              <p>
                O curso tem como objetivo a qualificação técnica e habilitação profissional na área da Enfermagem, em estrita consonância com as diretrizes do Conselho Federal de Enfermagem (COFEN) e Conselho Regional de Enfermagem (COREN).
              </p>

              <p>
                Por ser a expressão da verdade, firmamos a presente declaração para que produza os efeitos legais, administrativos ou acadêmicos que se fizerem necessários, inclusive para fins de estágio extracurricular, passe escolar ou comprovação de vínculo estudantil.
              </p>
            </div>

            <div className="text-right text-xs text-slate-600 my-8">
              São Paulo, {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.
            </div>

            {/* Signatures */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="w-52 mx-auto border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-900">Secretaria de Registros Acadêmicos</p>
                <p className="text-[10px] text-slate-500">CETS Saúde</p>
              </div>
              <div>
                <div className="w-52 mx-auto border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-900">{config?.directorName || 'Profª. Dra. Helena Vasconcelos'}</p>
                <p className="text-[10px] text-slate-500">Direção Geral</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Autenticidade digital verificável através do portal cetssaude.com.br com a chave de validação
              </span>
              <span className="font-mono font-bold text-slate-600">CETS-{student.enrollment}-2026</span>
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

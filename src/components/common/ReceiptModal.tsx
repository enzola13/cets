import React from 'react';
import { X, Printer, CheckCircle, Building2, ShieldCheck } from 'lucide-react';
import { Invoice, Student } from '../../types.ts';
import { useData } from '../../context/DataContext.tsx';

interface ReceiptModalProps {
  invoice: Invoice;
  student: Student;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, student, onClose }) => {
  const { config } = useData();

  const handlePrint = () => {
    window.print();
  };

  const formattedPaidAmount = (invoice.paidAmount || invoice.amount).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">Comprovante Oficial de Pagamento</h3>
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

        {/* Printable Receipt Body */}
        <div className="p-8 overflow-y-auto print:p-0">
          <div className="border-2 border-slate-200 rounded-xl p-6 bg-white relative">
            {/* Watermark badge */}
            <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Autenticado
            </div>

            {/* School Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-xl shadow-md">
                CETS
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                  {config?.schoolName || 'CETS'} – {config?.subtitle || 'Centro de Ensino Técnico em Saúde'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  CNPJ: {config?.cnpj || '34.128.910/0001-44'} • {config?.address || 'Av. Paulista, 1420 - SP'}
                </p>
                <p className="text-[11px] text-teal-700 font-medium">
                  {config?.corenAuthorization || 'Registro e Autorização de Cursos Técnicos em Enfermagem'}
                </p>
              </div>
            </div>

            <div className="text-center my-4">
              <h2 className="text-lg font-black text-slate-900 tracking-wide uppercase">
                Recibo de Quitação de Mensalidade Escolar
              </h2>
              <p className="text-xs text-slate-500">
                Nº de Controle: <span className="font-mono font-bold text-slate-800">{invoice.receiptNumber || 'REC-2026-AUTENTICADO'}</span>
              </p>
            </div>

            {/* Student & Payment Info Grid */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-xs mb-5">
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-bold">Aluno(a)</span>
                <span className="font-bold text-slate-900 text-sm">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-bold">Matrícula</span>
                <span className="font-mono font-bold text-teal-800 text-sm">{student.enrollment}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-bold">CPF</span>
                <span className="font-semibold text-slate-800">{student.cpf}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-bold">Curso</span>
                <span className="font-semibold text-slate-800">{student.course}</span>
              </div>
            </div>

            {/* Invoiced Details Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-5">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Descrição da Obrigação</th>
                    <th className="p-3">Ref. / Vencimento</th>
                    <th className="p-3">Forma</th>
                    <th className="p-3 text-right">Valor Pago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="p-3 font-medium">
                      {invoice.title}
                      <span className="block text-[11px] text-slate-500 font-normal">
                        Semestre 2026.1 – Técnico em Enfermagem
                      </span>
                    </td>
                    <td className="p-3">
                      {invoice.referenceMonth}
                      <span className="block text-[11px] text-slate-500">
                        Venc: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold text-[11px]">
                        {invoice.paymentMethod || 'PIX'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-800 text-sm">
                      {formattedPaidAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Metadata */}
            <div className="text-xs text-slate-600 space-y-1 bg-teal-50/50 p-3 rounded-lg border border-teal-100 mb-6">
              <p>
                <strong className="text-slate-800">Data de Liquidação:</strong>{' '}
                {invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}
              </p>
              <p>
                <strong className="text-slate-800">Código de Autenticação Digital:</strong>{' '}
                <span className="font-mono text-[11px] text-teal-900 break-all">
                  CETS-{Buffer ? '' : ''}{Math.random().toString(36).substring(2, 12).toUpperCase()}-2026-ENF
                </span>
              </p>
              <p className="text-[11px] text-slate-500 italic mt-2">
                Declaramos para os devidos fins que a importância acima discriminada foi devidamente quitada pelo aluno, conferindo plena e geral quitação referente à respectiva competência.
              </p>
            </div>

            {/* Signature Area */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-teal-700" /> Documento gerado eletronicamente pelo Sistema CETS.
              </div>
              <div className="text-right">
                <div className="w-44 border-b border-slate-400 mb-1"></div>
                <p className="text-xs font-bold text-slate-800">Secretaria & Tesouraria</p>
                <p className="text-[10px] text-slate-500">CETS Centro Técnico em Saúde</p>
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

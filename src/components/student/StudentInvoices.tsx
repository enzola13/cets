import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  FileCheck2,
  Copy,
  Check,
  Clock,
  AlertCircle,
  ShieldCheck,
  Filter,
  DollarSign,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { Invoice } from '../../types.ts';
import { PixModal } from '../common/PixModal.tsx';
import { ReceiptModal } from '../common/ReceiptModal.tsx';

export const StudentInvoices: React.FC = () => {
  const { studentProfile, user } = useAuth();
  const { students, getStudentInvoices, payInvoice } = useData();

  const [filter, setFilter] = useState<string>('TODAS');
  const [selectedPixInvoice, setSelectedPixInvoice] = useState<Invoice | null>(null);
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState<Invoice | null>(null);
  const [copiedBarcodeId, setCopiedBarcodeId] = useState<string | null>(null);

  const student = studentProfile || students.find((s) => s.userId === user?.id) || students[0];
  const invoices = student ? getStudentInvoices(student.id) : [];

  // Summary counts
  const totalCount = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === 'Pago');
  const openInvoices = invoices.filter((i) => i.status === 'A vencer' || i.status === 'Em aberto');
  const overdueInvoices = invoices.filter((i) => i.status === 'Atrasado');

  const filteredInvoices = invoices.filter((i) => {
    if (filter === 'PAGAS') return i.status === 'Pago';
    if (filter === 'ABERTO') return i.status === 'A vencer' || i.status === 'Em aberto';
    if (filter === 'ATRASADAS') return i.status === 'Atrasado';
    return true;
  });

  const handleCopyBarcode = (invoice: Invoice) => {
    navigator.clipboard.writeText(invoice.barcode);
    setCopiedBarcodeId(invoice.id);
    setTimeout(() => setCopiedBarcodeId(null), 3000);
  };

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Dados do aluno não encontrados.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Minhas Mensalidades
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestão financeira escolar, emissão de boletos, PIX instantâneo e comprovantes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {[
            { id: 'TODAS', label: 'Todas' },
            { id: 'ABERTO', label: 'Em Aberto' },
            { id: 'ATRASADAS', label: 'Atrasadas' },
            { id: 'PAGAS', label: 'Pagas' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all min-h-[40px] ${
                filter === item.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total de Mensalidades
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">faturas</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Mensalidades Pagas
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{paidInvoices.length}</span>
            <span className="text-[11px] text-slate-400 font-medium">quitadas</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Mensalidades em Aberto
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{openInvoices.length}</span>
            <span className="text-[11px] text-slate-400 font-medium">a vencer</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Mensalidades Atrasadas
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{overdueInvoices.length}</span>
            <span className="text-[11px] text-slate-400 font-medium">pendentes</span>
          </div>
        </div>
      </div>

      {/* Invoice List / Table */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
            Nenhuma mensalidade encontrada com o filtro selecionado.
          </div>
        ) : (
          filteredInvoices.map((inv) => {
            const isPaid = inv.status === 'Pago';
            const isOverdue = inv.status === 'Atrasado';

            return (
              <div
                key={inv.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-teal-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between md:justify-start gap-2">
                    <span className="font-extrabold text-slate-900 text-base sm:text-lg">{inv.title}</span>
                    <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                      Ref: {inv.referenceMonth}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-500">
                    <span>
                      Vencimento: <strong className="text-slate-800">{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</strong>
                    </span>
                    {inv.paidDate && (
                      <span className="text-emerald-700 font-semibold">
                        Pago em: {new Date(inv.paidDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="flex items-center justify-between sm:block text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Valor da Fatura</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      {inv.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isOverdue
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {inv.status}
                    </span>

                    {/* Action Buttons */}
                    {isPaid ? (
                      <button
                        onClick={() => setSelectedReceiptInvoice(inv)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-colors min-h-[44px]"
                      >
                        <FileCheck2 className="w-4 h-4 text-emerald-600" /> Ver Comprovante
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                        <button
                          onClick={() => handleCopyBarcode(inv)}
                          className="p-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Copiar Linha Digitável / Código de Barras"
                        >
                          {copiedBarcodeId === inv.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => setSelectedPixInvoice(inv)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 min-h-[44px]"
                        >
                          <QrCode className="w-4 h-4 text-teal-200" /> Pagar via PIX
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Safety & Bank Rules Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800">Instruções de Pagamento Bancário:</p>
          <p className="mt-0.5 leading-relaxed">
            O pagamento via PIX é compensado instantaneamente no sistema CETS. Caso prefira pagar via boleto bancário tradicional, utilize a linha digitável nos canais de autoatendimento bancário.
          </p>
        </div>
      </div>

      {/* Modals */}
      {selectedPixInvoice && (
        <PixModal
          invoice={selectedPixInvoice}
          studentName={student.name}
          onClose={() => setSelectedPixInvoice(null)}
          onConfirmPayment={async () => {
            await payInvoice(selectedPixInvoice.id, {
              paymentMethod: 'PIX',
              notes: 'Simulação de pagamento pelo aluno',
            });
            setSelectedPixInvoice(null);
          }}
        />
      )}

      {selectedReceiptInvoice && (
        <ReceiptModal
          invoice={selectedReceiptInvoice}
          student={student}
          onClose={() => setSelectedReceiptInvoice(null)}
        />
      )}
    </div>
  );
};

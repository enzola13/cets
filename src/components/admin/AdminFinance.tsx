import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  QrCode,
  Search,
  Filter,
  DollarSign,
  Download,
} from 'lucide-react';
import { useData } from '../../context/DataContext.tsx';
import { Invoice } from '../../types.ts';
import { ReceiptModal } from '../common/ReceiptModal.tsx';
import { PixModal } from '../common/PixModal.tsx';

export const AdminFinance: React.FC = () => {
  const { invoices, students, payInvoice } = useData();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState<Invoice | null>(null);
  const [selectedPixInvoice, setSelectedPixInvoice] = useState<Invoice | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const totalReceived = invoices
    .filter((i) => i.status === 'Pago')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalPending = invoices
    .filter((i) => i.status === 'A vencer')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalOverdue = invoices
    .filter((i) => i.status === 'Atrasado')
    .reduce((acc, i) => acc + i.amount, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const stu = students.find((s) => s.id === inv.studentId);
    const matchesSearch =
      !searchTerm ||
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu?.enrollment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleMarkPaid = async (invoiceId: string) => {
    await payInvoice(invoiceId, {
      paymentMethod: 'Dinheiro',
      notes: 'Baixa efetuada manualmente pelo painel administrativo',
    });
    setToastMsg('Fatura baixada com sucesso e recibo digital gerado!');
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-600 hover:underline">
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Gestão Financeira & Mensalidades
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Fluxo de arrecadação, controle de adimplência, baixas PIX e emissão de recibos
          </p>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Total Recebido</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {totalReceived.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">A Vencer</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {totalPending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Total em Atraso</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {totalOverdue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Faturas e Títulos ({filteredInvoices.length})</h3>
            <p className="text-xs text-slate-400">Controle individual de cobranças e conciliação bancária</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-1.5 w-full md:w-64 border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por aluno..."
                className="bg-transparent text-xs w-full outline-none text-slate-600"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="Pago">Pago</option>
              <option value="A vencer">A vencer</option>
              <option value="Atrasado">Atrasado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-[10px] uppercase text-slate-400 font-bold">
                <th className="px-6 py-3 border-b border-slate-100">Referência</th>
                <th className="px-6 py-3 border-b border-slate-100">Aluno</th>
                <th className="px-6 py-3 border-b border-slate-100">Vencimento</th>
                <th className="px-6 py-3 border-b border-slate-100">Valor</th>
                <th className="px-6 py-3 border-b border-slate-100">Status</th>
                <th className="px-6 py-3 border-b border-slate-100 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.map((inv) => {
                const stu = students.find((s) => s.id === inv.studentId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-xs text-slate-800">{inv.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.barcode.substring(0, 20)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-xs text-slate-800">{stu?.name || 'Aluno CETS'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{stu?.enrollment}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">
                      {inv.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          inv.status === 'Pago'
                            ? 'bg-green-100 text-green-700'
                            : inv.status === 'Atrasado'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status === 'Pago' ? (
                          <button
                            onClick={() => setSelectedReceiptInvoice(inv)}
                            className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Receipt className="w-3.5 h-3.5" /> Recibo
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedPixInvoice(inv)}
                              className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <QrCode className="w-3.5 h-3.5" /> PIX
                            </button>
                            <button
                              onClick={() => handleMarkPaid(inv.id)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                            >
                              Dar Baixa
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedReceiptInvoice && (
        <ReceiptModal
          invoice={selectedReceiptInvoice}
          student={students.find((s) => s.id === selectedReceiptInvoice.studentId) || students[0]}
          onClose={() => setSelectedReceiptInvoice(null)}
        />
      )}

      {selectedPixInvoice && (
        <PixModal
          invoice={selectedPixInvoice}
          studentName={students.find((s) => s.id === selectedPixInvoice.studentId)?.name || 'Aluno CETS'}
          onClose={() => setSelectedPixInvoice(null)}
          onConfirmPayment={async () => {
            await handleMarkPaid(selectedPixInvoice.id);
            setSelectedPixInvoice(null);
          }}
        />
      )}
    </div>
  );
};

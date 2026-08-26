import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ShieldCheck, Clock, Building2 } from 'lucide-react';
import { Invoice } from '../../types.ts';

interface PixModalProps {
  invoice: Invoice;
  studentName: string;
  onClose: () => void;
  onConfirmPayment?: () => void;
}

export const PixModal: React.FC<PixModalProps> = ({
  invoice,
  studentName,
  onClose,
  onConfirmPayment,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invoice.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formattedAmount = invoice.amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white p-4 sm:p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-500/30 text-teal-100 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-400/30 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" /> PIX Instantâneo CETS
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white pr-8">{invoice.title}</h3>
          <p className="text-teal-100/90 text-xs sm:text-sm mt-0.5">Aluno(a): {studentName}</p>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {/* Amount Box */}
          <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-4 text-center mb-5">
            <span className="text-xs font-medium uppercase tracking-wider text-teal-800">
              Valor com desconto de pontualidade
            </span>
            <div className="text-3xl font-extrabold text-teal-950 mt-1">
              {formattedAmount}
            </div>
            <div className="text-xs text-teal-700 flex items-center justify-center gap-1.5 mt-1.5">
              <Clock className="w-3.5 h-3.5" /> Vencimento oficial: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Simulated QR Code */}
          <div className="flex flex-col items-center justify-center mb-5">
            <div className="bg-white p-3 border-2 border-dashed border-teal-300 rounded-2xl shadow-inner relative group">
              <div className="w-48 h-48 bg-slate-950 rounded-xl p-2.5 flex flex-col justify-between relative overflow-hidden">
                {/* SVG pattern mimicking high-density QR */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 opacity-90">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 2 === 0 && i % 3 !== 1) || i === 0 || i === 5 || i === 30 || i === 35
                          ? 'bg-white'
                          : 'bg-teal-400'
                      }`}
                    />
                  ))}
                </div>
                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-teal-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> CETS PIX
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Abra o app do seu banco e aponte a câmera para o QR Code acima.
            </p>
          </div>

          {/* Copy-Paste PIX Code */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ou pague com PIX Copia e Cola:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={invoice.pixCode}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-700 hover:bg-teal-800 text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Institution Security Guarantee */}
          <div className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 mb-5">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Favorecido:</span> CETS Centro de Ensino Técnico em Saúde Ltda.<br />
              <span className="font-semibold text-slate-800">CNPJ:</span> 34.128.910/0001-44 • Chave PIX: financeiro@cetssaude.com.br
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Fechar
            </button>
            {onConfirmPayment && (
              <button
                onClick={() => {
                  onConfirmPayment();
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Simular Pagamento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

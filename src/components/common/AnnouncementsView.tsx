import React, { useState } from 'react';
import {
  BellRing,
  Calendar,
  Tag,
  Plus,
  CheckCircle2,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { AnnouncementCategory } from '../../types.ts';

export const AnnouncementsView: React.FC = () => {
  const { role, user } = useAuth();
  const { announcements, createAnnouncement } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Aviso Geral');
  const [toast, setToast] = useState<string | null>(null);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await createAnnouncement({
      title,
      content,
      category,
      priority: category === 'Urgente' ? 'alta' : 'normal',
      targetType: 'todos',
      authorName: user?.name || 'Coordenação Acadêmica CETS',
      active: true,
    });

    setTitle('');
    setContent('');
    setShowAddModal(false);
    setToast('Comunicado publicado com sucesso no mural!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Mural de Comunicados & Avisos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Informativos institucionais, oportunidades de estágio hospitalar e regulamentos
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Comunicado</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => {
          const categoryColors: Record<string, string> = {
            Geral: 'bg-teal-50 text-teal-800 border-teal-200',
            Urgente: 'bg-rose-50 text-rose-800 border-rose-200',
            Estágio: 'bg-blue-50 text-blue-800 border-blue-200',
            Financeiro: 'bg-amber-50 text-amber-800 border-amber-200',
            Acadêmico: 'bg-purple-50 text-purple-800 border-purple-200',
          };

          return (
            <div
              key={ann.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:border-slate-200 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                      categoryColors[ann.category] || 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ann.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ann.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                <span>Coordenação Geral CETS</span>
                <span className="text-teal-600 font-semibold">Oficial</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Publicar Novo Comunicado</h3>
            <p className="text-xs text-slate-400 mb-4">O aviso ficará visível a todos os alunos e professores.</p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Título do Comunicado
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Início das Inscrições para Estágio em UTI"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Geral">Geral</option>
                  <option value="Acadêmico">Acadêmico</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Conteúdo do Aviso
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva as instruções completas, datas, prazos e orientações aos discentes..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  FileCheck2,
  Award,
  FileText,
  CreditCard,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext.tsx';
import { Student } from '../../types.ts';
import { BoletimModal } from '../common/BoletimModal.tsx';
import { EnrollmentDeclarationModal } from '../common/EnrollmentDeclarationModal.tsx';

interface AdminStudentsProps {
  searchFilter?: string;
  isNewStudentModalOpen?: boolean;
  onCloseNewStudentModal?: () => void;
}

export const AdminStudents: React.FC<AdminStudentsProps> = ({
  searchFilter = '',
  isNewStudentModalOpen = false,
  onCloseNewStudentModal,
}) => {
  const { students, classes, addStudent, updateStudent, deleteStudent } = useData();
  const [localSearch, setLocalSearch] = useState(searchFilter);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStudentForBoletim, setSelectedStudentForBoletim] = useState<Student | null>(null);
  const [selectedStudentForDecl, setSelectedStudentForDecl] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(isNewStudentModalOpen);

  // Form states for new student
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [course, setCourse] = useState('Técnico em Enfermagem');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeSearch = localSearch || searchFilter;

  const filtered = students.filter((s) => {
    const matchesSearch =
      !activeSearch ||
      s.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.enrollment.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.cpf.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(activeSearch.toLowerCase());

    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    const matchesStatus = selectedStatus === 'all' || s.academicStatus === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpf || !email) return;

    const newEnrollment = `CETS2026${Math.floor(100 + Math.random() * 900)}`;

    await addStudent({
      userId: `user-stu-${Date.now()}`,
      name,
      email,
      cpf,
      phone,
      enrollment: newEnrollment,
      classId: classId || classes[0]?.id,
      course,
      semester: 1,
      academicStatus: 'Ativo',
      registrationDate: new Date().toISOString().split('T')[0],
      bloodType: 'O+',
      hasAllergy: false,
    });

    setName('');
    setEmail('');
    setCpf('');
    setPhone('');
    setShowAddModal(false);
    if (onCloseNewStudentModal) onCloseNewStudentModal();

    setSuccessToast(`Aluno(a) cadastrado(a) com sucesso! Matrícula gerada: ${newEnrollment}`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Gestão de Alunos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Registro geral de estudantes, turmas vinculadas e emissão documental
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Aluno</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center bg-slate-100 rounded-full px-4 py-1.5 w-full md:w-80 border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filtrar por nome, CPF ou matrícula..."
            className="bg-transparent text-xs w-full outline-none text-slate-600 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Todas as Turmas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Trancado">Trancado</option>
            <option value="Formado">Formado</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            Listagem de Alunos ({filtered.length})
          </h3>
          <span className="text-xs text-slate-400">
            Total matriculados no CETS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-[10px] uppercase text-slate-400 font-bold">
                <th className="px-6 py-3 border-b border-slate-100">Aluno</th>
                <th className="px-6 py-3 border-b border-slate-100">Matrícula</th>
                <th className="px-6 py-3 border-b border-slate-100">Turma</th>
                <th className="px-6 py-3 border-b border-slate-100">Curso</th>
                <th className="px-6 py-3 border-b border-slate-100">Status</th>
                <th className="px-6 py-3 border-b border-slate-100 text-right">Documentos & Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-slate-400">
                    Nenhum aluno encontrado para os critérios selecionados.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => {
                  const studentClass = classes.find((c) => c.id === student.classId);
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              CPF: {student.cpf} • {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono font-medium text-slate-600">
                        {student.enrollment}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {studentClass?.code || 'ENF-2026.1'}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {student.course}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            student.academicStatus === 'Ativo'
                              ? 'bg-green-100 text-green-700'
                              : student.academicStatus === 'Formado'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {student.academicStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForBoletim(student)}
                            title="Emitir Boletim Oficial"
                            className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Boletim</span>
                          </button>
                          <button
                            onClick={() => setSelectedStudentForDecl(student)}
                            title="Declaração de Matrícula"
                            className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Declaração</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Student */}
      {(showAddModal || isNewStudentModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Novo Cadastro de Aluno</h3>
                <p className="text-xs text-slate-400">Insira os dados do estudante para emissão da matrícula CETS</p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  if (onCloseNewStudentModal) onCloseNewStudentModal();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Beatriz Silva Medeiros"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    required
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  E-mail Acadêmico / Pessoal
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@exemplo.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Turma Inicial
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Curso Técnico
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  >
                    <option value="Técnico em Enfermagem">Técnico em Enfermagem</option>
                    <option value="Técnico em Radiologia">Técnico em Radiologia</option>
                    <option value="Técnico em Estética">Técnico em Estética</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    if (onCloseNewStudentModal) onCloseNewStudentModal();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20"
                >
                  Concluir Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedStudentForBoletim && (
        <BoletimModal
          student={selectedStudentForBoletim}
          onClose={() => setSelectedStudentForBoletim(null)}
        />
      )}

      {selectedStudentForDecl && (
        <EnrollmentDeclarationModal
          student={selectedStudentForDecl}
          onClose={() => setSelectedStudentForDecl(null)}
        />
      )}
    </div>
  );
};

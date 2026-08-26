export type UserRole = 'aluno' | 'professor' | 'admin';

export type AcademicStatus = 'Ativo' | 'Trancado' | 'Concluído' | 'Evadido';

export type InvoiceStatus = 'Pago' | 'A vencer' | 'Atrasado' | 'Em aberto';

export type GradeStatus = 'Aprovado' | 'Em andamento' | 'Recuperação' | 'Reprovado';

export type AttendanceStatus = 'Presença' | 'Falta' | 'Falta Justificada';

export type Shift = 'Manhã' | 'Tarde' | 'Noite' | 'Integral';

export type AnnouncementCategory = 
  | 'Aviso Geral' 
  | 'Acadêmico' 
  | 'Estágio e Laboratório' 
  | 'Financeiro' 
  | 'Urgente'
  | 'Evento';

export type AnnouncementTargetType = 'todos' | 'turma' | 'aluno' | 'professores';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  referenceId?: string; // Links to studentId or teacherId
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  userId: string;
  enrollment: string; // e.g. CETS2026001
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  classId: string;
  course: string; // e.g. "Técnico em Enfermagem"
  enrollmentDate: string;
  academicStatus: AcademicStatus;
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  avatarUrl?: string;
  notes?: string;
}

export interface Teacher {
  id: string;
  userId: string;
  registrationCode: string; // e.g. PROF202601
  name: string;
  cpf: string;
  corenOrCrm: string; // e.g. COREN-SP 18942-ENF
  specialty: string; // e.g. Enfermagem em Terapia Intensiva & Semiotécnica
  phone: string;
  email: string;
  subjectIds: string[];
  status: 'active' | 'inactive';
  avatarUrl?: string;
}

export interface ClassGroup {
  id: string;
  code: string; // e.g. ENF-2026.1-N
  name: string; // e.g. Técnico em Enfermagem - Turma Alpha
  shift: Shift;
  semester: number; // 1, 2, 3, 4
  module: string; // e.g. "Módulo I - Fundamentos e Anatomia"
  room: string; // e.g. "Sala 204 - Bloco Saúde"
  year: number;
  status: 'Em andamento' | 'Planejada' | 'Concluída';
  teacherAdvisorId?: string;
  maxStudents?: number;
}

export interface Subject {
  id: string;
  code: string; // e.g. ENF101
  name: string; // e.g. Anatomia e Fisiologia Humana
  workloadHours: number; // e.g. 80
  syllabus: string; // ementa
  module: number;
  teacherId?: string;
  isPracticalLab?: boolean;
}

export interface Schedule {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  startTime: string; // "19:00"
  endTime: string; // "22:30"
  room: string; // "Laboratório de Semiotécnica"
}

export interface GradeAudit {
  date: string;
  authorName: string;
  action: string;
  note?: string;
  oldGrade?: number | null;
  newGrade?: number | null;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  grade1: number | null; // 1ª Nota (0-10)
  grade2: number | null; // 2ª Nota (0-10)
  examGrade: number | null; // Exame/Recuperação (0-10)
  assignmentGrade: number | null; // Trabalhos/Práticas (0-10)
  average: number | null;
  status: GradeStatus;
  notes?: string;
  updatedBy: string;
  updatedAt: string;
  auditHistory: GradeAudit[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  justificationNotes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  title: string; // e.g. "Mensalidade Agosto/2026"
  referenceMonth: string; // e.g. "Agosto/2026"
  amount: number; // e.g. 339.90
  originalAmount: number;
  discount: number;
  penalty: number;
  dueDate: string; // YYYY-MM-DD
  status: InvoiceStatus;
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: 'PIX' | 'Boleto' | 'Cartão' | 'Dinheiro' | 'Transferência';
  barcode: string;
  pixCode: string;
  receiptNumber?: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: 'normal' | 'alta';
  targetType: AnnouncementTargetType;
  targetId?: string; // classId or studentId if targeted
  authorName: string;
  createdAt: string;
  active: boolean;
  tag?: string;
}

export interface SchoolConfig {
  schoolName: string;
  subtitle: string;
  slogan?: string;
  cnpj: string;
  address: string;
  cityState: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  directorName: string;
  corenAuthorization: string;
  minimumPassingGrade: number; // e.g. 7.0
  recoveryThreshold: number; // e.g. 5.0
  minimumAttendancePercentage: number; // e.g. 75
  currentTerm: string;
}

export interface DatabaseSchema {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  classes: ClassGroup[];
  subjects: Subject[];
  schedules: Schedule[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  invoices: Invoice[];
  announcements: Announcement[];
  config: SchoolConfig;
}

export interface AuthSession {
  token: string;
  user: User;
  studentProfile?: Student;
  teacherProfile?: Teacher;
}

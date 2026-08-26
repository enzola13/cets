import {
  DatabaseSchema,
  User,
  Student,
  Teacher,
  ClassGroup,
  Subject,
  Schedule,
  Grade,
  AttendanceRecord,
  Invoice,
  Announcement,
  SchoolConfig,
  AuthSession,
} from '../types.ts';
import { initialDatabaseSeed } from '../data/seedData.ts';

const LOCAL_STORAGE_KEY = 'cets_school_database_v1';

class ClientStorageStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseSchema {
    if (typeof window === 'undefined') {
      return JSON.parse(JSON.stringify(initialDatabaseSeed));
    }
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DatabaseSchema;
        if (parsed && parsed.users && parsed.students && parsed.config) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using seed:', e);
    }
    const seed = JSON.parse(JSON.stringify(initialDatabaseSeed));
    this.saveToStorage(seed);
    return seed;
  }

  private saveToStorage(dataToSave: DatabaseSchema = this.data) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  public resetDemoData(): DatabaseSchema {
    this.data = JSON.parse(JSON.stringify(initialDatabaseSeed));
    this.saveToStorage();
    return this.data;
  }

  public getFullDatabase(): DatabaseSchema {
    return this.data;
  }

  // Auth
  public login(credentials: { username: string; password: string }): AuthSession {
    const { username, password } = credentials;
    const cleanUser = username.trim().toLowerCase();
    const user = this.data.users.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        u.email.toLowerCase() === cleanUser
    );

    if (!user) {
      throw new Error('Usuário ou matrícula não encontrados.');
    }

    if (user.password !== password) {
      throw new Error('Senha incorreta. Tente novamente.');
    }

    if (user.status !== 'active') {
      throw new Error('Conta inativa. Entre em contato com a secretaria da CETS.');
    }

    let studentProfile: Student | undefined;
    let teacherProfile: Teacher | undefined;

    if (user.role === 'aluno') {
      studentProfile = this.data.students.find((s) => s.userId === user.id || s.id === user.referenceId);
    } else if (user.role === 'professor') {
      teacherProfile = this.data.teachers.find((t) => t.userId === user.id || t.id === user.referenceId);
    }

    const safeUser = { ...user };
    delete (safeUser as any).password;

    return {
      token: `token-${user.id}-${Date.now()}`,
      user: safeUser,
      studentProfile,
      teacherProfile,
    };
  }

  // Users
  public createUser(user: User): User {
    this.data.users.push(user);
    this.saveToStorage();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveToStorage();
    return this.data.users[idx];
  }

  // Students
  public getStudents(): Student[] {
    return this.data.students;
  }

  public createStudent(data: Partial<Student> & { initialPassword?: string; username?: string }): { student: Student; user: User } {
    const allStudents = this.data.students;
    let enrollment = data.enrollment;
    if (!enrollment) {
      const nextNum = String(allStudents.length + 1).padStart(3, '0');
      enrollment = `CETS2026${nextNum}`;
    }

    const studentId = `stu-${Date.now()}`;
    const userId = `usr-${Date.now()}`;

    const user: User = {
      id: userId,
      username: data.username || enrollment,
      password: data.initialPassword || '123',
      name: data.name || 'Novo Aluno',
      email: data.email || `${enrollment.toLowerCase()}@aluno.cetssaude.com.br`,
      role: 'aluno',
      status: 'active',
      referenceId: studentId,
      createdAt: new Date().toISOString(),
    };
    this.createUser(user);

    const student: Student = {
      id: studentId,
      userId,
      enrollment,
      name: data.name || 'Novo Aluno',
      cpf: data.cpf || '',
      birthDate: data.birthDate || '2000-01-01',
      phone: data.phone || '',
      whatsapp: data.whatsapp || data.phone || '',
      email: data.email || user.email,
      address: data.address || '',
      classId: data.classId || (this.data.classes[0]?.id || 'cls-1'),
      course: data.course || 'Técnico em Enfermagem',
      enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0],
      academicStatus: data.academicStatus || 'Ativo',
      bloodType: data.bloodType || 'O+',
      emergencyContact: data.emergencyContact || '',
      emergencyPhone: data.emergencyPhone || '',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      notes: data.notes || '',
    };
    this.data.students.push(student);

    // Initial invoices
    const months = ['Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const currentYear = 2026;
    const nowMonth = new Date().getMonth();

    for (let i = 0; i < 5; i++) {
      const targetMonthIndex = (nowMonth + i) % 12;
      const monthName = months[targetMonthIndex] || 'Mês';
      const monthNum = String(targetMonthIndex + 1).padStart(2, '0');
      const invoiceId = `inv-${Date.now()}-${i}`;
      let status: Invoice['status'] = 'Em aberto';
      if (i === 0) status = 'A vencer';

      const inv: Invoice = {
        id: invoiceId,
        studentId: student.id,
        title: `Mensalidade ${monthName}/${currentYear}`,
        referenceMonth: `${monthName}/${currentYear}`,
        amount: 339.90,
        originalAmount: 339.90,
        discount: 0,
        penalty: 0,
        dueDate: `${currentYear}-${monthNum}-05`,
        status,
        barcode: `34191.79001 01043.510047 91020.150008 8 97470000033990`,
        pixCode: `00020126580014br.gov.bcb.pix0136cets-financeiro@cetssaude.com.br5204000053039865406339.905802BR5920CETS ENSINO SAUDE6009SAO PAULO62070503***6304A${i}B${i}`,
        notes: 'Mensalidade regular do curso Técnico em Enfermagem.',
      };
      this.data.invoices.push(inv);
    }

    this.saveToStorage();
    return { student, user };
  }

  public updateStudent(id: string, updates: Partial<Student>): Student {
    const idx = this.data.students.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Aluno não encontrado.');
    this.data.students[idx] = { ...this.data.students[idx], ...updates };
    if (this.data.students[idx].userId && (updates.name || updates.email)) {
      this.updateUser(this.data.students[idx].userId!, {
        name: updates.name,
        email: updates.email,
      });
    }
    this.saveToStorage();
    return this.data.students[idx];
  }

  public deleteStudent(id: string): { success: boolean } {
    const student = this.data.students.find((s) => s.id === id);
    if (!student) throw new Error('Aluno não encontrado.');
    this.data.students = this.data.students.filter((s) => s.id !== id);
    if (student.userId) {
      this.data.users = this.data.users.filter((u) => u.id !== student.userId);
    }
    this.data.grades = this.data.grades.filter((g) => g.studentId !== id);
    this.data.attendance = this.data.attendance.filter((a) => a.studentId !== id);
    this.data.invoices = this.data.invoices.filter((i) => i.studentId !== id);
    this.saveToStorage();
    return { success: true };
  }

  // Teachers
  public getTeachers(): Teacher[] {
    return this.data.teachers;
  }

  public createTeacher(data: Partial<Teacher> & { initialPassword?: string; username?: string }): { teacher: Teacher; user: User } {
    const teacherId = `tea-${Date.now()}`;
    const userId = `usr-tea-${Date.now()}`;
    const code = data.registrationCode || `PROF2026${String(this.data.teachers.length + 1).padStart(2, '0')}`;
    const username = data.username || (data.name ? data.name.toLowerCase().replace(/\s+/g, '.') : 'prof');

    const user: User = {
      id: userId,
      username,
      password: data.initialPassword || '123',
      name: data.name || 'Professor CETS',
      email: data.email || `${username}@cetssaude.com.br`,
      role: 'professor',
      status: 'active',
      referenceId: teacherId,
      createdAt: new Date().toISOString(),
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    };
    this.createUser(user);

    const teacher: Teacher = {
      id: teacherId,
      userId,
      registrationCode: code,
      name: data.name || 'Professor CETS',
      cpf: data.cpf || '',
      corenOrCrm: data.corenOrCrm || 'COREN 0000',
      specialty: data.specialty || 'Enfermagem Geral',
      phone: data.phone || '',
      email: data.email || user.email,
      subjectIds: data.subjectIds || [],
      status: 'active',
      avatarUrl: user.avatarUrl,
    };
    this.data.teachers.push(teacher);
    this.saveToStorage();
    return { teacher, user };
  }

  public updateTeacher(id: string, updates: Partial<Teacher>): Teacher {
    const idx = this.data.teachers.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Professor não encontrado.');
    this.data.teachers[idx] = { ...this.data.teachers[idx], ...updates };
    if (this.data.teachers[idx].userId && (updates.name || updates.email)) {
      this.updateUser(this.data.teachers[idx].userId!, {
        name: updates.name,
        email: updates.email,
      });
    }
    this.saveToStorage();
    return this.data.teachers[idx];
  }

  public deleteTeacher(id: string): { success: boolean } {
    const teacher = this.data.teachers.find((t) => t.id === id);
    if (!teacher) throw new Error('Professor não encontrado.');
    this.data.teachers = this.data.teachers.filter((t) => t.id !== id);
    if (teacher.userId) {
      this.data.users = this.data.users.filter((u) => u.id !== teacher.userId);
    }
    this.saveToStorage();
    return { success: true };
  }

  // Classes
  public getClasses(): ClassGroup[] {
    return this.data.classes;
  }

  public createClass(cls: Partial<ClassGroup>): ClassGroup {
    const newClass: ClassGroup = {
      id: `cls-${Date.now()}`,
      code: cls.code || 'NOVA-TURMA',
      name: cls.name || 'Nova Turma',
      shift: cls.shift || 'Noite',
      semester: Number(cls.semester) || 1,
      module: cls.module || 'Módulo I - Fundamentos',
      room: cls.room || 'Sala 204',
      year: Number(cls.year) || 2026,
      status: cls.status || 'Em andamento',
      teacherAdvisorId: cls.teacherAdvisorId,
      maxStudents: Number(cls.maxStudents) || 35,
    };
    this.data.classes.push(newClass);
    this.saveToStorage();
    return newClass;
  }

  public updateClass(id: string, updates: Partial<ClassGroup>): ClassGroup {
    const idx = this.data.classes.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Turma não encontrada.');
    this.data.classes[idx] = { ...this.data.classes[idx], ...updates };
    this.saveToStorage();
    return this.data.classes[idx];
  }

  public deleteClass(id: string): { success: boolean } {
    this.data.classes = this.data.classes.filter((c) => c.id !== id);
    this.saveToStorage();
    return { success: true };
  }

  // Subjects
  public getSubjects(): Subject[] {
    return this.data.subjects;
  }

  public createSubject(data: Partial<Subject>): Subject {
    const sub: Subject = {
      id: `sub-${Date.now()}`,
      code: data.code || 'DISC001',
      name: data.name || 'Nova Disciplina',
      workloadHours: Number(data.workloadHours) || 60,
      syllabus: data.syllabus || '',
      module: Number(data.module) || 1,
      teacherId: data.teacherId,
      isPracticalLab: Boolean(data.isPracticalLab),
    };
    this.data.subjects.push(sub);
    this.saveToStorage();
    return sub;
  }

  public updateSubject(id: string, updates: Partial<Subject>): Subject {
    const idx = this.data.subjects.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Disciplina não encontrada.');
    this.data.subjects[idx] = { ...this.data.subjects[idx], ...updates };
    this.saveToStorage();
    return this.data.subjects[idx];
  }

  public deleteSubject(id: string): { success: boolean } {
    this.data.subjects = this.data.subjects.filter((s) => s.id !== id);
    this.saveToStorage();
    return { success: true };
  }

  // Schedules
  public getSchedules(): Schedule[] {
    return this.data.schedules;
  }

  public createSchedule(data: Partial<Schedule>): Schedule {
    const sch: Schedule = {
      id: `sch-${Date.now()}`,
      classId: data.classId || (this.data.classes[0]?.id || 'cls-1'),
      subjectId: data.subjectId || (this.data.subjects[0]?.id || 'sub-1'),
      teacherId: data.teacherId || (this.data.teachers[0]?.id || 'tea-1'),
      dayOfWeek: data.dayOfWeek || 'Segunda',
      startTime: data.startTime || '19:00',
      endTime: data.endTime || '22:30',
      room: data.room || 'Sala 204',
    };
    this.data.schedules.push(sch);
    this.saveToStorage();
    return sch;
  }

  public updateSchedule(id: string, updates: Partial<Schedule>): Schedule {
    const idx = this.data.schedules.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Horário não encontrado.');
    this.data.schedules[idx] = { ...this.data.schedules[idx], ...updates };
    this.saveToStorage();
    return this.data.schedules[idx];
  }

  public deleteSchedule(id: string): { success: boolean } {
    this.data.schedules = this.data.schedules.filter((s) => s.id !== id);
    this.saveToStorage();
    return { success: true };
  }

  // Grades
  public getGrades(): Grade[] {
    return this.data.grades;
  }

  public upsertGrade(gradeData: {
    id?: string;
    studentId: string;
    subjectId: string;
    classId?: string;
    grade1?: number | null;
    grade2?: number | null;
    examGrade?: number | null;
    assignmentGrade?: number | null;
    notes?: string;
    updatedBy?: string;
    auditNote?: string;
  }): Grade {
    let existingIndex = -1;
    if (gradeData.id) {
      existingIndex = this.data.grades.findIndex((g) => g.id === gradeData.id);
    } else {
      existingIndex = this.data.grades.findIndex(
        (g) => g.studentId === gradeData.studentId && g.subjectId === gradeData.subjectId
      );
    }

    const g1 = gradeData.grade1;
    const g2 = gradeData.grade2;
    const exam = gradeData.examGrade;
    const assign = gradeData.assignmentGrade;

    let average: number | null = null;
    let status: Grade['status'] = 'Em andamento';

    if (g1 !== null && g1 !== undefined && g2 !== null && g2 !== undefined) {
      let computed = (Number(g1) + Number(g2)) / 2;
      if (assign !== null && assign !== undefined) {
        computed = Number((computed * 0.7 + Number(assign) * 0.3).toFixed(1));
      } else {
        computed = Number(computed.toFixed(1));
      }

      if (exam !== null && exam !== undefined) {
        computed = Number(((computed + Number(exam)) / 2).toFixed(1));
      }

      average = computed;
      if (average >= (this.data.config?.minimumPassingGrade || 7.0)) {
        status = 'Aprovado';
      } else if (average >= (this.data.config?.recoveryThreshold || 5.0)) {
        status = exam !== null ? 'Reprovado' : 'Recuperação';
      } else {
        status = 'Reprovado';
      }
    } else {
      if (g1 !== null && g1 !== undefined && assign !== null && assign !== undefined) {
        average = Number(((Number(g1) + Number(assign)) / 2).toFixed(1));
      } else if (g1 !== null && g1 !== undefined) {
        average = Number(Number(g1).toFixed(1));
      }
      status = 'Em andamento';
    }

    const existing = existingIndex >= 0 ? this.data.grades[existingIndex] : null;
    const auditHistory = existing?.auditHistory ? [...existing.auditHistory] : [];
    auditHistory.unshift({
      date: new Date().toISOString(),
      authorName: gradeData.updatedBy || 'Professor / Secretaria CETS',
      action: existing ? 'Alteração de Notas' : 'Lançamento Inicial de Notas',
      note: gradeData.auditNote || `1ª Nota: ${g1 ?? '-'}, 2ª Nota: ${g2 ?? '-'}, Exame: ${exam ?? '-'}`,
      oldGrade: existing?.average,
      newGrade: average,
    });

    if (existingIndex >= 0 && existing) {
      const updated: Grade = {
        ...existing,
        ...gradeData,
        id: existing.id,
        average,
        status,
        updatedAt: new Date().toISOString(),
        auditHistory,
      };
      this.data.grades[existingIndex] = updated;
      this.saveToStorage();
      return updated;
    } else {
      const newGrade: Grade = {
        id: gradeData.id || `grd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        studentId: gradeData.studentId,
        subjectId: gradeData.subjectId,
        classId: gradeData.classId || 'cls-1',
        grade1: g1 !== undefined && g1 !== null ? Number(g1) : null,
        grade2: g2 !== undefined && g2 !== null ? Number(g2) : null,
        examGrade: exam !== undefined && exam !== null ? Number(exam) : null,
        assignmentGrade: assign !== undefined && assign !== null ? Number(assign) : null,
        average,
        status,
        notes: gradeData.notes,
        updatedBy: gradeData.updatedBy || 'Professor / Secretaria CETS',
        updatedAt: new Date().toISOString(),
        auditHistory,
      };
      this.data.grades.push(newGrade);
      this.saveToStorage();
      return newGrade;
    }
  }

  // Attendance
  public getAttendance(): AttendanceRecord[] {
    return this.data.attendance;
  }

  public saveAttendanceBatch(records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]): { success: boolean; count: number; records: AttendanceRecord[] } {
    const saved: AttendanceRecord[] = [];
    for (const rec of records) {
      const existingIdx = this.data.attendance.findIndex(
        (a) => a.studentId === rec.studentId && a.subjectId === rec.subjectId && a.date === rec.date
      );

      if (existingIdx >= 0) {
        this.data.attendance[existingIdx] = {
          ...this.data.attendance[existingIdx],
          status: rec.status,
          justificationNotes: rec.justificationNotes,
          recordedBy: rec.recordedBy,
          recordedAt: new Date().toISOString(),
        };
        saved.push(this.data.attendance[existingIdx]);
      } else {
        const newRecord: AttendanceRecord = {
          ...rec,
          id: `att-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          recordedAt: new Date().toISOString(),
        };
        this.data.attendance.push(newRecord);
        saved.push(newRecord);
      }
    }
    this.saveToStorage();
    return { success: true, count: saved.length, records: saved };
  }

  // Invoices
  public getInvoices(): Invoice[] {
    return this.data.invoices;
  }

  public createInvoice(data: Partial<Invoice>): Invoice {
    const invId = `inv-${Date.now()}`;
    const inv: Invoice = {
      id: invId,
      studentId: data.studentId || 'stu-1',
      title: data.title || `Mensalidade ${data.referenceMonth || 'Ref. 2026'}`,
      referenceMonth: data.referenceMonth || 'Agosto/2026',
      amount: Number(data.amount || 339.90),
      originalAmount: Number(data.originalAmount || data.amount || 339.90),
      discount: Number(data.discount || 0),
      penalty: Number(data.penalty || 0),
      dueDate: data.dueDate || '2026-09-05',
      status: data.status || 'A vencer',
      paidDate: data.paidDate,
      paidAmount: data.paidAmount ? Number(data.paidAmount) : undefined,
      paymentMethod: data.paymentMethod,
      barcode: data.barcode || `34191.79001 01043.510047 91020.150008 8 974700000${Math.floor(Number(data.amount || 339.90) * 100)}`,
      pixCode: data.pixCode || `00020126580014br.gov.bcb.pix0136cets-financeiro@cetssaude.com.br5204000053039865406${data.amount || 339.90}5802BR5920CETS ENSINO SAUDE6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      receiptNumber: data.receiptNumber,
      notes: data.notes || '',
    };
    this.data.invoices.push(inv);
    this.saveToStorage();
    return inv;
  }

  public updateInvoice(id: string, updates: Partial<Invoice>): Invoice {
    const idx = this.data.invoices.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Mensalidade não encontrada.');
    this.data.invoices[idx] = { ...this.data.invoices[idx], ...updates };
    this.saveToStorage();
    return this.data.invoices[idx];
  }

  public payInvoice(
    id: string,
    data: {
      paidAmount?: number;
      paymentMethod?: Invoice['paymentMethod'];
      discount?: number;
      penalty?: number;
      notes?: string;
    }
  ): Invoice {
    const idx = this.data.invoices.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Mensalidade não encontrada.');
    const current = this.data.invoices[idx];
    const finalAmount = Number(data.paidAmount || current.amount);
    const receiptNumber = `REC-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated: Invoice = {
      ...current,
      status: 'Pago',
      paidDate: new Date().toISOString().split('T')[0],
      paidAmount: finalAmount,
      paymentMethod: data.paymentMethod || 'PIX',
      discount: data.discount !== undefined ? Number(data.discount) : current.discount,
      penalty: data.penalty !== undefined ? Number(data.penalty) : current.penalty,
      receiptNumber,
      notes: data.notes || current.notes || 'Pagamento confirmado e compensado.',
    };
    this.data.invoices[idx] = updated;
    this.saveToStorage();
    return updated;
  }

  public bulkGenerateInvoices(data: { classId?: string; referenceMonth: string; dueDate: string; amount: number }): { success: boolean; count: number; invoices: Invoice[] } {
    let targetStudents = this.data.students.filter((s) => s.academicStatus === 'Ativo');
    if (data.classId && data.classId !== 'all') {
      targetStudents = targetStudents.filter((s) => s.classId === data.classId);
    }

    const created: Invoice[] = [];
    for (const stu of targetStudents) {
      const inv: Invoice = {
        id: `inv-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        studentId: stu.id,
        title: `Mensalidade ${data.referenceMonth}`,
        referenceMonth: data.referenceMonth,
        amount: Number(data.amount),
        originalAmount: Number(data.amount),
        discount: 0,
        penalty: 0,
        dueDate: data.dueDate,
        status: 'A vencer',
        barcode: `34191.79001 01043.510047 91020.150008 8 974700000${Math.floor(Number(data.amount) * 100)}`,
        pixCode: `00020126580014br.gov.bcb.pix0136cets-financeiro@cetssaude.com.br5204000053039865406${data.amount}5802BR5920CETS ENSINO SAUDE6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        notes: `Emissão em lote para ${stu.name}`,
      };
      this.data.invoices.push(inv);
      created.push(inv);
    }
    this.saveToStorage();
    return { success: true, count: created.length, invoices: created };
  }

  public deleteInvoice(id: string): { success: boolean } {
    this.data.invoices = this.data.invoices.filter((i) => i.id !== id);
    this.saveToStorage();
    return { success: true };
  }

  // Announcements
  public getAnnouncements(): Announcement[] {
    return this.data.announcements;
  }

  public createAnnouncement(data: Partial<Announcement>): Announcement {
    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title || 'Novo Comunicado',
      content: data.content || '',
      category: data.category || 'Aviso Geral',
      priority: data.priority || 'normal',
      targetType: data.targetType || 'todos',
      targetId: data.targetId,
      authorName: data.authorName || 'Direção CETS',
      createdAt: new Date().toISOString(),
      active: true,
      tag: data.tag,
    };
    this.data.announcements.unshift(ann);
    this.saveToStorage();
    return ann;
  }

  public updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement {
    const idx = this.data.announcements.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Comunicado não encontrado.');
    this.data.announcements[idx] = { ...this.data.announcements[idx], ...updates };
    this.saveToStorage();
    return this.data.announcements[idx];
  }

  public deleteAnnouncement(id: string): { success: boolean } {
    this.data.announcements = this.data.announcements.filter((a) => a.id !== id);
    this.saveToStorage();
    return { success: true };
  }

  // Config
  public getConfig(): SchoolConfig {
    return this.data.config;
  }

  public updateConfig(updates: Partial<SchoolConfig>): SchoolConfig {
    this.data.config = { ...this.data.config, ...updates };
    this.saveToStorage();
    return this.data.config;
  }
}

export const clientStorage = new ClientStorageStore();

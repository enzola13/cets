import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { User, Student, Teacher, ClassGroup, Subject, Schedule, Grade, AttendanceRecord, Invoice, Announcement } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // AUTH ROUTES
  // ==========================================

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Informe a matrícula/usuário e a senha.' });
    }

    const user = db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou matrícula não encontrados.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Conta inativa. Entre em contato com a secretaria da CETS.' });
    }

    let studentProfile: Student | undefined;
    let teacherProfile: Teacher | undefined;

    if (user.role === 'aluno') {
      studentProfile = db.getStudentByUserId(user.id);
      if (!studentProfile && user.referenceId) {
        studentProfile = db.getStudentById(user.referenceId);
      }
    } else if (user.role === 'professor') {
      teacherProfile = db.getTeacherByUserId(user.id);
      if (!teacherProfile && user.referenceId) {
        teacherProfile = db.getTeacherById(user.referenceId);
      }
    }

    const safeUser = { ...user };
    delete safeUser.password;

    res.json({
      token: `token-${user.id}-${Date.now()}`,
      user: safeUser,
      studentProfile,
      teacherProfile,
    });
  });

  app.post('/api/auth/change-password', (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !newPassword) {
      return res.status(400).json({ error: 'Parâmetros incompletos.' });
    }

    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (currentPassword && user.password !== currentPassword) {
      return res.status(400).json({ error: 'Senha atual incorreta.' });
    }

    db.updateUser(userId, { password: newPassword });
    res.json({ success: true, message: 'Senha atualizada com sucesso!' });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: 'Informe a matrícula, CPF ou e-mail cadastrado.' });
    }

    const user = db.getUserByUsername(identifier);
    const student = db.getStudents().find(
      (s) => s.enrollment.toLowerCase() === identifier.trim().toLowerCase() ||
             s.cpf.replace(/\D/g, '') === identifier.replace(/\D/g, '') ||
             s.email.toLowerCase() === identifier.trim().toLowerCase()
    );

    if (user || student) {
      return res.json({
        success: true,
        message: 'Instruções de redefinição foram enviadas para o e-mail cadastrado. Em ambiente acadêmico demonstrativo, a senha padrão para testes é "123". Se precisar de auxílio imediato, procure a Secretaria Acadêmica.',
      });
    }

    res.status(404).json({
      error: 'Nenhum registro acadêmico localizado com estes dados. Verifique e tente novamente.',
    });
  });

  // ==========================================
  // DASHBOARD & FULL DB
  // ==========================================

  app.get('/api/bootstrap', (req, res) => {
    res.json(db.getFullDatabase());
  });

  app.post('/api/reset-demo', (req, res) => {
    const fresh = db.resetDemoData();
    res.json({ success: true, data: fresh });
  });

  // ==========================================
  // STUDENTS CRUD
  // ==========================================

  app.get('/api/students', (req, res) => {
    res.json(db.getStudents());
  });

  app.post('/api/students', (req, res) => {
    const data = req.body;
    if (!data.name || !data.cpf) {
      return res.status(400).json({ error: 'Nome e CPF são obrigatórios.' });
    }

    // Auto generate enrollment if not provided e.g. CETS2026 + 3 digits
    let enrollment = data.enrollment;
    if (!enrollment) {
      const allStudents = db.getStudents();
      const nextNum = String(allStudents.length + 1).padStart(3, '0');
      enrollment = `CETS2026${nextNum}`;
    }

    const studentId = `stu-${Date.now()}`;
    const userId = `usr-${Date.now()}`;

    // Create user credentials
    const initialPassword = data.initialPassword || '123';
    const user: User = {
      id: userId,
      username: data.username || enrollment,
      password: initialPassword,
      name: data.name,
      email: data.email || `${enrollment.toLowerCase()}@aluno.cetssaude.com.br`,
      role: 'aluno',
      status: 'active',
      referenceId: studentId,
      createdAt: new Date().toISOString(),
    };
    db.createUser(user);

    const student: Student = {
      id: studentId,
      userId: userId,
      enrollment,
      name: data.name,
      cpf: data.cpf,
      birthDate: data.birthDate || '2000-01-01',
      phone: data.phone || '',
      whatsapp: data.whatsapp || data.phone || '',
      email: data.email || user.email,
      address: data.address || '',
      classId: data.classId || (db.getClasses()[0]?.id || 'cls-1'),
      course: data.course || 'Técnico em Enfermagem',
      enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0],
      academicStatus: data.academicStatus || 'Ativo',
      bloodType: data.bloodType || 'O+',
      emergencyContact: data.emergencyContact || '',
      emergencyPhone: data.emergencyPhone || '',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      notes: data.notes || '',
    };
    db.createStudent(student);

    // Also auto-generate initial 6 monthly invoices for this student
    const months = ['Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const currentYear = 2026;
    const nowMonth = new Date().getMonth(); // 0-based

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
        status: status,
        barcode: `34191.79001 01043.510047 91020.150008 8 97470000033990`,
        pixCode: `00020126580014br.gov.bcb.pix0136cets-financeiro@cetssaude.com.br5204000053039865406339.905802BR5920CETS ENSINO SAUDE6009SAO PAULO62070503***6304A${i}B${i}`,
        notes: 'Mensalidade regular do curso Técnico em Enfermagem.',
      };
      db.createInvoice(inv);
    }

    res.status(201).json({ student, user });
  });

  app.put('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const updated = db.updateStudent(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }
    // Also update associated user name/email if changed
    if (updated.userId && (req.body.name || req.body.email)) {
      db.updateUser(updated.userId, {
        name: req.body.name,
        email: req.body.email,
      });
    }
    res.json(updated);
  });

  app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const success = db.deleteStudent(id);
    if (!success) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }
    res.json({ success: true });
  });

  // ==========================================
  // TEACHERS CRUD
  // ==========================================

  app.get('/api/teachers', (req, res) => {
    res.json(db.getTeachers());
  });

  app.post('/api/teachers', (req, res) => {
    const data = req.body;
    if (!data.name || !data.corenOrCrm) {
      return res.status(400).json({ error: 'Nome e Registro Profissional (COREN/CRM) são obrigatórios.' });
    }

    const teacherId = `tea-${Date.now()}`;
    const userId = `usr-tea-${Date.now()}`;
    const code = data.registrationCode || `PROF2026${String(db.getTeachers().length + 1).padStart(2, '0')}`;
    const username = data.username || data.name.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const user: User = {
      id: userId,
      username,
      password: data.initialPassword || '123',
      name: data.name,
      email: data.email || `${username}@cetssaude.com.br`,
      role: 'professor',
      status: 'active',
      referenceId: teacherId,
      createdAt: new Date().toISOString(),
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    };
    db.createUser(user);

    const teacher: Teacher = {
      id: teacherId,
      userId: userId,
      registrationCode: code,
      name: data.name,
      cpf: data.cpf || '',
      corenOrCrm: data.corenOrCrm,
      specialty: data.specialty || 'Enfermagem Geral',
      phone: data.phone || '',
      email: data.email || user.email,
      subjectIds: data.subjectIds || [],
      status: 'active',
      avatarUrl: user.avatarUrl,
    };
    db.createTeacher(teacher);

    res.status(201).json({ teacher, user });
  });

  app.put('/api/teachers/:id', (req, res) => {
    const { id } = req.params;
    const updated = db.updateTeacher(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Professor não encontrado.' });
    }
    if (updated.userId && (req.body.name || req.body.email)) {
      db.updateUser(updated.userId, {
        name: req.body.name,
        email: req.body.email,
      });
    }
    res.json(updated);
  });

  app.delete('/api/teachers/:id', (req, res) => {
    const { id } = req.params;
    const success = db.deleteTeacher(id);
    if (!success) {
      return res.status(404).json({ error: 'Professor não encontrado.' });
    }
    res.json({ success: true });
  });

  // ==========================================
  // CLASSES CRUD
  // ==========================================

  app.get('/api/classes', (req, res) => {
    res.json(db.getClasses());
  });

  app.post('/api/classes', (req, res) => {
    const data = req.body;
    if (!data.name || !data.code) {
      return res.status(400).json({ error: 'Nome e código da turma são obrigatórios.' });
    }
    const newClass: ClassGroup = {
      id: `cls-${Date.now()}`,
      code: data.code,
      name: data.name,
      shift: data.shift || 'Noite',
      semester: Number(data.semester) || 1,
      module: data.module || 'Módulo I - Fundamentos',
      room: data.room || 'Sala 204',
      year: Number(data.year) || 2026,
      status: data.status || 'Em andamento',
      teacherAdvisorId: data.teacherAdvisorId,
      maxStudents: Number(data.maxStudents) || 35,
    };
    db.createClass(newClass);
    res.status(201).json(newClass);
  });

  app.put('/api/classes/:id', (req, res) => {
    const { id } = req.params;
    const updated = db.updateClass(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Turma não encontrada.' });
    res.json(updated);
  });

  app.delete('/api/classes/:id', (req, res) => {
    const { id } = req.params;
    const success = db.deleteClass(id);
    if (!success) return res.status(404).json({ error: 'Turma não encontrada.' });
    res.json({ success: true });
  });

  // ==========================================
  // SUBJECTS CRUD
  // ==========================================

  app.get('/api/subjects', (req, res) => {
    res.json(db.getSubjects());
  });

  app.post('/api/subjects', (req, res) => {
    const data = req.body;
    if (!data.name || !data.code) {
      return res.status(400).json({ error: 'Nome e código da disciplina são obrigatórios.' });
    }
    const sub: Subject = {
      id: `sub-${Date.now()}`,
      code: data.code,
      name: data.name,
      workloadHours: Number(data.workloadHours) || 60,
      syllabus: data.syllabus || '',
      module: Number(data.module) || 1,
      teacherId: data.teacherId,
      isPracticalLab: Boolean(data.isPracticalLab),
    };
    db.createSubject(sub);
    res.status(201).json(sub);
  });

  app.put('/api/subjects/:id', (req, res) => {
    const { id } = req.params;
    const updated = db.updateSubject(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Disciplina não encontrada.' });
    res.json(updated);
  });

  app.delete('/api/subjects/:id', (req, res) => {
    const { id } = req.params;
    const success = db.deleteSubject(id);
    if (!success) return res.status(404).json({ error: 'Disciplina não encontrada.' });
    res.json({ success: true });
  });

  // ==========================================
  // SCHEDULES CRUD
  // ==========================================

  app.get('/api/schedules', (req, res) => {
    res.json(db.getSchedules());
  });

  app.post('/api/schedules', (req, res) => {
    const data = req.body;
    const sch: Schedule = {
      id: `sch-${Date.now()}`,
      classId: data.classId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
      dayOfWeek: data.dayOfWeek || 'Segunda',
      startTime: data.startTime || '19:00',
      endTime: data.endTime || '22:30',
      room: data.room || 'Sala 204',
    };
    db.createSchedule(sch);
    res.status(201).json(sch);
  });

  app.put('/api/schedules/:id', (req, res) => {
    const { id } = req.params;
    const updated = db.updateSchedule(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Horário não encontrado.' });
    res.json(updated);
  });

  app.delete('/api/schedules/:id', (req, res) => {
    const { id } = req.params;
    const success = db.deleteSchedule(id);
    if (!success) return res.status(404).json({ error: 'Horário não encontrado.' });
    res.json({ success: true });
  });

  // ==========================================
  // GRADES CRUD (With Audit History)
  // ==========================================

  app.get('/api/grades', (req, res) => {
    res.json(db.getGrades());
  });

  app.post('/api/grades/upsert', (req, res) => {
    const {
      id,
      studentId,
      subjectId,
      classId,
      grade1,
      grade2,
      examGrade,
      assignmentGrade,
      notes,
      updatedBy,
      auditNote,
    } = req.body;

    if (!studentId || !subjectId) {
      return res.status(400).json({ error: 'Aluno e Disciplina são obrigatórios.' });
    }

    const currentGrades = db.getGrades();
    const existing = currentGrades.find(
      (g) => (id && g.id === id) || (g.studentId === studentId && g.subjectId === subjectId)
    );

    const auditHistory = existing?.auditHistory ? [...existing.auditHistory] : [];
    auditHistory.unshift({
      date: new Date().toISOString(),
      authorName: updatedBy || 'Professor / Secretaria',
      action: existing ? 'Alteração de Notas' : 'Lançamento Inicial de Notas',
      note: auditNote || `1ª Nota: ${grade1 ?? '-'}, 2ª Nota: ${grade2 ?? '-'}, Exame: ${examGrade ?? '-'}`,
      oldGrade: existing?.average,
      newGrade: null, // will be auto-set on upsert
    });

    const result = db.upsertGrade({
      id: existing?.id || id,
      studentId,
      subjectId,
      classId: classId || existing?.classId || 'cls-1',
      grade1: grade1 !== undefined && grade1 !== '' ? Number(grade1) : null,
      grade2: grade2 !== undefined && grade2 !== '' ? Number(grade2) : null,
      examGrade: examGrade !== undefined && examGrade !== '' ? Number(examGrade) : null,
      assignmentGrade: assignmentGrade !== undefined && assignmentGrade !== '' ? Number(assignmentGrade) : null,
      average: null,
      status: 'Em andamento',
      notes,
      updatedBy: updatedBy || 'Professor / Secretaria CETS',
      updatedAt: new Date().toISOString(),
      auditHistory,
    });

    res.json(result);
  });

  // ==========================================
  // ATTENDANCE BATCH & GET
  // ==========================================

  app.get('/api/attendance', (req, res) => {
    res.json(db.getAttendance());
  });

  app.post('/api/attendance/batch', (req, res) => {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Nenhum registro de frequência fornecido.' });
    }

    const saved = db.saveAttendanceBatch(records);
    res.json({ success: true, count: saved.length, records: saved });
  });

  // ==========================================
  // INVOICES & FINANCIAL CRUD
  // ==========================================

  app.get('/api/invoices', (req, res) => {
    res.json(db.getInvoices());
  });

  app.post('/api/invoices', (req, res) => {
    const data = req.body;
    if (!data.studentId || !data.amount || !data.dueDate) {
      return res.status(400).json({ error: 'Aluno, valor e data de vencimento são obrigatórios.' });
    }

    const invId = `inv-${Date.now()}`;
    const inv: Invoice = {
      id: invId,
      studentId: data.studentId,
      title: data.title || `Mensalidade ${data.referenceMonth || 'Ref. 2026'}`,
      referenceMonth: data.referenceMonth || 'Agosto/2026',
      amount: Number(data.amount),
      originalAmount: Number(data.originalAmount || data.amount),
      discount: Number(data.discount || 0),
      penalty: Number(data.penalty || 0),
      dueDate: data.dueDate,
      status: data.status || 'A vencer',
      paidDate: data.paidDate,
      paidAmount: data.paidAmount ? Number(data.paidAmount) : undefined,
      paymentMethod: data.paymentMethod,
      barcode: data.barcode || `34191.79001 01043.510047 91020.150008 8 974700000${Math.floor(Number(data.amount) * 100)}`,
      pixCode: data.pixCode || `00020126580014br.gov.bcb.pix0136cets-financeiro@cetssaude.com.br5204000053039865406${data.amount}5802BR5920CETS ENSINO SAUDE6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      receiptNumber: data.receiptNumber,
      notes: data.notes || '',
    };
    db.createInvoice(inv);
    res.status(201).json(inv);
  });

  app.put('/api/invoices/:id', (req, res) => {
    const { id } = req.params;
    const updated = db.updateInvoice(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Mensalidade não encontrada.' });
    res.json(updated);
  });

  app.post('/api/invoices/:id/pay', (req, res) => {
    const { id } = req.params;
    const { paidAmount, paymentMethod, discount, penalty, notes } = req.body;
    const current = db.getInvoiceById(id);
    if (!current) return res.status(404).json({ error: 'Mensalidade não encontrada.' });

    const finalAmount = Number(paidAmount || current.amount);
    const receiptNumber = `REC-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = db.updateInvoice(id, {
      status: 'Pago',
      paidDate: new Date().toISOString().split('T')[0],
      paidAmount: finalAmount,
      paymentMethod: paymentMethod || 'PIX',
      discount: discount !== undefined ? Number(discount) : current.discount,
      penalty: penalty !== undefined ? Number(penalty) : current.penalty,
      receiptNumber,
      notes: notes || current.notes || 'Pagamento confirmado e compensado.',
    });

    res.json(updated);
  });

  app.post('/api/invoices/bulk-generate', (req, res) => {
    const { classId, referenceMonth, dueDate, amount } = req.body;
    if (!referenceMonth || !dueDate || !amount) {
      return res.status(400).json({ error: 'Mês de referência, vencimento e valor são obrigatórios.' });
    }

    let targetStudents = db.getStudents().filter((s) => s.academicStatus === 'Ativo');
    if (classId && classId !== 'all') {
      targetStudents = targetStudents.filter((s) => s.classId === classId);
    }

    const created: Invoice[] = [];
    for (const stu of targetStudents) {
      const inv: Invoice = {
        id: `inv-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        studentId: stu.id,
        title: `Mensalidade ${referenceMonth}`,
        referenceMonth,
        amount: Number(amount),
        originalAmount: Number(amount),
        discount: 0,
        penalty: 0,
        dueDate,
        status: 'A vencer',
        barcode: `34191.79001 01043.510047 91020.150008 8 974700000${Math.floor(Number(amount) * 100)}`,
        pixCode: `00020126580014br.gov.bcb.pix0136cets-financeiro@cetssaude.com.br5204000053039865406${amount}5802BR5920CETS ENSINO SAUDE6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        notes: `Emissão em lote para ${stu.name}`,
      };
      db.createInvoice(inv);
      created.push(inv);
    }

    res.json({ success: true, count: created.length, invoices: created });
  });

  app.delete('/api/invoices/:id', (req, res) => {
    const { id } = req.params;
    const success = db.deleteInvoice(id);
    if (!success) return res.status(404).json({ error: 'Mensalidade não encontrada.' });
    res.json({ success: true });
  });

  // ==========================================
  // ANNOUNCEMENTS CRUD
  // ==========================================

  app.get('/api/announcements', (req, res) => {
    res.json(db.getAnnouncements());
  });

  app.post('/api/announcements', (req, res) => {
    const data = req.body;
    if (!data.title || !data.content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
    }

    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      content: data.content,
      category: data.category || 'Aviso Geral',
      priority: data.priority || 'normal',
      targetType: data.targetType || 'todos',
      targetId: data.targetId,
      authorName: data.authorName || 'Direção CETS',
      createdAt: new Date().toISOString(),
      active: true,
      tag: data.tag,
    };
    db.createAnnouncement(ann);
    res.status(201).json(ann);
  });

  app.put('/api/announcements/:id', (req, res) => {
    const { id } = req.params;
    const updated = db.updateAnnouncement(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Comunicado não encontrado.' });
    res.json(updated);
  });

  app.delete('/api/announcements/:id', (req, res) => {
    const { id } = req.params;
    const success = db.deleteAnnouncement(id);
    if (!success) return res.status(404).json({ error: 'Comunicado não encontrado.' });
    res.json({ success: true });
  });

  // ==========================================
  // CONFIG CRUD
  // ==========================================

  app.get('/api/config', (req, res) => {
    res.json(db.getConfig());
  });

  app.put('/api/config', (req, res) => {
    const updated = db.updateConfig(req.body);
    res.json(updated);
  });

  // ==========================================
  // VITE & STATIC SERVING
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CETS] Sistema Acadêmico em Saúde rodando na porta ${PORT}`);
  });
}

startServer();

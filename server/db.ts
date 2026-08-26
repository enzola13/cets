import fs from 'fs';
import path from 'path';
import { DatabaseSchema, User, Student, Teacher, ClassGroup, Subject, Schedule, Grade, AttendanceRecord, Invoice, Announcement, SchoolConfig } from '../src/types.ts';
import { initialDatabaseSeed } from './seed.ts';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent) as DatabaseSchema;
      }
    } catch (err) {
      console.error('Error loading database from disk, using seed:', err);
    }
    // Fallback to seed
    const seed = JSON.parse(JSON.stringify(initialDatabaseSeed));
    this.saveToDisk(seed);
    return seed;
  }

  private saveToDisk(dataToSave: DatabaseSchema = this.data) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  public resetDemoData(): DatabaseSchema {
    this.data = JSON.parse(JSON.stringify(initialDatabaseSeed));
    this.saveToDisk();
    return this.data;
  }

  public getFullDatabase(): DatabaseSchema {
    return this.data;
  }

  // Users
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserByUsername(username: string): User | undefined {
    return this.data.users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() ||
             u.email.toLowerCase() === username.trim().toLowerCase()
    );
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.saveToDisk();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveToDisk();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const prevLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    if (this.data.users.length !== prevLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // Students
  public getStudents(): Student[] {
    return this.data.students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.data.students.find((s) => s.id === id);
  }

  public getStudentByUserId(userId: string): Student | undefined {
    return this.data.students.find((s) => s.userId === userId);
  }

  public getStudentByEnrollment(enrollment: string): Student | undefined {
    return this.data.students.find((s) => s.enrollment.toLowerCase() === enrollment.toLowerCase());
  }

  public createStudent(student: Student): Student {
    this.data.students.push(student);
    this.saveToDisk();
    return student;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const idx = this.data.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.students[idx] = { ...this.data.students[idx], ...updates };
    this.saveToDisk();
    return this.data.students[idx];
  }

  public deleteStudent(id: string): boolean {
    const student = this.data.students.find((s) => s.id === id);
    if (!student) return false;

    this.data.students = this.data.students.filter((s) => s.id !== id);
    if (student.userId) {
      this.data.users = this.data.users.filter((u) => u.id !== student.userId);
    }
    // Also remove or keep grades/attendance/invoices
    this.data.grades = this.data.grades.filter((g) => g.studentId !== id);
    this.data.attendance = this.data.attendance.filter((a) => a.studentId !== id);
    this.data.invoices = this.data.invoices.filter((i) => i.studentId !== id);

    this.saveToDisk();
    return true;
  }

  // Teachers
  public getTeachers(): Teacher[] {
    return this.data.teachers;
  }

  public getTeacherById(id: string): Teacher | undefined {
    return this.data.teachers.find((t) => t.id === id);
  }

  public getTeacherByUserId(userId: string): Teacher | undefined {
    return this.data.teachers.find((t) => t.userId === userId);
  }

  public createTeacher(teacher: Teacher): Teacher {
    this.data.teachers.push(teacher);
    this.saveToDisk();
    return teacher;
  }

  public updateTeacher(id: string, updates: Partial<Teacher>): Teacher | null {
    const idx = this.data.teachers.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.teachers[idx] = { ...this.data.teachers[idx], ...updates };
    this.saveToDisk();
    return this.data.teachers[idx];
  }

  public deleteTeacher(id: string): boolean {
    const teacher = this.data.teachers.find((t) => t.id === id);
    if (!teacher) return false;
    this.data.teachers = this.data.teachers.filter((t) => t.id !== id);
    if (teacher.userId) {
      this.data.users = this.data.users.filter((u) => u.id !== teacher.userId);
    }
    this.saveToDisk();
    return true;
  }

  // Classes
  public getClasses(): ClassGroup[] {
    return this.data.classes;
  }

  public getClassById(id: string): ClassGroup | undefined {
    return this.data.classes.find((c) => c.id === id);
  }

  public createClass(cls: ClassGroup): ClassGroup {
    this.data.classes.push(cls);
    this.saveToDisk();
    return cls;
  }

  public updateClass(id: string, updates: Partial<ClassGroup>): ClassGroup | null {
    const idx = this.data.classes.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.classes[idx] = { ...this.data.classes[idx], ...updates };
    this.saveToDisk();
    return this.data.classes[idx];
  }

  public deleteClass(id: string): boolean {
    this.data.classes = this.data.classes.filter((c) => c.id !== id);
    this.saveToDisk();
    return true;
  }

  // Subjects
  public getSubjects(): Subject[] {
    return this.data.subjects;
  }

  public getSubjectById(id: string): Subject | undefined {
    return this.data.subjects.find((s) => s.id === id);
  }

  public createSubject(sub: Subject): Subject {
    this.data.subjects.push(sub);
    this.saveToDisk();
    return sub;
  }

  public updateSubject(id: string, updates: Partial<Subject>): Subject | null {
    const idx = this.data.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.subjects[idx] = { ...this.data.subjects[idx], ...updates };
    this.saveToDisk();
    return this.data.subjects[idx];
  }

  public deleteSubject(id: string): boolean {
    this.data.subjects = this.data.subjects.filter((s) => s.id !== id);
    this.saveToDisk();
    return true;
  }

  // Schedules
  public getSchedules(): Schedule[] {
    return this.data.schedules;
  }

  public createSchedule(sch: Schedule): Schedule {
    this.data.schedules.push(sch);
    this.saveToDisk();
    return sch;
  }

  public updateSchedule(id: string, updates: Partial<Schedule>): Schedule | null {
    const idx = this.data.schedules.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.schedules[idx] = { ...this.data.schedules[idx], ...updates };
    this.saveToDisk();
    return this.data.schedules[idx];
  }

  public deleteSchedule(id: string): boolean {
    this.data.schedules = this.data.schedules.filter((s) => s.id !== id);
    this.saveToDisk();
    return true;
  }

  // Grades
  public getGrades(): Grade[] {
    return this.data.grades;
  }

  public upsertGrade(gradeData: Omit<Grade, 'id'> & { id?: string }): Grade {
    let existingIndex = -1;
    if (gradeData.id) {
      existingIndex = this.data.grades.findIndex((g) => g.id === gradeData.id);
    } else {
      existingIndex = this.data.grades.findIndex(
        (g) => g.studentId === gradeData.studentId && g.subjectId === gradeData.subjectId
      );
    }

    // Auto-calculate average and status
    const g1 = gradeData.grade1;
    const g2 = gradeData.grade2;
    const exam = gradeData.examGrade;
    const assign = gradeData.assignmentGrade;

    let average: number | null = null;
    let status: Grade['status'] = 'Em andamento';

    if (g1 !== null && g1 !== undefined && g2 !== null && g2 !== undefined) {
      let computed = (Number(g1) + Number(g2)) / 2;
      if (assign !== null && assign !== undefined) {
        // 70% tests + 30% assignments
        computed = Number((computed * 0.7 + Number(assign) * 0.3).toFixed(1));
      } else {
        computed = Number(computed.toFixed(1));
      }

      if (exam !== null && exam !== undefined) {
        computed = Number(((computed + Number(exam)) / 2).toFixed(1));
      }

      average = computed;

      if (average >= this.data.config.minimumPassingGrade) {
        status = 'Aprovado';
      } else if (average >= this.data.config.recoveryThreshold) {
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

    if (existingIndex >= 0) {
      const existing = this.data.grades[existingIndex];
      const updated: Grade = {
        ...existing,
        ...gradeData,
        id: existing.id,
        average,
        status: gradeData.status || status,
        updatedAt: new Date().toISOString(),
      };
      this.data.grades[existingIndex] = updated;
      this.saveToDisk();
      return updated;
    } else {
      const newGrade: Grade = {
        ...gradeData,
        id: gradeData.id || `grd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        average,
        status: gradeData.status || status,
        updatedAt: new Date().toISOString(),
        auditHistory: gradeData.auditHistory || [],
      };
      this.data.grades.push(newGrade);
      this.saveToDisk();
      return newGrade;
    }
  }

  // Attendance
  public getAttendance(): AttendanceRecord[] {
    return this.data.attendance;
  }

  public saveAttendanceBatch(records: Omit<AttendanceRecord, 'id'>[]): AttendanceRecord[] {
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
    this.saveToDisk();
    return saved;
  }

  // Invoices
  public getInvoices(): Invoice[] {
    return this.data.invoices;
  }

  public getInvoiceById(id: string): Invoice | undefined {
    return this.data.invoices.find((i) => i.id === id);
  }

  public createInvoice(invoice: Invoice): Invoice {
    this.data.invoices.push(invoice);
    this.saveToDisk();
    return invoice;
  }

  public updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
    const idx = this.data.invoices.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.data.invoices[idx] = { ...this.data.invoices[idx], ...updates };
    this.saveToDisk();
    return this.data.invoices[idx];
  }

  public deleteInvoice(id: string): boolean {
    this.data.invoices = this.data.invoices.filter((i) => i.id !== id);
    this.saveToDisk();
    return true;
  }

  // Announcements
  public getAnnouncements(): Announcement[] {
    return this.data.announcements;
  }

  public createAnnouncement(ann: Announcement): Announcement {
    this.data.announcements.unshift(ann);
    this.saveToDisk();
    return ann;
  }

  public updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement | null {
    const idx = this.data.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.announcements[idx] = { ...this.data.announcements[idx], ...updates };
    this.saveToDisk();
    return this.data.announcements[idx];
  }

  public deleteAnnouncement(id: string): boolean {
    this.data.announcements = this.data.announcements.filter((a) => a.id !== id);
    this.saveToDisk();
    return true;
  }

  // School Config
  public getConfig(): SchoolConfig {
    return this.data.config;
  }

  public updateConfig(updates: Partial<SchoolConfig>): SchoolConfig {
    this.data.config = { ...this.data.config, ...updates };
    this.saveToDisk();
    return this.data.config;
  }
}

export const db = new DatabaseStore();

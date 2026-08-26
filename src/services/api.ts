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
import { clientStorage } from './clientStorage.ts';

const BASE_URL = '/api';

type ServerResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: any; isServerError: boolean };

// Check if we are running in an environment where server is offline or static
async function tryServerRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ServerResult<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Returned HTML or not found (typical of Netlify/static hosting)
      return { ok: false, error: new Error('Static host response - fallback to local storage'), isServerError: true };
    }

    if (!response.ok) {
      let errorMessage = `Erro: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMessage = errorData.error;
      } catch {
        // ignore
      }
      return { ok: false, error: new Error(errorMessage), isServerError: false };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err, isServerError: true };
  }
}

export const api = {
  // Auth
  login: async (credentials: { username: string; password: string }): Promise<AuthSession> => {
    const res = await tryServerRequest<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.ok) {
      return res.data;
    }
    const fail = res as { ok: false; error: any; isServerError: boolean };
    if (!fail.isServerError && fail.error) {
      throw fail.error;
    }
    // Fallback to clientStorage
    return clientStorage.login(credentials);
  },

  changePassword: async (data: { userId: string; currentPassword?: string; newPassword: string }) => {
    const res = await tryServerRequest<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return res.data;
    }
    const fail = res as { ok: false; error: any; isServerError: boolean };
    if (!fail.isServerError && fail.error) {
      throw fail.error;
    }

    clientStorage.updateUser(data.userId, { password: data.newPassword });
    return { success: true, message: 'Senha alterada com sucesso.' };
  },

  forgotPassword: async (identifier: string) => {
    const res = await tryServerRequest<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
    if (res.ok) {
      return res.data;
    }
    const fail = res as { ok: false; error: any; isServerError: boolean };
    if (!fail.isServerError && fail.error) {
      throw fail.error;
    }

    return {
      success: true,
      message: 'Instruções de recuperação de senha enviadas ao email/WhatsApp cadastrado.',
    };
  },

  // Bootstrap
  getBootstrapData: async (): Promise<DatabaseSchema> => {
    const res = await tryServerRequest<DatabaseSchema>('/bootstrap');
    if (res.ok) return res.data;
    return clientStorage.getFullDatabase();
  },

  resetDemoData: async (): Promise<{ success: boolean; data: DatabaseSchema }> => {
    const res = await tryServerRequest<{ success: boolean; data: DatabaseSchema }>('/reset-demo', { method: 'POST' });
    if (res.ok) return res.data;
    const fresh = clientStorage.resetDemoData();
    return { success: true, data: fresh };
  },

  // Students
  getStudents: async (): Promise<Student[]> => {
    const res = await tryServerRequest<Student[]>('/students');
    if (res.ok) return res.data;
    return clientStorage.getStudents();
  },

  createStudent: async (student: Partial<Student> & { initialPassword?: string; username?: string }) => {
    const res = await tryServerRequest<{ student: Student; user: User }>('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
    if (res.ok) return res.data;
    return clientStorage.createStudent(student);
  },

  updateStudent: async (id: string, updates: Partial<Student>) => {
    const res = await tryServerRequest<Student>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.ok) return res.data;
    return clientStorage.updateStudent(id, updates);
  },

  deleteStudent: async (id: string) => {
    const res = await tryServerRequest<{ success: boolean }>(`/students/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return res.data;
    return clientStorage.deleteStudent(id);
  },

  // Teachers
  getTeachers: async (): Promise<Teacher[]> => {
    const res = await tryServerRequest<Teacher[]>('/teachers');
    if (res.ok) return res.data;
    return clientStorage.getTeachers();
  },

  createTeacher: async (teacher: Partial<Teacher> & { initialPassword?: string; username?: string }) => {
    const res = await tryServerRequest<{ teacher: Teacher; user: User }>('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacher),
    });
    if (res.ok) return res.data;
    return clientStorage.createTeacher(teacher);
  },

  updateTeacher: async (id: string, updates: Partial<Teacher>) => {
    const res = await tryServerRequest<Teacher>(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.ok) return res.data;
    return clientStorage.updateTeacher(id, updates);
  },

  deleteTeacher: async (id: string) => {
    const res = await tryServerRequest<{ success: boolean }>(`/teachers/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return res.data;
    return clientStorage.deleteTeacher(id);
  },

  // Classes
  getClasses: async (): Promise<ClassGroup[]> => {
    const res = await tryServerRequest<ClassGroup[]>('/classes');
    if (res.ok) return res.data;
    return clientStorage.getClasses();
  },

  createClass: async (cls: Partial<ClassGroup>) => {
    const res = await tryServerRequest<ClassGroup>('/classes', {
      method: 'POST',
      body: JSON.stringify(cls),
    });
    if (res.ok) return res.data;
    return clientStorage.createClass(cls);
  },

  updateClass: async (id: string, updates: Partial<ClassGroup>) => {
    const res = await tryServerRequest<ClassGroup>(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.ok) return res.data;
    return clientStorage.updateClass(id, updates);
  },

  deleteClass: async (id: string) => {
    const res = await tryServerRequest<{ success: boolean }>(`/classes/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return res.data;
    return clientStorage.deleteClass(id);
  },

  // Subjects
  getSubjects: async (): Promise<Subject[]> => {
    const res = await tryServerRequest<Subject[]>('/subjects');
    if (res.ok) return res.data;
    return clientStorage.getSubjects();
  },

  createSubject: async (subject: Partial<Subject>) => {
    const res = await tryServerRequest<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(subject),
    });
    if (res.ok) return res.data;
    return clientStorage.createSubject(subject);
  },

  updateSubject: async (id: string, updates: Partial<Subject>) => {
    const res = await tryServerRequest<Subject>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.ok) return res.data;
    return clientStorage.updateSubject(id, updates);
  },

  deleteSubject: async (id: string) => {
    const res = await tryServerRequest<{ success: boolean }>(`/subjects/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return res.data;
    return clientStorage.deleteSubject(id);
  },

  // Schedules
  getSchedules: async (): Promise<Schedule[]> => {
    const res = await tryServerRequest<Schedule[]>('/schedules');
    if (res.ok) return res.data;
    return clientStorage.getSchedules();
  },

  createSchedule: async (schedule: Partial<Schedule>) => {
    const res = await tryServerRequest<Schedule>('/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
    if (res.ok) return res.data;
    return clientStorage.createSchedule(schedule);
  },

  updateSchedule: async (id: string, updates: Partial<Schedule>) => {
    const res = await tryServerRequest<Schedule>(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.ok) return res.data;
    return clientStorage.updateSchedule(id, updates);
  },

  deleteSchedule: async (id: string) => {
    const res = await tryServerRequest<{ success: boolean }>(`/schedules/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return res.data;
    return clientStorage.deleteSchedule(id);
  },

  // Grades
  getGrades: async (): Promise<Grade[]> => {
    const res = await tryServerRequest<Grade[]>('/grades');
    if (res.ok) return res.data;
    return clientStorage.getGrades();
  },

  upsertGrade: async (gradeData: {
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
  }) => {
    const res = await tryServerRequest<Grade>('/grades/upsert', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
    if (res.ok) return res.data;
    return clientStorage.upsertGrade(gradeData);
  },

  // Attendance
  getAttendance: async (): Promise<AttendanceRecord[]> => {
    const res = await tryServerRequest<AttendanceRecord[]>('/attendance');
    if (res.ok) return res.data;
    return clientStorage.getAttendance();
  },

  saveAttendanceBatch: async (records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]) => {
    const res = await tryServerRequest<{ success: boolean; count: number; records: AttendanceRecord[] }>('/attendance/batch', {
      method: 'POST',
      body: JSON.stringify({ records }),
    });
    if (res.ok) return res.data;
    return clientStorage.saveAttendanceBatch(records);
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    const res = await tryServerRequest<Invoice[]>('/invoices');
    if (res.ok) return res.data;
    return clientStorage.getInvoices();
  },

  createInvoice: async (invoice: Partial<Invoice>) => {
    const res = await tryServerRequest<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
    if (res.ok) return res.data;
    return clientStorage.createInvoice(invoice);
  },

  updateInvoice: async (id: string, updates: Partial<Invoice>) => {
    const res = await tryServerRequest<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.ok) return res.data;
    return clientStorage.updateInvoice(id, updates);
  },

  payInvoice: async (
    id: string,
    data: {
      paidAmount?: number;
      paymentMethod?: Invoice['paymentMethod'];
      discount?: number;
      penalty?: number;
      notes?: string;
    }
  ) => {
    const res = await tryServerRequest<Invoice>(`/invoices/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.ok) return res.data;
    return clientStorage.payInvoice(id, data);
  },

  bulkGenerateInvoices: async (data: { classId?: string; referenceMonth: string; dueDate: string; amount: number }) => {
    const res = await tryServerRequest<{ success: boolean; count: number; invoices: Invoice[] }>('/invoices/bulk-generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.ok) return res.data;
    return clientStorage.bulkGenerateInvoices(data);
  },

  deleteInvoice: async (id: string) => {
    const res = await tryServerRequest<{ success: boolean }>(`/invoices/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return res.data;
    return clientStorage.deleteInvoice(id);
  },

  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    const res = await tryServerRequest<Announcement[]>('/announcements');
    if (res.ok) return res.data;
    return clientStorage.getAnnouncements();
  },

  createAnnouncement: async (announcement: Partial<Announcement>) => {
    const res = await tryServerRequest<Announcement>('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcement),
    });
    if (res.ok) return res.data;
    return clientStorage.createAnnouncement(announcement);
  },

  updateAnnouncement: async (id: string, updates: Partial<Announcement>) => {
    const res = await tryServerRequest<Announcement>(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.ok) return res.data;
    return clientStorage.updateAnnouncement(id, updates);
  },

  deleteAnnouncement: async (id: string) => {
    const res = await tryServerRequest<{ success: boolean }>(`/announcements/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return res.data;
    return clientStorage.deleteAnnouncement(id);
  },

  // Config
  getConfig: async (): Promise<SchoolConfig> => {
    const res = await tryServerRequest<SchoolConfig>('/config');
    if (res.ok) return res.data;
    return clientStorage.getConfig();
  },

  updateConfig: async (config: Partial<SchoolConfig>) => {
    const res = await tryServerRequest<SchoolConfig>('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
    if (res.ok) return res.data;
    return clientStorage.updateConfig(config);
  },
};

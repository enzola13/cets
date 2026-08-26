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

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Erro na requisição: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) errorMessage = errorData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    request<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  changePassword: (data: { userId: string; currentPassword?: string; newPassword: string }) =>
    request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (identifier: string) =>
    request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),

  // Bootstrap
  getBootstrapData: () => request<DatabaseSchema>('/bootstrap'),
  resetDemoData: () => request<{ success: boolean; data: DatabaseSchema }>('/reset-demo', { method: 'POST' }),

  // Students
  getStudents: () => request<Student[]>('/students'),
  createStudent: (student: Partial<Student> & { initialPassword?: string; username?: string }) =>
    request<{ student: Student; user: User }>('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    }),
  updateStudent: (id: string, updates: Partial<Student>) =>
    request<Student>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteStudent: (id: string) =>
    request<{ success: boolean }>(`/students/${id}`, {
      method: 'DELETE',
    }),

  // Teachers
  getTeachers: () => request<Teacher[]>('/teachers'),
  createTeacher: (teacher: Partial<Teacher> & { initialPassword?: string; username?: string }) =>
    request<{ teacher: Teacher; user: User }>('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacher),
    }),
  updateTeacher: (id: string, updates: Partial<Teacher>) =>
    request<Teacher>(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteTeacher: (id: string) =>
    request<{ success: boolean }>(`/teachers/${id}`, {
      method: 'DELETE',
    }),

  // Classes
  getClasses: () => request<ClassGroup[]>('/classes'),
  createClass: (cls: Partial<ClassGroup>) =>
    request<ClassGroup>('/classes', {
      method: 'POST',
      body: JSON.stringify(cls),
    }),
  updateClass: (id: string, updates: Partial<ClassGroup>) =>
    request<ClassGroup>(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteClass: (id: string) =>
    request<{ success: boolean }>(`/classes/${id}`, {
      method: 'DELETE',
    }),

  // Subjects
  getSubjects: () => request<Subject[]>('/subjects'),
  createSubject: (subject: Partial<Subject>) =>
    request<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(subject),
    }),
  updateSubject: (id: string, updates: Partial<Subject>) =>
    request<Subject>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteSubject: (id: string) =>
    request<{ success: boolean }>(`/subjects/${id}`, {
      method: 'DELETE',
    }),

  // Schedules
  getSchedules: () => request<Schedule[]>('/schedules'),
  createSchedule: (schedule: Partial<Schedule>) =>
    request<Schedule>('/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    }),
  updateSchedule: (id: string, updates: Partial<Schedule>) =>
    request<Schedule>(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteSchedule: (id: string) =>
    request<{ success: boolean }>(`/schedules/${id}`, {
      method: 'DELETE',
    }),

  // Grades
  getGrades: () => request<Grade[]>('/grades'),
  upsertGrade: (gradeData: {
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
  }) =>
    request<Grade>('/grades/upsert', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    }),

  // Attendance
  getAttendance: () => request<AttendanceRecord[]>('/attendance'),
  saveAttendanceBatch: (records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]) =>
    request<{ success: boolean; count: number; records: AttendanceRecord[] }>('/attendance/batch', {
      method: 'POST',
      body: JSON.stringify({ records }),
    }),

  // Invoices
  getInvoices: () => request<Invoice[]>('/invoices'),
  createInvoice: (invoice: Partial<Invoice>) =>
    request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    }),
  updateInvoice: (id: string, updates: Partial<Invoice>) =>
    request<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  payInvoice: (
    id: string,
    data: {
      paidAmount?: number;
      paymentMethod?: Invoice['paymentMethod'];
      discount?: number;
      penalty?: number;
      notes?: string;
    }
  ) =>
    request<Invoice>(`/invoices/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  bulkGenerateInvoices: (data: { classId?: string; referenceMonth: string; dueDate: string; amount: number }) =>
    request<{ success: boolean; count: number; invoices: Invoice[] }>('/invoices/bulk-generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteInvoice: (id: string) =>
    request<{ success: boolean }>(`/invoices/${id}`, {
      method: 'DELETE',
    }),

  // Announcements
  getAnnouncements: () => request<Announcement[]>('/announcements'),
  createAnnouncement: (announcement: Partial<Announcement>) =>
    request<Announcement>('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcement),
    }),
  updateAnnouncement: (id: string, updates: Partial<Announcement>) =>
    request<Announcement>(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteAnnouncement: (id: string) =>
    request<{ success: boolean }>(`/announcements/${id}`, {
      method: 'DELETE',
    }),

  // Config
  getConfig: () => request<SchoolConfig>('/config'),
  updateConfig: (config: Partial<SchoolConfig>) =>
    request<SchoolConfig>('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    }),
};

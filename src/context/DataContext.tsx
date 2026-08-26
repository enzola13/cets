import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DatabaseSchema,
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
} from '../types.ts';
import { api } from '../services/api.ts';
import { clientStorage } from '../services/clientStorage.ts';

interface DataContextType {
  data: DatabaseSchema | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  resetDemoData: () => Promise<void>;

  // Data collections
  students: Student[];
  teachers: Teacher[];
  classes: ClassGroup[];
  subjects: Subject[];
  schedules: Schedule[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  invoices: Invoice[];
  announcements: Announcement[];
  config: SchoolConfig | null;

  // Student specific queries
  getStudentGrades: (studentId: string) => (Grade & { subjectName: string; subjectCode: string; workloadHours: number })[];
  getStudentAttendanceStats: (studentId: string) => {
    totalClasses: number;
    presences: number;
    absences: number;
    justified: number;
    percentage: number;
    subjectStats: { subjectId: string; subjectName: string; total: number; presences: number; absences: number; percentage: number }[];
  };
  getStudentInvoices: (studentId: string) => Invoice[];
  getStudentSchedule: (classId: string) => (Schedule & { subjectName: string; teacherName: string })[];
  getStudentAnnouncements: (studentId?: string, classId?: string) => Announcement[];

  // Teacher specific queries
  getTeacherClasses: (teacherId: string) => ClassGroup[];
  getTeacherSubjects: (teacherId: string) => Subject[];
  getTeacherSchedules: (teacherId: string) => (Schedule & { className: string; subjectName: string })[];

  // Admin & Financial KPIs
  getFinancialKPIs: () => {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    paidCount: number;
    pendingCount: number;
    overdueCount: number;
    totalInvoices: number;
  };
  getOverdueStudentsList: () => {
    student: Student;
    classGroup?: ClassGroup;
    invoices: Invoice[];
    totalOverdueAmount: number;
    oldestDueDate: string;
    daysOverdue: number;
  }[];

  // Actions
  createStudent: (student: Partial<Student> & { initialPassword?: string; username?: string }) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  createTeacher: (teacher: Partial<Teacher> & { initialPassword?: string; username?: string }) => Promise<void>;
  updateTeacher: (id: string, updates: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;

  createClass: (cls: Partial<ClassGroup>) => Promise<void>;
  updateClass: (id: string, updates: Partial<ClassGroup>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  createSubject: (sub: Partial<Subject>) => Promise<void>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  createSchedule: (sch: Partial<Schedule>) => Promise<void>;
  updateSchedule: (id: string, updates: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;

  saveGrade: (gradeData: {
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
  }) => Promise<Grade>;

  saveAttendanceRollCall: (records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]) => Promise<void>;

  createInvoice: (invoice: Partial<Invoice>) => Promise<void>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  payInvoice: (
    id: string,
    data: {
      paidAmount?: number;
      paymentMethod?: Invoice['paymentMethod'];
      discount?: number;
      penalty?: number;
      notes?: string;
    }
  ) => Promise<void>;
  bulkGenerateInvoices: (data: { classId?: string; referenceMonth: string; dueDate: string; amount: number }) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  createAnnouncement: (announcement: Partial<Announcement>) => Promise<void>;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  updateSchoolConfig: (config: Partial<SchoolConfig>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DatabaseSchema>(() => clientStorage.getFullDatabase());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setError(null);
      const bootstrap = await api.getBootstrapData();
      if (bootstrap) {
        setData(bootstrap);
      }
    } catch (err: any) {
      console.error('Failed to load school data:', err);
      // Even if network fails, we already have offline data initialized
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      const res = await api.resetDemoData();
      setData(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Queries
  const students = data?.students || [];
  const teachers = data?.teachers || [];
  const classes = data?.classes || [];
  const subjects = data?.subjects || [];
  const schedules = data?.schedules || [];
  const grades = data?.grades || [];
  const attendance = data?.attendance || [];
  const invoices = data?.invoices || [];
  const announcements = data?.announcements || [];
  const config = data?.config || null;

  const getStudentGrades = useCallback(
    (studentId: string) => {
      const stu = students.find((s) => s.id === studentId);
      if (!stu) return [];

      return subjects.map((sub) => {
        const found = grades.find((g) => g.studentId === studentId && g.subjectId === sub.id);
        if (found) {
          return {
            ...found,
            subjectName: sub.name,
            subjectCode: sub.code,
            workloadHours: sub.workloadHours,
          };
        }
        return {
          id: `grd-placeholder-${sub.id}`,
          studentId,
          subjectId: sub.id,
          classId: stu.classId,
          grade1: null,
          grade2: null,
          examGrade: null,
          assignmentGrade: null,
          average: null,
          status: 'Em andamento' as const,
          subjectName: sub.name,
          subjectCode: sub.code,
          workloadHours: sub.workloadHours,
          updatedBy: 'Não lançado',
          updatedAt: '',
          auditHistory: [],
        };
      });
    },
    [students, subjects, grades]
  );

  const getStudentAttendanceStats = useCallback(
    (studentId: string) => {
      const studentRecords = attendance.filter((a) => a.studentId === studentId);
      const total = studentRecords.length;
      const presences = studentRecords.filter((a) => a.status === 'Presença').length;
      const absences = studentRecords.filter((a) => a.status === 'Falta').length;
      const justified = studentRecords.filter((a) => a.status === 'Falta Justificada').length;
      // Justified doesn't penalize presence percentage
      const effectivePresences = presences + justified;
      const percentage = total > 0 ? Math.round((effectivePresences / total) * 100) : 100;

      const subjectStats = subjects.map((sub) => {
        const subRecords = studentRecords.filter((a) => a.subjectId === sub.id);
        const subTotal = subRecords.length;
        const subPresences = subRecords.filter((a) => a.status === 'Presença').length;
        const subJustified = subRecords.filter((a) => a.status === 'Falta Justificada').length;
        const subAbsences = subRecords.filter((a) => a.status === 'Falta').length;
        const subPct = subTotal > 0 ? Math.round(((subPresences + subJustified) / subTotal) * 100) : 100;

        return {
          subjectId: sub.id,
          subjectName: sub.name,
          total: subTotal,
          presences: subPresences + subJustified,
          absences: subAbsences,
          percentage: subPct,
        };
      });

      return {
        totalClasses: total,
        presences,
        absences,
        justified,
        percentage,
        subjectStats,
      };
    },
    [attendance, subjects]
  );

  const getStudentInvoices = useCallback(
    (studentId: string) => {
      return invoices
        .filter((i) => i.studentId === studentId)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    },
    [invoices]
  );

  const getStudentSchedule = useCallback(
    (classId: string) => {
      const list = schedules.filter((s) => s.classId === classId);
      return list.map((item) => {
        const sub = subjects.find((s) => s.id === item.subjectId);
        const tea = teachers.find((t) => t.id === item.teacherId);
        return {
          ...item,
          subjectName: sub?.name || 'Disciplina',
          teacherName: tea?.name || 'Docente CETS',
        };
      });
    },
    [schedules, subjects, teachers]
  );

  const getStudentAnnouncements = useCallback(
    (studentId?: string, classId?: string) => {
      return announcements
        .filter((a) => {
          if (!a.active) return false;
          if (a.targetType === 'todos') return true;
          if (a.targetType === 'turma' && classId && a.targetId === classId) return true;
          if (a.targetType === 'aluno' && studentId && a.targetId === studentId) return true;
          return false;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    [announcements]
  );

  const getTeacherClasses = useCallback(
    (teacherId: string) => {
      // Find classes where teacher teaches a schedule or is advisor
      const classIdsFromSchedules = schedules.filter((s) => s.teacherId === teacherId).map((s) => s.classId);
      return classes.filter((c) => c.teacherAdvisorId === teacherId || classIdsFromSchedules.includes(c.id));
    },
    [schedules, classes]
  );

  const getTeacherSubjects = useCallback(
    (teacherId: string) => {
      const tea = teachers.find((t) => t.id === teacherId);
      const subjectIds = new Set<string>();
      if (tea?.subjectIds) {
        tea.subjectIds.forEach((id) => subjectIds.add(id));
      }
      schedules.filter((s) => s.teacherId === teacherId).forEach((s) => subjectIds.add(s.subjectId));
      subjects.filter((s) => s.teacherId === teacherId).forEach((s) => subjectIds.add(s.id));

      return subjects.filter((s) => subjectIds.has(s.id));
    },
    [teachers, schedules, subjects]
  );

  const getTeacherSchedules = useCallback(
    (teacherId: string) => {
      const teaSchedules = schedules.filter((s) => s.teacherId === teacherId);
      return teaSchedules.map((sch) => {
        const cls = classes.find((c) => c.id === sch.classId);
        const sub = subjects.find((s) => s.id === sch.subjectId);
        return {
          ...sch,
          className: cls?.name || cls?.code || 'Turma',
          subjectName: sub?.name || 'Disciplina',
        };
      });
    },
    [schedules, classes, subjects]
  );

  const getFinancialKPIs = useCallback(() => {
    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    invoices.forEach((inv) => {
      if (inv.status === 'Pago') {
        totalPaid += inv.paidAmount || inv.amount;
        paidCount++;
      } else if (inv.status === 'Atrasado') {
        totalOverdue += inv.amount;
        overdueCount++;
      } else {
        totalPending += inv.amount;
        pendingCount++;
      }
    });

    return {
      totalPaid: Number(totalPaid.toFixed(2)),
      totalPending: Number(totalPending.toFixed(2)),
      totalOverdue: Number(totalOverdue.toFixed(2)),
      paidCount,
      pendingCount,
      overdueCount,
      totalInvoices: invoices.length,
    };
  }, [invoices]);

  const getOverdueStudentsList = useCallback(() => {
    const today = new Date();
    const map = new Map<string, { student: Student; invoices: Invoice[]; total: number; oldestDue: string }>();

    invoices
      .filter((i) => i.status === 'Atrasado')
      .forEach((inv) => {
        const stu = students.find((s) => s.id === inv.studentId);
        if (!stu) return;

        const curr = map.get(stu.id) || {
          student: stu,
          invoices: [],
          total: 0,
          oldestDue: inv.dueDate,
        };

        curr.invoices.push(inv);
        curr.total += inv.amount;
        if (new Date(inv.dueDate) < new Date(curr.oldestDue)) {
          curr.oldestDue = inv.dueDate;
        }
        map.set(stu.id, curr);
      });

    return Array.from(map.values()).map((entry) => {
      const classGroup = classes.find((c) => c.id === entry.student.classId);
      const diffTime = Math.abs(today.getTime() - new Date(entry.oldestDue).getTime());
      const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        student: entry.student,
        classGroup,
        invoices: entry.invoices,
        totalOverdueAmount: Number(entry.total.toFixed(2)),
        oldestDueDate: entry.oldestDue,
        daysOverdue,
      };
    });
  }, [invoices, students, classes]);

  // Mutations
  const createStudent = async (studentData: Partial<Student> & { initialPassword?: string; username?: string }) => {
    await api.createStudent(studentData);
    await refreshData();
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    await api.updateStudent(id, updates);
    await refreshData();
  };

  const deleteStudent = async (id: string) => {
    await api.deleteStudent(id);
    await refreshData();
  };

  const createTeacher = async (teacherData: Partial<Teacher> & { initialPassword?: string; username?: string }) => {
    await api.createTeacher(teacherData);
    await refreshData();
  };

  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    await api.updateTeacher(id, updates);
    await refreshData();
  };

  const deleteTeacher = async (id: string) => {
    await api.deleteTeacher(id);
    await refreshData();
  };

  const createClass = async (cls: Partial<ClassGroup>) => {
    await api.createClass(cls);
    await refreshData();
  };

  const updateClass = async (id: string, updates: Partial<ClassGroup>) => {
    await api.updateClass(id, updates);
    await refreshData();
  };

  const deleteClass = async (id: string) => {
    await api.deleteClass(id);
    await refreshData();
  };

  const createSubject = async (sub: Partial<Subject>) => {
    await api.createSubject(sub);
    await refreshData();
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    await api.updateSubject(id, updates);
    await refreshData();
  };

  const deleteSubject = async (id: string) => {
    await api.deleteSubject(id);
    await refreshData();
  };

  const createSchedule = async (sch: Partial<Schedule>) => {
    await api.createSchedule(sch);
    await refreshData();
  };

  const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
    await api.updateSchedule(id, updates);
    await refreshData();
  };

  const deleteSchedule = async (id: string) => {
    await api.deleteSchedule(id);
    await refreshData();
  };

  const saveGrade = async (gradeData: {
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
    const res = await api.upsertGrade(gradeData);
    await refreshData();
    return res;
  };

  const saveAttendanceRollCall = async (records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]) => {
    await api.saveAttendanceBatch(records);
    await refreshData();
  };

  const createInvoice = async (inv: Partial<Invoice>) => {
    await api.createInvoice(inv);
    await refreshData();
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    await api.updateInvoice(id, updates);
    await refreshData();
  };

  const payInvoice = async (
    id: string,
    data: {
      paidAmount?: number;
      paymentMethod?: Invoice['paymentMethod'];
      discount?: number;
      penalty?: number;
      notes?: string;
    }
  ) => {
    await api.payInvoice(id, data);
    await refreshData();
  };

  const bulkGenerateInvoices = async (data: { classId?: string; referenceMonth: string; dueDate: string; amount: number }) => {
    await api.bulkGenerateInvoices(data);
    await refreshData();
  };

  const deleteInvoice = async (id: string) => {
    await api.deleteInvoice(id);
    await refreshData();
  };

  const createAnnouncement = async (ann: Partial<Announcement>) => {
    await api.createAnnouncement(ann);
    await refreshData();
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    await api.updateAnnouncement(id, updates);
    await refreshData();
  };

  const deleteAnnouncement = async (id: string) => {
    await api.deleteAnnouncement(id);
    await refreshData();
  };

  const updateSchoolConfig = async (newConfig: Partial<SchoolConfig>) => {
    await api.updateConfig(newConfig);
    await refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        error,
        refreshData,
        resetDemoData,
        students,
        teachers,
        classes,
        subjects,
        schedules,
        grades,
        attendance,
        invoices,
        announcements,
        config,
        getStudentGrades,
        getStudentAttendanceStats,
        getStudentInvoices,
        getStudentSchedule,
        getStudentAnnouncements,
        getTeacherClasses,
        getTeacherSubjects,
        getTeacherSchedules,
        getFinancialKPIs,
        getOverdueStudentsList,
        createStudent,
        updateStudent,
        deleteStudent,
        createTeacher,
        updateTeacher,
        deleteTeacher,
        createClass,
        updateClass,
        deleteClass,
        createSubject,
        updateSubject,
        deleteSubject,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        saveGrade,
        saveAttendanceRollCall,
        createInvoice,
        updateInvoice,
        payInvoice,
        bulkGenerateInvoices,
        deleteInvoice,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        updateSchoolConfig,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

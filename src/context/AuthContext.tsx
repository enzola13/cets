import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Teacher, UserRole } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  studentProfile: Student | null;
  teacherProfile: Teacher | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUserSession: (userUpdates: Partial<User>) => void;
  updateStudentProfile: (studentUpdates: Partial<Student>) => void;
  switchUserRole: (role: UserRole, targetId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cets_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load persisted session on initial render
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.token) {
          setUser(parsed.user);
          setStudentProfile(parsed.studentProfile || null);
          setTeacherProfile(parsed.teacherProfile || null);
          setToken(parsed.token);
        }
      }
    } catch (e) {
      console.error('Failed to parse auth from localStorage', e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (
    newUser: User,
    newToken: string,
    newStudent?: Student | null,
    newTeacher?: Teacher | null
  ) => {
    setUser(newUser);
    setToken(newToken);
    setStudentProfile(newStudent || null);
    setTeacherProfile(newTeacher || null);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: newUser,
        token: newToken,
        studentProfile: newStudent || null,
        teacherProfile: newTeacher || null,
      })
    );
  };

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await api.login(credentials);
      saveSession(res.user, res.token, res.studentProfile, res.teacherProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setStudentProfile(null);
    setTeacherProfile(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUserSession = (userUpdates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...userUpdates };
    setUser(updated);
    if (token) {
      saveSession(updated, token, studentProfile, teacherProfile);
    }
  };

  const updateStudentProfile = (studentUpdates: Partial<Student>) => {
    if (!studentProfile) return;
    const updated = { ...studentProfile, ...studentUpdates };
    setStudentProfile(updated);
    if (user && token) {
      saveSession(user, token, updated, teacherProfile);
    }
  };

  // Quick switch for testing and preview convenience
  const switchUserRole = async (targetRole: UserRole, targetId?: string) => {
    setIsLoading(true);
    try {
      const data = await api.getBootstrapData();
      if (targetRole === 'admin') {
        const adminUser = data.users.find((u) => u.role === 'admin') || data.users[0];
        saveSession(adminUser, `token-admin-${Date.now()}`, null, null);
      } else if (targetRole === 'aluno') {
        const student = targetId
          ? data.students.find((s) => s.id === targetId || s.userId === targetId)
          : data.students[0];
        const studentUser = data.users.find((u) => u.id === student?.userId || u.referenceId === student?.id);
        if (student && studentUser) {
          saveSession(studentUser, `token-student-${Date.now()}`, student, null);
        }
      } else if (targetRole === 'professor') {
        const teacher = targetId
          ? data.teachers.find((t) => t.id === targetId || t.userId === targetId)
          : data.teachers[0];
        const teacherUser = data.users.find((u) => u.id === teacher?.userId || u.referenceId === teacher?.id);
        if (teacher && teacherUser) {
          saveSession(teacherUser, `token-teacher-${Date.now()}`, null, teacher);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        teacherProfile,
        role: user?.role || null,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUserSession,
        updateStudentProfile,
        switchUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

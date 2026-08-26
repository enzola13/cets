import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';
import { LoginScreen } from './components/auth/LoginScreen.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { MobileNav } from './components/layout/MobileNav.tsx';

// Student views
import { StudentDashboard } from './components/student/StudentDashboard.tsx';
import { StudentSubjects } from './components/student/StudentSubjects.tsx';
import { StudentGrades } from './components/student/StudentGrades.tsx';
import { StudentSchedules } from './components/student/StudentSchedules.tsx';
import { StudentAttendance } from './components/student/StudentAttendance.tsx';
import { StudentInvoices } from './components/student/StudentInvoices.tsx';

// Teacher views
import { TeacherDashboard } from './components/teacher/TeacherDashboard.tsx';
import { TeacherGrades } from './components/teacher/TeacherGrades.tsx';
import { TeacherAttendance } from './components/teacher/TeacherAttendance.tsx';

// Admin views
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { AdminStudents } from './components/admin/AdminStudents.tsx';
import { AdminClasses } from './components/admin/AdminClasses.tsx';
import { AdminFinance } from './components/admin/AdminFinance.tsx';

// Common views
import { AnnouncementsView } from './components/common/AnnouncementsView.tsx';
import { StudentProfileView } from './components/common/StudentProfileView.tsx';

const AppContent: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Unauthenticated view mode: 'landing' or 'login'
  const [unauthView, setUnauthView] = useState<'landing' | 'login'>('landing');

  if (!isAuthenticated) {
    if (unauthView === 'login') {
      return <LoginScreen onBackToLanding={() => setUnauthView('landing')} />;
    }
    return <LandingPage onGoToLogin={() => setUnauthView('login')} />;
  }

  // If user explicitly wants to preview the landing page while logged in
  if (activeTab === 'landing') {
    return <LandingPage onGoToLogin={() => setActiveTab('dashboard')} />;
  }

  // Render view by role and tab
  const renderCurrentView = () => {
    if (role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <AdminDashboard
              setActiveTab={setActiveTab}
              searchFilter={searchQuery}
              onOpenNewStudent={() => setIsNewStudentModalOpen(true)}
            />
          );
        case 'alunos':
          return (
            <AdminStudents
              searchFilter={searchQuery}
              isNewStudentModalOpen={isNewStudentModalOpen}
              onCloseNewStudentModal={() => setIsNewStudentModalOpen(false)}
            />
          );
        case 'turmas':
          return <AdminClasses />;
        case 'disciplinas':
          return <StudentSubjects />;
        case 'professores':
          return <TeacherDashboard setActiveTab={setActiveTab} />;
        case 'notas':
          return <TeacherGrades />;
        case 'frequencia':
          return <TeacherAttendance />;
        case 'financeiro':
          return <AdminFinance />;
        case 'horarios':
          return <StudentSchedules />;
        case 'comunicados':
          return <AnnouncementsView />;
        case 'relatorios':
          return <AdminFinance />;
        default:
          return <AdminDashboard setActiveTab={setActiveTab} />;
      }
    }

    if (role === 'professor') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard setActiveTab={setActiveTab} />;
        case 'turmas':
          return <AdminClasses />;
        case 'notas':
          return <TeacherGrades />;
        case 'frequencia':
          return <TeacherAttendance />;
        case 'horarios':
          return <StudentSchedules />;
        case 'comunicados':
          return <AnnouncementsView />;
        default:
          return <TeacherDashboard setActiveTab={setActiveTab} />;
      }
    }

    // Default Aluno views
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard setActiveTab={setActiveTab} />;
      case 'disciplinas':
        return <StudentSubjects />;
      case 'notas':
        return <StudentGrades />;
      case 'horarios':
        return <StudentSchedules />;
      case 'mensalidades':
        return <StudentInvoices />;
      case 'frequencia':
        return <StudentAttendance />;
      case 'comunicados':
        return <AnnouncementsView />;
      case 'perfil':
        return <StudentProfileView />;
      default:
        return <StudentDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sleek Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Application Container */}
      <main className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* Sleek Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewStudent={() => {
            setActiveTab('alunos');
            setIsNewStudentModalOpen(true);
          }}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Dynamic Content Body */}
        <section className="p-3.5 sm:p-6 lg:p-8 pb-28 md:pb-8 flex-1 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
          {renderCurrentView()}
        </section>

        {/* Sleek Footer */}
        <Footer />

        {/* Mobile Navigation */}
        <MobileNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

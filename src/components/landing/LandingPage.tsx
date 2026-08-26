import React, { useState } from 'react';
import {
  Stethoscope,
  HeartHandshake,
  BookOpen,
  GraduationCap,
  FileSpreadsheet,
  Calendar,
  CreditCard,
  CheckCircle2,
  Bell,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Clock,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Award,
  ChevronRight,
  Star,
  Lock,
  Smartphone,
  Check,
  ExternalLink,
  Menu,
  X,
  Play,
  QrCode,
  FileText,
  UserCheck,
} from 'lucide-react';
import { CetsLogo } from '../common/CetsLogo.tsx';

interface LandingPageProps {
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCourse, setLeadCourse] = useState('tecnico-enfermagem');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;
    setLeadSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      {/* 1. Header / Menu Fixo */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <CetsLogo variant="horizontal" size="md" theme="light" showSlogan={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('inicio')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Sobre a CETS
            </button>
            <button
              onClick={() => scrollToSection('funcionalidades')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollToSection('curso')}
              className="hover:text-teal-700 transition-colors cursor-pointer flex items-center gap-1 text-teal-800 font-bold"
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              Técnico em Enfermagem
            </button>
            <button
              onClick={() => scrollToSection('perfis')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Perfis
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Contato
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Acessar Portal do Aluno</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('sobre')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Sobre a CETS
              </button>
              <button
                onClick={() => scrollToSection('funcionalidades')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Funcionalidades do App
              </button>
              <button
                onClick={() => scrollToSection('curso')}
                className="text-left px-3 py-2 rounded-lg hover:bg-teal-50 text-teal-800 font-bold"
              >
                Curso Técnico em Enfermagem
              </button>
              <button
                onClick={() => scrollToSection('perfis')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Perfis de Acesso
              </button>
              <button
                onClick={() => scrollToSection('depoimentos')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Depoimentos
              </button>
              <button
                onClick={() => scrollToSection('contato')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Contato & Matrícula
              </button>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={onGoToLogin}
                className="w-full py-3 bg-teal-700 text-white rounded-xl text-center font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>Acessar Portal do Aluno</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section (Topo) */}
      <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-slate-900 to-teal-900 text-white pt-12 pb-20 sm:pb-28 lg:pt-20 lg:pb-32">
        {/* Background Glow Orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs sm:text-sm font-semibold backdrop-blur-xs">
                <HeartHandshake className="w-4 h-4 text-teal-300 animate-pulse" />
                <span>Aplicativo Oficial CETS • Gestão Acadêmica em Saúde</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Sua vida acadêmica na <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-200">palma da mão</span>.
              </h1>

              <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                O aplicativo CETS centraliza notas bimestrais, frequência em laboratórios, grade de horários, emissão de boletim e mensalidades com PIX instantâneo. Tudo para você focar 100% no seu futuro como profissional de enfermagem.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onGoToLogin}
                  className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Acessar Portal do Aluno</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('funcionalidades')}
                  className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>Conhecer Funcionalidades</span>
                </button>
              </div>

              {/* Quick Institutional Badges */}
              <div className="pt-6 border-t border-teal-800/60 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-teal-300">+3.500</span>
                  <span className="text-xs text-teal-100/70 font-medium">Alunos e Formados</span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-teal-300">94%</span>
                  <span className="text-xs text-teal-100/70 font-medium">Empregabilidade</span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-teal-300">100%</span>
                  <span className="text-xs text-teal-100/70 font-medium">Prática Hospitalar</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive App Preview Showcase */}
            <div className="lg:col-span-5 relative">
              {/* Outer Device Frame / Glassmorphism Mockup */}
              <div className="relative mx-auto max-w-sm sm:max-w-md bg-slate-900/90 rounded-3xl p-3 sm:p-4 border-2 border-teal-500/30 shadow-2xl shadow-teal-950/50 backdrop-blur-xl">
                {/* Floating highlight badge */}
                <div className="absolute -top-4 -right-4 bg-teal-500 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow-lg flex items-center gap-1.5 z-20">
                  <Sparkles className="w-3.5 h-3.5" /> App em Tempo Real
                </div>

                {/* Internal App Screen */}
                <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 text-left border border-slate-800 space-y-4">
                  {/* Top Bar of the Mockup */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                        JS
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-none">João Silva</h4>
                        <span className="text-[10px] text-teal-400 font-mono">Técnico em Enfermagem</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Matriculado
                    </span>
                  </div>

                  {/* Mock KPI Mini Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Frequência</span>
                      <span className="text-lg font-black text-teal-400">92.5%</span>
                      <span className="text-[9px] text-emerald-400 block mt-0.5 font-medium">✓ Acima da meta (75%)</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Média Geral</span>
                      <span className="text-lg font-black text-emerald-400">8.9</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Semestre 2026.1</span>
                    </div>
                  </div>

                  {/* Mock Next Class Card */}
                  <div className="bg-teal-950/60 border border-teal-800/60 p-3 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-teal-300 font-bold uppercase tracking-wider">Próxima Aula</span>
                      <span className="text-white font-mono bg-teal-900 px-1.5 py-0.5 rounded">Hoje • 08:00</span>
                    </div>
                    <p className="text-xs font-bold text-white">Semiologia e Semiomaiêutica</p>
                    <p className="text-[11px] text-teal-200/80">Prof. Dra. Camila • Lab. Anatomia 02</p>
                  </div>

                  {/* Mock Action: PIX Invoice Quick Pay */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Mensalidade Vigente</span>
                      <span className="text-xs font-bold text-white">Ref: Março/2026</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-bold">
                      <QrCode className="w-3.5 h-3.5" /> PIX Copia & Cola
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Sobre a CETS */}
      <section id="sobre" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Instituição de Referência</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Centro de Ensino Técnico em Saúde (CETS)
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                A <strong>CETS</strong> é uma instituição de ensino dedicada com exclusividade à formação de profissionais de excelência na área da saúde. Combinamos tradição pedagógica, laboratórios com tecnologia de simulação realística e parcerias com os principais hospitais e clínicas da região.
              </p>

              <p className="text-slate-600 text-base leading-relaxed">
                Nossa missão é preparar você para os desafios reais do mercado hospitalar, unindo o rigor científico e o cuidado humanizado com o suporte de uma plataforma digital inovadora.
              </p>

              {/* Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Laboratórios Modernos</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Simuladores anatômicos e equipamentos hospitalares.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Estágio Prático</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Supervisão direta com profissionais experientes na área hospitalar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Professores Especialistas</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Enfermeiros atuantes em UTIs, emergências e gestão.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Portal Integrado</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Boletim, frequência e pagamentos na palma da mão.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Showcase Box */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-teal-800">
                <div className="absolute top-0 right-0 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/95 rounded-2xl p-2 shadow-md">
                      <CetsLogo variant="emblem" size="sm" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">Excelência na Formação em Saúde</h3>
                      <p className="text-xs text-teal-200/80">Ensino Técnico Especializado e Humanizado</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-teal-200">Metodologia:</span>
                      <strong className="text-white font-medium">Aulas Teóricas + Práticas Intensivas</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-teal-200">Infraestrutura:</span>
                      <strong className="text-white font-medium">Laboratórios com Simulação Realística</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-teal-200">Carga Horária Total:</span>
                      <strong className="text-white font-mono">1.800 Horas (Teoria + Estágio)</strong>
                    </div>
                  </div>

                  <blockquote className="text-sm italic text-teal-100/90 border-l-2 border-teal-400 pl-4 py-1 leading-relaxed">
                    "Formação que você precisa, Qualidade que você Merece! Menos burocracia na secretaria, mais tempo e foco no aprendizado prático do cuidar."
                  </blockquote>

                  <div className="pt-2 flex items-center justify-between text-xs text-teal-300">
                    <span className="font-semibold text-cyan-300">CETS Saúde</span>
                    <span className="font-bold">Turmas Abertas 2026.1 & 2026.2</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Funcionalidades do App (Cards) */}
      <section id="funcionalidades" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-teal-700" />
              <span>Tecnologia na Educação</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tudo o que você precisa em um único aplicativo
            </h2>
            <p className="text-slate-600 text-base">
              Desenvolvido especialmente para as necessidades do aluno técnico de saúde. Interface rápida, leve e intuitiva para celular, tablet e computador.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Disciplinas */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-teal-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
                📚 Disciplinas
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Acompanhe a grade curricular do seu curso em tempo real. Veja ementas, cargas horárias, indicação de laboratórios práticos e informações do corpo docente.
              </p>
            </div>

            {/* Card 2: Notas */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-teal-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors flex items-center justify-center mb-5">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
                📝 Notas & Boletim
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Consulte suas 1ª e 2ª notas bimestrais, exames e médias ponderadas. Emita o Boletim Escolar Oficial autenticado em PDF com um único clique.
              </p>
            </div>

            {/* Card 3: Horários */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-teal-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
                📅 Grade de Horários
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Organize sua rotina com a grade semanal de aulas teóricas, escalas de laboratório prático e plantões de estágio hospitalar com indicação de salas e professores.
              </p>
            </div>

            {/* Card 4: Mensalidades */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-teal-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors flex items-center justify-center mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
                💰 Mensalidades & PIX
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Acompanhe o status financeiro de todas as parcelas. Pague instantaneamente via PIX QR Code ou copie a linha digitável e acesse recibos de quitação.
              </p>
            </div>

            {/* Card 5: Frequência */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-teal-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
                📊 Frequência em Tempo Real
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Controle o percentual de presenças e faltas por matéria com alertas automáticos sobre a margem de segurança regulamentar exigida pelo MEC/COREN (mínimo 75%).
              </p>
            </div>

            {/* Card 6: Comunicados */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-teal-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors flex items-center justify-center mb-5">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
                📢 Mural de Comunicados
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Receba avisos urgentes da coordenação, datas de provas, campanhas de vacinação, regras de estágio e eventos acadêmicos diretamente no celular.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Curso Técnico em Enfermagem (Destaque Principal) */}
      <section id="curso" className="py-16 sm:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-teal-300" />
                  <span>Curso em Destaque</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  Técnico em Enfermagem CETS
                </h2>

                <p className="text-teal-100 text-base leading-relaxed">
                  Uma das profissões mais demandadas e respeitadas no Brasil e no mundo. Nosso curso técnico capacita você para atuar em hospitais, clínicas, prontos-socorros, UTIs, unidades básicas de saúde e atendimento domiciliar.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-3.5 rounded-xl">
                    <Clock className="w-5 h-5 text-teal-300 mb-1" />
                    <span className="text-xs text-teal-200 block">Duração</span>
                    <strong className="text-sm text-white">18 a 24 Meses</strong>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-3.5 rounded-xl">
                    <Building2 className="w-5 h-5 text-teal-300 mb-1" />
                    <span className="text-xs text-teal-200 block">Turnos</span>
                    <strong className="text-sm text-white">Manhã, Noite ou Sábados</strong>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-3.5 rounded-xl col-span-2 sm:col-span-1">
                    <Award className="w-5 h-5 text-teal-300 mb-1" />
                    <span className="text-xs text-teal-200 block">Diploma</span>
                    <strong className="text-sm text-white">Válido no COREN</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-bold text-teal-200 uppercase tracking-wider mb-3">
                    Principais Módulos do Curso:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Anatomia & Fisiologia Humana</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Farmacologia & Cálculo de Medicamentos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Urgência, Emergência e UTI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Saúde da Mulher, Criança e Idoso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Biossegurança e Controle de Infecção</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Estágio Supervisionado em Hospital Geral</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Box: Lead Form for Enrollment */}
              <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100">
                <div className="text-center mb-5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    Matrículas Abertas 2026
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Garanta sua Vaga</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Preencha e nossa coordenação entrará em contato via WhatsApp com condições especiais.
                  </p>
                </div>

                {leadSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-emerald-900 text-lg">Solicitação Enviada!</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Obrigado, <strong>{leadName}</strong>! Nossa equipe pedagógica entrará em contato pelo número <strong>{leadPhone}</strong> em até 24 horas úteis.
                    </p>
                    <button
                      onClick={() => setLeadSubmitted(false)}
                      className="text-xs font-semibold text-emerald-700 underline"
                    >
                      Enviar outro contato
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Ex: Maria Oliveira"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        WhatsApp / Celular
                      </label>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="(11) 98888-7777"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Turno de Preferência
                      </label>
                      <select
                        value={leadCourse}
                        onChange={(e) => setLeadCourse(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                      >
                        <option value="tecnico-manha">Técnico em Enfermagem - Manhã (08h às 12h)</option>
                        <option value="tecnico-noite">Técnico em Enfermagem - Noite (19h às 22h30)</option>
                        <option value="tecnico-sabado">Técnico em Enfermagem - Sábados (08h às 17h)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-700/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Quero Mais Informações</span>
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-400">
                      🔒 Seus dados estão seguros e protegidos de acordo com a LGPD.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Para quem é o App (Perfis de Acesso) */}
      <section id="perfis" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-teal-700" />
              <span>Perfis de Acesso</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Uma experiência dedicada para cada integrante da escola
            </h2>
            <p className="text-slate-600 text-base">
              O aplicativo CETS possui painéis inteligentes e permissões isoladas para garantir agilidade e sigilo das informações.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Perfil Aluno */}
            <div className="bg-white border-2 border-teal-600/30 rounded-3xl p-7 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] uppercase font-black px-4 py-1 rounded-bl-xl">
                Mais Utilizado
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Portal do Aluno</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Tudo o que o estudante de enfermagem precisa para acompanhar sua evolução diária.
                </p>
                <ul className="space-y-3 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Consulta de notas e médias bimestrais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Emissão de Boletim e Declaração em PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Pagamento de mensalidades via PIX QR Code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Controle de faltas e grade semanal de aulas</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onGoToLogin}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Acessar como Aluno</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Perfil Professor */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Portal do Professor</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Ferramentas práticas para o docente focar no ensino e na avaliação dos alunos.
                </p>
                <ul className="space-y-3 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Lançamento de notas com cálculo automático de média</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Registro rápido de chamada e faltas hospitalares</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Publicação de comunicados e cronogramas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Visualização de turmas e relatórios de desempenho</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onGoToLogin}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Acessar como Docente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Perfil Secretaria / Admin */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Administração & Secretaria</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Controle total da instituição em um painel unificado com métricas em tempo real.
                </p>
                <ul className="space-y-3 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Cadastro de alunos e emissão de matrículas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Gestão financeira, inadimplência e conciliação PIX</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Organização de turmas, semestres e disciplinas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Emissão de relatórios acadêmicos e pedagógicos</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onGoToLogin}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Acessar Painel Direção</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Como Funciona (Passo a Passo) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
              <span>Passo a Passo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Como começar a usar o aplicativo CETS
            </h2>
            <p className="text-slate-600 text-base">
              Sem complicações: em 3 etapas você tem toda a sua trajetória acadêmica na ponta dos dedos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white font-black text-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-700/20">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Matrícula Efetuada</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A secretaria da CETS cadastra seu prontuário no sistema escolar e gera seu número oficial de matrícula acadêmica.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white font-black text-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-700/20">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Acesso & Senha</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Você recebe seus dados de acesso via e-mail/WhatsApp institucional e pode personalizar sua senha com total segurança.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white font-black text-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-700/20">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tudo em Tempo Real</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Basta entrar no portal através do navegador do celular ou computador para acompanhar aulas, notas, faltas e pagamentos.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Segurança e Confiabilidade */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 text-center lg:text-left">
              <div className="w-16 h-16 rounded-3xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto lg:mx-0 mb-4">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Segurança, Sigilo e Proteção de Dados
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                O aplicativo CETS adota rigorosos protocolos de segurança da informação e privacidade em conformidade com a LGPD.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-slate-700/80 p-5 rounded-2xl">
                <Lock className="w-5 h-5 text-teal-400 mb-2" />
                <h4 className="font-bold text-white text-base">Isolamento Estrito por Perfil</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Cada aluno tem acesso exclusivo e confidencial às suas próprias notas, frequência e faturas financeiras.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 p-5 rounded-2xl">
                <FileText className="w-5 h-5 text-teal-400 mb-2" />
                <h4 className="font-bold text-white text-base">Conformidade com a LGPD</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Tratamento de dados pessoais em saúde com consentimento e política clara de privacidade institucional.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 p-5 rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-teal-400 mb-2" />
                <h4 className="font-bold text-white text-base">Autenticação Criptografada</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Comunicação criptografada com certificado SSL/TLS de 256 bits em servidores de alta disponibilidade.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 p-5 rounded-2xl">
                <Award className="w-5 h-5 text-teal-400 mb-2" />
                <h4 className="font-bold text-white text-base">Auditoria Acadêmica</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Histórico de lançamento de notas e presenças com registro e carimbo de data e hora do professor.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Depoimentos de Alunos */}
      <section id="depoimentos" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Experiência dos Estudantes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              O que dizem os futuros profissionais de saúde
            </h2>
            <p className="text-slate-600 text-base">
              A satisfação dos nossos alunos de Enfermagem com as aulas presenciais e o suporte do aplicativo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Depoimento 1 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "O aplicativo da CETS facilitou muito a minha rotina. Eu consigo ver minhas notas assim que o professor lança e não fico mais na dúvida sobre minha presença nos estágios hospitalares. Muito prático!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                  JS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Juliana Souza</h4>
                  <p className="text-xs text-slate-500">Aluna do 3º Semestre de Enfermagem</p>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "Pagar a mensalidade pelo PIX direto no app e já gerar o comprovante na hora me poupa de ter que ir até a secretaria da escola. Além disso, o boletim é emitido em PDF com facilidade."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-sm">
                  RA
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Rodrigo Alves</h4>
                  <p className="text-xs text-slate-500">Aluno Técnico em Enfermagem - Noturno</p>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "A estrutura dos laboratórios da CETS aliada ao aplicativo onde vemos os avisos de estágio e matérias foi o que me fez escolher a instituição. Recomendo de olhos fechados!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  BF
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Beatriz Fernandes</h4>
                  <p className="text-xs text-slate-500">Formanda e Técnica Atuante em UTI</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Chamada Final (CTA) */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold">
            <HeartHandshake className="w-4 h-4 text-teal-300" />
            <span>Sua Carreira em Saúde Começa Aqui</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Pronto para acompanhar sua jornada na área da saúde?
          </h2>

          <p className="text-teal-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Seja você um aluno matriculado pronto para conferir suas notas ou um futuro técnico em enfermagem buscando sua vaga, a CETS está de portas abertas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-500/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Acessar o Portal CETS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('curso')}
              className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Quero me Matricular</span>
            </button>
          </div>
        </div>
      </section>

      {/* 11. Contato & Atendimento */}
      <section id="contato" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Telefone & WhatsApp</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  WhatsApp Oficial CETS<br />
                  Atendimento a Alunos e Matrículas
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Secretaria Acadêmica</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  contato@cets.edu.br<br />
                  Segunda a Sexta: 08h às 21h
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 12. Rodapé Institucional */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            
            {/* Coluna 1: Marca */}
            <div className="space-y-3">
              <div className="bg-white/95 rounded-2xl p-2 inline-block shadow-md">
                <CetsLogo variant="horizontal" size="sm" theme="light" showSlogan={false} />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Centro de Ensino Técnico em Saúde. Formação que você precisa, Qualidade que você Merece!
              </p>
            </div>

            {/* Coluna 2: Navegação */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Navegação</h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => scrollToSection('inicio')} className="hover:text-teal-400 transition-colors">Início</button></li>
                <li><button onClick={() => scrollToSection('sobre')} className="hover:text-teal-400 transition-colors">Sobre a Instituição</button></li>
                <li><button onClick={() => scrollToSection('funcionalidades')} className="hover:text-teal-400 transition-colors">Funcionalidades do App</button></li>
                <li><button onClick={() => scrollToSection('curso')} className="hover:text-teal-400 transition-colors">Curso Técnico em Enfermagem</button></li>
              </ul>
            </div>

            {/* Coluna 3: Portais */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Acesso ao Sistema</h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={onGoToLogin} className="hover:text-teal-400 transition-colors">Portal do Aluno</button></li>
                <li><button onClick={onGoToLogin} className="hover:text-teal-400 transition-colors">Portal do Professor</button></li>
                <li><button onClick={onGoToLogin} className="hover:text-teal-400 transition-colors">Secretaria Online</button></li>
                <li><button onClick={onGoToLogin} className="hover:text-teal-400 transition-colors">Recuperação de Senha</button></li>
              </ul>
            </div>

            {/* Coluna 4: Atendimento */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Atendimento & Suporte</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Suporte acadêmico ao aluno, emissão de documentos e atendimento a novos ingressantes de Segunda a Sexta.
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-teal-400 font-mono">CETS Saúde</span>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 CETS – Centro de Ensino Técnico em Saúde. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Política de Privacidade</span>
              <span className="hover:text-slate-400 cursor-pointer">Termos de Uso</span>
              <span className="hover:text-slate-400 cursor-pointer">Segurança LGPD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Stethoscope,
  HeartHandshake,
  BookOpen,
  GraduationCap,
  FileCheck2,
  Calendar,
  CreditCard,
  CheckCircle2,
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
  Menu,
  X,
  Syringe,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { CetsLogo } from '../common/CetsLogo.tsx';

interface LandingPageProps {
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
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

  const nursingModules = [
    {
      module: 'Módulo I',
      title: 'Bases da Enfermagem & Anatomia Humana',
      duration: '400 horas',
      subjects: [
        'Anatomia e Fisiologia Humana',
        'Fundamentos e Práticas de Enfermagem',
        'Microbiologia e Parasitologia',
        'Ética, Bioética e Legislação Profissional',
        'Biossegurança e Controle de Infecção',
      ],
    },
    {
      module: 'Módulo II',
      title: 'Farmacologia & Cuidados em Saúde Coletiva',
      duration: '400 horas',
      subjects: [
        'Farmacologia e Cálculo de Medicamentos',
        'Saúde Coletiva, SUS e Epidemiologia',
        'Imunização e Sala de Vacinas',
        'Nutrição e Dietética Aplicada à Saúde',
        'Psicologia Aplicada e Relações Humanas',
      ],
    },
    {
      module: 'Módulo III',
      title: 'Clínica Médica, Cirúrgica & Obstetrícia',
      duration: '500 horas',
      subjects: [
        'Assistência em Clínica Médica',
        'Enfermagem em Centro Cirúrgico e CME',
        'Saúde da Mulher, Obstetrícia e Parto',
        'Saúde da Criança e do Adolescente (Pediatria)',
        'Saúde do Idoso e Doenças Crônicas',
      ],
    },
    {
      module: 'Módulo IV',
      title: 'Urgência, Emergência, UTI & Estágio Supervisionado',
      duration: '500 horas',
      subjects: [
        'Urgência, Emergência e Atendimento Pré-Hospitalar (APH)',
        'Cuidados Intensivos e Enfermagem em UTI',
        'Saúde Mental e Atenção Psicossocial',
        'Estágio Curricular Supervisionado Hospitalar (400h)',
        'Trabalho de Conclusão de Curso Técnico',
      ],
    },
  ];

  const differentiators = [
    {
      icon: Activity,
      title: 'Laboratório Clínico Moderno',
      desc: 'Simulação realística, manequins anatômicos para punção venosa, sondagem, curativos e administração segura de medicações.',
    },
    {
      icon: Building2,
      title: 'Estágio Hospitalar Garantido',
      desc: 'Convênio com hospitais regionais, maternidades, SAMU e Unidades Básicas de Saúde (UBS) em Tucano e municípios vizinhos.',
    },
    {
      icon: Users,
      title: 'Professores Enfermeiros e Mestres',
      desc: 'Corpo docente atuante na linha de frente hospitalar, trazendo experiência prática e metodologia humanizada.',
    },
    {
      icon: Award,
      title: 'Habilitação COREN-BA & CEE',
      desc: 'Curso credenciado e autorizado pelos órgãos oficiais, com diploma válido em todo o território nacional.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header Fixo Clean */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <CetsLogo variant="horizontal" size="md" theme="light" showSlogan={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('inicio')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              O Curso
            </button>
            <button
              onClick={() => scrollToSection('diferenciais')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Laboratórios & Estágio
            </button>
            <button
              onClick={() => scrollToSection('grade')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Grade Curricular
            </button>
            <button
              onClick={() => scrollToSection('portal')}
              className="hover:text-blue-700 transition-colors cursor-pointer text-blue-700 font-bold"
            >
              Portal Acadêmico
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Contato
            </button>
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Acessar Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onGoToLogin}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold sm:hidden"
            >
              Entrar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
            <button
              onClick={() => scrollToSection('inicio')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-blue-700"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-blue-700"
            >
              O Curso Técnico
            </button>
            <button
              onClick={() => scrollToSection('diferenciais')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-blue-700"
            >
              Laboratórios & Estágio
            </button>
            <button
              onClick={() => scrollToSection('grade')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-blue-700"
            >
              Grade Curricular
            </button>
            <button
              onClick={() => scrollToSection('portal')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-blue-700"
            >
              Portal Acadêmico
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-blue-700"
            >
              Contato & Localização
            </button>
            <button
              onClick={onGoToLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Acessar Portal do Aluno / Direção <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* 2. Hero Section - Clean, Medical White & Blue */}
      <section id="inicio" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>CETS • Tucano - BA • Autorizado CEE/COREN-BA</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Curso Técnico em <span className="text-blue-600">Enfermagem</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                Formação profissional completa com foco em prática clínica intensiva, laboratórios modernos e estágio supervisionado em hospitais e unidades de saúde de Tucano e região.
              </p>

              {/* Quick Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-xs font-bold text-blue-600">1.800 Horas</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Teoria & Estágio Real</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-xs font-bold text-blue-600">Laboratório</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Simulação Clínica</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                  <p className="text-xs font-bold text-blue-600">Registro COREN</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Diploma Reconhecido</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  onClick={onGoToLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Acessar Portal Acadêmico</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollToSection('inscricao')}
                  className="bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Informações de Matrícula</span>
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Matrículas abertas para as turmas matutinas, vespertinas e noturnas.</span>
              </div>
            </div>

            {/* Right Card: Practical Nursing Image & Highlights */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl relative">
                <div className="relative rounded-2xl overflow-hidden mb-6 aspect-4/3 bg-blue-100">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
                    alt="Prática de Enfermagem CETS"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-xs px-3 py-1 rounded-full">
                      <Stethoscope className="w-3.5 h-3.5" /> Laboratório de Enfermagem CETS
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Modalidade</span>
                    <span className="text-xs font-bold text-slate-900">Presencial com Prática</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Localização</span>
                    <span className="text-xs font-bold text-slate-900">Tucano - BA (Entroncamento)</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Portal do Aluno</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 100% Digital Integrado
                    </span>
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
                  <p className="text-xs font-bold text-blue-900 italic">
                    "Formação que você precisa, Qualidade que você Merece!"
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Diferenciais da Formação CETS */}
      <section id="diferenciais" className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
              Excelência no Ensino em Saúde
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Por que escolher o Técnico em Enfermagem da CETS?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Estrutura planejada para preparar você com rigor técnico, ética e capacidade prática desde o primeiro semestre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Grade Curricular Estruturada */}
      <section id="grade" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
              Grade Curricular Oficial
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Estrutura Modular do Curso de Enfermagem
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Currículo alinhado com as diretrizes nacionais do MEC e Conselho Regional de Enfermagem (COREN).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nursingModules.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      {m.module}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {m.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-3">{m.title}</h3>

                <ul className="space-y-2">
                  {m.subjects.map((sub, sIdx) => (
                    <li key={sIdx} className="text-xs text-slate-600 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Portal Acadêmico Integrado CETS */}
      <section id="portal" className="py-16 md:py-24 bg-gradient-to-b from-blue-50/40 via-blue-50/20 to-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200">
                Tecnologia na Educação
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Portal Acadêmico 100% Digital para Alunos e Docentes
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Toda a sua vida acadêmica na palma da sua mão. Acesse notas, controle de frequência presencial e hospitalar, cronogramas de aulas, comunicados institucionais e financeiro.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <FileCheck2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Boletim e Avaliações Online</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Notas de provas teóricas, relatórios de estágio e média final calculada automaticamente.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Frequência e Horários de Aulas</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Acompanhamento de presenças e escala de plantões práticos e estágios.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Gestão Financeira & Mensalidades</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Emissão simplificada de boletos, código PIX com baixa rápida e histórico de pagamentos.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onGoToLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Entrar no Portal CETS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual: Preview Screen */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">portal.cetssaude.com.br</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        EA
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Enfermagem Geral - Turma 2026.1</p>
                        <p className="text-[10px] text-slate-500">Módulo II • Turno Noturno</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Regular
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block">Média Geral</span>
                      <span className="text-sm font-black text-blue-700">8.8</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block">Frequência</span>
                      <span className="text-sm font-black text-emerald-600">96%</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block">Mensalidade</span>
                      <span className="text-sm font-bold text-slate-700">Em dia</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-800 mb-1">Próxima Aula Prática:</p>
                    <p className="text-xs text-slate-600">Semiologia & Cuidados em UTI • Laboratório 1</p>
                    <p className="text-[10px] text-blue-600 font-semibold mt-1">Hoje às 19h00 • Profª. Camila Rodrigues</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Formulário de Informações de Matrícula */}
      <section id="inscricao" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200">
              Vagas Abertas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Deseja se matricular no Técnico em Enfermagem?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
              Preencha seus dados abaixo para que nossa Secretaria Acadêmica entre em contato via WhatsApp com os detalhes da grade, valores e documentação necessária.
            </p>

            {leadSubmitted ? (
              <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-base font-bold">Solicitação Enviada com Sucesso!</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Nossa equipe entrará em contato com você em breve pelo número informado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="mt-8 max-w-lg mx-auto space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp com DDD
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="(75) 99999-9999"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Solicitar Informações de Matrícula</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. Contato & Rodapé */}
      <footer id="contato" className="bg-[#0B1736] text-white pt-14 pb-8 border-t border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-blue-900/40">
            
            {/* Column 1: School Identity */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-2.5 w-fit shadow-xs">
                <CetsLogo variant="horizontal" size="sm" theme="light" showSlogan={false} />
              </div>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Centro de Ensino Técnico em Saúde — Formação profissional humanizada e capacitada com foco em Enfermagem em Tucano - BA.
              </p>
              <p className="text-xs text-cyan-300 font-bold italic">
                "Formação que você precisa, Qualidade que você Merece!"
              </p>
            </div>

            {/* Column 2: Contact Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Secretaria & Contato</h4>
              <div className="space-y-2 text-xs text-blue-200/80">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Av. Luiz Viana Filho, 404 - Entroncamento, Tucano - BA</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>contato@cetssaude.com.br</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>(75) 3273-0000 • (75) 99876-5432</span>
                </p>
              </div>
            </div>

            {/* Column 3: Portal Access */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Acesso ao Sistema</h4>
              <p className="text-xs text-blue-200/80">
                Alunos, professores e direção acadêmica podem acessar o sistema integrado para gestão de notas, horários e financeiro.
              </p>
              <button
                onClick={onGoToLogin}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Acessar Portal do Aluno / Diretor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300/60 gap-3 text-center sm:text-left">
            <p>© 2026 CETS - Centro de Ensino Técnico em Saúde. Todos os direitos reservados.</p>
            <p>Parecer CEE/COREN-BA nº 412/2022 • Tucano - Bahia</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

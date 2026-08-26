import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-12 flex items-center justify-between px-6 lg:px-8 bg-slate-50 text-[10px] text-slate-400 border-t border-slate-100 shrink-0">
      <div>© 2026 CETS - Centro de Ensino Técnico em Saúde</div>
      <div className="flex items-center space-x-4">
        <span>Versão 2.4.0-build</span>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
          <span>Sistema Online</span>
        </div>
      </div>
    </footer>
  );
};

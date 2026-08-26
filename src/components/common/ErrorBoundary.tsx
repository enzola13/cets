import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('cets_school_database_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 mb-2">
              Recuperação do Portal CETS
            </h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Ocorreu uma instabilidade momentânea na interface. Clique abaixo para restaurar a sessão e recarregar os dados com segurança.
            </p>
            <div className="space-y-3">
              <button
                id="btn-error-reload"
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <RefreshCw className="w-4 h-4" />
                Recarregar Página
              </button>
              <button
                id="btn-error-reset"
                onClick={this.handleReset}
                className="w-full text-xs text-slate-400 hover:text-slate-200 py-2 transition underline cursor-pointer"
              >
                Restaurar dados padrões de demonstração
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props?.children;
  }
}

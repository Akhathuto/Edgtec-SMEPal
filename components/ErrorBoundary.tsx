import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './common/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.operationType && parsed.authInfo) {
            isFirestoreError = true;
            errorMessage = `Firestore Permission Denied: ${parsed.operationType} at ${parsed.path || 'unknown path'}. Please ensure you have the correct permissions.`;
          }
        }
      } catch (e) {
        // Not a JSON error message, use default
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="h-10 w-10 text-rose-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
              {isFirestoreError ? "Security Access Error" : "Something went wrong"}
            </h2>
            <p className="text-slate-500 mb-10 leading-relaxed font-medium">
              {errorMessage}
            </p>
            <div className="space-y-4">
              <Button 
                onClick={this.handleReset}
                className="w-full !py-4 shadow-lg shadow-indigo-100"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Application
              </Button>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                If this persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

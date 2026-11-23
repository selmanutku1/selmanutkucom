import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application ErrorBoundary caught error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto max-w-[640px] px-6 py-24 text-center lg:px-8">
          <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-[24px] font-bold tracking-[-0.02em] text-[#0A192F]">
            {this.props.fallbackTitle || 'Beklenmeyen bir hata oluştu.'}
          </h1>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#465B71]">
            {this.props.fallbackDescription ||
              'Bağlantı veya yetki doğrulaması sırasında bir sorun oluştu. Sayfayı yenileyerek tekrar deneyebilirsiniz.'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-7 inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-md bg-[#0C2340] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#143966]"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span>Tekrar Dene</span>
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

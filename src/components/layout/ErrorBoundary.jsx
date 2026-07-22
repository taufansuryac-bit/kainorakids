import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase">Ups! Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Maaf, kami mengalami sedikit gangguan teknis pada bagian ini.
            Tim kami sudah mencatatnya.
          </p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-colors shadow-md hover:-translate-y-0.5"
          >
            <Home size={18} />
            Kembali ke Beranda
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

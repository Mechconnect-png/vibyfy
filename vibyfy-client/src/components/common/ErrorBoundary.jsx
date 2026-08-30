import React from "react";
import { RefreshCw, Home, ArrowLeft, AlertTriangle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    console.error("Moodify Crash:", error);
    console.error("Component Stack:", info);
  }

  reloadPage = () => {
    window.location.reload();
  };

  goHome = () => {
    window.location.href = "/";
  };

  goBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center shadow-2xl">

            <div className="flex justify-center">
              <div className="bg-red-500/10 p-5 rounded-full">
                <AlertTriangle
                  size={60}
                  className="text-red-500"
                />
              </div>
            </div>

            <h1 className="text-4xl font-bold mt-6">
              Oops! Something went wrong
            </h1>

            <p className="text-slate-400 mt-4">
              Moodify encountered an unexpected error.
              Try reloading the page or return to the Home page.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mt-6 text-left bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-auto">
                <p className="text-red-400 text-sm font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4 mt-8">

              <button
                onClick={this.reloadPage}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition"
              >
                <RefreshCw size={18} />
                Reload
              </button>

              <button
                onClick={this.goHome}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl transition"
              >
                <Home size={18} />
                Home
              </button>

              <button
                onClick={this.goBack}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl transition"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>

            </div>

          </div>

        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
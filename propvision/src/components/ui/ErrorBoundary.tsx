"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          <AlertTriangle size={24} className="text-warning" />
          <div className="text-sm text-zinc-400 font-mono">
            {this.props.fallbackTitle || "Something went wrong"}
          </div>
          <div className="text-[10px] text-zinc-600 font-mono max-w-xs">
            {this.state.error?.message}
          </div>
          <button
            className="action-btn"
            onClick={() => this.setState({ hasError: false, error: undefined })}
            aria-label="Retry loading"
          >
            <RefreshCw size={12} aria-hidden="true" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

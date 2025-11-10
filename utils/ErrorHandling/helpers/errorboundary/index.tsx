import React, { Component, ReactNode } from "react";
/**
 * ErrorBoundary component for catching uncaught errors in React tree.
 * Displays a fallback UI and logs errors using the logging client.
 *
 * @remarks
 * - Uses ErrorFallback for UI
 * - Logs errors and sends to external service
 * - Compatible with Expo/React Native/Web
 */
import { ErrorFallback } from "../../../../components/Tools/ErrorHandling/ErrorFallback";
import { createLoggingClient, LoggingPayload } from "../../logging";
import { captureException } from "../capture";

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

const loggingClient = createLoggingClient();

/**
 * React ErrorBoundary implementation for MediMatch.
 * Catches errors in child components and displays fallback UI.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    };
  }
  /**
   * Updates state when an error is thrown in a child component.
   * @param error - The error thrown
   * @returns Partial state update
   */
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Logs error details using the logging client.
   * @param error - The error object
   * @param errorInfo - Additional error info from React
   */
  logError = (error: Error, errorInfo: React.ErrorInfo) => {
    const payload: LoggingPayload = {
      message: error.message,
      level: "error",
      tags: {
        origin: "ErrorBoundary",
        userName: "user.name",
        userEmail: "user.email",
      },
      context: {
        componentStack: errorInfo.componentStack ?? undefined,
      },
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };

    void loggingClient.submit(payload);
  };

  /**
   * Lifecycle method called when an error is caught.
   * Logs and reports the error, then updates state.
   * @param error - The error object
   * @param errorInfo - Additional error info from React
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorWithStack = Object.assign({}, error, {
      componentStack: errorInfo.componentStack,
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    if (process.env.NODE_ENV === "development") {
      console.debug("[ErrorBoundary] Error details:", {
        error: errorWithStack,
        componentStack: errorInfo.componentStack,
        digest: errorInfo.digest,
      });
    }

    captureException(errorWithStack, {
      where: "ErrorBoundary",
      componentStack: errorInfo.componentStack,
      errorInfo: {
        digest: errorInfo.digest,
        componentStack: errorInfo.componentStack,
      },
    });
    this.setState({ error, errorInfo });
    this.logError(error, errorInfo);
  }

  /**
   * Renders fallback UI if an error has been caught, otherwise renders children.
   */
  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;

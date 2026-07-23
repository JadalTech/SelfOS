/**
 * ErrorBoundary
 *
 * React class component that catches JavaScript errors in its child
 * component tree. Renders a fallback UI instead of crashing the app.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={<CustomFallback />}>
 *     <RiskyComponent />
 *   </ErrorBoundary>
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { logger } from '@/shared/utils/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional custom fallback UI to render on error. */
  fallback?: React.ReactNode;
  /** Optional callback when an error is caught. */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('ErrorBoundary', 'Uncaught error in component tree', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Custom fallback
    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Default fallback UI
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#09090b',
          padding: 24,
        }}
      >
        <Text
          style={{
            color: '#fafafa',
            fontSize: 20,
            fontWeight: '700',
            marginBottom: 8,
          }}
        >
          Something went wrong
        </Text>
        <Text
          style={{
            color: '#a1a1aa',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 20,
          }}
        >
          An unexpected error occurred.{'\n'}Please try again.
        </Text>
        <TouchableOpacity
          onPress={this.handleRetry}
          style={{
            backgroundColor: '#6366f1',
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 12,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

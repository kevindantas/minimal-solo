import React, { ErrorInfo } from 'react';
import { captureLog } from '../../utils/sentry';
import { CustomError } from '../../model/Error';

type Props = {};
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  public componentDidCatch(error: CustomError, errorInfo: ErrorInfo) {
    if (!error.expected) {
      captureLog(error, { stack: errorInfo.componentStack });
    }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
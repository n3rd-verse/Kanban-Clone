import * as React from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { COMPONENT_TEXT } from "@/constants/messages";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback: React.ReactNode;
    onReset?: () => void;
    onError?: (error: Error) => void;
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

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col justify-center items-center gap-4 p-4">
                    <h2 className="font-bold text-xl">
                        {COMPONENT_TEXT.ERROR_BOUNDARY.TITLE}
                    </h2>
                    <p className="text-red-500">
                        {this.state.error?.message ||
                            COMPONENT_TEXT.ERROR_BOUNDARY.UNKNOWN_ERROR}
                    </p>
                    <Button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            this.props.onReset?.();
                        }}
                    >
                        {COMPONENT_TEXT.ERROR_BOUNDARY.TRY_AGAIN_BUTTON}
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export function ErrorBoundaryWithQueryReset(props: ErrorBoundaryProps) {
    const { reset } = useQueryErrorResetBoundary();
    return <ErrorBoundary {...props} onReset={reset} />;
}

function ErrorFallback({
    error,
    resetErrorBoundary
}: {
    error: Error;
    resetErrorBoundary: () => void;
}) {
    return (
        <div className="flex flex-col justify-center items-center bg-red-50 p-4 border border-red-200 rounded-lg min-h-[200px]">
            <h2 className="mb-2 font-medium text-red-600">
                {COMPONENT_TEXT.ERROR_BOUNDARY.ERROR_FALLBACK_TITLE}
            </h2>
            <pre className="mb-4 text-red-500 text-sm">{error.message}</pre>
            <Button variant="destructive" onClick={resetErrorBoundary}>
                {COMPONENT_TEXT.ERROR_BOUNDARY.TRY_AGAIN_BUTTON}
            </Button>
        </div>
    );
}

export function QueryErrorBoundary({
    children
}: {
    children: React.ReactNode;
}) {
    const { reset } = useQueryErrorResetBoundary();
    return (
        <ReactErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            {children}
        </ReactErrorBoundary>
    );
}

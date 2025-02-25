import * as React from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

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
                    <h2 className="font-bold text-xl">Something went wrong</h2>
                    <p className="text-red-500">
                        {this.state.error?.message || "Unknown error occurred"}
                    </p>
                    <Button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            this.props.onReset?.();
                        }}
                    >
                        Try again
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

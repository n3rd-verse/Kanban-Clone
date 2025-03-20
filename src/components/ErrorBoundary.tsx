import * as React from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

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
                <ErrorBoundaryContent
                    error={this.state.error}
                    onReset={() => {
                        this.setState({ hasError: false, error: null });
                        this.props.onReset?.();
                    }}
                />
            );
        }

        return this.props.children;
    }
}

function ErrorBoundaryContent({
    error,
    onReset
}: {
    error: Error | null;
    onReset: () => void;
}) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col justify-center items-center gap-4 p-4">
            <h2 className="font-bold text-xl">
                {t("components.errorBoundary.title")}
            </h2>
            <p className="text-red-500">
                {error?.message || t("components.errorBoundary.unknownError")}
            </p>
            <Button onClick={onReset}>
                {t("components.errorBoundary.tryAgainButton")}
            </Button>
        </div>
    );
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
    const { t } = useTranslation();

    return (
        <div className="flex flex-col justify-center items-center bg-red-50 p-4 border border-red-200 rounded-lg min-h-[200px]">
            <h2 className="mb-2 font-medium text-red-600">
                {t("components.errorBoundary.errorFallbackTitle")}
            </h2>
            <pre className="mb-4 text-red-500 text-sm">{error.message}</pre>
            <Button variant="destructive" onClick={resetErrorBoundary}>
                {t("components.errorBoundary.tryAgainButton")}
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

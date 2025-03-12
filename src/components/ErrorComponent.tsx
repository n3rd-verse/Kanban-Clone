import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface RouteErrorProps {
    error: Error;
    reset: () => void;
}

export function RouteErrorComponent({ error, reset }: RouteErrorProps) {
    const { reset: resetQueries } = useQueryErrorResetBoundary();
    const navigate = useNavigate();

    const handleReset = () => {
        // Reset both the router error boundary and query cache
        resetQueries();
        reset();
    };

    const handleGoHome = () => {
        // Navigate back to home and reset errors
        navigate({ to: "/" });
        handleReset();
    };

    return (
        <div className="flex flex-col justify-center items-center p-4 min-h-screen text-center">
            <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-center items-center mb-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="mb-4 font-bold text-gray-800 text-xl">
                    문제가 발생했습니다
                </h2>
                <p className="mb-6 text-gray-600">
                    {error.message || "앱 로딩 중 오류가 발생했습니다."}
                </p>
                <div className="flex sm:flex-row flex-col justify-center gap-2">
                    <Button variant="default" onClick={handleReset}>
                        다시 시도
                    </Button>
                    <Button variant="outline" onClick={handleGoHome}>
                        홈으로 돌아가기
                    </Button>
                </div>
            </div>
        </div>
    );
}

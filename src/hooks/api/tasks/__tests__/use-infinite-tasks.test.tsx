import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { TaskStatus } from "@/constants/task-status";

interface TaskItem {
    id: string;
    title: string;
    status: TaskStatus;
    [key: string]: any;
}

interface TaskPage {
    tasks: TaskItem[];
    total: number;
    nextPage?: number;
}

interface QueryResultData {
    pages: TaskPage[];
    pageParams: number[];
}

interface MockQueryResult {
    data: QueryResultData;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    fetchNextPage: any;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}

const mockFetchTasks = vi.fn();

vi.mock("@/services/tasks", () => ({
    fetchTasks: (...args: any[]) => {
        mockFetchTasks(...args);
        return Promise.resolve({
            tasks: [{ id: "task-1", title: "Task 1", status: TaskStatus.NEW }],
            total: 1,
            nextPage: 1
        });
    }
}));

vi.mock("@/components/ui/use-toast", () => ({
    useToast: () => ({
        toast: vi.fn()
    })
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

const mockQueryResult: MockQueryResult = {
    data: {
        pages: [],
        pageParams: [0]
    },
    isSuccess: true,
    isError: false,
    error: null,
    fetchNextPage: vi.fn(),
    hasNextPage: true,
    isFetchingNextPage: false
};

const mockUseSuspenseInfiniteQuery = vi.fn((options?: any) => mockQueryResult);

vi.mock("@tanstack/react-query", () => {
    const actual = require("@tanstack/react-query");
    return {
        ...actual,
        QueryClient: vi.fn().mockImplementation(() => ({
            setQueryData: vi.fn(),
            getQueryData: vi.fn(),
            invalidateQueries: vi.fn(),
            cancelQueries: vi.fn(),
            ensureQueryData: vi.fn()
        })),
        QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
            children,
        useSuspenseInfiniteQuery: (options: any) => {
            return mockUseSuspenseInfiniteQuery(options);
        }
    };
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInfiniteTasks } from "../use-infinite-tasks";
import { fetchTasks } from "@/services/tasks";

describe("useInfiniteTasks", () => {
    const mockFirstPage: TaskPage = {
        tasks: [{ id: "task-1", title: "Task 1", status: TaskStatus.NEW }],
        total: 1,
        nextPage: 1
    };

    const mockSecondPage: TaskPage = {
        tasks: [{ id: "task-2", title: "Task 2", status: TaskStatus.NEW }],
        total: 1,
        nextPage: undefined
    };

    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();

        vi.useFakeTimers();

        mockQueryResult.data = {
            pages: [mockFirstPage],
            pageParams: [0]
        };
        mockQueryResult.isSuccess = true;
        mockQueryResult.isError = false;
        mockQueryResult.error = null;
        mockQueryResult.fetchNextPage = vi.fn().mockResolvedValue({});
        mockQueryResult.hasNextPage = true;
        mockQueryResult.isFetchingNextPage = false;

        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    gcTime: 0
                }
            }
        });

        mockFetchTasks.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const createWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it("fetches tasks with the correct parameters", async () => {
        const filters = {
            status: [TaskStatus.NEW, TaskStatus.IN_PROGRESS],
            page: 0,
            limit: 20
        };

        mockFetchTasks.mockClear();

        const mockResolvedValue = {
            tasks: [{ id: "task-1", title: "Task 1", status: TaskStatus.NEW }],
            total: 1,
            nextPage: 1
        };

        mockFetchTasks.mockImplementation(() => {
            return Promise.resolve(mockResolvedValue);
        });

        let capturedOptions: any = null;

        vi.mocked(mockUseSuspenseInfiniteQuery).mockImplementation(function () {
            capturedOptions = arguments[0];
            return mockQueryResult;
        });

        renderHook(() => useInfiniteTasks(filters), {
            wrapper: createWrapper
        });

        if (capturedOptions?.queryFn) {
            await capturedOptions.queryFn({ pageParam: 0 });
        }

        await vi.runAllTimersAsync();

        expect(mockFetchTasks).toHaveBeenCalledWith({
            status: [TaskStatus.NEW, TaskStatus.IN_PROGRESS],
            page: 0,
            limit: expect.any(Number)
        });
    });

    it("handles error states", async () => {
        const mockError = new Error("Failed to fetch tasks");
        vi.spyOn(console, "error").mockImplementation(() => {});

        mockFetchTasks.mockImplementation(() => {
            throw mockError;
        });

        mockQueryResult.isSuccess = false;
        mockQueryResult.isError = true;
        mockQueryResult.error = mockError;
        mockQueryResult.data = { pages: [], pageParams: [] };

        await act(async () => {
            renderHook(() => useInfiniteTasks(), {
                wrapper: createWrapper
            });
        });

        expect(mockQueryResult.isError).toBe(true);
        expect(mockQueryResult.error).toEqual(mockError);
    });

    it("correctly fetches next pages", async () => {
        mockFetchTasks
            .mockReturnValueOnce(mockFirstPage)
            .mockReturnValueOnce(mockSecondPage);

        const fetchNextPage = vi.fn().mockImplementation(() => {
            const currentPages = [...mockQueryResult.data.pages];
            mockQueryResult.data = {
                ...mockQueryResult.data,
                pages: [...currentPages, mockSecondPage]
            };
            return Promise.resolve();
        });

        mockQueryResult.fetchNextPage = fetchNextPage;

        let result;

        await act(async () => {
            const rendered = renderHook(() => useInfiniteTasks(), {
                wrapper: createWrapper
            });
            result = rendered.result;
        });

        expect(mockQueryResult.data.pages).toHaveLength(1);

        await act(async () => {
            await mockQueryResult.fetchNextPage();
        });

        expect(mockQueryResult.data.pages).toHaveLength(2);
        expect(mockQueryResult.data.pages[0]).toEqual(mockFirstPage);
        expect(mockQueryResult.data.pages[1]).toEqual(mockSecondPage);
    });

    it("correctly determines if there are more pages", async () => {
        const mockResponse: TaskPage = {
            tasks: [{ id: "task-1", title: "Task 1", status: TaskStatus.NEW }],
            total: 1,
            nextPage: undefined
        };

        mockFetchTasks.mockResolvedValue(mockResponse);

        mockQueryResult.data = {
            pages: [mockResponse],
            pageParams: [0]
        };
        mockQueryResult.hasNextPage = false;

        await act(async () => {
            renderHook(() => useInfiniteTasks(), {
                wrapper: createWrapper
            });
        });

        expect(mockQueryResult.hasNextPage).toBe(false);
    });
});

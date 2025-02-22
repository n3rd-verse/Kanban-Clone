import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface AiChatButtonProps {
    onSearch: (query: string) => void;
}

export const AiChatButton = ({ onSearch }: AiChatButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: query.trim()
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        onSearch(query.trim());

        // Simulate streaming response (replace with actual API call)
        const response =
            "I understand you're interested in " +
            query.trim() +
            ". Let me help you with that...";
        const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response
        };

        // Simulate streaming effect
        let displayedContent = "";
        const words = response.split(" ");

        for (let i = 0; i < words.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            displayedContent += words[i] + " ";
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessage.id
                        ? { ...msg, content: displayedContent }
                        : msg
                )
            );
        }

        setIsLoading(false);
        setQuery("");
    };

    return (
        <div className="right-6 bottom-6 z-50 fixed">
            {isOpen && (
                <div className="right-0 bottom-16 slide-in-from-bottom-5 absolute bg-white shadow-lg rounded-lg w-[calc(100vw-48px)] sm:w-[400px] md:w-[450px] animate-in">
                    <div className="flex flex-col border rounded-lg h-[80vh] sm:h-[600px]">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="font-semibold">AI Chat Assistant</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex w-max max-w-[80%] rounded-lg px-4 py-2",
                                            message.role === "user"
                                                ? "ml-auto bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {message.content}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="bg-muted px-4 py-2 rounded-lg w-max">
                                        <div className="flex space-x-2">
                                            <div className="bg-foreground/30 rounded-full w-2 h-2 animate-bounce" />
                                            <div className="bg-foreground/30 rounded-full w-2 h-2 animate-bounce delay-100" />
                                            <div className="bg-foreground/30 rounded-full w-2 h-2 animate-bounce delay-200" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t">
                            <form
                                onSubmit={handleSubmit}
                                className="flex gap-2"
                            >
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="shadow-lg rounded-full w-12 h-12"
            >
                {isOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <MessageCircle className="w-5 h-5" />
                )}
            </Button>
        </div>
    );
};

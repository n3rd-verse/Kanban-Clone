import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
    items: { id: string; title: string }[];
    activeItem: string;
    onItemClick: (id: string) => void;
}

export const Navigation = ({
    items,
    activeItem,
    onItemClick
}: NavigationProps) => {
    const isMobile = useIsMobile();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="top-0 z-10 sticky bg-white border-gray-200 border-b w-full">
            <div className="px-4 sm:px-6 lg:px-8 max-w-full">
                <div className="flex justify-between items-center h-16">
                    {isMobile ? (
                        <div className="flex justify-end w-full">
                            <button
                                onClick={toggleMenu}
                                className="hover:bg-notion-hover p-2 rounded-md"
                                aria-label="Toggle menu"
                            >
                                <Menu className="w-6 h-6 text-notion-text" />
                            </button>
                            {isMenuOpen && (
                                <div className="top-16 left-0 absolute bg-white shadow-lg border-gray-200 border-b w-full animate-fade-in">
                                    <div className="py-2">
                                        {items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    onItemClick(item.id);
                                                    setIsMenuOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full px-4 py-2 text-left text-sm font-medium transition-colors duration-200",
                                                    activeItem === item.id
                                                        ? "bg-notion-gray text-notion-text"
                                                        : "text-gray-500 hover:bg-notion-hover hover:text-notion-text"
                                                )}
                                            >
                                                {item.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex min-w-full">
                            <div className="flex space-x-8 whitespace-nowrap">
                                {items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onItemClick(item.id)}
                                        className={cn(
                                            "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200",
                                            activeItem === item.id
                                                ? "border-b-2 border-notion-text text-notion-text"
                                                : "text-gray-500 hover:text-notion-text"
                                        )}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

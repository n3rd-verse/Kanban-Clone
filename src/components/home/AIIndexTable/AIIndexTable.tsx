
import * as React from "react";
import { AiChatButton } from "./AiChatButton";
import { ContentView } from "./ContentView";
import { Navigation } from "./Navigation";
import { KanbanBoard } from "../KanbanBoard/KanbanBoard";

const navigationItems = [
    { id: "board", title: "Board" },
    { id: "timeline", title: "Timeline" },
    { id: "calendar", title: "Calendar" },
];

export function AIIndexTable() {
    const [activeView, setActiveView] = React.useState("board");
    
    const handleSearch = (query: string) => {
        const matchingItem = navigationItems.find((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        if (matchingItem) {
            setActiveView(matchingItem.id);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case "board":
                return <KanbanBoard />;
            case "timeline":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">Timeline View</h2>
                        <p className="text-gray-600">Timeline view will be implemented here.</p>
                    </div>
                );
            case "calendar":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">Calendar View</h2>
                        <p className="text-gray-600">Calendar view will be implemented here.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white w-full min-h-screen overflow-x-hidden">
            <Navigation
                items={navigationItems}
                activeItem={activeView}
                onItemClick={setActiveView}
            />
            <div className="mt-4">
                {renderContent()}
            </div>
            <AiChatButton onSearch={handleSearch} />
        </div>
    );
}

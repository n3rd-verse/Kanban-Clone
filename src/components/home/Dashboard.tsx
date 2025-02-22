import { useState } from "react";
import { Navigation } from "./Navigation";
import { KanbanBoard } from "./KanbanBoard/KanbanBoard";

export function Dashboard() {
    const [activeView, setActiveView] = useState("board");

    return (
        <div className="mx-auto px-4 py-6 container">
            <Navigation activeView={activeView} onViewChange={setActiveView} />

            {activeView === "board" && <KanbanBoard />}
            {activeView === "timeline" && (
                <div>Timeline View (Coming Soon)</div>
            )}
            {activeView === "calendar" && (
                <div>Calendar View (Coming Soon)</div>
            )}
        </div>
    );
}

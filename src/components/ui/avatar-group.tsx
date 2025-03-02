import * as React from "react";
import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    max?: number;
}

export function AvatarGroup({
    children,
    max = 4,
    className,
    ...props
}: AvatarGroupProps) {
    const childrenArray = React.Children.toArray(children);
    const excess = childrenArray.length - max;

    return (
        <div className={cn("flex -space-x-2", className)} {...props}>
            {childrenArray.slice(0, max).map((child, i) => (
                <div key={i} className="relative">
                    {child}
                </div>
            ))}
            {excess > 0 && (
                <Avatar className="bg-gray-100 border-2 border-white">
                    <span className="text-gray-600 text-xs">+{excess}</span>
                </Avatar>
            )}
        </div>
    );
}

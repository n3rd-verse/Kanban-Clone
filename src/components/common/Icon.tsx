import React from "react";
import { cn } from "@/lib/utils";

interface IconProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
}

export function Icon({ src, alt, className, style }: IconProps) {
    return React.createElement("img", {
        src,
        alt,
        className: cn("w-6 h-6", className),
        style
    });
}

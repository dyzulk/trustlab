import React from "react";

export default function CommonGridShape() {
    return (
        <div className="absolute inset-0 z-0 opacity-10">
             {/* Simple grid pattern SVG or similar, replacing the image for now if static */}
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    )
}

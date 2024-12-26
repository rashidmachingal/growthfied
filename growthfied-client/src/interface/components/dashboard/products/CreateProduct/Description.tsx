"use client"

import { useEffect, useRef, useState, TextareaHTMLAttributes } from "react";

// Define Tailwind classes for static styling
const defaultClasses = "block w-full bg-mediumSpringGreen overflow-hidden resize-none";

interface AutoHeightTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}

const AutoHeightTextarea: React.FC<AutoHeightTextareaProps> = ({ className = defaultClasses, ...etc }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [currentValue, setCurrentValue] = useState<string>("");

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height to auto to calculate new scrollHeight
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [currentValue]);

    return (
        <textarea
            ref={textareaRef}
            className={className}
            {...etc}
            value={currentValue}
            onChange={e => {
                setCurrentValue(e.target.value);
                // To do something with value, maybe callback?
            }}
        />
    );
};

export default AutoHeightTextarea;

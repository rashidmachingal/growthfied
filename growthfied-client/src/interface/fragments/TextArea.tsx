"use client";

import { useEffect, useRef } from "react";
import { Div, Typography } from "@/interface/fragments";
import { TickIcon } from "../icons";

type TextAreaProps = {
  label?: string | boolean;
  name?: string;
  placeHolder?: string;
  innerText?: string;
  onChange?: any;
  autoFocus?: boolean;
  invalid?: boolean;
  showTick?: boolean;
  errorMessage?: string;
  minLength?: number;
  maxLength?: number;
  containerStyle?: string;
  innerTextStyle?: string;
  inputContainerStyle?: string;
  className?: string;
  defaultValue?: string;
  value?: any;
  fixedHeight?: string; // Add fixedHeight prop
};

export default function TextArea({
  label = false,
  name,
  placeHolder,
  innerText,
  onChange,
  autoFocus = false,
  invalid = false,
  showTick = false,
  errorMessage = "Please fill this field",
  minLength,
  maxLength,
  containerStyle,
  innerTextStyle,
  inputContainerStyle,
  className,
  defaultValue,
  value,
  fixedHeight = "6rem", // Set default fixedHeight
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Adjust height based on content

    const adjustHeight = () => {
      if (textareaRef.current?.scrollHeight !== 94) {
        if (textareaRef.current) {
          // Reset height to auto to recalculate scrollHeight
          textareaRef.current.style.height = "auto";
          // Set height to scrollHeight
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      }
    };

    adjustHeight(); // Adjust on initial render

    // Adjust on value change
    // If value or defaultValue changes, this effect will be triggered
  }, [value, defaultValue]);

  return (
    <Div className={containerStyle}>
      <Typography className="text-[13px] ml-1">{label}</Typography>
      <Div className={`relative ${inputContainerStyle}`}>
        <Typography
          className={`font-medium absolute top-[0.37rem] left-3 cursor-pointer ${innerTextStyle}`}
        >
          {innerText}
        </Typography>
        <textarea
          ref={textareaRef}
          placeholder={placeHolder}
          onChange={(e) => {
            onChange?.(e);
            if (textareaRef.current) {
              if (textareaRef.current?.scrollHeight !== 94) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }
          }}
          name={name}
          value={value}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          className={`px-3 pt-[5px] overflow-hidden pb-[5px] resize-none rounded-theme outline-none glowing-border border ${
            showTick ? "pr-8" : ""
          } ${
            invalid ? "border-red-500 focus:border-red-500" : "border"
          } ${className}`}
          style={{ height: fixedHeight }} // Set fixed height
        />
        {showTick && (
          <TickIcon className="fill-green-500 absolute top-[0.50rem] right-2 cursor-pointer" />
        )}
      </Div>
      <Typography className="text-[12px] text-red-600 ml-1 mt-[1px] cursor-pointer">
        {invalid ? errorMessage : ""}
      </Typography>
    </Div>
  );
}

// react
import { ChangeEventHandler } from "react";

// fragments
import { Div, Typography } from "@/interface/fragments";

// icons
import { TickIcon } from "@/interface/icons";

type InputFieldProps = {
  disabled?: boolean;
  type:
    | "text"
    | "number"
    | "tel"
    | "password"
    | "date"
    | "email"
    | "file"
    | "search";
  label?: string | boolean;
  placeHolder?: string;
  innerText?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string | number;
  defaultValue?: string | number;
  autoFocus?: boolean;
  invalid?: boolean;
  showTick?: boolean | undefined;
  errorMessage?: string;
  minLength?: number;
  maxLength?: number;
  containerStyle?: string;
  innerTextStyle?: string;
  inputContainerStyle?: string;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: "off" | "on"
  accept?: string
};

export default function InputField({
  disabled = false,
  type,
  label = false,
  placeHolder,
  innerText,
  onChange,
  value,
  defaultValue,
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
  id,
  name,
  accept,
  autoComplete = "off"
}: InputFieldProps) {
  return (
    <Div className={containerStyle}>
      <Typography className="text-[13px] ml-1">{label}</Typography>
      <Div className={`relative ${inputContainerStyle}`}>
        <Typography
          className={`font-medium absolute top-[0.37rem] cursor-pointer ${innerTextStyle}`}
        >
          {innerText}
        </Typography>
        <input
          disabled={disabled}
          type={type}
          placeholder={placeHolder}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          id={id}
          accept={accept}
          name={name}
          autoComplete={autoComplete}
          className={`px-3 h-theme rounded-theme outline-none glowing-border border ${
            showTick ? "pr-8" : ""
          } ${
            invalid ? "border-red-500 focus:border-red-500" : "border"
          } ${className}`}
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

"use client";

//react
import { Dispatch, SetStateAction, useState } from "react";

// fragments
import { Div, Typography } from "@/interface/fragments";

// icons
import { DropdownArrowIcon } from "@/interface/icons";

// third party npm modules
import OutsideClickHandler from "react-outside-click-handler";

type OptionType = {
  value: any;
  label: string;
};

type SelectDropdown = {
  options: OptionType[];
  onChange?: (value: any) => void;
  defaultValue?: any;
  setDefaultValue?: Dispatch<
    SetStateAction<{
      value: any;
      label: string;
    }>
  >;
  className?: string;
  bgStyle?: string
};

export default function SelectDropdown({
  options,
  defaultValue,
  setDefaultValue,
  onChange,
  className,
  bgStyle
}: SelectDropdown) {
  const [open, setOpen] = useState(false);
  const [outline, setOutline] = useState(false);

  const handleChange = (value: any) => {
    if (setDefaultValue) setDefaultValue(value);
    setOpen(false);
    if (onChange) onChange(value);
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setOpen(false);
        setOutline(false);
      }}
    >
      <Div className={`relative ${className} z-[48]`}>
        <Div
          onClick={() => {
            setOpen((prev) => !prev);
            setOutline(true);
          }}
          className={`${
            outline && "glowing-border-select"
          } min-w-[10rem] px-3 bg-white ${bgStyle} h-theme rounded-theme flex items-center justify-between gap-3 cursor-default outline-none border z-[49]`}
        >
          <Typography className="text-[14px] select-none">
            {defaultValue.label}
          </Typography>
          <DropdownArrowIcon/>
        </Div>
        {open && (
          <Div className="w-full min-h-[3rem] bg-white absolute top-[45px] border rounded-theme flex flex-col p-[8px] gap-[3px]">
            {options.map((option) => {
              return (
                <Div
                  onClick={() => handleChange(option)}
                  key={option.value}
                  className={`${
                    option.value === defaultValue.value && "bg-[#d3d3d356]"
                  } hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-default select-none`}
                >
                  <Typography className="text-[13px]">
                    {option.label}
                  </Typography>
                </Div>
              );
            })}
          </Div>
        )}
      </Div>
    </OutsideClickHandler>
  );
}

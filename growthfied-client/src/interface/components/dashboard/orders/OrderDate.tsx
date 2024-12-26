"use client"

import { SelectDropdown } from "@/interface/fragments";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OrderDateProps = {
  currentPage: number;
  orderStatus: string;
  linesPerPage: string;
}

export default function OrderDate({ currentPage, orderStatus, linesPerPage }: OrderDateProps) {
    const router = useRouter();

    const sortOptions = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Last 28 days", value: "last_28_days" },
        { label: "This Month", value: "this_month" },
        { label: "All Time", value: "all_time" },
    ];

    const [sortDefaultValue, setSortDefaultValue] = useState({
        value: "all_time",
        label: "All Time",
    });

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
    };

    const getDateRange = (sortValue: string) => {
        const now = new Date();
        let start: string;
        let end: string;
      
        switch (sortValue) {
          case "today":
            start = formatDate(now);
            end = formatDate(now);
            break;
      
          case "yesterday":
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1); // 1 day back
            start = formatDate(yesterday);
            end = formatDate(yesterday);
            break;
      
          case "this_week":
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
            start = formatDate(startOfWeek);
            end = formatDate(endOfWeek);
            break;
      
          case "last_28_days":
            const startOf28Days = new Date(now);
            startOf28Days.setDate(now.getDate() - 28); // 28 days back
            start = formatDate(startOf28Days);
            end = formatDate(now);
            break;
      
          case "this_month":
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month
            start = formatDate(startOfMonth);
            end = formatDate(endOfMonth);
            break;
      
          case "all_time":
            start = "2020-01-01";
            end = formatDate(now);
            break;
      
          default:
            start = formatDate(now);
            end = formatDate(now);
        }
      
        return { start, end };
      };
    

    const handleChange = (selectedOption: any) => {
        const { start, end } = getDateRange(selectedOption.value);
        router.push(`?p=${currentPage}&status=${orderStatus}&lpp=${linesPerPage}&start=${start}&end=${end}`);
        setSortDefaultValue(selectedOption);
    };

  return (
    <>
        <SelectDropdown
          onChange={handleChange}
          options={sortOptions}
          defaultValue={sortDefaultValue}
          setDefaultValue={setSortDefaultValue}
        />
    </>
  );
}

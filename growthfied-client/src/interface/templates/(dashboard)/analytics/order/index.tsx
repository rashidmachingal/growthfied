"use client"

import { useEffect, useState } from "react";
import { Div, SelectDropdown, Typography } from "@/interface/fragments";
import { AnalayticsBar, AnalyticsCard, Box, PageHeader } from "@/interface/components";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import Cookies from "universal-cookie";
import { getOrderAnalytics } from "@/@api/dashboard/analytics.api";

export default function AnalyticsOrderTemplates() {

    const { update_unauthorized } = useUserStore()

    const [defaultValue, setDefaultValue] = useState({ value: "this_month", label: "This Month"})
    const [errorMessage, setErrorMessage] = useState<string>("empty")
    const [loading, setLoading] = useState(true)
    const [analyticsData, setAnalyticsData] = useState<any>()

    const options = [
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "yesterday" },
      { label: "This Week", value: "this_week" },
      { label: "Last 28 days", value: "last_28_days" },
      { label: "This Month", value: "this_month" },
      { label: "All Time", value: "all_time" },
    ];

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

    const fetchData = async (start: string, end: string) => {
      try {
          setLoading(true)
          const params = {
            start_date: start,
            end_date: end,
          }
          const res = await getOrderAnalytics(params);
          setAnalyticsData(res.data)
          setLoading(false)
      } catch (error: any) {
          if (error.response.status === 401) {
            const cookies = new Cookies();
            cookies.remove("token", { path: "/" });
            update_unauthorized()
           }
           setErrorMessage("Failed to fetch data, please retry")
           setLoading(false)
        }
    }

   const handleChange = (selectedOption: any) => {
      setDefaultValue(selectedOption);
    };

  useEffect(() => {
     const { start, end } = getDateRange(defaultValue.value);
     fetchData(start, end)
     console.log(start, end)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  return (
    <Div>
     <PageHeader title="Analytics" >
        <SelectDropdown
          options={options}
          defaultValue={defaultValue}
          setDefaultValue={setDefaultValue}
          onChange={handleChange}
        />
     </PageHeader>

     <AnalayticsBar currentPage="Order" />

     
     <Div className="mt-5 w-full flex flex-col lg:flex-row gap-3 md:gap-5">
       { loading && ( <>
        <Box className="p-[6px] h-[5rem]" >
         <Div className="w-full rounded-[2px] h-full placeholder-animation">
         </Div>
        </Box>
        <Box className="p-[6px]" >
         <Div className="w-full rounded-[2px] h-full placeholder-animation">
         </Div>
        </Box>
        <Box className="p-[6px]" >
         <Div className="w-full rounded-[2px] h-full placeholder-animation">
         </Div>
        </Box>
        </>)}

        { !loading && (
         <>
         <AnalyticsCard iconName="report" title="COD Orders" count={analyticsData?.cod_orders} />
         <AnalyticsCard iconName="report"  title="Online Payment Orders" count={analyticsData?.online_orders} />
         <AnalyticsCard iconName="report"  title="Total Orders" count={analyticsData?.total_orders} />
         </>
        )}
      </Div>

    </Div>
  )
}

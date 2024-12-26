"use client"

import { useEffect, useState } from "react";
import { Div, SelectDropdown, Typography } from "@/interface/fragments";
import { AlertText, AnalayticsBar, AnalyticsCard, Box, PageHeader, SiteAnalyticsBox } from "@/interface/components";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { getSiteAnalytics } from "@/@api/dashboard/analytics.api";
import { formatTimeFromString, formatVisitorCount } from "@/utils";

export default function AnalyticsSiteTemplates() {

  const [defaultValue, setDefaultValue] = useState({
    value: "last_28_days",
    label: "Last 28 days",
  });
  const options = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "last_7_days" },
    { label: "Last 28 days", value: "last_28_days" },
    { label: "This Month", value: "this_month" },
    { label: "All Time", value: "all_time" },
  ];

  const { update_unauthorized } = useUserStore()
  const [errorMessage, setErrorMessage] = useState<string>("empty")

  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>([])


  // temp
  const [isDataAvailable, setIsDataAvailable] = useState({
    uniqueVisitors: false,
    newVisitors: false,
    totalVisitors: false,
    averageTimeSpend: false,
    topProducts: false,
  })

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
        start = "today"
        end = "today"
        break;
  
      case "yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1); // 1 day back
        start = "yesterday"
        end = "yesterday"
        break;
  
  
      case "last_7_days":
        start = "7daysAgo"
        end = "today"
        break;

      case "last_28_days":
        start = "28daysAgo"
        end = "today"
        break;
  
      case "this_month":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        start = formatDate(startOfMonth);
        end = "today"
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
        const res = await getSiteAnalytics(params);
        setAnalyticsData(res.data)
        if(res?.data?.base_analytics?.rows[0]?.metricValues[0]?.value){
          setIsDataAvailable((prevData) => ({
            ...prevData,
            uniqueVisitors: true
          }))
        }
        if(res?.data?.base_analytics?.rows[0]?.metricValues[1]?.value){
          setIsDataAvailable((prevData) => ({
            ...prevData,
            newVisitors: true
          }))
        }
        if(res?.data?.base_analytics?.rows[0]?.metricValues[2]?.value){
          setIsDataAvailable((prevData) => ({
            ...prevData,
            totalVisitors: true
          }))
        }
        if(res?.data?.base_analytics?.rows[0]?.metricValues[3]?.value){
          setIsDataAvailable((prevData) => ({
            ...prevData,
            averageTimeSpend: true
          }))
        }

        if(res?.data?.top_products?.rows){
          setIsDataAvailable((prevData) => ({
            ...prevData,
            topProducts: true
          }))
        }
        setLoading(false)
    } catch (error: any) {
        if (error?.response?.status === 401) {
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          update_unauthorized()
         }else{
           setErrorMessage("Failed to fetch data, please retry")
           setLoading(false)
         }
      }
  }

  const handleChange = (selectedOption: any) => {
    setDefaultValue(selectedOption);
  };

  useEffect(() => {
   const { start, end } = getDateRange(defaultValue.value);
   fetchData(start, end)
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [defaultValue])
  


  return (
    <Div>
     <PageHeader title="Analytics" >
     </PageHeader>

     <AnalayticsBar currentPage="Site" />

     <Div className="flex flex-col mt-[8px]" >

      <Div className="flex items-center gap-3 justify-end" >
        <Typography>Sort By</Typography>
        <SelectDropdown
         options={options}
         defaultValue={defaultValue}
         setDefaultValue={setDefaultValue}
         onChange={handleChange}
        />
      </Div>

      { errorMessage !== "empty" && loading && (
        <AlertText
        className="mt-3"
         text="Failed to fetch data"
         variant="danger"
        />
      ) }

       { loading && ( <>
        <Div className="flex flex-col lg:flex-row mt-3" >
        <Box className="p-[6px] h-[5rem]" >
         <Div className="w-full rounded-[2px] h-full placeholder-animation">
         </Div>
        </Box>
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
        </Div>

        <Div className="flex flex-col lg:flex-row mt-3" >
        <Box className="p-[6px] h-[25rem]" >
         <Div className="w-full rounded-[2px] h-full placeholder-animation">
         </Div>
        </Box>
        <Box className="p-[6px] h-[25rem]" >
         <Div className="w-full rounded-[2px] h-full placeholder-animation">
         </Div>
        </Box>
        </Div>
        </>)}

     { loading === false && (
      <>
      <Div className="w-full flex flex-col lg:flex-row gap-3 mt-[15px]">
        <AnalyticsCard 
          iconName="analytics" 
          title="Unique Visitors" 
          count={isDataAvailable.uniqueVisitors !== false ? formatVisitorCount(Number(analyticsData?.base_analytics?.rows[0]?.metricValues[0]?.value)) : 0}
        />
        <AnalyticsCard 
          iconName="analytics" 
          title="New Visitors"
          count={isDataAvailable.newVisitors !== false ? formatVisitorCount(Number(analyticsData?.base_analytics?.rows[0]?.metricValues[1]?.value)) : 0}
        />
        <AnalyticsCard 
          iconName="analytics"  
          title="Total Views"
          count={isDataAvailable.totalVisitors !== false ? formatVisitorCount(Number(analyticsData?.base_analytics?.rows[0]?.metricValues[2]?.value)): 0}
        />
        <AnalyticsCard 
          iconName="analytics"  
          title="Average Time Spend" 
          count={isDataAvailable.averageTimeSpend !== false ? formatTimeFromString(analyticsData?.base_analytics?.rows[0]?.metricValues[3]?.value): 0}
        />
      </Div>
      
      <Div className="flex flex-col lg:flex-row gap-3 mt-2" >
       <SiteAnalyticsBox 
         data={isDataAvailable.topProducts !== false ? analyticsData?.top_products?.rows: false} 
         title="Top 15 Products" 
         sub_title="Products"
       />
      </Div>
      </>
     ) }

     </Div>
    </Div>
  )
}

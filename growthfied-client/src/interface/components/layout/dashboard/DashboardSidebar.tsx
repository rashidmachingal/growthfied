"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Div, Typography } from "@/interface/fragments";
import {
  //AnalyticsFillIcon,
  //AnalyticsOutlineIcon,
  AnalyticsFillIcon,
  AnalyticsOutlineIcon,
  BillingFillIcon,
  BillingOutlineIcon,
  CategoriesOutlineIcon,
  CoupenFillIcon,
  CoupenOutlineIcon,
  DashboardFillIcon,
  DashboardOutlineIcon,
  OrdersFillIcon,
  OrdersOutlineIcon,
  PageFillIcon,
  PageOutlineIcon,
  PaymentFillIcon,
  PaymentOutlineIcon,
  ProductsFillIcon,
  ProductsOutlineIcon,
  SettingsFillIcon,
  SettingsOutlineIcon,
  // UserFillIcon,
  // UserOutlineIcon,
} from "@/interface/icons";
import CategoriesFillIcon from "@/interface/icons/CategoriesFillIcon";

type DashboardSidebarProps = {
  toggleSidebar: boolean;
  setToggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function DashboardSidebar({
  toggleSidebar,
  setToggleSidebar,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const sidebarData = [
    {
      title: "Dashboard",
      url: "/dashboard",
      defaultLogo: <DashboardFillIcon />,
      activeLogo: <DashboardOutlineIcon />,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      defaultLogo: <ProductsFillIcon />,
      activeLogo: <ProductsOutlineIcon />,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      defaultLogo: <OrdersFillIcon />,
      activeLogo: <OrdersOutlineIcon />,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      defaultLogo: <CategoriesFillIcon />,
      activeLogo: <CategoriesOutlineIcon />,
    },
    {
      title: "Coupens",
      url: "/dashboard/coupens",
      defaultLogo: <CoupenFillIcon />,
      activeLogo: <CoupenOutlineIcon />,
    },
    //{
    //  title: "Customers",
    //  url: "/dashboard/customers",
    //  defaultLogo: <UserFillIcon />,
    //  activeLogo: <UserOutlineIcon />,
    //},
    //
    //{
    //  title: "Payments",
    //  url: "/dashboard/payments",
    //  defaultLogo: <PaymentFillIcon />,
    //  activeLogo: <PaymentOutlineIcon />,
    //},
    //{
    //  title: "Subscription",
    //  url: "/dashboard/subscription",
    //  defaultLogo: <BillingFillIcon />,
    //  activeLogo: <BillingOutlineIcon />,
    //},
    {
      title: "Pages",
      url: "/dashboard/pages",
      defaultLogo: <PageFillIcon />,
      activeLogo: <PageOutlineIcon />,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics/site",
      defaultLogo: <AnalyticsFillIcon />,
      activeLogo: <AnalyticsOutlineIcon />,
     },
    {
      title: "Settings",
      url: "/dashboard/settings",
      defaultLogo: <SettingsFillIcon />,
      activeLogo: <SettingsOutlineIcon />,
    },
  ];

  return (
    <Div
      className={`w-full fixed z-50 left-[0rem] ${toggleSidebar ? "flex" : "hidden"} vmd:flex vmd:w-auto vmd:left-0 top-[4.2rem] `}
    >
      <Div
        className={`w-[65%] vmd:w-[14.6rem] h-[calc(100vh)] bg-[#ebebeb] p-3 flex flex-col gap-[2px] transition-all `}
      >
        {sidebarData.map((item, index) => {
          const isActive =
            (index === 0 && pathname === item.url) || // For the first item ("Dashboard")
            (index !== 0 && pathname.startsWith(item.url));

          return (
            <Link
              onClick={() => {
                setTimeout(() => {
                  setToggleSidebar(false);
                }, 100);
              }}
              key={item.url}
              className={`${
                isActive ? "bg-white hover:bg-[white]" : "hover:bg-[#ffffff7f]"
              } flex items-center gap-[7px] h-[1.8rem] pl-[8px] p-[4px] rounded-theme cursor-pointer`}
              href={item.url}
            >
              {isActive ? item.activeLogo : item.defaultLogo}
              <Typography className="text-[13px] font-medium text-[#303030]">
                {item.title}
              </Typography>
            </Link>
          );
        })}
      </Div>
      <Div
        onClick={() => setToggleSidebar(false)}
        className="w-[35%] vmd:hidden"
      />
    </Div>
  );
}

"use client";

// next
import Image from "next/image";
import Link from "next/link";

// fragments
import { Button, Div, Span, Typography } from "@/interface/fragments";

// components
import { AlertText, Box, PageHeader, PaymentList } from "@/interface/components";

// icons
import { EditOutlineIcon } from "@/interface/icons";

// images
import BankImage from "../../../../../public/settings/bank.png";

export default function PaymentsTemplate() {

  return (
    <>
      <PageHeader title="Payments" />
      <Div className="mt-3 flex flex-col gap-2">
        <AlertText
          className="flex flex-col lg:flex-row"
          variant="info"
          text="You need to update your bank account, for getting payment weekly"
        >
          <Button type="link" url="/dashboard/payments/add" className="!h-[2rem] w-full lg:w-auto mt-2 lg:mt-0 !bg-[#0985b7] hover:!bg-[#0986b7dc]">
            Update Payment Info
          </Button>
        </AlertText>

        <Typography className="text-[14px]">
          Your online earnings are transferred to your bank account every
          Saturday
        </Typography>

        <Box className="mt-3 p-[10px] relative">
          <Typography className="text-[13px] font-medium">
            Your Payment Account
          </Typography>
          <Div className="flex gap-4">
            <Div className="mt-2">
              <Image
                className="w-[4rem] h-[2]  md:w-[6rem] md:h-[4rem]"
                src={BankImage}
                width={0}
                height={0}
                alt="img"
              />
            </Div>
            <Div className="mt-2">
              <Typography className="text-[12px]">
                Bank transfer to bank account •••• 4918
              </Typography>
              <Typography className="text-[12px]">Rashid Machingal</Typography>
            </Div>
          </Div>
          <Link href="/dashboard/payments/edit" className="cursor-pointer" >
          <Div className="hover:bg-gray-100 p-[5px] rounded absolute right-2 top-2 flex items-center justify-center">
            <EditOutlineIcon />
          </Div>
          </Link>
        </Box>
        <Box className="mt-3 p-[15px]">
          <Typography className="text-[13px]">
            Your This Week Earnings:{" "}
            <Span className="font-medium text-[14px]">₹1560</Span>
          </Typography>
        </Box>
        <PaymentList />
      </Div>
    </>
  );
}

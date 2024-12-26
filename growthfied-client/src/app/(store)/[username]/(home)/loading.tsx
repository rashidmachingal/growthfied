import { Div } from "@/interface/fragments";

export default function Loading() {
  return (
    <Div className="flex flex-col items-center mt-[3rem] pb-[8rem] md:pb-[5rem] w-full">
      {/* <Div className="flex items-center justify-center flex-col mt-3 gap-2">
        <Div className="rounded-[100%] placeholder-animation h-[6rem] w-[6rem]"></Div>
      </Div> */}
      <Div className="flex items-center justify-center mt-3 gap-2 w-full px-[2rem]">
        <Div className="rounded-8 placeholder-animation h-theme w-full md:w-[20rem]"></Div>
        <Div className="rounded-8 placeholder-animation h-theme w-[3rem]"></Div>
      </Div>
      <Div className="w-full md:w-[95%] lg:w-[80%] flex justify-center gap-[1rem] md:gap-[2rem] flex-wrap mt-[3rem]">
        <Div className="placeholder-animation h-[15rem] w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border-transparent cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10"></Div>
        <Div className="placeholder-animation h-[15rem] w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border-transparent cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10"></Div>
        <Div className="placeholder-animation h-[15rem] w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border-transparent cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10"></Div>
        <Div className="placeholder-animation h-[15rem] w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border-transparent cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10"></Div>
        <Div className="placeholder-animation h-[15rem] w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border-transparent cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10"></Div>
        <Div className="placeholder-animation h-[15rem] w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border-transparent cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10"></Div>
        <Div className="placeholder-animation h-[15rem] w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border-transparent cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10"></Div>
        <Div className="placeholder-animation h-[15rem] w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border-transparent cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10"></Div>
      </Div>
    </Div>
  );
}

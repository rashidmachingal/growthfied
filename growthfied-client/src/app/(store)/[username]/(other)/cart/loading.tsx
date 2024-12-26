import { Div } from "@/interface/fragments";

export default function Loading() {
  return (
    <>
      <Div className="w-full bg-white p-[9px] pt-[8px] flex flex-col gap-[15px] pb-[3rem] mt-[5.5rem] md:px-[8rem]">
        <Div className="flex items-center gap-5">
          <Div className="w-[3.5rem] h-[3.5rem] rounded-full  placeholder-animation"></Div>
          <Div className="w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5">
          <Div className="w-[3.5rem] h-[3.5rem] rounded-full  placeholder-animation"></Div>
          <Div className="w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5">
          <Div className="w-[3.5rem] h-[3.5rem] rounded-full placeholder-animation"></Div>
          <Div className="w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5">
          <Div className="w-[3.5rem] h-[3.5rem] rounded-full  placeholder-animation"></Div>
          <Div className="w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5">
          <Div className="w-[3.5rem] h-[3.5rem] rounded-full  placeholder-animation"></Div>
          <Div className="w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5">
          <Div className="w-[3.5rem] h-[3.5rem] rounded-full placeholder-animation"></Div>
          <Div className="w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
      </Div>
    </>
  );
}

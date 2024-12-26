import { Div } from "@/interface/fragments";

export default function Page() {
  return (
    <>
      {/* <Div className="shadow-md flex justify-between items-center w-full px-[2rem] lg:px-[5rem] bg-white h-[5rem]">
        <Div className="flex items-center gap-3 w-full justify-center lg:w-auto">
          <Div className="w-full flex items-center gap-2">
            <Div className="rounded-full placeholder-animation h-[4rem] w-[4rem]"></Div>
            <Div className="rounded-8 placeholder-animation h-[2.5rem] w-full md:w-[10rem]"></Div>
          </Div>
        </Div>

        <Div className="flex items-center gap-3">
          <Div className="rounded-8 placeholder-animation h-[2.5rem] w-full md:w-[20rem]"></Div>
          <Div className="rounded-8 placeholder-animation h-[2.5rem] w-full md:w-[3rem]"></Div>
        </Div>

        <Div className="flex items-center gap-3">
          <Div className="rounded-8 placeholder-animation h-[2.5rem] w-full md:w-[13rem]"></Div>
        </Div>
      </Div> */}

      <Div className="w-full mt-[8rem] md:mt-[8rem] flex flex-col md:flex-row gap-[1.25rem] md:gap-[8rem] px-[2rem] lg:px-[20rem]">
        <Div className="placeholder-animation w-full md:w-[50%] flex justify-end h-[25rem]"></Div>

        <Div className="w-full md:w-[50%] flex h-[25rem] flex-col">
          <Div className="flex flex-col gap-2 w-full">
            <Div className="rounded-8 placeholder-animation h-[2rem] w-full"></Div>
            <Div className="rounded-8 placeholder-animation h-[2rem] w-[50%]"></Div>
          </Div>
          <Div className="flex gap-2 w-full mt-5">
            <Div className="rounded-8 placeholder-animation h-[2rem] w-[25%]"></Div>
            <Div className="rounded-8 placeholder-animation h-[2rem] w-[25%]"></Div>
            <Div className="rounded-8 placeholder-animation h-[2rem] w-[25%]"></Div>
          </Div>
          <Div className="flex gap-2 w-full mt-5">
            <Div className="rounded-8 placeholder-animation h-[2rem] w-[65%]"></Div>
          </Div>
          <Div className="flex gap-2 w-full mt-5">
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[70%]"></Div>
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[30%]"></Div>
          </Div>
          <Div className="flex gap-2 w-full mt-2">
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[30%]"></Div>
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[70%]"></Div>
          </Div>
          <Div className="flex gap-2 w-full mt-2">
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[100%]"></Div>
          </Div>
          <Div className="flex gap-2 w-full mt-2">
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[30%]"></Div>
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[70%]"></Div>
          </Div>
          <Div className="flex gap-2 w-full mt-2">
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[70%]"></Div>
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[30%]"></Div>
          </Div>
          <Div className="flex gap-2 w-full mt-2">
            <Div className="rounded-[50px] placeholder-animation h-[1rem] w-[100%]"></Div>
          </Div>
        </Div>
      </Div>
    </>
  );
}

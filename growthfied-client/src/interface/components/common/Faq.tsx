"use client"

// react
import { useState } from "react";

// fragments
import { Div, Typography } from "@/interface/fragments";

export default function Faq() {


  return (
    <Div className="mt-5 flex flex-col justify-center w-full items-center gap-2" >
        {faqData.map((item, index) => {
          return(
          <Div key={index} className="flex flex-col justify-center w-[95%] md:w-[50rem]" >
            <Div  className="p-2 px-5 border cursor-pointer flex justify-between items-center hover:bg-gray-100 rounded-t-theme" >
             <Typography className="font-medium" >{item.question}</Typography>
            </Div>
            <Div className={`p-2 px-5 border flex flex-col gap-2  h-auto transition-all'}`} >
            <Typography>
              {item.answer}
            </Typography>
            </Div>
          </Div>
        )})}
    </Div>
  )
}

const faqData = [
  {
    question: "What is Growthfied?",
    answer: "Growthfied is the solution for effortlessly creating your online store. Our user-friendly platform simplifies every step of building your e-commerce website, allowing you to get started quickly and easily."
  },
  {
    question: "Is Growthfied Free?",
    answer: "It is not a free platform; however, it currently offers a free trial."
  },
  {
    question: "How can I contact Growthfied?",
    answer: "You can reach us by emailing at growthfied@gmail.com."
  },
]
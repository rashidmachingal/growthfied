// fragments
import { Button, Div, InputField, SelectDropdown, TextArea, Typography } from "@/interface/fragments";

export default function AddReview() {

    const options = [
      {
        label:"5 Star Rating", 
        value:"5"
      },
      {
        label:"4 Star Rating", 
        value:"4"
      },
      {
        label:"3 Star Rating", 
        value:"3"
      },
      {
        label:"2 Star Rating", 
        value:"2"
      },
      {
        label:"1 Star Rating", 
        value:"1"
      },
    ]

  return (
    <Div className="w-[95%] md:w-[25rem]" >
      <Typography className="font-medium" >Write your review</Typography>
      <Div className="mt-1" >
       <SelectDropdown className="mt-[2px]" bgStyle="!bg-gray-50" options={options} defaultValue={options[0]} />
       <InputField type="text"  placeHolder="Your Name" containerStyle="mt-2" className="w-full bg-gray-50 text-[13px]" />
       <InputField type="text"  placeHolder="Enter Order Id" containerStyle="mt-2" className="w-full bg-gray-50 text-[13px]" />
       <TextArea placeHolder="Write your opinion about this product" className="w-full bg-gray-50 text-[13px] !h-[4.8rem]" containerStyle="mt-2" />
       <Button className="w-full mt-1" >Publish Review</Button>
      </Div>
    </Div>
  )
}

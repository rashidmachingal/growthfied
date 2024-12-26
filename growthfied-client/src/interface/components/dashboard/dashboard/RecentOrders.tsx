// fragments
import { Button, Div, Table, Typography } from "@/interface/fragments";
import { EyeIcon } from "@/interface/icons";

export default function RecentOrders() {
  return (
    <Div className="w-full mt-5">
      <Div className="w-full overflow-x-auto scrollable-container" >
        <Table className="bg-white w-full mt-3 rounded-theme " >
            <thead className="text-xs h-[3.5rem] border-b uppercase" >
                <tr>
                    <th>Order Id</th>
                    <th>Date</th>
                    <th>Whatsapp Number</th>
                    <th>Total Items</th>
                    <th>Payment Method</th>
                    <th>Total Amount</th>
                    <th className="pr-2" >More Details</th>
                </tr>
            </thead>
            <tbody className="text-center text-sm" >
                <tr className="border-b" >
                    <td className="h-[3rem] min-w-[6rem] flex items-center justify-center" >#0001</td>
                    <td className="h-[3rem] min-w-[10rem]" >25 July 2023</td>
                    <td className="h-[3rem] min-w-[10rem]" >+91 9876543210</td>
                    <td className="h-[3rem] min-w-[10rem]" >1</td>
                    <td className="h-[3rem] min-w-[10rem]" >Online Payment</td>
                    <td className="h-[3rem] min-w-[10rem]" >$198</td>
                    <td className="h-[3rem] min-w-[10rem] flex justify-center items-center" >
                     <Button className="!h-[2rem] gap-2" >
                      <EyeIcon/>
                      View
                     </Button>
                    </td>
                </tr>
                <tr className="border-b" >
                    <td className="h-[3rem] min-w-[6rem]" >#0001</td>
                    <td className="h-[3rem] min-w-[10rem]" >25 July 2023</td>
                    <td className="h-[3rem] min-w-[10rem]" >+91 9876543210</td>
                    <td className="h-[3rem] min-w-[6rem]" >1</td>
                    <td className="h-[3rem] min-w-[10rem]" >Online Payment</td>
                    <td className="h-[3rem] min-w-[10rem]" >$198</td>
                    <td className="h-[3rem] min-w-[10rem] flex justify-center items-center" >
                     <Button className="!h-[2rem] gap-2" >
                      <EyeIcon/>
                      View
                     </Button>
                    </td>
                </tr>
                <tr className="border-b" >
                    <td className="h-[3rem] min-w-[6rem]" >#0001</td>
                    <td className="h-[3rem] min-w-[10rem]" >25 July 2023</td>
                    <td className="h-[3rem] min-w-[10rem]" >+91 9876543210</td>
                    <td className="h-[3rem] min-w-[6rem]" >1</td>
                    <td className="h-[3rem] min-w-[10rem]" >Online Payment</td>
                    <td className="h-[3rem] min-w-[10rem]" >$198</td>
                    <td className="h-[3rem] min-w-[10rem] flex justify-center items-center" >
                     <Button className="!h-[2rem] gap-2" >
                      <EyeIcon/>
                      View
                     </Button>
                    </td>
                </tr>
                <tr className="border-b" >
                    <td className="h-[3rem] min-w-[6rem]" >#0001</td>
                    <td className="h-[3rem] min-w-[10rem]" >25 July 2023</td>
                    <td className="h-[3rem] min-w-[10rem]" >+91 9876543210</td>
                    <td className="h-[3rem] min-w-[6rem]" >1</td>
                    <td className="h-[3rem] min-w-[10rem]" >Online Payment</td>
                    <td className="h-[3rem] min-w-[10rem]" >$198</td>
                    <td className="h-[3rem] min-w-[10rem] flex justify-center items-center" >
                     <Button className="!h-[2rem] gap-2" >
                      <EyeIcon/>
                      View
                     </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
      </Div>
    </Div>
  );
}

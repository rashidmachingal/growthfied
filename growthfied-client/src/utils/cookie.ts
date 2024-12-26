import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import Cookies from "universal-cookie";

export const makeUnauthorized = (error: any) => {
  if (error.response.status === 401) {
    const cookies = new Cookies();
    cookies.remove("token", { path: "/" });
    useUserStore.getState().fetch_user();
  }
};

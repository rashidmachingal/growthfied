"use client";

import { AppProgressBar } from "next-nprogress-bar";

export default function ProgressBar() {
  return (
    <AppProgressBar
      height="4px"
      color="#0985b7"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}

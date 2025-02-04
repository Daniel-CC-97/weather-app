import React from "react";
import { cn } from "@/utils/cn";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "w-full bg-black-800 border border-black-300 rounded-xl flex py-4 shadow-sm",
        props.className
      )}
    />
  );
}

import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

export default function WeatherIcon(
  props: React.HTMLProps<HTMLDivElement> & { iconname: string }
) {
  return (
    <div {...props} className={cn("relative h-20 w-20")}>
      <Image
        src={`https://openweathermap.org/img/wn/${props.iconname}@4x.png`}
        alt="Weather Icon"
        className="absolute w-full h-full"
        width={100}
        height={100}
      ></Image>
    </div>
  );
}

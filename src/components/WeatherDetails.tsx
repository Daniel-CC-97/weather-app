import React from "react";
import { MdVisibility } from "react-icons/md";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa6";
import { ImMeter } from "react-icons/im";
import { LuSunrise } from "react-icons/lu";
import { FiSunset } from "react-icons/fi";

export interface WeatherDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunRise: string;
  sunSet: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    visibility = "25km",
    humidity = "61%",
    windSpeed = "7 km/h",
    airPressure = "1012 hPa",
    sunRise = "06:20",
    sunSet = "19:23",
  } = props;
  return (
    <>
      <SingleWeatherDetail
        icon={<MdVisibility />}
        information="Visibility"
        value={visibility}
      ></SingleWeatherDetail>
      <SingleWeatherDetail
        icon={<WiHumidity />}
        information="Humidity"
        value={humidity}
      ></SingleWeatherDetail>
      <SingleWeatherDetail
        icon={<FaWind />}
        information="Wind Speed"
        value={windSpeed}
      ></SingleWeatherDetail>
      <SingleWeatherDetail
        icon={<ImMeter />}
        information="Air Pressure"
        value={airPressure}
      ></SingleWeatherDetail>
      <SingleWeatherDetail
        icon={<LuSunrise />}
        information="Sun Rise"
        value={sunRise}
      ></SingleWeatherDetail>
      <SingleWeatherDetail
        icon={<FiSunset />}
        information="Sun Set"
        value={sunSet}
      ></SingleWeatherDetail>
    </>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold ">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}

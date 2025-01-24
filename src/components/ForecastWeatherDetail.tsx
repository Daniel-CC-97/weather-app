import React from "react";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  description: string;
}

export default function ForecastWeatherDetail(
  props: ForecastWeatherDetailProps
) {
  const {
    weatherIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feelsLike,
    tempMin,
    tempMax,
    description,
  } = props;
  return (
    <Container className="gap-4 overflow-x-auto">
      <section className="flex gap-4 items-center px-4">
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconname={weatherIcon}></WeatherIcon>
          <p>{date}</p>
          <p className="text-xs">{day}</p>
        </div>
        <div className="flex flex-col px-4 items-center">
          <span className="text-5xl">{convertKelvinToCelsius(temp ?? 0)}°</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels like</span>
            <span>{convertKelvinToCelsius(feelsLike ?? 0)}°</span>
          </p>
          <p className="text-xs space-x-2">
            <span>{convertKelvinToCelsius(tempMin ?? 0)}°↓</span>{" "}
            <span>{convertKelvinToCelsius(tempMax ?? 0)}°↑</span>
          </p>
          <p className="capitalize">{description}</p>
        </div>
      </section>
      <section className="flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props}></WeatherDetails>
      </section>
    </Container>
  );
}

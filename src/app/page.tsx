"use client"; // Ensures this component runs on the client side

// Importing UI components and utilities
import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { msToKms } from "@/utils/msToKms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";

// Type definitions for weather data

type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecast[];
  city: City;
};

type WeatherForecast = {
  dt: number;
  main: MainWeatherData;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  city: City;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
};

type MainWeatherData = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Clouds = {
  all: number;
};

type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

type Sys = {
  pod: string;
};

type City = {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

type Coordinates = {
  lat: number;
  lon: number;
};

export default function Home() {
  // Using global state atoms for location and loading status
  const [place] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  // Fetch weather data using react-query
  const { isPending, data } = useQuery<WeatherData>({
    queryKey: ["weatherData", place], // Improved query key
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    },
  });

  const firstData = data?.list[0]; // Get first forecast entry

  // Extract unique dates from forecast data
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  // Get first data entry for each unique date
  const firstDataforEach = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  // Display loading animation if data is still being fetched
  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 min-h-screen">
      {/* Navbar with city name and search bar */}
      <Navbar location={data?.city.name}></Navbar>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-0 md:pt-4">
        {loadingCity ? (
          <WeatherSkeleton></WeatherSkeleton>
        ) : (
          <>
            {/* Display today's weather */}
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className="gap-10 px-6 items-center">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl text-center">
                      {convertKelvinToCelsius(firstData?.main.temp ?? 0)}°
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span>
                        {convertKelvinToCelsius(
                          firstData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                        °↓
                      </span>{" "}
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                        °↑
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((weatherData, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(weatherData.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon
                          iconname={getDayOrNightIcon(
                            weatherData.weather[0].icon,
                            weatherData.dt_txt
                          )}
                        ></WeatherIcon>
                        <p>
                          {convertKelvinToCelsius(weatherData.main.temp ?? 0)}°
                        </p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                <Container className="w-fit justify-center flex flex-col px-4 items-center">
                  <p className="capitalize text-center">
                    {firstData?.weather[0].description}
                  </p>
                  <WeatherIcon
                    iconname={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  ></WeatherIcon>
                </Container>
                <Container className="bg-black-600 justify-between px-6 gap-4 overflow-x-auto">
                  <WeatherDetails
                    visibility={msToKms(firstData?.visibility ?? 0)}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    sunRise={format(
                      fromUnixTime(data?.city.sunrise ?? 0),
                      "HH:mm"
                    )}
                    sunSet={format(
                      fromUnixTime(data?.city.sunset ?? 0),
                      "HH:mm"
                    )}
                    windSpeed={convertWindSpeed(firstData?.wind.speed ?? 0)}
                  ></WeatherDetails>
                </Container>
              </div>
            </section>

            {/* Display 7-day forecast */}
            <section className="flex flex-col w-full gap-4">
              <p className="text-2xl">Forecast (7 days)</p>
              {firstDataforEach.map((d, index) => {
                return (
                  <ForecastWeatherDetail
                    key={index}
                    description={d?.weather[0].description ?? ""}
                    weatherIcon={d?.weather[0].icon ?? ""}
                    date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                    day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                    feelsLike={d?.main.feels_like ?? 0}
                    temp={d?.main.temp ?? 0}
                    tempMax={d?.main.temp_max ?? 0}
                    tempMin={d?.main.temp_min ?? 0}
                    airPressure={`${d?.main.pressure} hPa`}
                    humidity={`${d?.main.humidity}%`}
                    sunRise={format(
                      fromUnixTime(data?.city.sunrise ?? 0),
                      "HH:mm"
                    )}
                    sunSet={format(
                      fromUnixTime(data?.city.sunset ?? 0),
                      "HH:mm"
                    )}
                    visibility={`${msToKms(d?.visibility ?? 0)}`}
                    windSpeed={`${convertWindSpeed(d?.wind.speed ?? 0)}`}
                  ></ForecastWeatherDetail>
                );
              })}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// Skeleton loader component for when weather data is loading
function WeatherSkeleton() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2 items-end">
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
            <div className="h-5 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center gap-10 px-6">
            <div className="flex flex-col items-center px-4">
              <div className="h-12 w-20 bg-gray-300 rounded"></div>
              <div className="h-4 w-32 bg-gray-300 rounded mt-2"></div>
              <div className="flex gap-2 mt-2">
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                >
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div className="h-4 w-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-fit flex flex-col px-4 items-center">
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full mt-2"></div>
          </div>
          <div className="flex-1 bg-gray-300 rounded h-36"></div>
        </div>
      </section>

      <section className="flex flex-col w-full gap-4">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-300 rounded p-4"
          >
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
            <div className="h-6 w-10 bg-gray-300 rounded"></div>
          </div>
        ))}
      </section>
    </main>
  );
}

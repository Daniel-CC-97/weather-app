"use client";
import Container from "@/components/Container";
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

const API =
  "https://api.openweathermap.org/data/2.5/forecast?q=london&appid=2d204e5cd64299f2b4b15b4b187843bb&cnt=56";

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
  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );

      return data;
    },
  });

  const firstData = data?.list[0];

  console.log("data: ", data);

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <Navbar></Navbar>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
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
                    {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓
                  </span>{" "}
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
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
                      iconName={getDayOrNightIcon(
                        weatherData.weather[0].icon,
                        weatherData.dt_txt
                      )}
                    ></WeatherIcon>
                    <p>{convertKelvinToCelsius(weatherData.main.temp ?? 0)}°</p>
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
                iconName={getDayOrNightIcon(
                  firstData?.weather[0].icon ?? "",
                  firstData?.dt_txt ?? ""
                )}
              ></WeatherIcon>
            </Container>
            <Container className="bg-black-800 justify-between px-6 gap-4 overflow-x-auto">
              <WeatherDetails
                visibility={msToKms(firstData?.visibility ?? 0)}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunRise={format(fromUnixTime(data?.city.sunrise ?? 0), "HH:mm")}
                sunSet={format(fromUnixTime(data?.city.sunset ?? 0), "HH:mm")}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 0)}
              ></WeatherDetails>
            </Container>
          </div>
        </section>

        <section className="flex flex-col w-full gap-4">
          <p className="text-2xl">Forecast (7 days)</p>
        </section>
      </main>
    </div>
  );
}

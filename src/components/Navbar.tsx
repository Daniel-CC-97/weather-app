"use client";
import React from "react";
import { useEffect, useState } from "react";
import { IoSunny } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
import SearchBar from "./SearchBar";
import axios from "axios";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "@/app/atom";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setPlace] = useAtom(placeAtom);
  const [, setLoading] = useAtom(loadingCityAtom);

  const handleInputChange = async (value: string) => {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );
        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (value: string) => {
    setCity(value);
    setShowSuggestions(false);
  };

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (suggestions.length === 0) {
      setError("Location not found");
      setLoading(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoading(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { longitude, latitude } = position.coords;
        try {
          setLoading(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoading(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoading(false);
        }
      });
    }
  };
  return (
    <>
      <nav className="bg-black-900 text-black-300 shadow-sm sticky top-0 left-0 z-50">
        <div className="p-6 w-full flex justify-between items-center max-w-7xl mx-auto">
          <p className="flex items-center justify-center gap-2">
            <h2 className="text-3xl text-black-300">Weather</h2>
            <IoSunny className="text-3xl text-yellow-600 mt-1" />
          </p>
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Current Location"
              onClick={handleCurrentLocation}
              className="text-2xl cursor-pointer hover:opacity-80"
            />
            <FaLocationDot className="text-2xl" />
            <p className="text-black-300 text-sm">{location}</p>
            <div className="relative hidden md:flex">
              <SearchBar
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              ></SearchBar>
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                }}
              ></SuggestionBox>
            </div>
          </section>
        </div>
      </nav>
      <section className="flex md:hidden">
        <div className="relative px-3">
          <SearchBar
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          ></SearchBar>
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
            }}
          ></SuggestionBox>
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-black-600 absolute border left-0 border-black-300 rounded-md min-w-[200px] flex flex-col gap-1 p-2">
          {error && suggestions.length < 1 && (
            <li className="text-red">{error}</li>
          )}
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded hover:bg-black-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

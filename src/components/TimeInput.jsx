"use client";

import { useState } from "react";

export default function TimeInput() {
  //
  const [time, setTime] = useState(0);
  //
  function secondsToTimeString(seconds) {
    let hours = "00";
    let minutes = "00";
    hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  return (
    <div className="h-2/5 w-full flex flex-col justify-center items-center">
      <label className="addList mb-1 px-2" htmlFor="time">
        T I M E : {secondsToTimeString(time)}
      </label>
      <input
        className="w-full"
        type="range"
        name="time"
        id="time"
        min={0}
        max={86400}
        step={900}
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
    </div>
  );
}

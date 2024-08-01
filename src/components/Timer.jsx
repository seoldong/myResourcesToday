"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

//
export default function Timer({ scheduleData }) {
  const param = useParams();
  const [scheduleObj, setScheduleObj] = useState();
  const [remainingTime, setRemainingTime] = useState(Number(0));

  useEffect(() => {
    if (scheduleData) setScheduleObj(scheduleData);
  }, [scheduleData]);

  useEffect(() => {
    if (scheduleObj) {
      const timer = setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const todayTotalSec = hours * (60 * 60) + minutes * 60 + seconds;
        const setTime = Number(scheduleObj.settime);

        let remainingSec = setTime - todayTotalSec;

        if (remainingSec <= 0) {
          remainingSec = remainingSec + 24 * 60 * 60;
        } else if (remainingSec > 24 * 60 * 60) {
          remainingSec = remainingSec - 24 * 60 * 60;
        }

        setRemainingTime(remainingSec);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [scheduleObj]);

  function convertSecondsToMinutesHours(totalSeconds) {
    let hours = Math.floor(totalSeconds / (60 * 60));
    let minutes = Math.floor((totalSeconds / 60) % 60);
    let seconds = Math.floor(totalSeconds % 60);
    hours <= 0 ? (hours = 0) : (hours = hours);
    minutes <= 0 ? (minutes = 0) : (minutes = minutes);
    seconds <= 0 ? (seconds = 0) : (seconds = seconds);
    return { hours, minutes, seconds };
  }

  function convertToTwoDigits(num) {
    const convertNum = num < 10 ? "0" + num : num;
    return convertNum;
  }

  const time = convertSecondsToMinutesHours(remainingTime);
  const hours = convertToTwoDigits(time.hours);
  const minutes = convertToTwoDigits(time.minutes);
  const seconds = convertToTwoDigits(time.seconds);

  //
  return (
    <div className="h-4/5 pt-10 w-3/5 flex flex-col justify-center items-center">
      <h1 className="time h-1/5 overflow-auto text-4xl w-full flex justify-center items-center font-extralight">
        {param.schedule}
      </h1>
      <div className="time h-2/5 w-full flex items-center text-4xl font-extralight">
        <div className="w-1/5 flex justify-center items-center">{hours}</div>
        <div className="w-1/5 flex justify-center items-center">:</div>
        <div className="w-1/5 flex justify-center items-center">{minutes}</div>
        <div className="w-1/5 flex justify-center items-center">:</div>
        <div className="w-1/5 flex justify-center items-center">{seconds}</div>
      </div>
      <div className="time h-2/5 w-full overflow-auto flex justify-center items-center text-2xl font-extralight">
        {scheduleObj?.memo}
      </div>
    </div>
  );
}

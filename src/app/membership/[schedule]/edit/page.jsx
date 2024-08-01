"use client";

import CancelBtn from "@/components/CancelBtn";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MembershipScheduleEditPage() {
  const router = useRouter();
  const sParams = useSearchParams();
  const scheduleName = sParams.get("editTarget"); //쿼리 받아야 해서 클라이언트 페이지로 작성

  const initeScheduleData = {
    settime: 0,
    memo: "",
  };
  const [editTarget, setEditTarget] = useState(scheduleName);
  const [scheduleData, setScheduleData] = useState(initeScheduleData);

  //
  useEffect(() => {
    if (scheduleName) {
      const getSchedule = async () => {
        const url = `/api/fetchTargetSchedule`;
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduleName }),
        };
        const response = await fetch(url, options);
        const schedule = await response.json();
        setScheduleData(schedule);
      };
      getSchedule();
    }
  }, [scheduleName]);

  //
  const onClickSave = async (e) => {
    e.preventDefault();
    const newData = { [editTarget]: scheduleData };

    const url = `/api/updateEditSchedule`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduleName, newData }),
    };

    try {
      const response = await fetch(url, options);
      router.push(`/membership/${editTarget}`);
      router.refresh();
    } catch (err) {
      console.log("edit schedule > save err", err);
    }
  };
  //
  function secondsToTimeString(seconds) {
    let hours = "00";
    let minutes = "00";
    if (scheduleData) {
      hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
      minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    }
    return `${hours}:${minutes}`;
  }

  return (
    <form
      className="h-full pt-5 w-4/5 flex flex-col justify-center items-center"
      action=""
    >
      <ul className="h-4/5 flex flex-col items-center pb-3">
        <div className="h-1/5 flex flex-col justify-between items-center">
          <label className="px-2" htmlFor="title">
            T I T L E
          </label>
          <input
            className="text-center"
            type="text"
            name="title"
            id="title"
            value={editTarget}
            onChange={(e) => setEditTarget(e.target.value)}
          />
        </div>
        <div className="h-2/5 w-full flex flex-col justify-center items-center">
          <label className="mb-3 px-2" htmlFor="time">
            T I M E : {secondsToTimeString(scheduleData.settime)}
          </label>
          <input
            className="w-full"
            type="range"
            name="time"
            id="time"
            min={0}
            max={86400}
            step={900}
            value={scheduleData.settime}
            onChange={(e) =>
              setScheduleData({
                ...scheduleData,
                settime: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="h-2/5 w-full flex flex-col justify-between items-center">
          <label className="mb-3 px-2" htmlFor="memo">
            M E M O
          </label>
          <textarea
            className="h-full w-full"
            name="memo"
            id="memo"
            value={scheduleData.memo || ""}
            onChange={(e) =>
              setScheduleData({ ...scheduleData, memo: e.target.value })
            }
          />
        </div>
      </ul>

      <div className="h-1/5 w-full flex items-center">
        <div className="w-1/2 flex justify-center items-center">
          <button
            className="scheduleControlBtn underline underline-offset-8 hover:bg-gray-300 p-3 flex justify-center items-center"
            onClick={(e) => onClickSave(e)}
          >
            S A V E
          </button>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <CancelBtn />
        </div>
      </div>
    </form>
  );
}

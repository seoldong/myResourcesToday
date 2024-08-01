"use client";

import { useContext, useEffect, useState } from "react";
import { ScheduleContext } from "@/context/scheduleContext";
import Timer from "@/components/Timer";
import { useParams, useRouter } from "next/navigation";
import ScheduleControl from "@/components/scheduleControl";
import { onAuthStateChanged } from "firebase/auth";
import { invalidateSession } from "@/logic-c/apiRoute";
import { auth } from "@/lib/firebase-config";
//
export default function MembershipSchedulePage() {
  const { scheduleListArr } = useContext(ScheduleContext);
  const router = useRouter();
  const params = useParams();
  //
  useEffect(() => {
    const checkLoginStatus = onAuthStateChanged(auth, async (userCred) => {
      if (!userCred) {
        await invalidateSession();
        router.push("/");
      }
    });
    return () => checkLoginStatus();
  }, [router]);
  //
  const [selectScheduleData, setSelectScheduleData] = useState({});
  //
  useEffect(() => {
    if (scheduleListArr.length > 0) {
      const firstScheduleName = Object.keys(scheduleListArr[0])[0];
      //
      if (params.schedule === "schedule") {
        router.push(`/membership/${firstScheduleName}`);
      } else {
        const matchingSchedule = scheduleListArr.find((schedule) => {
          const [name] = Object.keys(schedule);
          return name === params.schedule;
        });

        if (matchingSchedule) {
          setSelectScheduleData(matchingSchedule[params.schedule]);
        } else {
          router.push(`/membership/${firstScheduleName}`);
        }
      }
    }
  }, [params.schedule, router, scheduleListArr]);

  return (
    <>
      <Timer scheduleData={selectScheduleData} />
      <ScheduleControl />
    </>
  );
}

"use client";
import { auth } from "@/lib/firebase-config";
import { invalidateSession } from "@/logic-c/apiRoute";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from 'next/router';
//---------------------------------------------------
import { useState, useEffect } from "react";
//---------------------------------------------------
export default function TimerNonLogin({ logStatus }) {
  const router = useRouter();
  //
  const initTime = { hours: 0, minutes: 0, seconds: 0 };
  const [timeLeft, setTimeLeft] = useState(initTime);
  //
  useEffect(() => {
    const checkLogin = onAuthStateChanged(auth, async (userCred) => {
      if (!userCred) {
        if (logStatus) {
          invalidateSession();
        }
      } else if (userCred) {
        if (!logStatus) {
          await signOut();
        }
      }
    });
    return () => checkLogin();
  }, [logStatus]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);
  //
  function formatNumber(num) {
    return num.toString().padStart(2, "0");
  }
  //
  return (
    <>
      <div className="w-full flex items-center text-4xl font-extralight">
        <span className="w-1/5 flex justify-center items-center">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="w-1/5 flex justify-center items-center">{`:`}</span>
        <span className="w-1/5 flex justify-center items-center">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="w-1/5 flex justify-center items-center">{`:`}</span>
        <span className="w-1/5 flex justify-center items-center">
          {formatNumber(timeLeft.seconds)}
        </span>
      </div>
    </>
  );
}
//---------------------------------------------------
const calculateTimeLeft = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const difference = midnight - now;

  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

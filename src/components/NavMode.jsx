"use client";

import { useEffect, useState } from "react";

export default function NavMode({ aniView }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const dawn = [0, 1, 2, 3, 4, 5];
    const morning = [6, 7, 8];
    const dayTime = [9, 10, 11, 12];
    const leavingWork = [13, 14, 15, 16];
    const evening = [17, 18, 19];
    const nighttime = [20, 21, 22, 23];
    if (aniView === "on") {
      const current = new Date().getHours();
      let time;
      if (dawn.includes(current)) time = "dawn";
      if (morning.includes(current)) time = "morning";
      if (dayTime.includes(current)) time = "dayTime";
      if (leavingWork.includes(current)) time = "leavingWork";
      if (evening.includes(current)) time = "evening";
      if (nighttime.includes(current)) time = "nighttime";
      document.documentElement.setAttribute("data-theme", `${time}`);
    } else {
      const storage = localStorage.getItem("theme");
      if (storage === null) {
        document.documentElement.setAttribute("data-theme", "light");
        setTheme("light");
      } else if (storage === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        setTheme("light");
      } else if (storage === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        setTheme("dark");
      }
    }
  }, [aniView, theme]);

  const onClickModeChange = (e) => {
    e.preventDefault();
    if (theme === "light") {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <div>
      {aniView ? (
        "animation_view"
      ) : (
        <button onClick={(e) => onClickModeChange(e)}>{`${theme} mode`}</button>
      )}
    </div>
  );
}

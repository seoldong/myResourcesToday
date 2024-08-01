'use client'
// contexts/ScheduleContext.js
import React, { createContext, useContext, useState } from 'react';

// Create Context
export const ScheduleContext = createContext();

// Provider Component
export const ScheduleProvider = ({ children, initData }) => {
  const [scheduleListArr, setScheduleListArr] = useState(initData);

  return (
    <ScheduleContext.Provider value={{scheduleListArr}} >
      {children}
    </ScheduleContext.Provider>
  );
};

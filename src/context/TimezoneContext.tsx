import React, { createContext, useContext, useState, useEffect } from "react";

interface TimezoneContextType {
  timezone: "GMT" | "ET";
  toggleTimezone: () => void;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(
  undefined
);

export const TimezoneProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timezone, setTimezone] = useState<"GMT" | "ET">(() => {
    const savedTimezone = localStorage.getItem("timezone");
    return savedTimezone === "GMT" || savedTimezone === "ET"
      ? savedTimezone
      : "ET"; // Default to ET
  });

  useEffect(() => {
    localStorage.setItem("timezone", timezone);
  }, [timezone]);

  const toggleTimezone = () => {
    setTimezone((prev) => (prev === "GMT" ? "ET" : "GMT"));
  };

  return (
    <TimezoneContext.Provider value={{ timezone, toggleTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error("useTimezone must be used within a TimezoneProvider");
  }
  return context;
};

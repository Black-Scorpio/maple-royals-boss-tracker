// src/utils/timeUtils.ts
export type Timezone = "GMT" | "ET";

export const formatTime = (date: Date, timezone: Timezone = "ET") => {
  if (timezone === "GMT") {
    // 24-hour format for GMT
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  } else {
    // 12-hour format for ET
    return date
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      })
      .toLowerCase();
  }
};

export const getStoredTimezone = (): Timezone => {
  return (localStorage.getItem("timezone") as Timezone) || "ET";
};

export const storeTimezone = (tz: Timezone) => {
  localStorage.setItem("timezone", tz);
};

// src/utils/timeUtils.ts
export const formatTime = (date: Date) => {
  return date
    .toLocaleTimeString([], {
      hour: "numeric", // Use "numeric" instead of "2-digit" to remove leading zero
      minute: "2-digit",
      hour12: true, // Ensure 12-hour format
    })
    .toLowerCase(); // Ensure "am/pm" is lowercase for consistency
};

function formatDate(str = "") {
  if (!str) return "";

  const date = new Date(str + "Z");

  if (isNaN(date.getTime())) return "Invalid date";

  // "Asia/Kolkata"
  // "Asia/Dhaka"
  return date.toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    hour12: true,
  });
}

export { formatDate };

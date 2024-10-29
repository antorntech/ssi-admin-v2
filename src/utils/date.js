function formatDate(str = "") {
  if (!str) return "";

  const date = new Date(str);
  
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("bn-BD");
}

export { formatDate };

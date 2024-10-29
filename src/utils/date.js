function formatDate(str = "") {
  if (!str) return "";
  const date = new Date(str);
  return date.toLocaleString();
}

export { formatDate };

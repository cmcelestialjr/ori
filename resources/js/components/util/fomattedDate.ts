export const formattedDate = (dateString?: string): string => {
  if (!dateString) return "Invalid date"; // Handle undefined or empty input

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date"; // Handle invalid date format

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

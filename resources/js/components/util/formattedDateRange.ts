export const formattedDateRange = (start_date?: string, end_date?: string): string => {
  if (!start_date || !end_date) return "Invalid date range"; // Handle undefined or empty values

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid date range"; // Handle invalid date formats
  }

  const options: Intl.DateTimeFormatOptions = { month: "long", day: "2-digit" };

  return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`;
};
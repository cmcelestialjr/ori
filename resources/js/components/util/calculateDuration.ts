export const calculateDuration = (start_date: any, end_date: any): number => {
  const start = new Date(start_date);
  const end = new Date(end_date);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }

  // Calculate difference in milliseconds, convert to days
  const diffInMs = end.getTime() - start.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1; // Include the last day
};
export const parseDate = (date: Date | string | undefined, time?: boolean) => {
  if (!date) return;

  const parsedDate = new Date(date);

  let dateString = parsedDate.toDateString();

  if (time) {
    let hours = parsedDate.getHours();
    const minutes = parsedDate.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    dateString += ` ${hours}:${minutes} ${ampm}`;
  }

  return dateString;
};

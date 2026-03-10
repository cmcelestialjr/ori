import { useState } from "react";

function InputDate() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value; // "YYYY-MM-DD"
    setSelectedDate(rawValue);

    if (rawValue) {
      // Convert "YYYY-MM-DD" to a readable format
      const date = new Date(rawValue);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      console.log("Formatted Date:", formattedDate); // Example: "March 19, 2025"
    }
  };

  return (
    <input
      type="date"
      className="w-full appearance-none bg-white border rounded-md p-3 cursor-pointer hover:border-blue-500"
      value={selectedDate}
      onChange={handleChange}
    />
  );
}

export default InputDate;

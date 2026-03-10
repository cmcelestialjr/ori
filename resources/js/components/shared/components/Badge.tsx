type BadgePropsType = {
  type?: string;
  color?: "yellow" | "red" | "blue" | "green";
  title?: string;
};

const Badge = ({ title, color, type }: BadgePropsType) => {
  return (
    <>
      {type === "pending" && (
        <span className="me-2 rounded-md bg-yellow-200 px-2.5 py-1 text-sm font-semibold text-yellow-800">
          pending
        </span>
      )}
      {type === "approved" && (
        <span className="me-2 rounded-md bg-blue-200 px-2.5 py-1 text-sm font-semibold text-blue-800">
          approved
        </span>
      )}
      {type === "rejected" && (
        <span className="me-2 rounded-md bg-red-200 px-2.5 py-1 text-sm font-semibold text-red-800">
          rejected
        </span>
      )}
      {type === "evaluated" && (
        <span className="me-2 rounded-md bg-green-200 px-2.5 py-1 text-sm font-semibold text-green-800">
          evaluated
        </span>
      )}
      {!type && (
        <span
          className={`bg-${color}-200 text-${color}-800 me-2 rounded-md px-2.5 py-1 text-sm font-semibold`}
        >
          {title}
        </span>
      )}
    </>
  );
};

export default Badge;

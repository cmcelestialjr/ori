import { ReactNode } from "react";

interface CardProps {
  title: string;
  total?: number | string | null;
  borderColor: string;
  icon?: ReactNode | string | number;
  name?: string | null;
}

const Card = ({ title, total, borderColor, icon, name }: CardProps) => {
  return (
    // <div
    //   className={`flex flex-1 flex-row items-center justify-between rounded-md border-l-8 bg-white p-5 shadow ${borderColor}`}
    // >
    <div
      className={`flex flex-1 flex-row items-center justify-between rounded-md border-l-8 bg-white p-5 shadow hover:shadow-md lg:flex-col-reverse lg:items-start xl:flex xl:flex-row ${borderColor}`}
    >
      <div>
        <h3 className="font-bold text-text2Color">{title}</h3>
        {name && <p className="my-1 text-sm font-bold text-gray-800">{name}</p>}
        <p
          className={`mt-2 font-bold text-text3Color ${typeof total === "string" ? "mb-2 text-base capitalize" : "text-2xl"}`}
        >
          {total}
        </p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center text-3xl font-bold text-gray-800">
        {icon}
      </div>
    </div>
  );
};

export default Card;

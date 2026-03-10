import React, { useState } from "react";
import { Link } from "react-router-dom";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  route?: string;
  link?: string;
}

const Tooltip = ({ text, children, route, link }: TooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className="absolute left-1/2 z-50 mt-2 w-52 -translate-x-1/2 select-text text-wrap rounded bg-gray-800 px-4 py-2 text-sm text-white shadow-lg after:absolute after:-top-2 after:left-[46%] after:border-b-[16px] after:border-l-8 after:border-r-8 after:border-b-gray-800 after:border-l-transparent after:border-r-transparent"
        >
          <p className="text-pretty break-words">
            {text}{" "}
            {route && (
              <span className="inline-flex text-blue-500">
                <Link to={route}>{link}</Link>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

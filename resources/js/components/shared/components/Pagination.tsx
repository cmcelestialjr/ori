import React from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import Button from "./Button";

type PaginationType = {
  currentPage: number;
  totalPages: number;
  links: {
    url?: string | null;
    label: string | number;
    active: boolean;
  }[];
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationType> = ({
  currentPage,
  totalPages,
  links,
  onPageChange,
}) => {
  const displayLinks = links
    .filter(
      (link) => typeof link.label === "string" && !isNaN(Number(link.label)),
    )
    .slice(0, 5);

  return (
    <div className="flex items-center justify-center space-x-4">
      {currentPage > 1 && (
        <Button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-sm px-1 py-2 text-blue-500 hover:bg-blue-900 hover:text-white"
        >
          <BiLeftArrow />
        </Button>
      )}

      {displayLinks.map((link, index) => (
        <Button
          key={index}
          type="button"
          onClick={() => onPageChange(Number(link.label))}
          className={`${link.active ? "bg-blue-900 text-white" : "text-blue-500 hover:bg-blue-900 hover:text-white"} rounded-sm px-2 py-1`}
        >
          {Number(link.label)}
        </Button>
      ))}

      {totalPages > 5 && (
        <Button
          type="button"
          className="rounded-sm px-2 py-1 text-blue-500 hover:bg-blue-900 hover:text-white"
        >
          ...
        </Button>
      )}

      {links[links.length - 1].url && (
        <Button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-md px-1 py-2 text-blue-500 hover:bg-blue-900 hover:text-white"
        >
          <BiRightArrow />
        </Button>
      )}
    </div>
  );
};

export default Pagination;

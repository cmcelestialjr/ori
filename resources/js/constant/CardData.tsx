import { ReactNode } from "react";

export interface DashboardCard {
  title: string;
  border: string;
  icon?: ReactNode;
  total?: number | string;
  name?: string;
}

export const AdminFacultyCard = [
  {
    title: "College of Arts and Sciences",
    total: 765,
    border: "border-indigo-900",
  },
  {
    title: "College of Education",
    total: 956,
    border: "border-yellow-400",
  },
  {
    title: "College of Management and Entrepreneurship",
    total: 794,
    border: "border-indigo-700",
  },
];

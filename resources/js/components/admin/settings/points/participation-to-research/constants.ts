export type TableType = {
  id: number;
  category: string;
  coverage: string;
  points: number;
  legend: string;
};

export const customStyles = {
  rows: {
    style: {
      fontSize: "1rem",
      backgroundColor: "#fff",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    },
  },
  headCells: {
    style: {
      fontSize: "1rem",
      backgroundColor: "#f3f4f6",
    },
  },
  cells: {
    style: {
      fontSize: "1rem",
    },
  },
};

export const nature_attendance = [
  "attendance",
  "organizer",
  "coordinator",
  "facilitator",
  "editor in chief",
  "associate editor",
  "managing editor",
  "production and circulation manager",
  "business manager",
  "moderator",
  "judge",
  "committee member",
  "resource person",
  "lecturer",
  "presenter",
  "speaker",
  "consultant",
];

export const coverages = [
  "unit/department",
  "college-wide",
  "university-wide",
  "regional/national",
  "international",
];

export const legends = [
  "per hour",
  "per day",
  "per presentation",
  "per project",
];

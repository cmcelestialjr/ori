export const completedFormula = (
  authorship: string | undefined,
  authors: string | undefined,
) => {
  if (authorship === undefined || authors === undefined) return;

  if (authorship.toLowerCase() !== "sole author") {
    const authorsArray = authors.split(",").map((author) => author.trim());

    return 150 / authorsArray.length;
  }

  return 150;
};

{
  /**
  Attendance Nature:

  Attendance
  Organizer/Coordinators
  Facilitators/Editor in Chief/Associate Editor/Managing Editor/Production and Circulation Manager/Business Manager/Moderatos/Judge
  Committee Member
  Resource Person/Lecturer/Presenter/Speaker
  Consultant

  */
}

export const participationToResearchFormula = (
  attendanceNature: string | undefined,
  coverage: string | undefined,
  date: string | undefined,
) => {
  if (
    attendanceNature === undefined ||
    coverage === undefined ||
    date === undefined
  )
    return;

  const datePattern = /(\w{3}) (\d+)-(\d+), (\d{4})/;
  const match = date?.match(datePattern);

  let duration = 1;

  if (match) {
    const startDay = Number(match[2]);
    const endDay = Number(match[3]);
    duration = endDay - startDay + 1;
  }

  const normalizedNature = attendanceNature.toLowerCase().trim();
  let activityType: keyof typeof pointsTable = "";

  switch (normalizedNature) {
    case "coordinators":
      activityType = "organizer";
      break;
    case "editor in chief":
    case "associate editor":
    case "managing editor":
    case "production and circulation manager":
    case "business manager":
    case "moderator":
    case "judge":
    case "facilitator":
      activityType = "facilitator";
      break;
    case "committee member":
      activityType = "committeeMember";
      break;
    case "consultant":
      activityType = "consultant";
      break;
    default:
      throw new Error(`Invalid attendance nature: ${attendanceNature}`);
  }

  const pointsTable: { [key: string]: { [key: string]: number } } = {
    attendance: {
      "unit/department": 0.5,
      "college-wide": 1,
      "university-wide": 1.5,
      "regional/national": 10,
      international: 20,
    },
    organizer: {
      "unit/department": 10,
      "college-wide": 20,
      "university-wide": 45,
      "regional/national": 90,
      international: 180,
    },
    facilitator: {
      "unit/department": 6,
      "college-wide": 12,
      "university-wide": 15,
      "regional/national": 30,
      international: 60,
    },
    committeeMember: {
      "unit/department": 3,
      "college-wide": 6,
      "university-wide": 10,
      "regional/national": 20,
      international: 40,
    },
    resourcePerson: {
      "unit/department": 10,
      "college-wide": 20,
      "university-wide": 45,
      "regional/national": 90,
      international: 180,
    },
    consultant: {
      "unit/department": 10,
      "college-wide": 20,
      "university-wide": 45,
      "regional/national": 90,
      international: 180,
    },
  };

  const legends = {
    attendance: "a",
    organizer: "c",
    facilitator: "c",
    committeeMember: "c",
    resourcePerson: "d",
    consultant: "c",
  };

  if (!pointsTable[activityType] || !pointsTable[activityType][coverage]) {
    throw new Error(`Invalid coverage: ${coverage}`);
  }

  const pointsPerUnit = pointsTable[activityType][coverage];
  const legend = legends[activityType as keyof typeof legends];

  let totalPoints;
  switch (legend) {
    case "a":
    case "b":
    case "d":
      totalPoints = pointsPerUnit * duration;
      break;
    case "c":
      totalPoints = pointsPerUnit;
      break;
    default:
      throw new Error("Invalid legend.");
  }

  return totalPoints;
};

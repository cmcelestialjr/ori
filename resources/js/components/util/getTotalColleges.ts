import { UserType } from "../admin/types";

export const totalCollege = (college: string, users: UserType[]) => {
  const colleges = users?.map((user) => user.college);
  const total = colleges?.filter((cas) => cas === college);
  return total?.length;
};
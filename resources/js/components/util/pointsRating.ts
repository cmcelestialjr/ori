import { PointsRatingEnum } from "../admin/types";

export const pointsRating = (points: number): string => {
  if (points <= 18) {
    return PointsRatingEnum.POOR;
  } else if (points > 18 && points <= 36) {
    return PointsRatingEnum.BELOW_SATISFACTORY;
  } else if (points > 36 && points <= 54) {
    return PointsRatingEnum.SATISFACTORY;
  } else if (points > 54 && points <= 72) {
    return PointsRatingEnum.ABOVE_SATISFACTORY;
  } else {
    return PointsRatingEnum.EXCELLENT;
  }
};

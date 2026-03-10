import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

const fetchCitationPoints = async ({
  scopus,
  authors,
  citedAuthors,
}: {
  scopus: boolean | null;
  authors: string;
  citedAuthors: string;
}) => {
  const res = await api.get("/api/points/citation", {
    params: {
      scopus,
      researchAuthors: authors,
      citedAuthors,
    },
  });

  const data = res.data.data;
  return {
    points: +data.points.join(),
    totalPoints: {
      scopus: data.total[0],
      non_scopus: data.total[1],
    },
  };
};

export const useCitationsPoints = (
  scopus: boolean | null,
  authors: string,
  citedAuthors: string,
) => {
  const query = useQuery({
    queryKey: ["citationPoints", scopus, authors, citedAuthors],
    queryFn: () => fetchCitationPoints({ scopus, authors, citedAuthors }),
    enabled: scopus !== null,
    staleTime: 5 * 60 * 1000,
  });

  return {
    points: query.data?.points ?? 0,
    totalPoints: query.data?.totalPoints ?? {
      scopus: null,
      non_scopus: null,
    },
    ...query,
  };
};

const fetchCompletedPoints = async () => {
  const res = await api.get("/api/completed/points");
  return res.data.data.points;
};

export const useGetCompletedPoints = (authors: string | undefined) => {
  const query = useQuery({
    queryKey: ["completedPoints"],
    queryFn: fetchCompletedPoints,
    enabled: !!authors,
    staleTime: 5 * 60 * 1000,
  });

  const arrAuthors = authors?.split(",");
  const totalPoints = query.data ?? 0;
  const points =
    arrAuthors?.length === 1
      ? totalPoints
      : totalPoints / (arrAuthors?.length || 1);

  return {
    points,
    total: totalPoints,
    ...query,
  };
};

type PointsType = {
  school_level: string;
  research_involvement: string | undefined;
  funded_research: boolean;
};

const fetchOtherResearchPoints = async (props: PointsType) => {
  const res = await api.post("/api/other-research-involvement/points", props);
  return res.data.data.points;
};

export const useGetOtherResearchPoints = (props: PointsType) => {
  const isPropsValid =
    !!props.school_level && props.research_involvement !== undefined;

  const query = useQuery({
    queryKey: ["otherResearchPoints", props],
    queryFn: () => fetchOtherResearchPoints(props),
    enabled: isPropsValid,
    staleTime: 5 * 60 * 1000,
  });

  return {
    points: query.data ?? 0,
    ...query,
  };
};

type PropertyType = {
  type: string | undefined;
  acceptance_date: string | undefined;
  publication_date: string | undefined;
  grant_date: string | undefined;
  isLNU?: boolean;
};

export const useGetIntellectualPropertyPoints = ({
  type,
  acceptance_date,
  publication_date,
  grant_date,
  isLNU,
}: PropertyType) => {
  const status =
    type === "patent/invention" || type === "utility model"
      ? acceptance_date
        ? "accepted"
        : publication_date
          ? "published"
          : grant_date
            ? "granted"
            : undefined
      : undefined;

  const { data: points = 0, ...pointsQuery } = useQuery({
    queryKey: ["intellectualPropertyPoints", type, status, isLNU],
    queryFn: async () => {
      const res = await api.post("/api/intellectual-property/points", {
        type,
        status,
        isLNU,
      });
      return res.data.data;
    },
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allPoints = [], ...allPointsQuery } = useQuery({
    queryKey: ["allUtilityPatentPoints"],
    queryFn: async () => {
      const res = await api.get("/api/utility-patent/points");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    points,
    allPoints,
    isLoading: pointsQuery.isLoading || allPointsQuery.isLoading,
    isError: pointsQuery.isError || allPointsQuery.isError,
  };
};

export const useGetPeerReviewPoints = (
  coverage: string | undefined,
  abstract: number,
  article: number,
) => {
  const isEnabled = !!coverage && (abstract > 0 || article > 0);

  const { data: basePoint = 0, ...query } = useQuery({
    queryKey: ["peerReviewPoints", coverage, abstract, article],
    queryFn: async () => {
      const res = await api.post("/api/peer-review/points", {
        coverage,
        abstract: abstract > 0,
        article: article > 0,
      });
      return res.data.data;
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  let points = 0;
  if (article > 0) {
    points = article * basePoint;
  } else if (abstract > 0) {
    points = abstract * basePoint;
  }

  return {
    points,
    total: basePoint,
    ...query,
  };
};

export const useGetPresentedPoints = (
  coverage: string | undefined,
  category: string | undefined,
) => {
  const isEnabled = !!coverage && !!category;

  const { data: points = 0, ...query } = useQuery({
    queryKey: ["presentedPoints", coverage, category],
    queryFn: async () => {
      const res = await api.post("/api/participation-to-research/points", {
        coverage,
        category,
      });
      return res.data.data;
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  return { points, ...query };
};

export const usePublishedResearchPoints = (
  coverage: string | undefined,
  authors: string | undefined,
  isScopus?: boolean
) => {
  const isEnabled = !!coverage;

  const { data: totalPoints = 0, ...query } = useQuery({
    queryKey: ["publishedResearchPoints", coverage],
    queryFn: async () => {
      const res = await api.post("/api/published/points", { coverage, isScopus });
      return res.data.data;
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const authorList = authors?.split(",") ?? [];
  const dividedPoints =
    authorList.length > 1 ? totalPoints / authorList.length : totalPoints;

  return {
    points: dividedPoints,
    total: totalPoints,
    ...query,
  };
};


export const useGetParticipationPoints = (
  coverage: string | undefined,
  category: string | undefined,
  date: string | Date | undefined,
) => {
  const isEnabled = !!coverage && !!category && !!date;

  const { data: points = 0, ...query } = useQuery({
    queryKey: ["participationPoints", coverage, category, date],
    queryFn: async () => {
      const res = await api.post("/api/participation-to-research/points", {
        coverage,
        category,
        date,
      });
      return res.data.data;
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  return { points, ...query };
};

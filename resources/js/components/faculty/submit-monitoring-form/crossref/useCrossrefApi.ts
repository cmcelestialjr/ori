import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

type PublishedResearchApiType = {
  title: string;
  editor_publisher: string;
  article_link: string;
  issno_vol_pages: string;
  date: Date;
  journal_name: string;
  num_citations_date: number;
};

const fetchPublishedResearch = async (
  research_title?: string,
  author?: string,
) => {
  if (!research_title || !author)
    throw new Error("Research title and author are required");

  const res = await api.post("/api/crossref/api/published-research", {
    research_title,
    author,
  });

  const data = res.data.data;

  return {
    ...data,
    issno_vol_pages: data.issno_vol_pages[0],
  } as PublishedResearchApiType;
};

const useCrossrefApi = (research_title?: string, author?: string) => {
  return useQuery({
    queryKey: ["published-research", research_title, author],
    queryFn: () => fetchPublishedResearch(research_title, author),
    enabled: !!research_title && !!author,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
};

export default useCrossrefApi;
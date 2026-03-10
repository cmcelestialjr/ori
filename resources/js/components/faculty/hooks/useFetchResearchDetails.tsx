import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

type ResearchType = { type: string; id: number };
type ResearchField = { field: string; id: number };
type SocioEconomicObjective = { type: string; id: number };

export type DataType = {
  research_type: ResearchType[];
  research_field: ResearchField[];
  socio_economic_objective: SocioEconomicObjective[];
};

const fetchResearchDetails = async (): Promise<DataType> => {
  const res = await api.get("/api/research-details");
  return res.data.data;
};

const useFetchResearchDetails = () => {
  return useQuery<DataType, Error>(["researchDetails"], fetchResearchDetails, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};

export default useFetchResearchDetails;

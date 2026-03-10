import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { PaginationTableType } from "../../admin/types";
import api from "../../api/axios";
import axios from "axios";
import { researchMonitoringForm } from "../../shared/types/types";

type CoordinatorDataType = {
  forms: {
    data: researchMonitoringForm[];
    paginationData: PaginationTableType;
  };
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
};
type FacultyDataType = {
  forms: {
    data: researchMonitoringForm[];
    paginationData: PaginationTableType;
  };
  totalPoints: number;
  rating: string;
};

type ParamsType = {
  page: number;
  search: string;
  status: string;
};
type MonitoringFormContextType = {
  coordinatorData: CoordinatorDataType;
  facultyData: FacultyDataType;
  loading: boolean;
  error: string;
  refetchData: () => void;
  params: ParamsType;
  setParams: Dispatch<SetStateAction<ParamsType>>;
};

type childrenType = { children: React.ReactNode };

export const MonitoringFormsContext =
  createContext<MonitoringFormContextType | null>(null);

const MonitoringFormsContextProvider = ({ children }: childrenType) => {
  const [coordinatorData, setCoordinatorData] = useState<CoordinatorDataType>({
    forms: {
      data: [],
      paginationData: {
        current_page: 1,
        total: 1,
        last_page: 0,
        links: [{ url: "", active: false, label: "" }],
      },
    },
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
  });

  const [facultyData, setFacultyData] = useState<FacultyDataType>({
    forms: {
      data: [],
      paginationData: {
        current_page: 1,
        last_page: 0,
        total: 1,
        links: [{ url: "", active: false, label: "" }],
      },
    },
    totalPoints: 0,
    rating: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({
    page: 1,
    status: "all",
    search: "",
  });
  const [shouldRefetch, setShouldRefetch] = useState(false);
  
  // We remove the dependency on 'roles' for data mapping to prevent bugs
  const refetchData = () => {
    setShouldRefetch(!shouldRefetch);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchMonitoringForms = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/research-monitoring-forms`, {
          params: { ...params },
          signal: controller.signal,
        });

        const responseData = response.data.data;

        
        if (responseData.hasOwnProperty("totalPending")) {
          setCoordinatorData({
            ...responseData,
            forms: {
              data: [...responseData.forms.data],
              paginationData: { ...responseData.forms },
            },
          });
        } 
        
        else if (responseData.hasOwnProperty("totalPoints")) {

          setFacultyData({
            ...responseData,
            forms: {
              data: [...responseData.forms.data],
              paginationData: { ...responseData.forms },
            },
          });
        }
        

        else {
        }

        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message);
        }
        setLoading(false);
      }
    };

    fetchMonitoringForms();

    return () => controller.abort();
  }, [shouldRefetch, params.page]);

  return (
    <MonitoringFormsContext.Provider
      value={{
        coordinatorData,
        facultyData,
        error,
        loading,
        refetchData,
        params,
        setParams,
      }}
    >
      {children}
    </MonitoringFormsContext.Provider>
  );
};

export default MonitoringFormsContextProvider;
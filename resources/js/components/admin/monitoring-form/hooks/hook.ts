import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import { ArchivedResearch, BackupFilesType } from "../../../shared/types/types";
import { ResearchMonitoringForm } from "../../types";
import FacultyDashboard from "../../../faculty/FacultyDashboard";
import { PayloadType } from "../../../faculty/submit-monitoring-form/CreateResearchMonitoringForm";

export type LineChartType = {
  name: string;
  total_submission: number;
  "completed research (unpublished)": number;
  "presented research": number;
  "published research/creative works": number;
  "citations of published research": number;
  "participation to research/seminar/activity": number;
  "intellectual property (utility model/patent/copyright/trademark/industrial)": number;
  "refereeing in peer-reviewed journal": number;
  "other research involvement (panel/statistician/editor/adviser/internal/external funded research)": number;
  "creative works": number;
}[];

type CreateResearchMonitoringForm = {
  payload: PayloadType;
  fieldKey:
    | "completed"
    | "presented"
    | "published"
    | "citations"
    | "participation"
    | "intellectual"
    | "peerjournal"
    | "otherresearch";
};

export type BarChartType = {
  name: string;
  no_poverty: number;
  zero_hunger: number;
  "good_health_and_well-being": number;
  quality_education: number;
  gender_equality: number;
  clean_water_and_sanitation: number;
  affordable_and_clean_energy: number;
  decent_work_and_economic_growth: number;
  "industry,_innovation,_and_infrastructure": number;
  reduced_inequalities: number;
  sustainable_cities_and_communities: number;
  responsible_consumption_and_production: number;
  climate_action: number;
  life_below_water: number;
  life_on_land: number;
  "peace,_justice,_and_strong_institutions": number;
  partnerships_for_the_goals: number;
}[];

type CollegeChartType = {
  year: string;
  total_submission: number;
}[];

export type ChartsType = {
  default: LineChartType;
  CAS: CollegeChartType;
  CME: CollegeChartType;
  COE: CollegeChartType;
};

type AdminDashboardType = {
  total_users: number;
  highest_points: {
    id: number;
    name: string;
    total_points: number;
  };
  total_count: number;
  total_evaluated: number;
  recent_approved: ResearchMonitoringForm[];
  charts: ChartsType;
};

export type FacultyDashboard = {
  recent: ResearchMonitoringForm[];
  totalPoints: number;
  totalSubmission: number;
  rating: string;
};

export const useFacultyDashboard = () => {
  const { data, ...query } = useQuery<FacultyDashboard>({
    queryKey: ["facultyDashboard"],
    queryFn: async () => {
      const res = await api.get("/api/faculty-dashboard");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { data, ...query };
};

export const useFacultyMonitoringForm = () => {
  const { data, ...query } = useQuery<{
    forms: ResearchMonitoringForm[];
    enable: boolean;
  }>({
    queryKey: ["facultyMonitoringForm"],
    queryFn: async () => {
      const res = await api.get("/api/faculty-monitoring-forms");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { data, ...query };
};

export const useMutationResearchMonitoringForm = () => {
  const queryClient = useQueryClient();

  const Create = () => {
    return useMutation({
      mutationFn: async ({
        fieldKey,
        payload,
      }: CreateResearchMonitoringForm) => {
        await api.post("/api/" + fieldKey, payload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["facultyDashboard"]);
        queryClient.invalidateQueries(["coordinatorDashboard"]);
        queryClient.invalidateQueries(["facultyMonitoringForm"]);
      },
      onError: (error) => {
        console.error("Error saving form:", error);
      },
    });
  };

  const Delete = (id: number) => {
    return useMutation({
      mutationFn: async () => {
        await api.delete("/api/research-monitoring-form/" + id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["adminSubmissions"]);
        queryClient.invalidateQueries(["facultyDashboard"]);
        queryClient.invalidateQueries(["facultyMonitoringForm"]);
      },
      onError: (error) => {
        console.error("Error deleting research:", error);
      },
    });
  };

  return { Delete, Create };
};

export const useArchivedResearch = <P>(params: P) => {
  const { data: archivedResearch = [], ...query } = useQuery<
    ArchivedResearch[]
  >({
    queryKey: ["archivedResearch", params],
    queryFn: async () => {
      const res = await api.get("/api/archives", { params: params });
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { archivedResearch, ...query };
};

export const useArchiveResearchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.put("/api/archive-research");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminSubmissions"]);
      queryClient.invalidateQueries(["archivedResearch"]);
      queryClient.invalidateQueries(["facultyArchived"]);
      queryClient.invalidateQueries(["facultyDashboard"]);
    },
    onError: (error) => {
      console.error("Error archiving research:", error);
    },
  });
};

export const useResearchSubmission = () => {
  const { data: submissions = [], ...query } = useQuery<
    ResearchMonitoringForm[]
  >({
    queryKey: ["adminSubmissions"],
    queryFn: async () => {
      const res = await api.get("/api/admin-submissions");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { submissions, ...query };
};

export const useAdminDashboard = () => {
  const { data, ...query } = useQuery<AdminDashboardType>({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const res = await api.get("/api/admin-dashboard");
      return res.data.data;
    },

    staleTime: 5 * 60 * 1000,
  });

  return { data, ...query };
};

export const useFacultyArchive = <P>(params: P) => {
  const { data: archivedResearch = [], ...query } = useQuery<
    Omit<ArchivedResearch, "users">[]
  >({
    queryKey: ["facultyArhived", params],
    queryFn: async () => {
      const res = await api.get("/api/faculty-archives", { params: params });
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { archivedResearch, ...query };
};

export const useGetBackupList = () => {
  const { data: backupList = [], ...query } = useQuery<BackupFilesType[]>({
    queryKey: ["backupList"],
    queryFn: async () => {
      const res = await api.get("/api/backup-list");

      return res.data.data;
    },

    staleTime: 5 * 60 * 1000,
  });

  return { backupList, ...query };
};

export const useMutateBackup = () => {
  const queryClient = useQueryClient();

  const CreateBackup = () => {
    const {
      mutate: createBackup,
      isLoading,
      isError,
      error,
    } = useMutation(
      async () => {
        const res = await api.get("/api/backup");
        return res.data.data;
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(["backupList"]);
          window.open(data, "_blank");
        },
        onError: (err) => {
          console.error("Error creating backup:", err);
        },
      },
    );

    return { createBackup, isLoading, isError, error };
  };

  const DeleteBackup = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await api.delete("/api/backup/" + id);
        return res.data;
      },

      onSuccess: () => {
        queryClient.invalidateQueries(["backupList"]);
      },
      onError: (err) => {
        console.error("Error deleting backup:", err);
      },
    });
  };

  const DownloadBackup = () => {
    return useMutation({
      mutationFn: async (id: number | null) => {
        const res = await api.get("/api/download-backup/" + id);
        return res.data.data;
      },
      onSuccess: (data) => {
        window.open(data, "_blank");
      },
      onError: (err) => {
        console.error("Error downloading backup:", err);
      },
    });
  };

  const RestoreBackup = () => {
    return useMutation({
      mutationFn: async (backupFile: string) => {
        const res = await api.post("/api/restore-backup/", {
          backup_file: backupFile,
        });
        return res.data.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        queryClient.invalidateQueries(["adminSubmissions"]);
        queryClient.invalidateQueries(["adminDashboard"]);
        queryClient.invalidateQueries(["facultyDashboard"]);
        queryClient.invalidateQueries(["facultyMonitoringForm"]);
        queryClient.invalidateQueries(["archivedResearch"]);
        queryClient.invalidateQueries(["facultyArchived"]);
        queryClient.invalidateQueries(["facultyDashboard"]);
      },
      onError: (err) => {
        console.error("Error restoring backup:", err);
      },
    });
  };

  return { CreateBackup, DeleteBackup, DownloadBackup, RestoreBackup };
};

const uploadFiles = async (files: File[]) => {
  const formImage = new FormData();
  for (const file of files) {
    formImage.append("evidence_path[]", file);
  }

  const res = await api.post<{ data: string[] }>(
    "/api/file-upload-private",
    formImage,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data.data;
};

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: uploadFiles,
  });
};

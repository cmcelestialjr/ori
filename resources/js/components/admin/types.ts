export type UserType = {
  id: number;
  fname: string;
  lname: string;
  mi: string;
  suffix: string;
  image_path: string | undefined;
  academic_rank: string;
  unit: string;
  college: string;
  email: string;
  roles: {
    name: string;
  }[];
  research_monitoring_form: {
    status: string;
    points: { points: number };
  }[];
};

export type UserAdminType = {
  total_cas: number;
  total_coe: number;
  total_cme: number;
  users: UserDataTable[];
};

export type PaginationTableType = {
  current_page: number;
  last_page: number;
  total: number;
  links: [
    {
      url: null | string;
      label: string | number;
      active: boolean;
    },
  ];
};

export const PointsRatingEnum = {
  POOR: "poor",
  BELOW_SATISFACTORY: "below satisfactory",
  SATISFACTORY: "satisfactory",
  ABOVE_SATISFACTORY: "above satisfactory",
  EXCELLENT: "excellent",
};

export type UserDataTable = {
  id: number;
  name: string;
  academic_rank: string;
  unit: string;
  college: string;
  email: string;
  coordinator: boolean;
  is_admin: boolean;
  totalPoints: number | null;
  rating: string;
};

export type ErrorMessages = {
  fname?: string;
  lname?: string;
  mi?: string;
  college?: string;
  unit?: string;
  academic_rank?: string;
  email?: string;
  password?: string;
  [key: string]: string | undefined;
};

// monitoring form
export interface ResearchMonitoringResponse {
  data: ResearchMonitoringForm[];
}

export interface ResearchMonitoringForm {
  id: number;
  research_involvement_type_id: number;
  users_id: number;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string;
  evaluated_at: string | null;
  created_at: string;
  updated_at: string;
  points: Points;
  sdg_mappings: SDGMapping[];
  agenda_mappings: AgendaMapping[];
  users: User;
  researchinvolvement: ResearchInvolvement;
}

export interface Points {
  id: number;
  points: number;
  rating: string;
  researchmonitoringform_id: number;
}

export interface SDGMapping {
  id: number;
  name: string;
  image_path: string;
  pivot: SDGPivot;
}

export interface SDGPivot {
  researchmonitoringform_id: number;
  sdgmapping_id: number;
}

export interface AgendaMapping {
  id: number;
  name: string;
  image_path: string;
  pivot: AgendaPivot;
}

export interface AgendaPivot {
  researchmonitoringform_id: number;
  agendamapping_id: number;
}

export interface User {
  id: number;
  fname: string;
  lname: string;
  mi: string;
  name: string;
  suffix: string | null;
  image_path: string;
  academic_rank: string;
  unit: string;
  college: string;
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ResearchInvolvement {
  id: number;
  research_involvement_type: string;
}

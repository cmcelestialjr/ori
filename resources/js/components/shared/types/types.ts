export type researchMonitoringForm = {
  id: number;
  research_involvement_type_id: number;
  users_id: number;
  status: string;
  reviewed_by?: string | undefined;
  reviewed_at?: string | undefined;
  evaluated_at: Date | undefined;
  created_at: Date;
  updated_at: Date;
  researchdocuments: Researchdocument[];
  researchinvolvement: ResearchInvolvementType;
  points: Points;
  users: Users;
};

export type CompletedResearchEntities = {
  title: string;
  authors: string;
};

export type ArchivedResearch = {
  id: number;
  research_involvement_type_id: number;
  users_id: number;
  status: string;
  reviewed_by: string;
  reviewed_at: Date | string;
  evaluated_at: Date | string;
  rejected_message: string | null;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
  researchinvolvement: {
    id: number;
    research_involvement_type: string;
  };
  points: {
    researchmonitoringform_id: number;
    points: number;
    rating: string;
    id: number;
  };
  users: {
    id: number;
    name: string;
    college: string;
  };
};

export type PresentedResearchEntities = {
  presenter_name: string;
  presentation_title: string;
  date_presented: string;
  conference_name: string;
  conference_place: string;
  conference_organization: string;
  conference_type: string;
};

export const RoleEnum = {
  FACULTY: "faculty",
  RESEARCH_COORDINATOR: "research-coordinator",
  ADMIN: "admin",
} as const;

export type MonitoringFormDetailsType = {
  id: number;
  users: Users;
  status: string;
  rejected_message?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  researchinvolvement: ResearchInvolvementType;
  publishedresearchprod: Publishedresearchprod;
  presentedresearchprod: Presentedresearchprod;
  ongoingresearchprod: Ongoingresearchprod;
  completedresearchprod: Completedresearchprod;
  attendancetoresearch: ResearchAttendance;
  citations: CitationsType;
  otherresearch: OtherResearchType;
  peerreview: PeerReviewType;
  intellectualproperty: IntellectualPropertyType;
  researchdocuments: Researchdocument[];
  points: Points;
};

export type OtherResearchType = {
  research_involvement: string;
  research_title: string | null;
  fund_source_nature: string;
  date: string;
  researchmonitoringform_id: number;
};

export type PeerReviewType = {
  name: string;
  journal_name: string;
  article_title: string;
  article_reviewed: number;
  abstract_title: string;
  abstract_reviewed: number;
  coverage: string;
  date_reviewed: string;
  organization: string;
  researchmonitoringform_id: number;
};
export type IntellectualPropertyType = {
  property_type: string;
  title: string;
  owner_name: string;
  processor_name: string;
  document_id: string;
  registration_date: string;
  acceptance_date: string;
  publication_date: string;
  grant_date: string;
  expiry_date: string;
  researchmonitoringform_id: number;
};

export type User = {
  academic_rank: string;
  college: string;
  created_at?: Date | null;
  deleted_at?: Date | null;
  email: string;
  fname: string;
  id: number;
  image_path: string | undefined;
  lname: string;
  mi: string;
  suffix: string;
  unit: string;
  updated_at?: Date | null;
  roles: {
      id?: number;
      name: string;
    }[];
};

export type BackupFilesType = {
  id: number;
  file_path: string;
  file_name: string;
  file_size: string;
  created_at: Date;
};

export type ResearchInvolvementType = {
  id: number;
  research_involvement_type: string;
  enable: boolean;
};

export type Researchdocument = {
  id: number;
  file_path: string;
  status: string;
  researchmonitoringform_id: number;
  created_at: Date;
  updated_at: Date;
};
export type Research = {
  id: number;
  title: string;
  authorship_nature: string;
  authors: string;
  user_id: number;
  socio_economic_objective_id: number | null;
  research_field_id: number | null;
  research_type_id: number | null;
};

export const STATUS_TYPE = {
  APPROVED: "approved",
  REJECT: "rejected",
  PENDING: "pending",
  EVALUATED: "evaluated",
};

export const COVERAGES = {
  UNIT_DEPARTMENT: "unit/department",
  COLLEGE_WIDE: "college-wide",
  UNIVERSITY_WIDE: "university-wide",
  REGIONAL_NATIONAL: "regional/national",
  INTERNATIONAL: "international",
};

export type CitationsType = {
  cited_authors: string;
  cited_article_title: string;
  research_title: string;
  journal_title: string;
  issno_vol_pages: string;
  authors: string;
  date: string | Date;
  publisher_name: string;
  url_link: string;
  scopus_link: string;
  researchmonitoringform_id: number;
};

export type StatusType = {
  status: "pending" | "approved" | "evaluated" | "rejected";
};

export type Ongoingresearchprod = {
  stage_research_production: string;
  target_date_completion: Date;
  nature_fund_source: string;
};
export type Presentedresearchprod = {
  id: number;
  presenter_name: string;
  presentation_title: string;
  date_presented: string;
  conference_name: string;
  conference_type: string;
  conference_nature: string;
  conference_place: string;
  conference_organization: string;
  researchmonitoringform_id: number;
  created_at: Date;
  updated_at: Date;
};

export type Publishedresearchprod = {
  date: Date;
  coverage: string;
  indexing: string;
  journal_name: string;
  issno_vol_pages: string;
  editor_publisher: string;
  article_link: string;
  scopus_link: string;
  num_citations_date: number;
  research: Research;
  created_at: Date;
  updated_at: Date;
  researchmonitoringform_id: number;
};

export type Completedresearchprod = {
  date_completed: Date;
  nature_fund_source: string;
  target_date_publication: string | Date | undefined;
  researchmonitoringform_id: number;
  research: Research;
};

export enum FundSourceNatureEnum {
  LNU_FUNDED_INITIATED = "internal funded research",
  EXTERNALLY_FUNDED = "external funded research",
  PERSONAL = "personal",
}

export type ResearchAttendance = {
  date: string;
  organizer: string;
  research_title: string;
  coverage: string;
  attendance_nature: string;
  fund_source_nature: string;
  conference_type: string;
  place: string;
  researchmonitoringform_id: number;
};
export type Points = {
  id: number;
  researchmonitoringform_id: number;
  points: number;
  rating: string;
  created_at: Date;
  updated_at: Date;
};
export type Users = {
  id: number;
  fname: string;
  lname: string;
  mi: string;
  name: string;
  suffix: null;
  image_path: string;
  academic_rank: string;
  unit: string;
  college: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
};

export type AgendaMapping = {
  id: number;
  name: string;
  image_path: string;
};

export type SDGMapping = {
  id: number;
  name: string;
  description: string;
  image_path: string;
};

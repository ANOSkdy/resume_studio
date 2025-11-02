export interface IHistoryEntry {
  year: string;
  month: string;
  desc: string;
  status: string; // "入学" | "卒業" | "入社" など
}

export interface IQualificationEntry {
  year: string;
  month: string;
  desc: string;
}

export interface IResumeFormData {
  photo: string | null;
  name: string;
  name_furigana: string;
  birth_date: string;
  gender: "選択しない" | "男" | "女";

  address_furigana: string;
  address_postal_code: string;
  address_main: string;
  phone: string;
  email: string;

  same_as_current_address: boolean;
  contact_address_furigana: string;
  contact_address_postal_code: string;
  contact_address_main: string;
  contact_phone: string;
  contact_email: string;

  history: IHistoryEntry[];
  qualifications: IQualificationEntry[];

  q1_resume: string;
  q2_resume: string;
  q3_resume: string;
  q4_resume: string;
  q5_resume: string;
  generated_resume_pr: string;

  special_requests: string;

  q1_cv: string;
  q2_cv: string;
  q3_cv: string;
  q4_cv: string;
  q5_cv: string;

  generated_cv_summary: string;
  generated_cv_details: string;
  generated_cv_skills: string;
  generated_cv_pr: string;
  generated_cv_speciality: string;
}

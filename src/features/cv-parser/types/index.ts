export interface CvField {
  key: string;
  label: string;
}

export const CV_FIELDS: CvField[] = [
  { key: "name", label: "Họ và tên" },
  { key: "phone", label: "SĐT" },
  { key: "email", label: "Email" },
  { key: "location", label: "Địa chỉ" },
  { key: "current_company", label: "Công ty hiện tại" },
  { key: "current_title", label: "Vị trí hiện tại" },
  { key: "years_exp", label: "Số năm KN" },
  { key: "skills", label: "Skills / Tech Stack" },
  { key: "education", label: "Học vấn" },
  { key: "expected_salary", label: "Lương mong muốn" },
  { key: "summary", label: "Tóm tắt nhanh" },
];

export type ParsedCv = Record<string, string | string[] | number | null>;

export function mapResumePlaceholders(src: any) {
  return {
    date_created: src.date_created ?? "",
    name_furigana: src.name_furigana ?? "",
    name: src.name ?? "",
    photo: src.photo ?? "",
    birth_year: src.birth_year ?? "",
    birth_month: src.birth_month ?? "",
    birth_day: src.birth_day ?? "",
    age: src.age ?? "",
    address_furigana: src.address_furigana ?? "",
    address_postal_code: src.address_postal_code ?? "",
    address_main: src.address_main ?? "",
    phone: src.phone ?? src.contacts?.phone ?? "",
    email: src.email ?? src.contacts?.email ?? "",
    contact_address_furigana: src.contact_address_furigana ?? "",
    contact_address_postal_code: src.contact_address_postal_code ?? "",
    contact_address_main: src.contact_address_main ?? "",
    contact_phone: src.contact_phone ?? "",
    contact_email: src.contact_email ?? "",
    generated_pr: src.generated_pr ?? src.self_pr_resume ?? "",
    special_requests: src.special_requests ?? "",
  };
}

export function mapCvPlaceholders(src: any) {
  return {
    date_created: src.date_created ?? "",
    name: src.name ?? "",
    work_summary: src.work_summary ?? "",
    work_details: src.work_details ?? "",
    skills: Array.isArray(src.skills) ? src.skills.join(", ") : (src.skills ?? ""),
    self_pr_cv: src.self_pr_cv ?? src.generated_pr ?? "",
  };
}

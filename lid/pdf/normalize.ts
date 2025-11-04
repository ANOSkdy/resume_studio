// lib/pdf/normalize.ts
export function toResumePayload(form: any) {
  return {
    name: form.fullName ?? form.name ?? "",
    contacts: {
      email: form.email ?? "",
      phone: form.phone ?? "",
      address: form.address ?? "",
    },
    educations: (form.educations ?? []).map((e: any) => ({
      school: e.school, degree: e.degree, period: e.period,
    })),
    jobs: (form.jobs ?? form.workHistory ?? []).map((j: any) => ({
      company: j.company, role: j.role, period: j.period, summary: j.summary,
    })),
  };
}

export function toCvPayload(form: any) {
  return {
    name: form.fullName ?? form.name ?? "",
    summary: form.summary ?? "",
    skills: Array.isArray(form.skills) ? form.skills : (form.skills ?? "").split(",").map((s: string) => s.trim()).filter(Boolean),
    projects: (form.projects ?? []).map((p: any) => ({
      name: p.name, role: p.role, period: p.period, detail: p.detail, tech: p.tech ?? [],
    })),
  };
}

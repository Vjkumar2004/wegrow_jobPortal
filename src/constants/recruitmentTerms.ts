export const CURRENT_TERMS_VERSION = "2026.1";

export interface TermClause {
  number: number;
  title: string;
  summary: string;
  content: string;
  isCrucial?: boolean;
}

export const RECRUITMENT_TERMS_CLAUSES: TermClause[] = [
  {
    number: 1,
    title: "Scope of Service",
    summary: "Recruitment facilitation and pipeline support.",
    content:
      "WeGrow Jobz provides recruitment support, including candidate sourcing, initial screening, shortlisting and interview coordination according to the selected package.",
    isCrucial: false,
  },
  {
    number: 2,
    title: "Employer's Responsibility",
    summary: "Final hiring decision and statutory employment compliance.",
    content:
      "The final candidate selection, background verification, salary negotiation, employment agreement and appointment decision are the responsibility of the hiring company.",
    isCrucial: true,
  },
  {
    number: 3,
    title: "Post-Joining Responsibility",
    summary: "Workplace conduct and ongoing employment management.",
    content:
      "Once a candidate joins the company, WeGrow Jobz is not responsible for the candidate's personal behaviour, attitude, discipline, workplace conduct, job performance or employment-related disputes.",
    isCrucial: true,
  },
  {
    number: 4,
    title: "No Guarantee of Candidate Performance",
    summary: "Facilitation without warranty of performance.",
    content:
      "WeGrow Jobz facilitates recruitment but does not guarantee future candidate performance, long-term retention or workplace behaviour.",
    isCrucial: true,
  },
  {
    number: 5,
    title: "Candidate Information",
    summary: "Data verification and employer due diligence.",
    content:
      "Candidate information is shared based on the details provided by candidates and the verification checks included in the selected package. Employers must independently verify important credentials before hiring.",
    isCrucial: false,
  },
  {
    number: 6,
    title: "Payment & Replacement Policy",
    summary: "Package commercial agreements and terms.",
    content:
      "Package pricing, payment terms, cancellation conditions and replacement policies are governed by the specific package agreement.",
    isCrucial: false,
  },
  {
    number: 7,
    title: "Limitation of Responsibility",
    summary: "Legal boundaries of consultancy scope.",
    content:
      "WeGrow Jobz is not responsible for events outside its agreed recruitment services. This clause does not exclude any responsibility that cannot legally be excluded.",
    isCrucial: true,
  },
];


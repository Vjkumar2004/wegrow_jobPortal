import { Job, Company, Application, Interview, StudentProfile } from "@/types";

export const MOCK_COMPANIES: Company[] = [
  {
    id: "comp-1",
    name: "Infosys Technologies",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    description: "Global leader in next-generation digital services and consulting.",
    website: "https://infosys.com",
    industry: "Information Technology & Services",
    location: "Bengaluru, Karnataka",
    size: "100,000+ employees",
    about: "Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 56 countries to navigate their digital transformation.",
    status: "Approved",
    activeJobsCount: 14,
    joinedDate: "2023-01-15",
  },
  {
    id: "comp-2",
    name: "Tata Consultancy Services (TCS)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    description: "An IT services, consulting and business solutions organization.",
    website: "https://tcs.com",
    industry: "IT & Software Solutions",
    location: "Mumbai, Maharashtra",
    size: "500,000+ employees",
    about: "TCS is an IT services, consulting and business solutions organization partnering with many of the world’s largest businesses for the past 50 years.",
    status: "Approved",
    activeJobsCount: 22,
    joinedDate: "2023-02-10",
  },
  {
    id: "comp-3",
    name: "Tech Mahindra",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Tech_Mahindra_New_Logo.svg",
    description: "Connecting experiences and delivering next-gen technologies.",
    website: "https://techmahindra.com",
    industry: "Telecommunications & IT",
    location: "Pune, Maharashtra",
    size: "120,000+ employees",
    about: "Tech Mahindra offers innovative and customer-centric digital experiences, enabling enterprises, associates and the society to Rise.",
    status: "Approved",
    activeJobsCount: 8,
    joinedDate: "2023-04-05",
  },
  {
    id: "comp-4",
    name: "Razorpay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
    description: "The modern financial services platform powering Indian businesses.",
    website: "https://razorpay.com",
    industry: "Fintech",
    location: "Bengaluru, Karnataka",
    size: "3,000+ employees",
    about: "Razorpay is India's leading full-stack financial solutions company, providing payments and banking services to businesses of all sizes.",
    status: "Approved",
    activeJobsCount: 11,
    joinedDate: "2023-05-20",
  },
  {
    id: "comp-5",
    name: "Freshworks",
    logo: "https://asset.brandfetch.io/idgXw6gX7k/id2qF19m1l.svg",
    description: "Software that empowers businesses to delight their customers & employees.",
    website: "https://freshworks.com",
    industry: "SaaS & Cloud Computing",
    location: "Chennai, Tamil Nadu",
    size: "5,000+ employees",
    about: "Freshworks provides innovative customer engagement software for businesses of all sizes, making it easy for teams to acquire, close, and keep their customers for life.",
    status: "Approved",
    activeJobsCount: 6,
    joinedDate: "2023-06-12",
  },
  {
    id: "comp-6",
    name: "NexGen Dynamics (Pending Approval)",
    logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=128&auto=format&fit=crop&q=80",
    description: "AI-driven supply chain forecasting startup.",
    website: "https://nexgen-dynamics.example.com",
    industry: "Artificial Intelligence",
    location: "Hyderabad, Telangana",
    size: "50-100 employees",
    about: "We build enterprise intelligent automation solutions using state-of-the-art machine learning.",
    status: "Pending",
    activeJobsCount: 2,
    joinedDate: "2023-10-01",
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Graduate Software Engineer (Fresher 2025)",
    company: {
      id: "comp-1",
      name: "Infosys Technologies",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
      location: "Bengaluru / Pune / Hyderabad",
      website: "https://infosys.com",
      size: "100,000+ employees",
      industry: "IT Services",
      about: "Infosys is a global leader in next-generation digital services and consulting."
    },
    location: "Bengaluru, Karnataka",
    salaryMin: 400000,
    salaryMax: 650000,
    salaryCurrency: "₹",
    experience: "Fresher (0 - 1 yr)",
    jobType: "Full Time",
    workMode: "Hybrid",
    skills: ["Java", "Spring Boot", "React", "SQL", "Data Structures"],
    description: "We are seeking enthusiastic Graduate Software Engineers to join our global engineering development center. You will participate in intensive corporate training and be deployed into client projects building cloud-native microservices.",
    responsibilities: [
      "Develop high-quality modular code following best programming practices",
      "Participate in agile sprints, daily standups, and peer code reviews",
      "Collaborate with senior architects to understand software requirements",
      "Write unit tests and functional test suites using modern frameworks",
      "Debug system defects and implement robust patches"
    ],
    requirements: [
      "B.Tech/B.E/MCA in Computer Science, IT, or related technical disciplines",
      "Consistent academic record with 60% or 6.5 CGPA and above",
      "Foundational proficiency in object-oriented programming (Java or C++)",
      "Good understanding of RDBMS and basic SQL queries",
      "Excellent logical thinking and verbal/written communication skills"
    ],
    qualifications: ["Bachelor's or Master's in Computer Science or related degree (2024 / 2025 batch)"],
    benefits: [
      "Health & Medical Insurance for candidate and parents",
      "Continuous learning opportunities through internal campus certifications",
      "Hybrid work policy (2 days WFH)",
      "Performance incentives and annual appraisal"
    ],
    postedDate: "2024-03-24",
    deadline: "2024-04-30",
    openings: 50,
    status: "Published",
    applicantsCount: 142
  },
  {
    id: "job-2",
    title: "Frontend Developer (React / Next.js)",
    company: {
      id: "comp-4",
      name: "Razorpay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
      location: "Bengaluru, Karnataka",
      website: "https://razorpay.com",
      size: "3,000+ employees",
      industry: "Fintech",
      about: "Razorpay powers payments and business banking for over 10 million businesses in India."
    },
    location: "Bengaluru, Karnataka",
    salaryMin: 1200000,
    salaryMax: 1800000,
    salaryCurrency: "₹",
    experience: "1 - 3 yrs",
    jobType: "Full Time",
    workMode: "On-site",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
    description: "Razorpay's Checkout team is looking for a passionate Frontend Developer to build frictionless and blazing-fast payment checkout experiences seen by millions of shoppers every day.",
    responsibilities: [
      "Architect and ship user-facing features on merchant checkout and dashboard",
      "Optimize web application performance to ensure sub-second load times",
      "Collaborate with Product Managers and Designers to iterate on UX prototypes",
      "Maintain our shared UI component library and design system tokens"
    ],
    requirements: [
      "1-3 years of proven experience building production React/TypeScript web apps",
      "Deep understanding of the DOM, browser performance, and modern CSS",
      "Familiarity with state management libraries and RESTful API integrations",
      "Knowledge of web accessibility (WCAG) and cross-browser quirks"
    ],
    qualifications: ["Bachelor's in Engineering, Design or equivalent field experience"],
    benefits: [
      "Comprehensive medical insurance & wellness allowances",
      "ESOPs grant option for high performers",
      "Catered gourmet meals and snacks on campus",
      "Generous annual education stipend"
    ],
    postedDate: "2024-03-22",
    deadline: "2024-04-20",
    openings: 4,
    status: "Published",
    applicantsCount: 88
  },
  {
    id: "job-3",
    title: "Product Design Intern (UI/UX)",
    company: {
      id: "comp-5",
      name: "Freshworks",
      logo: "https://asset.brandfetch.io/idgXw6gX7k/id2qF19m1l.svg",
      location: "Chennai, Tamil Nadu",
      website: "https://freshworks.com",
      size: "5,000+ employees",
      industry: "SaaS",
      about: "Freshworks creates user-friendly SaaS products for sales, support, and IT."
    },
    location: "Chennai, Tamil Nadu",
    salaryMin: 25000,
    salaryMax: 35000,
    salaryCurrency: "₹",
    experience: "Internship / Fresher",
    jobType: "Internship",
    workMode: "Hybrid",
    skills: ["Figma", "UI/UX", "User Research", "Wireframing", "Prototyping"],
    description: "Join our design studio as a Product Design Intern where you will work side-by-side with senior product designers to craft elegant SaaS experiences for global enterprise customers.",
    responsibilities: [
      "Conduct usability tests and qualitative customer interviews",
      "Design wireframes, user flows, and high-fidelity mockups in Figma",
      "Participate in design critiques and refine prototypes based on feedback",
      "Collaborate with frontend developers to ensure design precision"
    ],
    requirements: [
      "Strong portfolio demonstrating user-centric design process and visual taste",
      "Proficiency in Figma and interactive prototyping tools",
      "Curiosity about enterprise software workflows and information architecture",
      "Good communication skills to articulate design decisions"
    ],
    qualifications: ["Currently pursuing or recently graduated in Design, HCI, or related field"],
    benefits: [
      "Monthly stipend of ₹30,000",
      "Opportunity for full-time PPO (Pre-Placement Offer) upon internship completion",
      "Mentorship from seasoned design leads",
      "Company laptop provided"
    ],
    postedDate: "2024-03-25",
    deadline: "2024-04-15",
    openings: 2,
    status: "Published",
    applicantsCount: 65
  },
  {
    id: "job-4",
    title: "Backend Engineer (Go / Node.js)",
    company: {
      id: "comp-2",
      name: "Tata Consultancy Services (TCS)",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
      location: "Remote / Hybrid",
      website: "https://tcs.com",
      size: "500,000+ employees",
      industry: "IT Solutions",
      about: "TCS enables digital business innovation for leading global enterprises."
    },
    location: "Remote, India",
    salaryMin: 800000,
    salaryMax: 1300000,
    salaryCurrency: "₹",
    experience: "2 - 4 yrs",
    jobType: "Full Time",
    workMode: "Remote",
    skills: ["Node.js", "Golang", "PostgreSQL", "Docker", "AWS", "Kafka"],
    description: "We are hiring experienced backend engineers to develop distributed systems and high-throughput data processing pipelines for our strategic enterprise cloud initiatives.",
    responsibilities: [
      "Design and maintain scalable REST and gRPC microservices",
      "Optimize complex relational queries in PostgreSQL and manage caching with Redis",
      "Implement event-driven streaming architectures with Apache Kafka",
      "Deploy and monitor containerized services on Kubernetes / AWS"
    ],
    requirements: [
      "2-4 years experience in backend engineering with Node.js, Go, or Python",
      "Strong grasp of distributed systems, concurrency, and database indexing",
      "Hands-on experience with cloud infrastructure (AWS or GCP)",
      "Proactive attitude towards unit testing and automated CI/CD"
    ],
    qualifications: ["B.E / B.Tech / M.Tech in Computer Science or related degree"],
    benefits: [
      "100% remote flexibility with home office setup reimbursement",
      "Comprehensive family health insurance",
      "Quarterly performance bonuses",
      "Flexible working hours"
    ],
    postedDate: "2024-03-20",
    deadline: "2024-04-25",
    openings: 6,
    status: "Published",
    applicantsCount: 74
  },
  {
    id: "job-5",
    title: "Associate DevOps / Cloud Engineer",
    company: {
      id: "comp-3",
      name: "Tech Mahindra",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Tech_Mahindra_New_Logo.svg",
      location: "Pune, Maharashtra",
      website: "https://techmahindra.com",
      size: "120,000+ employees",
      industry: "Telecommunications & IT",
      about: "Tech Mahindra delivers next-generation customer-centric IT services."
    },
    location: "Pune, Maharashtra",
    salaryMin: 600000,
    salaryMax: 900000,
    salaryCurrency: "₹",
    experience: "1 - 3 yrs",
    jobType: "Full Time",
    workMode: "Hybrid",
    skills: ["Docker", "Kubernetes", "Terraform", "Linux", "CI/CD", "AWS"],
    description: "Support our cloud infrastructure migration teams by automating deployment pipelines, managing Kubernetes clusters, and monitoring uptime metrics.",
    responsibilities: [
      "Automate multi-stage continuous delivery pipelines using GitHub Actions / GitLab CI",
      "Manage infrastructure as code (IaC) using Terraform",
      "Monitor cluster health with Prometheus and Grafana dashboards",
      "Assist developers with containerizing microservices"
    ],
    requirements: [
      "Solid understanding of Linux internals and shell scripting",
      "Hands-on experience with Docker container lifecycle and Kubernetes basics",
      "Basic understanding of networking, DNS, and SSL configurations",
      "AWS Certified Solutions Architect Associate is a plus"
    ],
    qualifications: ["B.E/B.Tech in Computer Science/IT/ECE"],
    benefits: [
      "Certification sponsorship program",
      "Transportation shuttle services",
      "Annual health checkup camps",
      "Rewarding career progression track"
    ],
    postedDate: "2024-03-18",
    deadline: "2024-04-18",
    openings: 5,
    status: "Published",
    applicantsCount: 52
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app-101",
    jobId: "job-1",
    jobTitle: "Graduate Software Engineer (Fresher 2025)",
    companyName: "Infosys Technologies",
    companyLogo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=128&auto=format&fit=crop&q=80",
    applicantId: "stu-1",
    applicantName: "Aarav Sharma",
    applicantEmail: "aarav.sharma@example.com",
    applicantPhone: "+91 98765 43210",
    applicantCollege: "NIT Trichy",
    applicantGradYear: "2024",
    applicantExperience: "Fresher",
    appliedDate: "2024-03-26",
    status: "Interview",
    resumeUrl: "#",
    notes: "Cleared screening round with top score in algorithm test."
  },
  {
    id: "app-102",
    jobId: "job-2",
    jobTitle: "Frontend Developer (React / Next.js)",
    companyName: "Razorpay",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80",
    applicantId: "stu-1",
    applicantName: "Aarav Sharma",
    applicantEmail: "aarav.sharma@example.com",
    applicantPhone: "+91 98765 43210",
    applicantCollege: "NIT Trichy",
    applicantGradYear: "2024",
    applicantExperience: "1.5 yrs",
    appliedDate: "2024-03-24",
    status: "Shortlisted",
    resumeUrl: "#",
    notes: "Impressive GitHub portfolio and live Next.js projects."
  },
  {
    id: "app-103",
    jobId: "job-4",
    jobTitle: "Backend Engineer (Go / Node.js)",
    companyName: "Tata Consultancy Services (TCS)",
    companyLogo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80",
    applicantId: "stu-1",
    applicantName: "Aarav Sharma",
    applicantEmail: "aarav.sharma@example.com",
    applicantPhone: "+91 98765 43210",
    applicantCollege: "NIT Trichy",
    applicantGradYear: "2024",
    applicantExperience: "1 yr",
    appliedDate: "2024-03-21",
    status: "Under Review",
    resumeUrl: "#"
  },
  {
    id: "app-104",
    jobId: "job-3",
    jobTitle: "Product Design Intern (UI/UX)",
    companyName: "Freshworks",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80",
    applicantId: "stu-2",
    applicantName: "Priya Nair",
    applicantEmail: "priya.nair@example.com",
    applicantPhone: "+91 98123 45678",
    applicantCollege: "NIFT Bangalore",
    applicantGradYear: "2025",
    applicantExperience: "Fresher",
    appliedDate: "2024-03-25",
    status: "Selected",
    resumeUrl: "#",
    notes: "Offer letter generated. Joining in May 2024."
  },
  {
    id: "app-105",
    jobId: "job-1",
    jobTitle: "Graduate Software Engineer (Fresher 2025)",
    companyName: "Infosys Technologies",
    companyLogo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=128&auto=format&fit=crop&q=80",
    applicantId: "stu-3",
    applicantName: "Rohan Varma",
    applicantEmail: "rohan.v@example.com",
    applicantPhone: "+91 91234 56789",
    applicantCollege: "BITS Pilani",
    applicantGradYear: "2024",
    applicantExperience: "Fresher",
    appliedDate: "2024-03-22",
    status: "Shortlisted",
    resumeUrl: "#"
  }
];

export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: "int-1",
    applicationId: "app-101",
    jobTitle: "Graduate Software Engineer (Fresher 2025)",
    companyName: "Infosys Technologies",
    candidateName: "Aarav Sharma",
    candidateEmail: "aarav.sharma@example.com",
    date: "2024-04-05",
    time: "11:00 AM - 12:00 PM IST",
    type: "Technical",
    meetingLink: "https://meet.google.com/wegrow-interview-demo",
    status: "Upcoming",
    notes: "Topics: Data Structures, Problem Solving, and Spring Boot basics."
  },
  {
    id: "int-2",
    applicationId: "app-102",
    jobTitle: "Frontend Developer (React / Next.js)",
    companyName: "Razorpay",
    candidateName: "Aarav Sharma",
    candidateEmail: "aarav.sharma@example.com",
    date: "2024-04-08",
    time: "02:30 PM - 03:30 PM IST",
    type: "HR Discussion",
    meetingLink: "https://meet.google.com/razorpay-hr-round",
    status: "Upcoming",
    notes: "Culture fit, salary expectations, and notice period discussion."
  },
  {
    id: "int-3",
    applicationId: "app-104",
    jobTitle: "Product Design Intern (UI/UX)",
    companyName: "Freshworks",
    candidateName: "Priya Nair",
    candidateEmail: "priya.nair@example.com",
    date: "2024-03-28",
    time: "10:00 AM - 11:00 AM IST",
    type: "Screening",
    meetingLink: "https://meet.google.com/freshworks-portfolio-eval",
    status: "Completed",
    notes: "Candidate performed exceptionally well during Figma portfolio walk-through."
  }
];

export const MOCK_STUDENT_PROFILE: StudentProfile = {
  id: "stu-1",
  name: "Vijayakumar M",
  email: "vijayakumar@example.com",
  phone: "+91 98765 43210",
  headline: "Aspiring Full Stack Developer | Computer Science & Engineering",
  bio: "Final year Computer Science student with a deep passion for modern web technologies, distributed systems, and cloud infrastructure. Active competitive programmer and open source contributor. Looking for full time opportunities in software development.",
  location: "Chennai, Tamil Nadu",
  dateOfBirth: "12 Mar 2003",
  gender: "Male",
  degreeName: "B.E Computer Science",
  experienceLevel: "Fresher",
  completionPercentage: 85,
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  checklist: [
    { label: "Personal Information", done: true },
    { label: "Education Details", done: true },
    { label: "Skills", done: true, countText: "(8/10)" },
    { label: "Add Projects", done: true, countText: "(2/2)" },
    { label: "Upload Resume", done: true },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.E Computer Science and Engineering",
      institution: "National Institute of Technology (NIT), Trichy",
      startYear: "2021",
      endYear: "2025",
      grade: "8.1 / 10.0",
      cgpa: "8.1 / 10.0"
    }
  ],
  skills: [
    "Java", "Python", "JavaScript", "React", "Node.js", "Express.js",
    "MongoDB", "MySQL", "Firebase", "Git", "HTML", "CSS", "Tailwind CSS", "Docker"
  ],
  projects: [
    {
      id: "proj-1",
      title: "MechaFinder - Mechanic Finder Platform",
      description: "A platform to find nearby mechanics with real-time location, reviews and booking.",
      link: "https://github.com/vijayakumarm/mechafinder",
      dateText: "Mar 2025",
      thumbnailUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&auto=format&fit=crop&q=80",
      technologies: ["React", "Node.js", "MongoDB", "Firebase", "Leaflet"]
    },
    {
      id: "proj-2",
      title: "Document Format Converter",
      description: "Convert PDFs, images and documents between multiple formats.",
      link: "https://github.com/vijayakumarm/doc-converter",
      dateText: "Jan 2025",
      thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&auto=format&fit=crop&q=80",
      technologies: ["Python", "Flask", "React", "Tailwind CSS"]
    }
  ],
  internships: [
    {
      id: "intern-1",
      role: "Software Developer Intern",
      company: "Bluestock Fintech",
      companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80",
      duration: "Feb 2025 - Apr 2025 (3 Months)",
      bullets: [
        "Built IPO management system with React.js and Firebase.",
        "Implemented secure authentication and real-time data handling.",
        "Worked with Python for data processing and automation."
      ],
      description: "Built IPO management system with React.js and Firebase. Implemented secure authentication and real-time data handling."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services (AWS)",
      issueDate: "Nov 2024",
      credentialUrl: "https://aws.amazon.com/verification"
    }
  ],
  resumeName: "Vijayakumar_M_Resume.pdf",
  resumeUrl: "#",
  resumeUploadDate: "Uploaded on Sep 10, 2026 - 420 KB",
  resumeFileSize: "420 KB",
  isAtsOptimized: true,
  linkedin: "https://linkedin.com/in/vijayakumarm",
  github: "https://github.com/vijayakumarm",
  careerPreferences: {
    preferredRoles: "Software Developer, Full Stack Developer",
    preferredLocations: "Chennai, Bangalore, Remote",
    employmentType: "Full Time",
    expectedSalary: "Rs 4 - 7 LPA",
    joiningTimeline: "Immediate / 1 Month"
  }
};

export const MOCK_STUDENTS_ADMIN = [
  {
    id: "stu-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    college: "NIT Trichy",
    gradYear: "2024",
    completionPercentage: 85,
    applicationsCount: 7,
    status: "Active"
  },
  {
    id: "stu-2",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    college: "NIFT Bangalore",
    gradYear: "2025",
    completionPercentage: 95,
    applicationsCount: 4,
    status: "Active"
  },
  {
    id: "stu-3",
    name: "Rohan Varma",
    email: "rohan.v@example.com",
    college: "BITS Pilani",
    gradYear: "2024",
    completionPercentage: 70,
    applicationsCount: 5,
    status: "Active"
  },
  {
    id: "stu-4",
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    college: "IIT Madras",
    gradYear: "2024",
    completionPercentage: 100,
    applicationsCount: 12,
    status: "Active"
  },
  {
    id: "stu-5",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    college: "SRM University",
    gradYear: "2023",
    completionPercentage: 40,
    applicationsCount: 1,
    status: "Suspended"
  }
];

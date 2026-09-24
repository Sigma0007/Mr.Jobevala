export const initialResume = {
  personal: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Full Stack Software Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexmorgan.dev",
    linkedin: "https://linkedin.com/in/alexmorgan-dev",
    github: "https://github.com/alexmorgan",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  },
  summary: "Results-driven Software Engineer with 6+ years of experience designing and deploying scalable web applications, microservices, and distributed cloud systems. Proven track record of improving application performance by 40% and mentoring high-performing engineering teams.",
  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React.js",
    "Node.js",
    "Express",
    "Next.js",
    "Python",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS (S3, EC2, Lambda)",
    "GraphQL",
    "Git & CI/CD",
    "Agile/Scrum"
  ],
  experience: [
    {
      id: "exp-1",
      jobTitle: "Senior Frontend Engineer",
      company: "TechScale Innovations",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "",
      isCurrent: true,
      description: "• Architected and developed a core analytics dashboard handling 2M+ daily active events with sub-second latency.\n• Led a team of 5 frontend developers, establishing modern React design systems and testing standards with 90%+ code coverage.\n• Reduced web app bundle size by 35% through dynamic code splitting and tree-shaking optimizations."
    },
    {
      id: "exp-2",
      jobTitle: "Full Stack Developer",
      company: "Nexus Digital Labs",
      location: "Austin, TX",
      startDate: "2019-06",
      endDate: "2022-02",
      isCurrent: false,
      description: "• Built robust RESTful APIs and real-time notification microservices using Node.js, Express, and Redis.\n• Collaborated with UX designers and product managers to deliver 12+ enterprise SaaS features on tight deadlines.\n• Automated deployment pipelines with GitHub Actions and AWS ECS, cutting deployment times by 60%."
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2015-08",
      endDate: "2019-05",
      description: "Graduated with Honors (GPA: 3.85/4.0). Coursework in Algorithms, Distributed Systems, Database Management, and Artificial Intelligence."
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "CloudPulse - DevOps Monitoring Platform",
      role: "Lead Developer & Architect",
      technologies: "React, Node.js, TimescaleDB, Docker, WebSockets",
      projectUrl: "https://github.com/alexmorgan/cloudpulse",
      description: "Real-time metrics monitoring SaaS with interactive charting, automated incident alerts, and customizable dashboard widgets."
    },
    {
      id: "proj-2",
      name: "SmartDoc - Real-time Collaboration Tool",
      role: "Full Stack Engineer",
      technologies: "React, Express, Socket.io, Redis, Slate.js",
      projectUrl: "https://smartdoc-demo.app",
      description: "Collaborative markdown workspace supporting multi-user simultaneous editing, version diffing, and export to PDF."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect - Associate",
      organization: "Amazon Web Services",
      issueDate: "2023-04",
      credentialUrl: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      name: "Meta Certified Front-End Developer",
      organization: "Meta / Coursera",
      issueDate: "2021-11",
      credentialUrl: "https://coursera.org/verify/meta-frontend"
    }
  ],
  languages: [
    {
      id: "lang-1",
      language: "English",
      proficiency: "Native / Bilingual"
    },
    {
      id: "lang-2",
      language: "Spanish",
      proficiency: "Professional Working"
    }
  ],
  interests: [
    "Open Source Contributing",
    "UI/UX Design Systems",
    "Cloud Architecture",
    "Marathon Running",
    "Chess"
  ]
};

export const emptyResume = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photo: ""
  },
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: []
};

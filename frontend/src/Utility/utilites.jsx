import {
  Clock,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle2,
  XCircle,
  Calculator,
  Megaphone,
  PenTool,
  Code2,
  Users,
  Car,
  HeadphonesIcon,
  HeartPulse,
  Briefcase,
} from "lucide-react";

export const statusConfig = {
  pending: {
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: Clock,
    name: "Pending",
  },
  reviewed: {
    color: "bg-purple-50 text-purple-600 border-purple-100",
    icon: Eye,
    name: "Reviewed",
  },
  shortlisted: {
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
    icon: Bookmark,
    name: "Shortlisted",
  },
  interview: {
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: Calendar,
    name: "Interview",
  },
  hired: {
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: CheckCircle2,
    name: "Hired",
  },
  rejected: {
    color: "bg-red-50 text-red-600 border-red-100",
    icon: XCircle,
    name: "Rejected",
  },
};

export const workModeType = [
  { label: "On-site", value: "on-site" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

export const jobType = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
];

export const SalaryRangeType = [
  { label: "Any Salary", value: "Any Salary" },
  { label: "₹0 - ₹30k", value: "0-30000" },
  { label: "₹30k - ₹60k", value: "30000-60000" },
  { label: "₹60k - ₹100k", value: "60000-100000" },
  { label: "₹100k+", value: "100000+" },
];

export const ExperienceType = [
  { label: "0-1 year", value: "0-1" },
  { label: "1-3 years", value: "1-3" },
  { label: "3-5 years", value: "3-5" },
  { label: "5-10 years", value: "5-10" },
  { label: "10+ years", value: "10+" },
];

export const CATEGORIES = [
  {
    title: "Accounting / Finance",
    value: "accounting-finance",
    count: "2 open positions",
    icon: Calculator,
  },
  {
    title: "Marketing",
    value: "marketing",
    count: "86 open positions",
    icon: Megaphone,
  },
  {
    title: "Design",
    value: "design",
    count: "43 open positions",
    icon: PenTool,
  },
  {
    title: "Development",
    value: "development",
    count: "12 open positions",
    icon: Code2,
  },
  {
    title: "Human Resource",
    value: "human-resource",
    count: "55 open positions",
    icon: Users,
  },
  {
    title: "Automotive Jobs",
    value: "automotive-jobs",
    count: "2 open positions",
    icon: Car,
  },
  {
    title: "Customer Service",
    value: "customer-service",
    count: "2 open positions",
    icon: HeadphonesIcon,
  },
  {
    title: "Health and Care",
    value: "health-and-care",
    count: "25 open positions",
    icon: HeartPulse,
  },
  {
    title: "Project Management",
    value: "project-management",
    count: "92 open positions",
    icon: Briefcase,
  },
];

export const EXPERIENCE_LEVELS = [
  {
    label: "Entry Level (0-2 yrs)",
    value: "0-2",
  },
  {
    label: "Mid Level (3-5 yrs)",
    value: "3-5",
  },
  {
    label: "Senior (5+ yrs)",
    value: "5-plus",
  },
];

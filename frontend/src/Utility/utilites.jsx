import {
  Clock,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle2,
  XCircle,
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

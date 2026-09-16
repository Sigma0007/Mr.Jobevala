import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  FileText,
  Briefcase,
  UserCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { useSocket } from "../context/SocketContext";

// Helper for human-readable relative time
const formatTimeAgo = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useSocket();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredNotifications =
    activeFilter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markAsRead(item._id);
    }
    setIsOpen(false);

    if (item.link) {
      navigate(item.link);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "profile":
        return {
          icon: UserCheck,
          bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        };
      case "application":
        return {
          icon: FileText,
          bg: "bg-blue-50 text-blue-600 border-blue-100",
        };
      case "status_update":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        };
      case "job":
        return {
          icon: Briefcase,
          bg: "bg-purple-50 text-purple-600 border-purple-100",
        };
      case "subscription":
        return {
          icon: Sparkles,
          bg: "bg-amber-50 text-amber-600 border-amber-100",
        };
      default:
        return {
          icon: Bell,
          bg: "bg-slate-50 text-slate-600 border-slate-100",
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-all border border-slate-200/80 hover:border-brand-200 focus:outline-none cursor-pointer"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />

        {/* Unread badge & animated ping */}
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-[360px] sm:w-[420px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-slate-900 text-base">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 mt-3 pt-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeFilter === "all"
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveFilter("unread")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeFilter === "unread"
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                    <Inbox className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {activeFilter === "unread"
                      ? "No unread notifications"
                      : "No notifications yet"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">
                    {activeFilter === "unread"
                      ? "You're all caught up! Check back later."
                      : "We'll notify you here about application updates, jobs, and matches."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const { icon: TypeIcon, bg: iconBg } = getNotificationIcon(
                    item.type
                  );
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleNotificationClick(item)}
                      className={`group relative p-4 transition-all hover:bg-slate-50/80 cursor-pointer flex items-start gap-3.5 ${
                        !item.isRead ? "bg-brand-50/20" : "bg-white"
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {!item.isRead && (
                        <div className="absolute left-1.5 top-5 w-2 h-2 rounded-full bg-brand-600 shadow-sm" />
                      )}

                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 p-2.5 rounded-2xl border ${iconBg} mt-0.5`}
                      >
                        <TypeIcon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={`text-xs font-bold truncate ${
                              !item.isRead ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5 inline" />
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>

                      {/* Delete button (shows on hover) */}
                      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item._id);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  Real-time notification engine active
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;

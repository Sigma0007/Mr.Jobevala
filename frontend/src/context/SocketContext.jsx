import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import {
  Bell,
  CheckCircle2,
  FileText,
  Briefcase,
  UserCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import customerservice from "../customer/customerservice";

const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  // Fetch notifications from server
  const fetchNotifications = useCallback(async (filter = "all") => {
    if (!user) return;
    try {
      setLoading(true);
      const query = filter === "unread" ? "?filter=unread" : "";
      const res = await customerservice.getNotifications(query);
      if (res && res.success) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await customerservice.getUnreadNotificationsCount();
      if (res && res.success) {
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, [user]);

  // Mark single notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      const res = await customerservice.markNotificationAsRead(id);
      if (res && res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const res = await customerservice.markAllNotificationsAsRead();
      if (res && res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  }, []);

  // Delete single notification
  const deleteNotification = useCallback(async (id) => {
    try {
      const res = await customerservice.deleteNotificationApi(id);
      if (res && res.success) {
        setNotifications((prev) => {
          const item = prev.find((n) => n._id === id);
          if (item && !item.isRead) {
            setUnreadCount((c) => Math.max(0, c - 1));
          }
          return prev.filter((n) => n._id !== id);
        });
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      const res = await customerservice.clearAllNotificationsApi();
      if (res && res.success) {
        setNotifications([]);
        setUnreadCount(0);
        toast.success("All notifications cleared");
      }
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  }, []);

  // Display custom toast popup for new real-time notification
  const displayNotificationToast = useCallback((notification) => {
    const getNotificationIcon = (type) => {
      switch (type) {
        case "profile":
          return <UserCheck className="w-5 h-5 text-indigo-500" />;
        case "application":
          return <FileText className="w-5 h-5 text-blue-500" />;
        case "status_update":
          return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
        case "job":
          return <Briefcase className="w-5 h-5 text-purple-500" />;
        case "subscription":
          return <Sparkles className="w-5 h-5 text-amber-500" />;
        default:
          return <Bell className="w-5 h-5 text-brand-600" />;
      }
    };

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 border border-slate-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
          onClick={() => {
            toast.dismiss(t.id);
            if (notification.link) {
              window.location.href = notification.link;
            }
          }}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start gap-3.5">
              <div className="flex-shrink-0 p-2.5 bg-slate-50 rounded-xl border border-slate-100 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {notification.title}
                  </p>
                  <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Just Now
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-slate-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: "top-right",
      }
    );
  }, []);

  // Manage WebSocket connection lifecycle
  useEffect(() => {
    if (!user || !user.id && !user._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const currentUserId = user.id || user._id;

    const newSocket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      query: { userId: currentUserId },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("join_user_room", currentUserId);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for real-time notifications
    newSocket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      displayNotificationToast(notification);
    });

    // Initial load of notifications
    fetchNotifications();
    fetchUnreadCount();

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  }, [user, fetchNotifications, fetchUnreadCount, displayNotificationToast]);

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;

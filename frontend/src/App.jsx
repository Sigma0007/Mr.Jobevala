import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import FindJobs from "./pages/FindJobs";
import JobDetails from "./pages/JobDetails";
import Footer from "./components/Footer";
import { UserDashboard } from "./components/user/UserDashboard";

// Import your brand new HomePage
import HomePage from "./pages/HomePage";

// Import the brand new Loader
import InitialLoader from "./components/InitialLoader";
import AdminDashboard from "./components/admin/AdminDashboard";
import EmployerDashboard from "./components/provider/EmployerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import JobApplications from "./components/provider/JobApplications";
import FindCandidates from "./pages/FindCandidates";
import UserAppliedJobDetail from "./pages/UserAppliedJobDetail";
import PricingPlans from "./pages/PricingPlans";
import PaymentHistory from "./pages/PaymentHistory";
import ResumeBuilder from "./pages/ResumeBuilder";
import CommunityFeed from "./pages/CommunityFeed";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import HelpCenter from "./pages/HelpCenter";
import { useEffect } from "react";
import { setAllCategoriesType } from "./Redux/Dashboard/DashboardAction";
import { useDispatch } from "react-redux";
import customerservice from "./customer/customerservice";
import MSGLogin from "./components/MSG/MSGLogin";
import { SocketProvider } from "./context/SocketContext";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // get all categories
    const getAllCategories = async () => {
      try {
        const response = await customerservice.getCategories();
        if (response.success) {
          dispatch(setAllCategoriesType(response.data));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getAllCategories();
  }, []);

  return (
    <SocketProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 font-sans relative">
        {/* 
            The InitialLoader sits here. It blocks the UI visually 
            on first visit, plays the beautiful laptop zoom animation, 
            and seamlessly unmounts to reveal the app.
          */}
        <InitialLoader />

        <Navbar />

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            className: "",
            style: {
              background: "#ffffff",
              color: "#0f172a",
              padding: "16px 24px",
              borderRadius: "16px",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: { primary: "#2563eb", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
            },
          }}
        />

        <Routes>
          {/* Call the clean HomePage component here */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/msglogin" element={<MSGLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<FindJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/feed" element={<CommunityFeed />} />
          <Route path="/posts" element={<CommunityFeed />} />
          <Route path="/candidates" element={<FindCandidates />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/payments/history" element={<PaymentHistory />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          {/* Company & Support Pages */}
          <Route path="/about" element={<AboutUs />} />\
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/help-center" element={<HelpCenter />} />
          {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* PROVIDER */}
          <Route
            path="/provider/dashboard"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/jobs/:id/applications"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <JobApplications />
              </ProtectedRoute>
            }
          />
          {/* USER */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/applied/:id"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserAppliedJobDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </SocketProvider>
  );
}

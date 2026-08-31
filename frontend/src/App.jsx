import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import FindJobs from "./pages/FindJobs";
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
import { useEffect } from "react";
import { setAllCategoriesType } from "./Redux/Dashboard/DashboardAction";
import { useDispatch } from "react-redux";
import customerservice from "./customer/customerservice";

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
    <>
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
          <Route path="/register" element={<Register />} />

          <Route path="/jobs" element={<FindJobs />} />
          <Route path="/candidates" element={<FindCandidates />} />

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
        </Routes>
        <Footer />
      </div>
    </>
  );
}

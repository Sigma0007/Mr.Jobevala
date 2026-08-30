import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Briefcase, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../Redux/Auth/AuthAction";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Smart routing flags: Find Jobs is public, others are protected
  const navLinks = [
    { name: "Home", href: "/", protected: false },
    { name: "Find Jobs", href: "/jobs", protected: false },
    { name: "Find Candidates", href: "/candidates", protected: true },
  ];

  const requireAuth = (e, path) => {
    if (!user) {
      e.preventDefault();
      toast.error("Please create an account to access this feature.");
      navigate("/register");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Successfully logged out");
    navigate("/");
  };

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setIsOpen(false);
    if (link.protected) {
      requireAuth(e, link.href);
    } else {
      navigate(link.href);
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-brand-600 p-2 rounded-xl text-white">
              <Briefcase className="w-6 h-6" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Job<span className="text-brand-600">Portal</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Auth / Dashboard */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Redirects to /user/dashboard, /provider/dashboard, or /admin/dashboard based on role */}
                <Link
                  to={`/${user.role}/dashboard`}
                  className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:bg-brand-700 hover:shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-full border border-slate-100 hover:bg-red-50 hover:border-red-100"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:bg-brand-700 hover:shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:-translate-y-0.5"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-brand-600 focus:outline-none p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col space-y-3">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block text-center px-3 py-3 text-base font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center bg-brand-600 text-white px-5 py-3 rounded-xl text-base font-medium hover:bg-brand-700 transition-colors shadow-sm"
                    >
                      Join Now
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${user.role}/dashboard`}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-xl text-base font-medium hover:bg-brand-700 transition-colors shadow-sm"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 text-center bg-red-50 text-red-600 hover:bg-red-100 px-5 py-3 rounded-xl text-base font-medium transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Log Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

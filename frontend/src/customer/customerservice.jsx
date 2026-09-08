import { Auth } from "./Auth";

// Auth Actions
const registerUser = (data = {}) => {
  const endpoint = "/api/auth/register";
  return Auth(endpoint, data, "POST");
};
const loginUser = (data = {}) => {
  const endpoint = "/api/auth/login";
  return Auth(endpoint, data, "POST");
};
const fetchMe = () => {
  const endpoint = "/api/auth/me";
  return Auth(endpoint, {}, "GET");
};
const logoutUser = (data = {}) => {
  const endpoint = "/api/auth/logout";
  return Auth(endpoint, data, "POST");
};
const forgotPassword = (data = {}) => {
  const endpoint = "/api/auth/forgot-password";
  return Auth(endpoint, data, "POST");
};
const resetPassword = (data = {}) => {
  const endpoint = "/api/auth/reset-password";
  return Auth(endpoint, data, "POST");
};

const createJob = (data = {}) => {
  const endpoint = "/api/jobs";
  return Auth(endpoint, data, "POST");
};

const getMyJobs = (params = "") => {
  const endpoint = `/api/jobs/my-jobs${params}`;
  return Auth(endpoint, {}, "GET");
};

const getMyJobById = (id) => {
  const endpoint = `/api/jobs/my-jobs/${id}`;
  return Auth(endpoint, {}, "GET");
};

const updateJob = (id, data = {}) => {
  const endpoint = `/api/jobs/${id}`;
  return Auth(endpoint, data, "PUT");
};

const deleteJob = (id) => {
  const endpoint = `/api/jobs/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

const updateJobStatus = (id, data = {}) => {
  const endpoint = `/api/jobs/${id}/status`;
  return Auth(endpoint, data, "PATCH");
};

const getUserProfile = () => {
  const endpoint = `/api/userprofile`;
  return Auth(endpoint, {}, "GET");
};

const getUserOverview = () => {
  const endpoint = `/api/userprofile/overview`;
  return Auth(endpoint, {}, "GET");
};

const updateUserProfile = (data = {}) => {
  const endpoint = `/api/userprofile`;
  return Auth(endpoint, data, "PUT");
};

const uploadProfileImage = (formData) => {
  const endpoint = `/api/userprofile/upload-image`;
  return Auth(endpoint, formData, "POST", true);
};

const uploadResume = (formData) => {
  const endpoint = `/api/userprofile/upload-resume`;
  return Auth(endpoint, formData, "POST", true);
};

const deleteResume = () => {
  const endpoint = `/api/userprofile/resume`;
  return Auth(endpoint, {}, "DELETE");
};

const getCompanyProfile = () => {
  const endpoint = `/api/companyprofile`;
  return Auth(endpoint, {}, "GET");
};

const updateCompanyProfile = (data = {}) => {
  const endpoint = `/api/companyprofile`;
  return Auth(endpoint, data, "PUT");
};

const uploadCompanyLogo = (formData) => {
  const endpoint = `/api/companyprofile/upload-logo`;
  return Auth(endpoint, formData, "POST", true);
};

const deleteCompanyLogo = () => {
  const endpoint = `/api/companyprofile/logo`;
  return Auth(endpoint, {}, "DELETE");
};

const getAllJobs = (query = "") => {
  const endpoint = `/api/jobs/getAllJobs${query}`;
  return Auth(endpoint, {}, "GET");
};

const getJobById = (id) => {
  const endpoint = `/api/jobs/${id}`;
  return Auth(endpoint, {}, "GET");
};

const getLastsixJobs = () => {
  const endpoint = `/api/jobs/getLastsixJobs`;
  return Auth(endpoint, {}, "GET");
};

const getAllUserProfiles = (query = "") => {
  const endpoint = `/api/userprofile/get/all${query}`;
  return Auth(endpoint, {}, "GET");
};

const saveJob = (id) => {
  const endpoint = `/api/jobs/${id}/save`;
  return Auth(endpoint, {}, "POST");
};

const getSavedJobs = (query = "") => {
  const endpoint = `/api/jobs/saved${query}`;
  return Auth(endpoint, {}, "GET");
};

const removeSavedJob = (id) => {
  const endpoint = `/api/jobs/saved/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

const createApplication = (data = {}) => {
  const endpoint = `/api/applications`;
  return Auth(endpoint, data, "POST");
};

const getMyApplications = (params = "") => {
  const endpoint = `/api/applications/my-applications${params}`;
  return Auth(endpoint, {}, "GET");
};

const getApplicationById = (id) => {
  const endpoint = `/api/applications/${id}`;
  return Auth(endpoint, {}, "GET");
};

const getJobApplications = (id) => {
  const endpoint = `/api/applications/job/${id}`;
  return Auth(endpoint, {}, "GET");
};

const updateApplicationStatus = (id, data = {}) => {
  const endpoint = `/api/applications/${id}/status`;
  return Auth(endpoint, data, "PATCH");
};

const getProviderApplications = () => {
  const endpoint = `/api/applications/provider-applications`;
  return Auth(endpoint, {}, "GET");
};

const getProviderOverview = () => {
  const endpoint = `/api/companyprofile/overview`;
  return Auth(endpoint, {}, "GET");
};

const getProviderStats = () => {
  const endpoint = `/api/jobs/provider-state-overview`;
  return Auth(endpoint, {}, "GET");
};

// --- Admin APIs ---

const getAdminStats = () => {
  const endpoint = `/api/admin/stats`;
  return Auth(endpoint, {}, "GET");
};

const getAdminUsers = () => {
  const endpoint = `/api/admin/users`;
  return Auth(endpoint, {}, "GET");
};

const deleteAdminUser = (id) => {
  const endpoint = `/api/admin/users/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

const getAdminJobs = () => {
  const endpoint = `/api/admin/jobs`;
  return Auth(endpoint, {}, "GET");
};

const deleteAdminJob = (id) => {
  const endpoint = `/api/admin/jobs/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

// --- Category APIs ---

const getCategories = () => {
  const endpoint = `/api/categories`;
  return Auth(endpoint, {}, "GET");
};

const getCategoryJobCounts = () => {
  const endpoint = `/api/categories/job-counts`;
  return Auth(endpoint, {}, "GET");
};

const createCategory = (data = {}) => {
  const endpoint = `/api/categories`;
  return Auth(endpoint, data, "POST");
};

const updateCategory = (id, data = {}) => {
  const endpoint = `/api/categories/${id}`;
  return Auth(endpoint, data, "PUT");
};

const deleteCategory = (id) => {
  const endpoint = `/api/categories/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

// --- Location APIs ---

const getLocationsHierarchy = () => {
  const endpoint = `/api/locations/hierarchy`;
  return Auth(endpoint, {}, "GET");
};

const getNextLocationCode = (type) => {
  const endpoint = `/api/locations/next-code?type=${type}`;
  return Auth(endpoint, {}, "GET");
};

const createState = (data = {}) => {
  const endpoint = `/api/locations/states`;
  return Auth(endpoint, data, "POST");
};

const updateState = (id, data = {}) => {
  const endpoint = `/api/locations/states/${id}`;
  return Auth(endpoint, data, "PUT");
};

const deleteState = (id) => {
  const endpoint = `/api/locations/states/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

const createDistrict = (data = {}) => {
  const endpoint = `/api/locations/districts`;
  return Auth(endpoint, data, "POST");
};

const updateDistrict = (id, data = {}) => {
  const endpoint = `/api/locations/districts/${id}`;
  return Auth(endpoint, data, "PUT");
};

const deleteDistrict = (id) => {
  const endpoint = `/api/locations/districts/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

const createSubDivision = (data = {}) => {
  const endpoint = `/api/locations/subdivisions`;
  return Auth(endpoint, data, "POST");
};

const updateSubDivision = (id, data = {}) => {
  const endpoint = `/api/locations/subdivisions/${id}`;
  return Auth(endpoint, data, "PUT");
};

const deleteSubDivision = (id) => {
  const endpoint = `/api/locations/subdivisions/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

export default {
  registerUser,
  loginUser,
  fetchMe,
  logoutUser,
  forgotPassword,
  resetPassword,
  createJob,
  getMyJobs,
  getMyJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  getUserProfile,
  getUserOverview,
  updateUserProfile,
  uploadProfileImage,
  uploadResume,
  deleteResume,
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
  deleteCompanyLogo,
  getAllJobs,
  getJobById,
  getAllUserProfiles,
  saveJob,
  getSavedJobs,
  removeSavedJob,
  createApplication,
  getMyApplications,
  getApplicationById,
  getJobApplications,
  updateApplicationStatus,
  getProviderApplications,
  getProviderOverview,
  getProviderStats,
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminJobs,
  deleteAdminJob,
  getCategories,
  getCategoryJobCounts,
  createCategory,
  updateCategory,
  deleteCategory,
  getLastsixJobs,
  getLocationsHierarchy,
  getNextLocationCode,
  createState,
  updateState,
  deleteState,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  createSubDivision,
  updateSubDivision,
  deleteSubDivision,
};

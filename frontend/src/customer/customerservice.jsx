import { Auth } from "./Auth";

// Auth Actions
const registerUser = (data = {}) => {
  const endpoint = "/auth/register";
  return Auth(endpoint, data, "POST");
};
const loginUser = (data = {}) => {
  const endpoint = "/auth/login";
  return Auth(endpoint, data, "POST");
};
const fetchMe = () => {
  const endpoint = "/auth/me";
  return Auth(endpoint, {}, "GET");
};
const logoutUser = (data = {}) => {
  const endpoint = "/auth/logout";
  return Auth(endpoint, data, "POST");
};
const forgotPassword = (data = {}) => {
  const endpoint = "/auth/forgot-password";
  return Auth(endpoint, data, "POST");
};
const resetPassword = (data = {}) => {
  const endpoint = "/auth/reset-password";
  return Auth(endpoint, data, "POST");
};

const createJob = (data = {}) => {
  const endpoint = "/jobs";
  return Auth(endpoint, data, "POST");
};

const getMyJobs = () => {
  const endpoint = "/jobs/my-jobs";
  return Auth(endpoint, {}, "GET");
};

const getMyJobById = (id) => {
  const endpoint = `/jobs/my-jobs/${id}`;
  return Auth(endpoint, {}, "GET");
};

const updateJob = (id, data = {}) => {
  const endpoint = `/jobs/${id}`;
  return Auth(endpoint, data, "PUT");
};

const deleteJob = (id) => {
  const endpoint = `/jobs/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

const updateJobStatus = (id, data = {}) => {
  const endpoint = `/jobs/${id}/status`;
  return Auth(endpoint, data, "PATCH");
};

const getUserProfile = () => {
  const endpoint = `/userprofile`;
  return Auth(endpoint, {}, "GET");
};

const updateUserProfile = (data = {}) => {
  const endpoint = `/userprofile`;
  return Auth(endpoint, data, "PUT");
};

const getCompanyProfile = () => {
  const endpoint = `/companyprofile`;
  return Auth(endpoint, {}, "GET");
};

const updateCompanyProfile = (data = {}) => {
  const endpoint = `/companyprofile`;
  return Auth(endpoint, data, "PUT");
};

const getAllJobs = () => {
  const endpoint = `/jobs/getAllJobs`;
  return Auth(endpoint, {}, "GET");
};

const getAllUserProfiles = () => {
  const endpoint = `/userprofile/get/all`;
  return Auth(endpoint, {}, "GET");
};

const saveJob = (id) => {
  const endpoint = `/jobs/${id}/save`;
  return Auth(endpoint, {}, "POST");
};

const getSavedJobs = () => {
  const endpoint = `/jobs/saved`;
  return Auth(endpoint, {}, "GET");
};

const removeSavedJob = (id) => {
  const endpoint = `/jobs/saved/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

const createApplication = (data = {}) => {
  const endpoint = `/applications`;
  return Auth(endpoint, data, "POST");
};

const getMyApplications = () => {
  const endpoint = `/applications/my-applications`;
  return Auth(endpoint, {}, "GET");
};

const getJobApplications = (id) => {
  const endpoint = `/applications/job/${id}`;
  return Auth(endpoint, {}, "GET");
};

const updateApplicationStatus = (id, data = {}) => {
  const endpoint = `/applications/${id}/status`;
  return Auth(endpoint, data, "PATCH");
};

const getProviderApplications = () => {
  const endpoint = `/applications/provider-applications`;
  return Auth(endpoint, {}, "GET");
};

const getProviderStats = () => {
  const endpoint = `/jobs/provider-state-overview`;
  return Auth(endpoint, {}, "GET");
};

// --- Admin APIs ---

const getAdminStats = () => {
  const endpoint = `/admin/stats`;
  return Auth(endpoint, {}, "GET");
};

const getAdminUsers = () => {
  const endpoint = `/admin/users`;
  return Auth(endpoint, {}, "GET");
};

const deleteAdminUser = (id) => {
  const endpoint = `/admin/users/${id}`;
  return Auth(endpoint, {}, "DELETE");
};

const getAdminJobs = () => {
  const endpoint = `/admin/jobs`;
  return Auth(endpoint, {}, "GET");
};

const deleteAdminJob = (id) => {
  const endpoint = `/admin/jobs/${id}`;
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
  updateUserProfile,
  getCompanyProfile,
  updateCompanyProfile,
  getAllJobs,
  getAllUserProfiles,
  saveJob,
  getSavedJobs,
  removeSavedJob,
  createApplication,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getProviderApplications,
  getProviderStats,
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminJobs,
  deleteAdminJob,
};

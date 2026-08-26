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
};

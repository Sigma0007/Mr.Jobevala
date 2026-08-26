import axios from "axios";

const baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL,
});

// Main API function
export const Auth = async (
    url = "",
    data = {},
    method = "POST",
    formData = false
) => {
    try {
        const headers = {
            "Content-Type": formData
                ? "multipart/form-data"
                : "application/json",
        }
        const token = localStorage.getItem("token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await api({
            url,
            method,
            data,
            headers,
        });

        return response.data;

    } catch (error) {
        console.error("API Error:", error);

        return {
            status: error.response?.status || 0,

            message:
                error.response?.data?.message ||
                error.message ||
                "Something went wrong",

            data: [],
        };
    }
};


export default api;
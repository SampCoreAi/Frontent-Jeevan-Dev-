
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const LOGIN_PATH = "/Home/pages/Login";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

const getToken = (key) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

const clearAuth = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  delete api.defaults.headers.common.Authorization;
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;

  if (window.location.pathname !== LOGIN_PATH) {
    window.location.replace(LOGIN_PATH);
  }
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  failedQueue = [];
};

// REQUEST INTERCEPTOR

api.interceptors.request.use(
  (config) => {
    const token = getToken("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const message =
      error.response?.data?.message || "";

    const url = originalRequest.url || "";

    const isAuthEndpoint =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/register") ||
      url.includes("/api/auth/refresh");

    const isExpiredToken =
      status === 401 ||
      (status === 403 &&
        message.toLowerCase().includes("expired token"));

    // Do not refresh on login or registration errors.
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (!isExpiredToken || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Wait if another request is refreshing the token.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getToken("refreshToken");

      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      // Use plain axios to avoid interceptor loops.
      const response = await axios.post(
        `${API_URL}/api/auth/refresh`,
        { refreshToken },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData =
        response.data.data || response.data;

      const newAccessToken =
        responseData.accessToken;

      const newRefreshToken =
        responseData.refreshToken;

      if (!newAccessToken) {
        throw new Error(
          "Access token missing in refresh response"
        );
      }

      localStorage.setItem(
        "token",
        newAccessToken
      );

      // Support refresh-token rotation.
      if (newRefreshToken) {
        localStorage.setItem(
          "refreshToken",
          newRefreshToken
        );
      }

      api.defaults.headers.common.Authorization =
        `Bearer ${newAccessToken}`;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);

      clearAuth();
      redirectToLogin();

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

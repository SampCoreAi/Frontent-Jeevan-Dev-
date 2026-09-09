import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// 🔹 Variable to prevent multiple refresh calls at same time
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  })
  
  isRefreshing = false;
  failedQueue = [];
}

// 🔹 Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 Response interceptor with proper refresh handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ CRITICAL: Refresh endpoint ko skip karo (infinite loop prevent)
    if (
  error.response?.status === 401 &&
  !originalRequest._retry &&
  !originalRequest.url.includes("/refresh") &&
  !originalRequest.url.includes("/register") &&
  !originalRequest.url.includes("/login")
){
      
      if (isRefreshing) {
        // Agar pehle se refresh chal raha hai, to wait karo
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject
          });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.warn("⚠️ No refresh token found");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        console.log("🔄 Refreshing access token...");

        // Refresh token call (plain axios use karo, api instance se nahi)
        const res = await axios.post(
          `${API_URL}/api/auth/refresh`,
          { refreshToken },
          {
            baseURL: API_URL,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        const newAccessToken = res.data.data?.accessToken || res.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token in response");
        }

        console.log("✅ Token refreshed successfully");

        // Store new token
        localStorage.setItem("token", newAccessToken);

        // Update all pending requests
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Queue ko process karo
        processQueue(null, newAccessToken);

        // Original request ko retry karo
        return api(originalRequest);

      } catch (err) {
        console.error("❌ Refresh Token Failed:", err.message);
        
        processQueue(err, null);
        
        localStorage.clear();
        window.location.href = "/login";
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
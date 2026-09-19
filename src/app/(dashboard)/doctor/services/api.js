import axios from "@/utils/axiosInstance";
import { API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from '../constants';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Refreshing token...");

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const res = await apiClient.post("/api/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;

        console.log("✅ New Token:", newAccessToken);

        localStorage.setItem("token", newAccessToken);

        // Update headers
        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return apiClient(originalRequest);

      } catch (err) {
        console.log("❌ Refresh failed");

        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Generic API request handler
const apiRequest = async (method, endpoint, data = null, params = null) => {
  try {
    const config = {
      method,
      url: endpoint,
      ...(data && { data }),
      ...(params && { params }),
    };

    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR;
    throw new Error(errorMessage);
  }
};

export const scheduleService = {
  getHospitals: () =>
    apiRequest("GET", API_ENDPOINTS.SCHEDULES.GET_HOSPITALS),




getDoctorAppointments: (
  selectedHospital,
  selectedMode,
  status,
  date,
  pagination
) =>
  apiRequest(
    "GET",
    API_ENDPOINTS.APPOINTMENTS.VIEW_VISIT,
    null,
    {
      hospitalName: selectedHospital,
      mode: selectedMode,
      status: status,
        slot_date: date, 
      limit: pagination.limit,
      offset: pagination.offset,
    }
  ),

  getSchedules: () =>
    apiRequest("GET", API_ENDPOINTS.SCHEDULES.GET_SCHEDULES),

  createSchedule: (scheduleData) =>
    apiRequest(
      "POST",
      API_ENDPOINTS.SCHEDULES.CREATE_SCHEDULE,
      scheduleData
    ),

  updateSchedule: (id, scheduleData) =>
    apiRequest(
      "PUT",
      `${API_ENDPOINTS.SCHEDULES.UPDATE_SCHEDULE}/${id}`,
      scheduleData
    ),

 deleteSchedule: (scheduleId, body = null) =>
  apiRequest(
    "DELETE",
    `${API_ENDPOINTS.SCHEDULES.DELETE_SCHEDULE}/${scheduleId}`,
    body
  ),
  // NEW
  updateSlotStatus: (scheduleId, slotId, status) =>
    apiRequest(
      "PATCH",
      `/api/schedules/${scheduleId}/slots/${slotId}/status`,
      {
        status,
      }
    ),
};

// Appointment API services
export const appointmentService = {
  getAppointments: (params = null) =>
    apiRequest('GET', API_ENDPOINTS.APPOINTMENTS.GET_APPOINTMENTS, null, params),

  createAppointment: (appointmentData) =>
    apiRequest('POST', API_ENDPOINTS.APPOINTMENTS.CREATE_APPOINTMENT, appointmentData),

  updateAppointment: (id, appointmentData) =>
    apiRequest('PUT', `${API_ENDPOINTS.APPOINTMENTS.UPDATE_APPOINTMENT}/${id}`, appointmentData),

  deleteAppointment: (id) =>
    apiRequest('DELETE', `${API_ENDPOINTS.APPOINTMENTS.DELETE_APPOINTMENT}/${id}`),

  verifyToken: (token) =>
    apiRequest('GET', `${API_ENDPOINTS.APPOINTMENTS.VERIFY_TOKEN}/${token}`),

 getPrescriptionByAppointmentId: (appointment_id) =>
  apiRequest(
    'GET',
    API_ENDPOINTS.PRESCRIPTIONS.GET_PRESCRIPTION_BY_TOKEN,
    null,
    { appointment_id }
  ),
  createPrescription: (prescriptionData) =>
    apiRequest('POST', API_ENDPOINTS.PRESCRIPTIONS.CREATE_PRESCRIPTION, prescriptionData),
  editPrescription: (appointmentId, prescriptionData) =>
    apiRequest(
      'PUT',
      `${API_ENDPOINTS.PRESCRIPTIONS.EDIT_PRESCRIPTION}/${appointmentId}`,
      prescriptionData
    ),
};


// Dashboard API services
export const getTodayStats = () =>
  apiRequest("GET", API_ENDPOINTS.DASHBOARD.TODAY_STATS);



// Patient API services
export const patientService = {
  getPatients: (params = null) =>
    apiRequest('GET', API_ENDPOINTS.PATIENTS.GET_PATIENTS, null, params),

  getPatientDetails: (id) =>
    apiRequest('GET', `${API_ENDPOINTS.PATIENTS.GET_PATIENT_DETAILS}/${id}`),

  createPatient: (patientData) =>
    apiRequest('POST', API_ENDPOINTS.PATIENTS.CREATE_PATIENT, patientData),

  updatePatient: (id, patientData) =>
    apiRequest('PUT', `${API_ENDPOINTS.PATIENTS.UPDATE_PATIENT}/${id}`, patientData),
};

// Prescription API services
export const prescriptionService = {
  getPrescriptions: (params = null) =>
    apiRequest('GET', API_ENDPOINTS.PRESCRIPTIONS.GET_PRESCRIPTIONS, null, params),

  createPrescription: (prescriptionData) =>
    apiRequest('POST', API_ENDPOINTS.PRESCRIPTIONS.CREATE_PRESCRIPTION, prescriptionData),

  updatePrescription: (id, prescriptionData) =>
    apiRequest('PUT', `${API_ENDPOINTS.PRESCRIPTIONS.UPDATE_PRESCRIPTION}/${id}`, prescriptionData),
};

// Reports API services
export const reportService = {
  getReports: (params = null) =>
    apiRequest('GET', API_ENDPOINTS.REPORTS.GET_REPORTS, null, params),

  uploadReport: (formData) => {
    const config = {
      method: 'POST',
      url: API_ENDPOINTS.REPORTS.UPLOAD_REPORT,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return apiClient(config).then(response => response.data);
  },

  deleteReport: (id) =>
    apiRequest('DELETE', `${API_ENDPOINTS.REPORTS.DELETE_REPORT}/${id}`),
};

// Profile API services
export const profileService = {
  getProfile: () => apiRequest('GET', API_ENDPOINTS.PROFILE.GET_PROFILE),

 
  updateProfile: (profileData) =>
    apiRequest('PATCH', API_ENDPOINTS.PROFILE.UPDATE_PROFILE, profileData),

  changePassword: (passwordData) =>
    apiRequest('PUT', API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, passwordData),

  uploadLicense: (formData) => {
    const config = {
      method: 'POST',
      url: `${API_ENDPOINTS.PROFILE.UPLOAD_LICENSE}?folder=doctor-licenses`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return apiClient(config).then(response => response.data);
  },

  uploadImage: (formData) => {
    const config = {
      method: 'POST',
      url: `${API_ENDPOINTS.PROFILE.UPLOAD_IMAGE}?folder=doctor-profile`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return apiClient(config).then(response => response.data);
  },
};

// Feedback API services
export const feedbackService = {
  getFeedback: (params = null) =>
    apiRequest('GET', API_ENDPOINTS.FEEDBACK.GET_FEEDBACK, null, params),

  submitFeedback: (feedbackData) =>
    apiRequest('POST', API_ENDPOINTS.FEEDBACK.SUBMIT_FEEDBACK, feedbackData),
};

export default apiClient;   
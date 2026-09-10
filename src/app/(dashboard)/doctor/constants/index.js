// API Endpoints
export const API_ENDPOINTS = {

  DASHBOARD: {
  TODAY_STATS: "/api/dashboard/today-stats",
},
  SCHEDULES: {
    GET_HOSPITALS: '/api/schedules/getHospitalsName',
    GET_SCHEDULES: '/api/schedules/getScheduleById',
    CREATE_SCHEDULE: '/api/schedules/createSchedule',
    UPDATE_SCHEDULE: '/api/schedules/updateSchedule',
    DELETE_SCHEDULE: '/api/schedules/Delete',
  },
  APPOINTMENTS: {
    GET_APPOINTMENTS: '/api/appointments/getAppointments',
    VIEW_VISIT:'/api/appointments/view-e-visit',
    CREATE_APPOINTMENT: '/api/appointments/createAppointment',
    UPDATE_APPOINTMENT: '/api/appointments/updateAppointment',
    DELETE_APPOINTMENT: '/api/appointments/deleteAppointment',
    VERIFY_TOKEN: '/api/appointments/verify-token',

  },
  PATIENTS: {
    GET_PATIENTS: '/api/patients/getPatients',
    GET_PATIENT_DETAILS: '/api/patients/getPatientDetails',
    CREATE_PATIENT: '/api/patients/createPatient',
    UPDATE_PATIENT: '/api/patients/updatePatient',
  },
  PRESCRIPTIONS: {
    CREATE_PRESCRIPTION: '/api/prescriptions/save',
    GET_PRESCRIPTION_BY_TOKEN: '/api/appointments/prescription',
    EDIT_PRESCRIPTION: '/api/prescriptions/update',
  },
  REPORTS: {
    GET_REPORTS: '/api/reports/getReports',
    UPLOAD_REPORT: '/api/reports/uploadReport',
    DELETE_REPORT: '/api/reports/deleteReport',
  },
  PROFILE: {
    GET_PROFILE: '/api/doctors/getDoctorProfileById',
    CREATE_PROFILE: '/api/doctors/create-profile',
    UPDATE_PROFILE: '/api/doctors/update-profile',
    CHANGE_PASSWORD: '/api/doctor/changePassword',
    UPLOAD_LICENSE: '/api/licenseFile/upload',
    UPLOAD_IMAGE: '/api/licenseFile/imageUpload',
  },
  FEEDBACK: {
    GET_FEEDBACK: '/api/feedback/getFeedback',
    SUBMIT_FEEDBACK: '/api/feedback/submitFeedback',
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SCHEDULE_CREATED: 'Schedule created successfully',
  SCHEDULE_UPDATED: 'Schedule updated successfully',
  SCHEDULE_DELETED: 'Schedule deleted successfully',
  APPOINTMENT_CREATED: 'Appointment booked successfully',
  APPOINTMENT_UPDATED: 'Appointment updated successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
  PATIENT_CREATED: 'Patient registered successfully',
  PATIENT_UPDATED: 'Patient information updated successfully',
  PRESCRIPTION_CREATED: 'Prescription created successfully',
  PRESCRIPTION_UPDATED: 'Prescription updated successfully',
  REPORT_UPLOADED: 'Report uploaded successfully',
  PROFILE_CREATED: 'Profile created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  LICENSE_UPLOADED: 'License uploaded successfully',
  IMAGE_UPLOADED: 'Profile image uploaded successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  REQUIRED_FIELDS: 'Please fill all required fields',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_FORMAT: 'Invalid file format',
  SCHEDULE_CONFLICT: 'Schedule conflicts with existing schedule',
  APPOINTMENT_NOT_AVAILABLE: 'Selected time slot is not available',
  PATIENT_NOT_FOUND: 'Patient not found',
  SERVER_ERROR: 'Server error. Please try again later.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PHONE_INVALID: 'Please enter a valid 10-digit phone number',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_NUMBER: 'Password must contain at least one number',
  PASSWORD_SPECIAL: 'Password must contain at least one special character',
  DATE_INVALID: 'Please enter a valid date',
  TIME_INVALID: 'Please enter a valid time',
  NUMBER_POSITIVE: 'Please enter a positive number',
  AGE_MIN: 'Age must be at least 18 years',
  AGE_MAX: 'Age cannot be more than 120 years',
};

export const LOADING_MESSAGES = {
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  UPDATING: 'Updating...',
  DELETING: 'Deleting...',
  UPLOADING: 'Uploading...',
  PROCESSING: 'Processing...',
  FETCHING_DATA: 'Fetching data...',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export const TIME_SLOTS = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
  NIGHT: 'Night',
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Blood Groups
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

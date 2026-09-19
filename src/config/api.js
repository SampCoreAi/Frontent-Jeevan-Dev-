export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const API_ENDPOINTS = {
  DOCTOR_PROFILE: (id) => `/doctors/getDoctorPublicProfileById/${id}`,

  DOCTOR_FEEDBACK: (doctorId) => `/feedback/doctor/${doctorId}`,

  SUBMIT_FEEDBACK: '/feedback/patient',
  RATING_CARD: '/feedback/ratings',
  DOCTOR_REPLY: '/feedback/doctor/reply',

  GET_USER_PROFILE: "/user/getProfile",
  CREATE_PROFILE: "/user/createProfile",
  UPLOAD_IMAGE: "/licenseFile/imageUpload",
  UPDATE_PROFILE: "/user/updateProfile",
};
  

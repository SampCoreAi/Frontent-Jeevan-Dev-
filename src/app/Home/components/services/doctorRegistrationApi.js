import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const doctorRegistrationApi = {
  uploadDocument: async (registrationId, file, fieldName) => {
    const formData = new FormData();

    formData.append("registrationId", String(registrationId));
    formData.append(fieldName, file);


    const response = await axios.post(
      `${BASE_URL}/api/doctor-registration/registration/upload-documents`,
      formData
    );

    return response.data;
  },

  registerDoctor: async (data) => {
    const response = await axios.post(
      `${BASE_URL}/api/doctor-registration/create`,
      data
    );

    return response.data;
  },
};

export default doctorRegistrationApi;
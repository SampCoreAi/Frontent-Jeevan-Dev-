import api from "../../../../utils/axiosInstance";

export const createWalkInLabTestRequest = async ({
  labId,
  fullName,
  email,
  phoneNumber,
  referringDoctorName,
  referringDoctorPhone,
  tests,
  sampleType,
  priority,
  requestType,
}) => {
  const patientResponse = await api.post("/api/lab-requests/walk-in-patient", {
    fullName,
    email,
    phoneNumber,
  });
  const patientData = patientResponse.data?.data || {};
  const patientId = Number(patientData.patientId);
  const requestLabId = Number(labId || patientData.labId);

  if (!Number.isInteger(patientId) || patientId <= 0) {
    throw new Error("Unable to create or find the patient account.");
  }
  if (!Number.isInteger(requestLabId) || requestLabId <= 0) {
    throw new Error("Unable to resolve the lab assigned to this account.");
  }

  const response = await api.post("/api/lab-requests/create", {
    labId: requestLabId,
    patientId,
    tests,
    sampleType,
    priority,
    referringDoctorName,
    referringDoctorPhone,
    doctorNote: requestType === "WALK_IN"
      ? "Walk-in request created directly by the lab."
      : "Independent request created by the lab without a doctor prescription.",
  });

  const request = response.data?.data || null;
  return {
    patientId,
    labId: requestLabId,
    request,
    requestId: request?.id || null,
    orderId: request?.order_id || null,
  };
};
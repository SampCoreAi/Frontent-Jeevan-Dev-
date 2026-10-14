export const PHARMACY_DOCUMENTS = [
  { field: "retentionFeeReceipt", label: "Drug retention fee receipt" },
  {
    field: "pharmacistRegistrationCertificate",
    label: "Pharmacist registration certificate",
  },
  { field: "entityProof", label: "Business/entity proof" },
  { field: "panCard", label: "PAN document" },
  {
    field: "pharmacistAppointmentLetter",
    label: "Pharmacist appointment letter",
  },
];

export function isPharmacyDocumentRequired(field, data = {}) {
  if (
    field === "pharmacistRegistrationCertificate" ||
    field === "entityProof"
  ) {
    return true;
  }

  if (field === "retentionFeeReceipt") {
    return Boolean(data.retentionFeeRequired);
  }

  if (field === "panCard") {
    return Boolean(data.entityPan || data.personalPan);
  }

  if (field === "pharmacistAppointmentLetter") {
    return (
      Boolean(data.appointmentLetterRequired) &&
      data.employmentType !== "Owner"
    );
  }

  return false;
}

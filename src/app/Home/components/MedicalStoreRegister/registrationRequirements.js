export const PHARMACY_DOCUMENTS = [
  { field: "form20Certificate", label: "Form 20 drug licence certificate" },
  { field: "form21Certificate", label: "Form 21 certificate" },
  {
    field: "entityProof",
    label: "Shop proof (rent agreement or ownership paper)",
  },
  {
    field: "pharmacistRegistrationCertificate",
    label: "Pharmacist registration certificate",
  },
  {
    field: "pharmacistQualificationCertificate",
    label: "Pharmacist D.Pharm/B.Pharm certificate",
  },
];

export function isPharmacyDocumentRequired(field, data = {}) {
  if (field === "form21Certificate") {
    return Boolean(data.dispenseScheduleC1);
  }

  return PHARMACY_DOCUMENTS.some((document) => document.field === field);
}
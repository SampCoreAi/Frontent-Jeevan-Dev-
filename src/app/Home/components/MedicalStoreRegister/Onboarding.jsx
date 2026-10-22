"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Chip,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import Sidebar from "./Sidebar";
import StoreInformationForm from "./StoreInformationForm";
import LicenseBusinessForm from "./LicenseBusinessForm";
import AddressForm from "./AddressForm";
import DocumentsForm from "./DocumentsForm";
import Verification from "./Verification";
import Navbar from "../../components/Navbar";

const INITIAL_DATA = {
  licensedTradeName: "",
  legalEntityName: "",
  entityType: "",
  storeEmail: "",
  storeEmailVerified: false,
  storePhone: "",
  signatoryFullName: "",
  signatoryDesignation: "",
  signatoryEmail: "",
  signatoryPhone: "",
  entityPan: "",
  personalPan: "",
  shopUnit: "",
  street: "",
  area: "",
  cityDistrict: "",
  state: "",
  pinCode: "",
  landmark: "",
  gstin: "",
  gstinApplicable: false,
  shopEstablishmentApplicable: false,
  retentionFeeRequired: false,
  appointmentLetterRequired: false,
  drugLicenseNumber: "",
  licenseExpiryDate: "",
  issuingAuthority: "",
  form20Number: "",
  form20GrantDate: "",
  retentionDueDate: "",
  dispenseScheduleC1: false,
  pharmacistFullName: "",
  registrationNumber: "",
  statePharmacyCouncil: "",
  registrationValidityDate: "",
  hprDigiPharmedId: "",
  employmentType: "Full-time Employee",
  pharmacistPhone: "",
  collectPayments: false,
  coldChainMedicines: false,
  retentionFeeReceipt: null,
  pharmacistRegistrationCertificate: null,
  entityProof: null,
  panCard: null,
  pharmacistAppointmentLetter: null,
  onboardingStatus: "",
};

export default function MedicalStoreOnboarding() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(INITIAL_DATA);
  const [uploadedDocuments, setUploadedDocuments] = React.useState({});
  const [registrationId, setRegistrationId] = React.useState(() =>
    typeof window === "undefined" ? null : (
      new URLSearchParams(window.location.search).get("registrationId") ||
      localStorage.getItem("pharmacyRegistrationId")
    ),
  );

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
const postEmailOtp = async (path, body) => {
  const baseURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  if (!baseURL) throw new Error("NEXT_PUBLIC_API_URL set karo.");

  const response = await fetch(
    `${baseURL}/api/pharmacy-registration/${path}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Email OTP request failed.");
  }
  return result;
};

const sendStoreEmailOtp = ({ email }) =>
  postEmailOtp("send-email-otp", { registrationId, email });

const verifyStoreEmailOtp = ({ email, otp }) =>
  postEmailOtp("verify-email-otp", { registrationId,  otp });
  const updateData = (newData) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  React.useEffect(() => {
    if (!registrationId) return undefined;

    let cancelled = false;
    const loadRegistration = async () => {
      try {
        const baseURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
          /\/+$/,
          "",
        );
        if (!baseURL) {
          throw new Error("Please configure NEXT_PUBLIC_API_URL in .env.local");
        }

        const headers = {};
        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;
        const response = await fetch(
          `${baseURL}/api/pharmacy-registration/getPharmacyRegistrationById/${encodeURIComponent(registrationId)}`,
          { headers },
        );
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.message ||
              result?.error ||
              `Unable to load registration (${response.status})`,
          );
        }

        const registration = result?.data || {};
        const registrationData =
          registration.registrationData || registration;
        const premises = registrationData.premisesDetails || {};
        const signatory = registrationData.signatoryDetails || {};
        const drugLicence =
          registrationData.drugLicenceDetails ||
          registrationData.drugLicenseDetails ||
          {};
        const pharmacist = registrationData.pharmacistDetails || {};

        if (cancelled) return;

        setData((previous) => ({
          ...previous,
          licensedTradeName:
            registrationData.licensedTradeName ?? previous.licensedTradeName,
          legalEntityName:
            registrationData.legalEntityName ?? previous.legalEntityName,
            storeEmailVerified:
  registration.storeEmailVerified ?? previous.storeEmailVerified ?? false,
          entityType: registrationData.entityType ?? previous.entityType,
          storeEmail: registrationData.storeEmail ?? previous.storeEmail,
          storePhone: registrationData.storePhone ?? previous.storePhone,
          signatoryFullName:
            signatory.fullName ?? previous.signatoryFullName,
          signatoryDesignation:
            signatory.designation ?? previous.signatoryDesignation,
          signatoryEmail: signatory.email ?? previous.signatoryEmail,
          signatoryPhone: signatory.phone ?? previous.signatoryPhone,
          entityPan: signatory.entityPan ?? previous.entityPan,
          personalPan: signatory.personalPan ?? previous.personalPan,
          shopUnit: premises.shopUnit ?? previous.shopUnit,
          street: premises.street ?? previous.street,
          area: premises.area ?? previous.area,
          cityDistrict: premises.cityDistrict ?? previous.cityDistrict,
          state: premises.state ?? previous.state,
          pinCode: premises.pinCode ?? previous.pinCode,
          issuingAuthority:
            drugLicence.issuingAuthority ?? previous.issuingAuthority,
          form20Number: drugLicence.form20Number ?? previous.form20Number,
          form20GrantDate:
            drugLicence.form20GrantDate?.split("T")[0] ??
            previous.form20GrantDate,
          retentionDueDate:
            drugLicence.retentionDueDate?.split("T")[0] ??
            previous.retentionDueDate,
          dispenseScheduleC1:
            drugLicence.dispensesScheduleCC1 ??
            previous.dispenseScheduleC1,
          drugLicenseNumber:
            drugLicence.drugLicenseNumber ?? previous.drugLicenseNumber,
          licenseExpiryDate:
            drugLicence.licenseExpiryDate?.split("T")[0] ??
            previous.licenseExpiryDate,
          pharmacistFullName:
            pharmacist.fullName ?? previous.pharmacistFullName,
          registrationNumber:
            pharmacist.registrationNumber ?? previous.registrationNumber,
          statePharmacyCouncil:
            pharmacist.statePharmacyCouncil ?? previous.statePharmacyCouncil,
          registrationValidityDate:
            pharmacist.registrationValidityDate?.split("T")[0] ??
            previous.registrationValidityDate,
          employmentType:
            pharmacist.employmentType ?? previous.employmentType,
          pharmacistPhone: pharmacist.phone ?? previous.pharmacistPhone,
          hprDigiPharmedId:
            pharmacist.hprDigiPharmedId ?? previous.hprDigiPharmedId,
          gstin: registrationData.gstin ?? previous.gstin,
          gstinApplicable: Boolean(
            registrationData.gstin ?? previous.gstinApplicable,
          ),
          shopEstablishmentNumber:
            registrationData.shopEstablishmentNumber ??
            previous.shopEstablishmentNumber,
          shopEstablishmentApplicable: Boolean(
            registrationData.shopEstablishmentNumber ??
              previous.shopEstablishmentApplicable,
          ),
          udyamRegistrationNumber:
            registrationData.udyamRegistrationNumber ??
            previous.udyamRegistrationNumber,
          retentionFeeRequired:
            registrationData.retentionFeeRequired ??
            previous.retentionFeeRequired,
          appointmentLetterRequired:
            registrationData.appointmentLetterRequired ??
            previous.appointmentLetterRequired,
          collectPayments:
            registrationData.collectPlatformPayments ??
            previous.collectPayments,
          coldChainMedicines:
            registrationData.handlesColdChainMedicines ??
            previous.coldChainMedicines,
          onboardingStatus:
            registration.onboardingStatus ?? previous.onboardingStatus,
        }));
        setUploadedDocuments(
          Object.fromEntries(
            Object.entries(registration.documents || {}).filter(
              ([, value]) => Boolean(value),
            ),
          ),
        );
      } catch (error) {
        if (!cancelled) {
          showSnackbar(
            error.message || "Unable to load saved pharmacy registration.",
            "error",
          );
        }
      }
    };

    loadRegistration();
    return () => {
      cancelled = true;
    };
  }, [registrationId]);

  React.useEffect(() => {
    if (!registrationId) return;

    localStorage.setItem("pharmacyRegistrationId", String(registrationId));
    const url = new URL(window.location.href);
    url.searchParams.set("registrationId", String(registrationId));
    window.history.replaceState({}, "", url);
  }, [registrationId]);

  const handleNext = (nextStep, result) => {
    if (nextStep === 2) {
      const id =
        result?.data?.data?.id ||
        result?.data?.data?.registrationId ||
        result?.data?.id ||
        result?.data?.registrationId ||
        (typeof result?.data === "number" || typeof result?.data === "string"
          ? result.data
          : null) ||
        result?.id ||
        result?.registrationId ||
        registrationId;

      if (!id) {
        showSnackbar(
          "Registration ID was not returned by the server.",
          "error",
        );
        return;
      }

      setRegistrationId(id);
      localStorage.setItem("pharmacyRegistrationId", String(id));
    }

    setActiveStep(nextStep);
  };

  const saveAndNavigate = async (nextStep) => {
    if (!registrationId) {
      showSnackbar(
        "Registration ID not found. Please complete Step 1 first.",
        "error",
      );
      return;
    }

    try {
      setLoading(true);
      const baseURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
        /\/+$/,
        "",
      );
      if (!baseURL) {
        throw new Error("Please configure NEXT_PUBLIC_API_URL in .env.local");
      }

      let payload = { registrationId: String(registrationId) };
     if (activeStep === 2) {
  payload.drugLicenceDetails = {
    ...(data.drugLicenseNumber?.trim()
      ? { drugLicenseNumber: data.drugLicenseNumber.trim() }
      : {}),
    ...(data.licenseExpiryDate
      ? { licenseExpiryDate: data.licenseExpiryDate }
      : {}),
  };

  if (
    (data.gstinApplicable || data.collectPayments) &&
    data.gstin.trim()
  ) {
    payload.gstin = data.gstin.trim().toUpperCase();
  }
} else if (activeStep === 3) {
        payload = {
          ...payload,
          drugLicenceDetails: {
            ...(data.issuingAuthority.trim()
              ? { issuingAuthority: data.issuingAuthority.trim() }
              : {}),
            ...(data.form20Number.trim()
              ? { form20Number: data.form20Number.trim() }
              : {}),
            ...(data.form20GrantDate
              ? { form20GrantDate: data.form20GrantDate }
              : {}),
            ...(data.retentionDueDate
              ? { retentionDueDate: data.retentionDueDate }
              : {}),
            dispensesScheduleCC1: Boolean(data.dispenseScheduleC1),
          },
          pharmacistDetails: {
            ...(data.pharmacistFullName.trim()
              ? { fullName: data.pharmacistFullName.trim() }
              : {}),
            ...(data.registrationNumber.trim()
              ? { registrationNumber: data.registrationNumber.trim() }
              : {}),
            ...(data.statePharmacyCouncil.trim()
              ? { statePharmacyCouncil: data.statePharmacyCouncil.trim() }
              : {}),
            ...(data.registrationValidityDate
              ? { registrationValidityDate: data.registrationValidityDate }
              : {}),
            ...(data.employmentType
              ? { employmentType: data.employmentType }
              : {}),
            ...(data.pharmacistPhone
              ? { phone: data.pharmacistPhone }
              : {}),
            ...(data.hprDigiPharmedId.trim()
              ? { hprDigiPharmedId: data.hprDigiPharmedId.trim() }
              : {}),
          },
        };
      } else if (activeStep === 4) {
        payload = {
          ...payload,
          ...(data.shopEstablishmentApplicable &&
          data.shopEstablishmentNumber?.trim()
            ? { shopEstablishmentNumber: data.shopEstablishmentNumber.trim() }
            : {}),
          ...(data.udyamRegistrationNumber?.trim()
            ? { udyamRegistrationNumber: data.udyamRegistrationNumber.trim() }
            : {}),
          retentionFeeRequired: Boolean(data.retentionFeeRequired),
          appointmentLetterRequired: Boolean(data.appointmentLetterRequired),
          collectPlatformPayments: Boolean(data.collectPayments),
          handlesColdChainMedicines: Boolean(data.coldChainMedicines),
        };
      }

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        `${baseURL}/api/pharmacy-registration/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.errors?.join("\n") ||
            result?.message ||
            result?.error ||
            `Unable to save registration (${response.status})`,
        );
      }

      setActiveStep(nextStep);
    } catch (error) {
      showSnackbar(error.message || "Unable to save registration.", "error");
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (field, file) => {
    if (!registrationId) {
      throw new Error("Registration ID not found. Please complete Step 1 first.");
    }

    const baseURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
      /\/+$/,
      "",
    );
    if (!baseURL) {
      throw new Error("Please configure NEXT_PUBLIC_API_URL in .env.local");
    }

    const formData = new FormData();
    formData.append("registrationId", String(registrationId));
    formData.append(field, file);
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(
      `${baseURL}/api/pharmacy-registration/upload-documents`,
      {
        method: "POST",
        headers,
        body: formData,
      },
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result?.success === false) {
      throw new Error(
        result?.message ||
          result?.error ||
          `Unable to upload ${file.name} (${response.status})`,
      );
    }

    setUploadedDocuments((previous) => ({
      ...previous,
      [field]: result?.data?.documents?.[field] || file.name,
    }));
  };

 const handleFinalSubmit = async ({ declarationAccepted } = {}) => {
  try {
    setLoading(true);

    const baseURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    if (!baseURL) throw new Error("NEXT_PUBLIC_API_URL set karo.");
    if (!registrationId) throw new Error("Registration ID nahi mila.");
    if (!declarationAccepted) throw new Error("Sab declarations accept karo.");

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(
      `${baseURL}/api/pharmacy-registration/submit`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ registrationId: Number(registrationId) }),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(result.message || result.error || "Registration submit nahi hua.");
    }

    setData((prev) => ({ ...prev, onboardingStatus: "SUBMITTED" }));
    showSnackbar("Medical store registration submitted successfully.", "success");
  } catch (error) {
    showSnackbar(error.message || "Registration submit nahi hua.", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "calc(100vh - 76px)",
          px: { xs: 1.5, sm: 2.5, lg: 4 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 4, md: 6 },
          backgroundColor: "#F5F9F7",
          backgroundImage:
            "radial-gradient(ellipse at 8% 0%, rgba(7,135,106,0.10), transparent 34%), radial-gradient(ellipse at 100% 22%, rgba(52,211,153,0.08), transparent 30%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1360px",
            mx: "auto",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={1.5}
            sx={{ mb: { xs: 2.5, md: 3 } }}
          >
            <Box>
              <Typography
                sx={{
                  mb: 0.5,
                  color: "#07876A",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Pharmacy partner onboarding
              </Typography>
              <Typography
                component="h1"
                sx={{
                  color: "#172033",
                  fontSize: { xs: "22px", sm: "26px" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: "-0.025em",
                }}
              >
                Register your medical store
              </Typography>
              <Typography
                sx={{
                  mt: 0.7,
                  color: "#66736E",
                  fontSize: { xs: "12px", sm: "13px" },
                }}
              >
                Complete the steps below to submit your pharmacy profile.
              </Typography>
            </Box>

            <Chip
              icon={<LockOutlinedIcon sx={{ fontSize: "16px !important" }} />}
              label="Secure registration"
              size="small"
              sx={{
                height: 32,
                px: 0.5,
                border: "1px solid #D7E9E1",
                bgcolor: "rgba(255,255,255,0.82)",
                color: "#08765D",
                fontSize: "11px",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#07876A" },
              }}
            />
          </Stack>

          <Grid
            container
            spacing={{ xs: 2, md: 2.5 }}
            sx={{
              alignItems: "stretch",
            }}
          >
            {/* LEFT SIDEBAR */}
            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{
                alignSelf: "flex-start",
                position: { md: "sticky" },
                top: { md: 88 },
              }}
            >
              <Sidebar
                activeStep={activeStep}
                onStepChange={setActiveStep}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 9 }}
              sx={{
                minWidth: 0,
                alignSelf: "stretch",
              }}
            >
              {activeStep === 1 && (
                <StoreInformationForm
                  data={data}
                  registrationId={registrationId}
                  onChange={updateData}
                  onNext={(result) => handleNext(2, result)}
                  loading={loading}
                />
              )}

              {activeStep === 2 && (
                <LicenseBusinessForm
                  data={data}
                  onChange={updateData}
                  onBack={() => handleNext(1)}
                  onNext={() => saveAndNavigate(3)}
                  loading={loading}
                />
              )}

              {activeStep === 3 && (
                <AddressForm
                  data={data}
                  onChange={updateData}
                  onBack={() => handleNext(2)}
                  onNext={() => saveAndNavigate(4)}
                  loading={loading}
                />
              )}

              {activeStep === 4 && (
                <DocumentsForm
                  data={data}
                  onChange={updateData}
                  uploadedDocuments={uploadedDocuments}
                  onUploadDocument={uploadDocument}
                  onBack={() => handleNext(3)}
                  onNext={() => saveAndNavigate(5)}
                  loading={loading}
                />
              )}

              {activeStep === 5 && (
                <Verification
                  data={data}
                  uploadedDocuments={uploadedDocuments}
                  onBack={() => handleNext(4)}
                  onSubmit={handleFinalSubmit}
                  loading={loading}
                  onSendOtp={sendStoreEmailOtp}
                  onVerifyOtp={verifyStoreEmailOtp}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{
            borderRadius: "10px",
            fontSize: "12px",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

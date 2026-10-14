"use client";

import * as React from "react";
import { Alert, Box, Grid, Snackbar } from "@mui/material";

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
  const [registrationId, setRegistrationId] = React.useState(() =>
    typeof window === "undefined"
      ? null
      : localStorage.getItem("pharmacyRegistrationId"),
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

  const updateData = (newData) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const handleNext = (nextStep, result) => {
    if (nextStep === 2) {
      const id =
        result?.data?.data?.id ||
        result?.data?.data?.registrationId ||
        result?.data?.id ||
        result?.data?.registrationId ||
        result?.id ||
        result?.registrationId;

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

  const handleFinalSubmit = async ({ declarationAccepted } = {}) => {
    try {
      setLoading(true);
      const baseURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
        /\/+$/,
        "",
      );

      if (!baseURL) {
        throw new Error("Please configure NEXT_PUBLIC_API_URL in .env.local");
      }

      if (!registrationId) {
        throw new Error(
          "Registration ID not found. Please complete Step 1 first.",
        );
      }

      if (!declarationAccepted) {
        throw new Error("Please accept all declarations before submitting.");
      }

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const payload = {
        registrationId,
        licensedTradeName: data.licensedTradeName.trim(),
        legalEntityName: data.legalEntityName.trim(),
        entityType: data.entityType,
        storeEmail: data.storeEmail.trim(),
        storePhone: data.storePhone,
        premisesDetails: {
          shopUnit: data.shopUnit.trim(),
          street: data.street.trim(),
          area: data.area.trim(),
          cityDistrict: data.cityDistrict.trim(),
          state: data.state.trim(),
          pinCode: data.pinCode,
        },
        signatoryDetails: {
          fullName: data.signatoryFullName.trim(),
          designation: data.signatoryDesignation.trim(),
          email: data.signatoryEmail.trim(),
          phone: data.signatoryPhone,
          entityPan:
            data.entityType !== "Proprietorship" && data.entityPan
              ? data.entityPan.trim().toUpperCase()
              : null,
          personalPan:
            data.entityType === "Proprietorship" && data.personalPan
              ? data.personalPan.trim().toUpperCase()
              : null,
        },
        drugLicenceDetails: {
          issuingAuthority: data.issuingAuthority.trim(),
          form20Number: data.form20Number.trim(),
          form20GrantDate: data.form20GrantDate,
          retentionDueDate: data.retentionDueDate,
          dispensesScheduleCC1: Boolean(data.dispenseScheduleC1),
          drugLicenseNumber: data.drugLicenseNumber.trim(),
          licenseExpiryDate: data.licenseExpiryDate,
        },
        pharmacistDetails: {
          fullName: data.pharmacistFullName.trim(),
          registrationNumber: data.registrationNumber.trim(),
          statePharmacyCouncil: data.statePharmacyCouncil.trim(),
          registrationValidityDate: data.registrationValidityDate,
          employmentType: data.employmentType,
          phone: data.pharmacistPhone,
          hprDigiPharmedId: data.hprDigiPharmedId.trim(),
        },
        gstin:
          (data.gstinApplicable || data.collectPayments) && data.gstin
            ? data.gstin.trim().toUpperCase()
            : null,
        shopEstablishmentNumber:
          data.shopEstablishmentApplicable
            ? (data.shopEstablishmentNumber || "").trim()
            : null,
        udyamRegistrationNumber:
          (data.udyamRegistrationNumber || "").trim() || null,
        retentionFeeRequired: Boolean(data.retentionFeeRequired),
        appointmentLetterRequired: Boolean(data.appointmentLetterRequired),
        collectPlatformPayments: Boolean(data.collectPayments),
        handlesColdChainMedicines: Boolean(data.coldChainMedicines),
        declarationAccepted: true,
      };

      const registrationResponse = await fetch(
        `${baseURL}/api/pharmacy-registration/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        },
      );

      if (!registrationResponse.ok) {
        const body = await registrationResponse.text();
        let message = body;
        try {
          const errorResult = JSON.parse(body);
          message = errorResult.message || errorResult.error || body;
        } catch {
          // Non-JSON error bodies are displayed as returned by the API.
        }
        throw new Error(
          message || `Unable to save registration (${registrationResponse.status})`,
        );
      }

      const registrationResult = await registrationResponse.json();
      if (registrationResult?.success === false) {
        throw new Error(
          registrationResult.message || "Unable to save registration.",
        );
      }

      const formData = new FormData();
      formData.append("registrationId", String(registrationId));

      [
        "retentionFeeReceipt",
        "pharmacistRegistrationCertificate",
        "entityProof",
        "panCard",
        "pharmacistAppointmentLetter",
      ].forEach((field) => {
        const file = data[field];
        if (file instanceof File) formData.append(field, file);
      });

      const uploadResponse = await fetch(
        `${baseURL}/api/pharmacy-registration/upload-documents`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        const body = await uploadResponse.text();
        let message = body;
        try {
          const errorResult = JSON.parse(body);
          message = errorResult.message || errorResult.error || body;
        } catch {
          // Non-JSON error bodies are displayed as returned by the API.
        }
        throw new Error(
          message || `Unable to upload documents (${uploadResponse.status})`,
        );
      }

      if (
        uploadResponse.headers
          .get("content-type")
          ?.includes("application/json")
      ) {
        const uploadResult = await uploadResponse.json();
        if (uploadResult?.success === false) {
          throw new Error(
            uploadResult.message || "Unable to upload documents.",
          );
        }
      }

      setData((prev) => ({
        ...prev,
        onboardingStatus: "SUBMITTED",
      }));

      showSnackbar(
        "Medical store registration submitted successfully.",
        "success",
      );
    } catch (error) {
      showSnackbar(
        error.message || "Something went wrong while submitting registration.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          backgroundColor: "#FFFFFF",

          backgroundImage: `
    linear-gradient(
      90deg,
      rgba(7, 135, 106, 0.13) 0%,
      rgba(7, 135, 106, 0.05) 25%,
      rgba(255, 255, 255, 0.35) 45%,
      rgba(255, 255, 255, 0.35) 55%,
      rgba(7, 135, 106, 0.05) 75%,
      rgba(7, 135, 106, 0.13) 100%
    ),
    linear-gradient(
      135deg,
      rgba(7, 135, 106, 0.09) 0%,
      rgba(52, 211, 153, 0.035) 45%,
      rgba(255, 255, 255, 0.08) 100%
    ),
    linear-gradient(
      135deg,
      rgba(7, 135, 106, 0.18) 0%,
      rgba(52, 211, 153, 0.08) 50%,
      rgba(255, 255, 255, 0.45) 100%
    ),
    linear-gradient(rgba(7, 135, 106, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(7, 135, 106, 0.16) 1px, transparent 1px)
  `,

          backgroundSize: `
    100% 100%,
    100% 100%,
    40px 40px,
    40px 40px,
    40px 40px
  `,

          backgroundPosition: `
    center,
    center,
    0 0,
    0 0,
    0 0
  `,

          pt: { xs: 3, md: 2 },
          pb: { xs: 4, md: 5 },
          px: { xs: 1.25, sm: 2, md: 3 },
          textAlign: "left",
          position: "relative",
          overflow: "visible",
          minHeight: "calc(100vh - 110px)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1500px",
            mx: "auto",
          }}
        >
          <Grid
            container
            spacing={{ xs: 1.5, md: 2 }}
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
                top: { md: 16 },
              }}
            >
              <Sidebar activeStep={activeStep} onStepChange={setActiveStep} />
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
                  onNext={() => handleNext(3)}
                  loading={loading}
                />
              )}

              {activeStep === 3 && (
                <AddressForm
                  data={data}
                  onChange={updateData}
                  onBack={() => handleNext(2)}
                  onNext={() => handleNext(4)}
                  loading={loading}
                />
              )}

              {activeStep === 4 && (
                <DocumentsForm
                  data={data}
                  onChange={updateData}
                  onBack={() => handleNext(3)}
                  onNext={() => handleNext(5)}
                  loading={loading}
                />
              )}

              {activeStep === 5 && (
                <Verification
                  data={data}
                  onBack={() => handleNext(4)}
                  onSubmit={handleFinalSubmit}
                  loading={loading}
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

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";

import LabInformationForm from "./LabInformationForm";
import LabAddressForm from "./LabAddressForm";
import LabLicenseBusinessForm from "./LabLicenseBusinessForm";
import LabServicesForm from "./LabServicesForm";
import LabDocumentsForm from "./LabDocumentsForm";
import LabVerification from "./LabVerification";

/* =========================================================
   COLORS
========================================================= */

const C = {
  primary: "#07876A",
  primaryDark: "#066F58",

  soft: "#EAF6F1",
  soft2: "#F7FBF9",

  bg: "#F8FAF9",
  white: "#FFFFFF",

  text: "#172033",
  muted: "#74807B",

  border: "#DDE9E5",
  error: "#E5484D",
};

const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    ""
  );

  if (!baseUrl) {
    throw new Error(
      "Please configure NEXT_PUBLIC_API_URL in .env.local"
    );
  }

  return baseUrl;
};

/* =========================================================
   STEPS
========================================================= */

const steps = [
  {
    title: "Lab Information",
    subtitle: "Basic details about your lab",
    icon: ScienceOutlinedIcon,
  },
  {
    title: "Lab Address",
    subtitle: "Laboratory location details",
    icon: LocationOnOutlinedIcon,
  },
  {
    title: "License Details",
    subtitle: "Registration & business details",
    icon: DescriptionOutlinedIcon,
  },
  {
    title: "Lab Services",
    subtitle: "Tests & diagnostic services",
    icon: BiotechOutlinedIcon,
  },
  {
    title: "Documents",
    subtitle: "Upload required documents",
    icon: FolderOutlinedIcon,
  },
  {
    title: "Verification",
    subtitle: "Verify, review and submit",
    icon: VerifiedUserOutlinedIcon,
  },
];

/* =========================================================
   INITIAL DATA
========================================================= */

const initialData = {
  /* LAB INFORMATION */
  labName: "",
  labType: "",
  email: "",
  phone: "",

  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerAge: "",
  ownerGender: "",

  /* ADDRESS */
  shopUnitNumber: "",
  buildingName: "",
  streetAddress: "",
  areaLocality: "",
  landmark: "",
  pinCode: "",
  city: "",
  state: "",

  /* LICENSE */
  labRegistrationNumber: "",
  licenseExpiryDate: "",
  gstin: "",

  /* SERVICES */
  services: [],

  /* DOCUMENTS */
  labRegistrationDocument: null,
  governmentIdProof: null,
  businessProof: null,
  gstCertificate: null,
};

/* =========================================================
   SIDEBAR STEP
========================================================= */

function SidebarStep({ step, index, activeStep }) {
  const active = activeStep === index;
  const completed = activeStep > index;

  const Icon = step.icon;

  return (
    <Box
      sx={{
        position: "relative",
        pb: index === steps.length - 1 ? 0 : 0.75,
      }}
    >
      {/* CONNECTING LINE */}

      {index !== steps.length - 1 && (
        <Box
          sx={{
            position: "absolute",
            left: 19,
            top: 48,
            height: 20,
            borderLeft: "1px dashed #D7E4E0",
          }}
        />
      )}

      <Box
        sx={{
          minHeight: 58,

          px: active ? 1.1 : 0.75,
          py: 0.8,

          display: "flex",
          alignItems: "center",

          gap: 1,

          borderRadius: "10px",

          border: active
            ? "1px solid rgba(7,135,106,0.30)"
            : "1px solid transparent",

          bgcolor: active ? C.soft : "transparent",
        }}
      >
        {/* NUMBER */}

        <Box
          sx={{
            width: 38,
            height: 38,

            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            borderRadius: "9px",

            bgcolor: active
              ? C.primary
              : completed
              ? "#E4F3ED"
              : "#F0F3F2",

            color: active
              ? "#FFFFFF"
              : completed
              ? C.primary
              : "#63746F",

            fontSize: "11px",
            fontWeight: 800,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </Box>

        {/* STEP CONTENT */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Stack
            direction="row"
            spacing={0.65}
            alignItems="center"
          >
            <Icon
              sx={{
                fontSize: 14,
                color:
                  active || completed
                    ? C.primary
                    : "#71827D",
              }}
            />

            <Typography
              sx={{
                fontSize: "10.5px",
                fontWeight: active ? 750 : 650,
                color: active ? C.primary : C.text,
                lineHeight: 1.2,
              }}
            >
              {step.title}
            </Typography>
          </Stack>

          <Typography
            sx={{
              mt: 0.3,
              pl: "20px",

              fontSize: "8.8px",
              lineHeight: 1.3,

              color: C.muted,
            }}
          >
            {step.subtitle}
          </Typography>
        </Box>

        {/* ACTIVE DOT */}

        {active && (
          <Box
            sx={{
              width: 7,
              height: 7,

              flexShrink: 0,

              borderRadius: "50%",
              bgcolor: C.primary,

              boxShadow:
                "0 0 0 4px rgba(7,135,106,0.10)",
            }}
          />
        )}
      </Box>
    </Box>
  );
}

/* =========================================================
   DESKTOP SIDEBAR
========================================================= */

function DesktopSidebar({ activeStep }) {
  const progress =
    ((activeStep + 1) / steps.length) * 100;

  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: "flex",
        },

        width: 300,
        flexShrink: 0,

        flexDirection: "column",

        px: 2,
        py: 1.8,

        bgcolor: "#FFFFFF",

        borderRight: `1px solid ${C.border}`,
      }}
    >
      {/* SIDEBAR HEADER */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 800,
              color: C.text,
            }}
          >
            Onboarding Steps
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: "9.5px",
              color: C.muted,
            }}
          >
            Complete your lab profile
          </Typography>
        </Box>

        <Chip
          label={`${activeStep + 1} / ${steps.length}`}
          size="small"
          sx={{
            height: 25,

            bgcolor: C.soft,
            color: C.primary,

            borderRadius: "9px",

            fontSize: "10px",
            fontWeight: 800,

            "& .MuiChip-label": {
              px: 1.1,
            },
          }}
        />
      </Stack>

      {/* PROGRESS */}

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt: 1.4,
          mb: 1.35,

          height: 3.5,

          borderRadius: "20px",

          bgcolor: "#E7EFEC",

          "& .MuiLinearProgress-bar": {
            bgcolor: C.primary,
            borderRadius: "20px",
          },
        }}
      />

      {/* STEPS */}

      <Box>
        {steps.map((step, index) => (
          <SidebarStep
            key={step.title}
            step={step}
            index={index}
            activeStep={activeStep}
          />
        ))}
      </Box>

      {/* SECURE CARD */}

      <Box
        sx={{
          mt: "auto",
          pt: 1.4,
        }}
      >
        <Box
          sx={{
            p: 1.15,

            display: "flex",
            alignItems: "flex-start",

            gap: 0.8,

            border: `1px solid ${C.border}`,
            borderRadius: "10px",

            bgcolor: "#F8FBFA",
          }}
        >
          <Box
            sx={{
              width: 31,
              height: 31,

              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              bgcolor: C.soft,
              borderRadius: "8px",
            }}
          >
            <LockOutlinedIcon
              sx={{
                fontSize: 15,
                color: C.primary,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "9.8px",
                fontWeight: 750,
                color: C.text,
              }}
            >
              Your information is secure
            </Typography>

            <Typography
              sx={{
                mt: 0.15,

                fontSize: "8.5px",
                lineHeight: 1.4,

                color: C.muted,
              }}
            >
              Your details are securely stored and used only
              for verification.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* =========================================================
   MOBILE PROGRESS
========================================================= */

function MobileProgress({ activeStep }) {
  const current = steps[activeStep];
  const Icon = current.icon;

  const progress =
    ((activeStep + 1) / steps.length) * 100;

  return (
    <Box
      sx={{
        display: {
          xs: "block",
          md: "none",
        },

        px: 1.5,
        py: 1.2,

        bgcolor: "#FFFFFF",

        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack
          direction="row"
          spacing={0.8}
          alignItems="center"
        >
          <Box
            sx={{
              width: 32,
              height: 32,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "8px",
              bgcolor: C.soft,
            }}
          >
            <Icon
              sx={{
                fontSize: 17,
                color: C.primary,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "10.5px",
                fontWeight: 750,
                color: C.text,
              }}
            >
              {current.title}
            </Typography>

            <Typography
              sx={{
                fontSize: "8.5px",
                color: C.muted,
              }}
            >
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </Box>
        </Stack>

        <Typography
          sx={{
            fontSize: "9.5px",
            fontWeight: 750,
            color: C.primary,
          }}
        >
          {Math.round(progress)}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt: 0.9,

          height: 3,

          borderRadius: "20px",

          bgcolor: "#E7EFEC",

          "& .MuiLinearProgress-bar": {
            bgcolor: C.primary,
          },
        }}
      />
    </Box>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function LabOnboarding() {
  const [activeStep, setActiveStep] = useState(0);

  const [data, setData] = useState(initialData);

  const [loading, setLoading] = useState(false);
  const [registrationId, setRegistrationId] = useState(() =>
    typeof window === "undefined"
      ? null
      : localStorage.getItem("labRegistrationId")
  );
  const [saveError, setSaveError] = useState("");

  /* =========================================================
     UPDATE DATA
  ========================================================= */

  const updateData = (values) => {
    setData((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const loadRegistration = async (id) => {
    const response = await axios.get(
      `${getApiBaseUrl()}/api/lab-registration/getLabRegistrationById/${id}`
    );

    if (response.data?.success === false) {
      throw new Error(
        response.data.message ||
          "Unable to fetch lab registration."
      );
    }

    const registration =
      response.data?.data?.registrationData ||
      response.data?.data ||
      {};
    const labInformation = registration.labInformation || {};
    const labAddress = registration.labAddress || {};
    const licenseBusiness = registration.licenseBusiness || {};

    setData((previous) => ({
      ...previous,
      labName:
        labInformation.diagnosticLabName ??
        labInformation.labName ??
        previous.labName,
      labType: labInformation.labType ?? previous.labType,
      email:
        labInformation.labContactEmail ??
        labInformation.email ??
        previous.email,
      phone:
        labInformation.labContactPhone ??
        labInformation.phone ??
        previous.phone,
      ownerName:
        labInformation.ownerFullName ??
        labInformation.ownerName ??
        previous.ownerName,
      ownerEmail: labInformation.ownerEmail ?? previous.ownerEmail,
      ownerPhone: labInformation.ownerPhone ?? previous.ownerPhone,
      ownerAge: labInformation.ownerAge ?? previous.ownerAge,
      ownerGender: labInformation.ownerGender ?? previous.ownerGender,
      shopUnitNumber:
        labAddress.shopUnitNumber ?? previous.shopUnitNumber,
      buildingName:
        labAddress.buildingComplexName ?? previous.buildingName,
      streetAddress:
        labAddress.streetRoadName ?? previous.streetAddress,
      areaLocality: labAddress.areaLocality ?? previous.areaLocality,
      landmark: labAddress.landmark ?? previous.landmark,
      pinCode: labAddress.pinCode ?? previous.pinCode,
      city: labAddress.cityTown ?? previous.city,
      state: labAddress.state ?? previous.state,
      labRegistrationNumber:
        licenseBusiness.registrationLicenseNumber ??
        previous.labRegistrationNumber,
      licenseExpiryDate:
        licenseBusiness.licenseExpiryDate?.split("T")[0] ??
        previous.licenseExpiryDate,
      gstin: licenseBusiness.gstin ?? previous.gstin,
      services: registration.services ?? previous.services,
    }));

    return response.data;
  };

  useEffect(() => {
    if (!registrationId) return;

    loadRegistration(registrationId).catch((error) => {
      console.error("Lab registration fetch error:", error);
      setSaveError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load saved lab registration."
      );
    });
  }, [registrationId]);

  /* =========================================================
     NEXT
  ========================================================= */

  const next = () => {
    setActiveStep((prev) =>
      Math.min(prev + 1, steps.length - 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     BACK
  ========================================================= */

  const back = () => {
    setActiveStep((prev) =>
      Math.max(prev - 1, 0)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

const handleInformationNext = async () => {
  try {
    setLoading(true);
    setSaveError("");

    const payload = {
      ...(registrationId
        ? { registrationId: String(registrationId) }
        : {}),
      labInformation: {
        diagnosticLabName: data.labName.trim(),
        labType: data.labType,
        labContactEmail: data.email.trim(),
        labContactPhone: data.phone,
        ownerFullName: data.ownerName.trim(),
        ownerEmail: data.ownerEmail.trim(),
        ownerPhone: data.ownerPhone,
        ownerAge: Number(data.ownerAge),
        ownerGender: data.ownerGender,
      },
    };

    const response = await axios.post(
      `${getApiBaseUrl()}/api/lab-registration/create`,
      payload
    );

    if (response.data?.success === false) {
      throw new Error(
        response.data.message || "Unable to save lab information."
      );
    }

    const id =
      response.data?.data?.registrationId ||
      response.data?.data?.id ||
      response.data?.registrationId ||
      response.data?.id ||
      registrationId;

    if (!id) {
      throw new Error("Registration ID was not returned by the server.");
    }

    setRegistrationId(String(id));
    localStorage.setItem("labRegistrationId", String(id));
    next();
  } catch (error) {
    console.error("Lab information save error:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to save lab information."
    );
  } finally {
    setLoading(false);
  }
};
  const handleAddressNext = async () => {
    if (!registrationId) {
      setSaveError(
        "Registration ID not found. Please complete Lab Information first."
      );
      return;
    }

    try {
      setLoading(true);
      setSaveError("");
      const response = await axios.post(
        `${getApiBaseUrl()}/api/lab-registration/create`,
        {
          registrationId,
          labAddress: {
            shopUnitNumber: data.shopUnitNumber.trim(),
            buildingComplexName: data.buildingName.trim(),
            streetRoadName: data.streetAddress.trim(),
            areaLocality: data.areaLocality.trim(),
            landmark: data.landmark.trim(),
            pinCode: data.pinCode,
            cityTown: data.city.trim(),
            state: data.state,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Unable to save lab address.");
      }

      next();
    } catch (error) {
      console.error("Lab address save error:", error);
      setSaveError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save lab address."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLicenseNext = async () => {
    if (!registrationId) {
      setSaveError(
        "Registration ID not found. Please complete Lab Information first."
      );
      return;
    }

    try {
      setLoading(true);
      setSaveError("");
      const response = await axios.post(
        `${getApiBaseUrl()}/api/lab-registration/create`,
        {
          registrationId,
          licenseBusiness: {
            registrationLicenseNumber:
              data.labRegistrationNumber.trim(),
            licenseExpiryDate: data.licenseExpiryDate,
            gstin: data.gstin.trim(),
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message ||
            "Unable to save license and business details."
        );
      }

      next();
    } catch (error) {
      console.error("Lab license details save error:", error);
      setSaveError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save license and business details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentsNext = async () => {
    if (!registrationId) {
      setSaveError(
        "Registration ID not found. Please complete Lab Information first."
      );
      return;
    }

    try {
      setLoading(true);
      setSaveError("");
      const formData = new FormData();
      formData.append("registrationId", String(registrationId));
      formData.append(
        "labRegistrationCertificate",
        data.labRegistrationDocument
      );
      formData.append("governmentIdProof", data.governmentIdProof);
      formData.append("businessProof", data.businessProof);
      if (data.gstCertificate) {
        formData.append("gstCertificate", data.gstCertificate);
      }

      const response = await axios.post(
        `${getApiBaseUrl()}/api/lab-registration/upload-documents`,
        formData
      );
      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to upload lab documents."
        );
      }
      next();
    } catch (error) {
      console.error("Lab document upload error:", error);
      setSaveError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to upload lab documents."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SEND OTP
  ========================================================= */

  const handleSendOtp = async ({ email }) => {
    if (!registrationId) {
      throw new Error(
        "Registration ID not found. Please complete Lab Information first."
      );
    }

    const response = await axios.post(
      `${getApiBaseUrl()}/api/lab-registration/send-email-otp`,
      {  email }
    );

    if (response.data?.success === false) {
      throw new Error(
        response.data.message ||
          "Unable to send verification code."
      );
    }

    return response.data;
  };

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const handleVerifyOtp = async ({ email, otp }) => {
    if (!registrationId) {
      throw new Error(
        "Registration ID not found. Please complete Lab Information first."
      );
    }

    const response = await axios.post(
      `${getApiBaseUrl()}/api/lab-registration/verify-email-otp`,
      {  otp }
    );

    if (
      response.data?.success === false ||
      response.data?.verified === false
    ) {
      throw new Error(
        response.data.message ||
          "Email verification failed."
      );
    }

    return response.data;
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!registrationId) {
        throw new Error(
          "Registration ID not found. Please complete Lab Information first."
        );
      }

      const formData = new FormData();
      formData.append("registrationId", String(registrationId));

      Object.entries(data).forEach(([key, value]) => {
        if (value == null) return;

        if (
          typeof File !== "undefined" &&
          value instanceof File
        ) {
          formData.append(key, value);
          return;
        }

        formData.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : String(value)
        );
      });

      const response = await axios.post(
        `${getApiBaseUrl()}/api/lab-registration/create`,
        formData
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Lab registration submission failed."
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Lab registration error:",
        error
      );
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Lab registration submission failed."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FORM
  ========================================================= */

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <LabInformationForm
            data={data}
            onChange={updateData}
            onNext={handleInformationNext}
            loading={loading}
          />
        );

      case 1:
        return (
          <LabAddressForm
            data={data}
            onChange={updateData}
            onBack={back}
            onNext={handleAddressNext}
          />
        );

      case 2:
        return (
          <LabLicenseBusinessForm
            data={data}
            onChange={updateData}
            onBack={back}
            onNext={handleLicenseNext}
          />
        );

      case 3:
        return (
          <LabServicesForm
            data={data}
            onChange={updateData}
            onBack={back}
            onNext={next}
          />
        );

      case 4:
        return (
          <LabDocumentsForm
            data={data}
            onChange={updateData}
            onBack={back}
            onNext={handleDocumentsNext}
            loading={loading}
          />
        );

      case 5:
        return (
          <LabVerification
            data={data}
            onBack={back}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
            onSubmit={handleSubmit}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: C.bg,

        py: {
          xs: 1,
          md: 2,
        },

        px: {
          xs: 1,
          md: 2,
        },
      }}
    >
      {/* =====================================================
          DOCTOR REGISTRATION JAISE CENTERED CONTAINER
      ===================================================== */}

      <Box
        sx={{
          width: "100%",

          // IMPORTANT
          // Full screen width nahi lega
          maxWidth: "1400px",

          mx: "auto",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",

            display: "flex",
            alignItems: "stretch",

            overflow: "hidden",

            bgcolor: C.white,

            border: `1px solid ${C.border}`,

            borderRadius: {
              xs: "12px",
              md: "18px",
            },

            boxShadow:
              "0 12px 35px rgba(23,32,51,0.04)",
          }}
        >
          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <DesktopSidebar activeStep={activeStep} />

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <Box
            sx={{
              flex: 1,
              minWidth: 0,

              display: "flex",
              flexDirection: "column",
            }}
          >
            <MobileProgress activeStep={activeStep} />

            <Box
              sx={{
                px: {
                  xs: 1.5,
                  sm: 2.5,
                  md: 3,
                },

                py: {
                  xs: 1.5,
                  md: 2,
                },
              }}
            >
              {/* =============================================
                  HEADER
              ============================================= */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
                spacing={1}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,

                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      bgcolor: C.soft,

                      borderRadius: "10px",
                    }}
                  >
                    <HealthAndSafetyOutlinedIcon
                      sx={{
                        fontSize: 21,
                        color: C.primary,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "16px",
                          md: "18px",
                        },

                        fontWeight: 800,

                        lineHeight: 1.2,

                        color: C.primaryDark,
                      }}
                    >
                      Lab Verification & Onboarding
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,

                        fontSize: "10px",

                        color: C.muted,
                      }}
                    >
                      Join our trusted network of diagnostic
                      healthcare providers
                    </Typography>
                  </Box>
                </Stack>

                {/* REQUIRED */}

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                >
                  <VerifiedUserOutlinedIcon
                    sx={{
                      fontSize: 15,
                      color: "#71847D",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "9.5px",
                      color: C.muted,

                      whiteSpace: "nowrap",
                    }}
                  >
                    All fields marked with{" "}
                    <Box
                      component="span"
                      sx={{
                        color: C.error,
                        fontWeight: 700,
                      }}
                    >
                      *
                    </Box>{" "}
                    are required
                  </Typography>
                </Stack>
              </Stack>

              {/* =============================================
                  INFO BOX
              ============================================= */}

              <Box
                sx={{
                  mt: 1.5,

                  px: 1.3,
                  py: 1.1,

                  display: "flex",
                  alignItems: "flex-start",

                  gap: 0.8,

                  bgcolor: C.soft,

                  borderRadius: "10px",
                }}
              >
                <InfoOutlinedIcon
                  sx={{
                    mt: "1px",

                    fontSize: 18,

                    color: C.primary,

                    flexShrink: 0,
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      fontWeight: 750,
                      color: C.text,
                    }}
                  >
                    Why do we collect this information?
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.1,

                      fontSize: "9.5px",
                      lineHeight: 1.4,

                      color: C.muted,
                    }}
                  >
                    To verify your laboratory, validate
                    registration details and create your lab
                    account after approval.
                  </Typography>
                </Box>
              </Box>

              {/* DIVIDER */}

              <Box
                sx={{
                  my: 1.5,

                  height: "1px",

                  bgcolor: C.border,
                }}
              />

              {/* =============================================
                  FORM
              ============================================= */}

              <Box
                sx={{
                  /*
                   * Existing Lab forms ke bade input ko bhi
                   * Doctor registration jaisa compact karega.
                   */

                  "& .MuiInputBase-root": {
                    minHeight: "44px",
                  },

                  "& .MuiOutlinedInput-input": {
                    fontSize: "11px",
                  },

                  "& .MuiInputLabel-root": {
                    fontSize: "11px",
                  },

                  "& .MuiFormHelperText-root": {
                    fontSize: "9px",
                  },

                  "& .MuiButton-root": {
                    minHeight: "38px",
                    fontSize: "10px",
                    textTransform: "none",
                  },
                }}
              >
                {saveError && (
                  <Alert
                    severity="error"
                    onClose={() => setSaveError("")}
                    sx={{ mb: 1.5, fontSize: "11px" }}
                  >
                    {saveError}
                  </Alert>
                )}
                {renderForm()}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
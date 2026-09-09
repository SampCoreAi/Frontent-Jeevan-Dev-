"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Grid,
  Snackbar,
} from "@mui/material";
import axios from "axios";

import OnboardingSidebar from "./Sidebar";
import PersonalInfoForm from "./PersonalInformationForm";
import ProfessDetail from "./ProfessDetail";
import DocumentData from "./documentData";
import Verification from "./Verification";
import HospitalDetail from "./HospitalDetailsForm";
const COLORS = {
  pageBg: "#F3F6F4",
};

export default function DoctorOnboardingPage() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const [registrationId, setRegistrationId] = React.useState(null);

  const [fieldErrors, setFieldErrors] = React.useState({});

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [doctorData, setDoctorData] = React.useState({
    // STEP 1
    fullName: "",
    gender: "",
    age: "",
    email: "",
    mobile: "",

    // STEP 2
    medicalRegistrationNumber: "",
    medicalCouncil: "",
    qualification: "",
    specialization: "",
    registrationExpiryDate: "",

    // STEP 3
    medicalRegistrationCertificate: "",
    medicalDegreeCertificate: "",
    governmentIdProof: "",
    selfie: "",
  });

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // ==========================================
  // LOAD REGISTRATION
  // ==========================================
  React.useEffect(() => {
    const loadDoctorRegistration = async () => {
      try {
        const savedId = localStorage.getItem(
          "doctorRegistrationId"
        );

        if (!savedId) return;

        setRegistrationId(savedId);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/getDoctorRegistrationById/${savedId}`
        );

        const doctor = response.data?.data;

        if (!doctor) return;

        setDoctorData({
          fullName: doctor.full_name || "",

          gender: doctor.gender
            ? doctor.gender.toLowerCase()
            : "",

          age: doctor.age || "",
          email: doctor.email || "",
          mobile: doctor.mobile || "",

          medicalRegistrationNumber:
            doctor.medical_registration_number || "",

          medicalCouncil:
            doctor.medical_council || "",

          qualification:
            doctor.qualification || "",

          specialization:
            doctor.specialization || "",

          registrationExpiryDate:
            doctor.registration_expiry_date || "",

          medicalRegistrationCertificate:
            doctor.medical_registration_certificate || "",

          medicalDegreeCertificate:
            doctor.medical_degree_certificate || "",

          governmentIdProof:
            doctor.government_id_proof || "",

          selfie: doctor.selfie || "",
        });
      } catch (error) {
        console.error(
          "GET DOCTOR REGISTRATION ERROR:",
          error.response?.data || error.message
        );
      }
    };

    loadDoctorRegistration();
  }, []);

  // ==========================================
  // UPDATE FORM DATA
  // ==========================================
  const updateDoctorData = (newData) => {
    setDoctorData((prev) => ({
      ...prev,
      ...newData,
    }));

    const changedFields = Object.keys(newData);

    setFieldErrors((prev) => {
      const updated = { ...prev };

      changedFields.forEach((field) => {
        delete updated[field];
      });

      return updated;
    });
  };

  // ==========================================
  // STEP 1
  // ==========================================
  const handlePersonalInfoNext = async () => {
    try {
      setFieldErrors({});

      const errors = {};

      const fullName = doctorData.fullName?.trim();
      const email = doctorData.email?.trim();
      const mobile = doctorData.mobile?.trim();
      const age = Number(doctorData.age);

      // Full Name
      if (!fullName) {
        errors.fullName = "Full name is required.";
      } else if (fullName.length < 3) {
        errors.fullName =
          "Full name must be at least 3 characters.";
      }

      // Gender
      if (!doctorData.gender) {
        errors.gender = "Please select your gender.";
      }

      // Age
      if (!doctorData.age) {
        errors.age = "Age is required.";
      } else if (!Number.isInteger(age)) {
        errors.age = "Please enter a valid age.";
      } else if (age < 18) {
        errors.age =
          "Doctor age must be at least 18 years.";
      } else if (age > 100) {
        errors.age = "Please enter a valid age.";
      }

      // Email
      if (!email) {
        errors.email = "Email address is required.";
      } else {
        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          errors.email =
            "Please enter a valid email address.";
        }
      }

      // Mobile
      if (!mobile) {
        errors.mobile = "Mobile number is required.";
      } else if (!/^[6-9]\d{9}$/.test(mobile)) {
        errors.mobile =
          "Please enter a valid 10-digit mobile number.";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      setLoading(true);

      const payload = {
        fullName,
        gender: doctorData.gender.toUpperCase(),
        age,
        email,
        mobile,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/create`,
        payload
      );

      const id =
        response.data?.data?.id ||
        response.data?.data?.registrationId ||
        response.data?.id ||
        response.data?.registrationId;

      if (!id) {
        throw new Error(
          "Registration ID was not returned by the server."
        );
      }

      setRegistrationId(id);

      localStorage.setItem(
        "doctorRegistrationId",
        String(id)
      );

      setActiveStep(2);
    } catch (error) {
      console.error(
        "STEP 1 ERROR:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";

      const normalizedMessage =
        message.toLowerCase();

      // Specific field errors
      if (
        normalizedMessage.includes("email") &&
        (
          normalizedMessage.includes("already") ||
          normalizedMessage.includes("exists")
        )
      ) {
        setFieldErrors((prev) => ({
          ...prev,
          email: message,
        }));

        return;
      }

      if (
        normalizedMessage.includes("mobile") ||
        normalizedMessage.includes("phone")
      ) {
        setFieldErrors((prev) => ({
          ...prev,
          mobile: message,
        }));

        return;
      }

      if (normalizedMessage.includes("age")) {
        setFieldErrors((prev) => ({
          ...prev,
          age: message,
        }));

        return;
      }

      if (normalizedMessage.includes("gender")) {
        setFieldErrors((prev) => ({
          ...prev,
          gender: message,
        }));

        return;
      }

      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 2
  // ==========================================
  const handleProfessionalDetailsNext = async () => {
    try {
      setLoading(true);

      const requiredFields = {
        medicalRegistrationNumber:
          doctorData.medicalRegistrationNumber,

        medicalCouncil:
          doctorData.medicalCouncil,

        qualification:
          doctorData.qualification,

        specialization:
          doctorData.specialization,
      };

      const emptyField = Object.entries(
        requiredFields
      ).find(
        ([, value]) =>
          !String(value || "").trim()
      );

      if (emptyField) {
        showSnackbar(
          "Please fill all required fields.",
          "warning"
        );
        return;
      }

      if (!registrationId) {
        showSnackbar(
          "Registration ID not found. Please complete Step 1 first.",
          "error"
        );
        return;
      }

      const payload = {
        registrationId,

        medicalRegistrationNumber:
          doctorData.medicalRegistrationNumber,

        medicalCouncil:
          doctorData.medicalCouncil,

        qualification:
          doctorData.qualification,

        specialization:
          doctorData.specialization,

        registrationExpiryDate:
          doctorData.registrationExpiryDate || null,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/create`,
        payload
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Professional details save failed."
        );
      }

      setActiveStep(3);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
// ==========================================
// STEP 3 - HOSPITAL DETAILS
// ==========================================
const handleHospitalDetailsNext = async () => {
  try {
    setLoading(true);

    if (!registrationId) {
      showSnackbar(
        "Registration ID not found. Please complete Step 1 first.",
        "error"
      );
      return;
    }

    const hospital = doctorData.hospitalDetail || {};

    const requiredFields = {
      hospitalName: hospital.hospitalName,
      flatPlotNo: hospital.flatPlotNo,
      buildingSociety: hospital.buildingSociety,
      streetName: hospital.streetName,
      areaLocality: hospital.areaLocality,
      city: hospital.city,
      district: hospital.district,
      state: hospital.state,
      pinCode: hospital.pinCode,
    };

    const emptyField = Object.entries(requiredFields).find(
      ([, value]) => !String(value || "").trim()
    );

    if (emptyField) {
      showSnackbar(
        "Please fill all required hospital details.",
        "warning"
      );
      return;
    }

    if (!/^\d{6}$/.test(hospital.pinCode)) {
      showSnackbar(
        "Please enter a valid 6-digit PIN code.",
        "warning"
      );
      return;
    }

    const payload = {
      registrationId,
 hospitalDetail: [
    {
      hospitalName: hospital.hospitalName,
      flatPlotNo: hospital.flatPlotNo,
      buildingSociety: hospital.buildingSociety,
      streetName: hospital.streetName,
      areaLocality: hospital.areaLocality,
      landmark: hospital.landmark || "",
      city: hospital.city,
      district: hospital.district,
      state: hospital.state,
      pinCode: hospital.pinCode,
    },
  ],
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/create`,
      payload
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Hospital details save failed."
      );
    }

    showSnackbar(
      response.data?.message ||
        "Hospital details saved successfully.",
      "success"
    );

    setActiveStep(4);
  } catch (error) {
    console.error(
      "STEP 3 HOSPITAL DETAILS ERROR:",
      error.response?.data || error
    );

    showSnackbar(
      error.response?.data?.message ||
        error.message ||
        "Something went wrong while saving hospital details.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};
  // ==========================================
  // STEP CHANGE
  // ==========================================
  const handleStepChange = (stepId) => {
    const savedRegistrationId =
      localStorage.getItem(
        "doctorRegistrationId"
      );

    if (!savedRegistrationId) return;

    setRegistrationId(savedRegistrationId);
    setActiveStep(stepId);
  };

  // ==========================================
  // DOCUMENT NEXT
  // ==========================================
const handleDocumentsNext = () => {
  setActiveStep(5);
};

  // ==========================================
  // FINAL SUBMIT
  // ==========================================
  const handleFinalVerificationSubmit =
    async () => {
      try {
        setLoading(true);

        if (!registrationId) {
          showSnackbar(
            "Registration ID not found.",
            "error"
          );
          return;
        }

        if (!doctorData.email) {
          showSnackbar(
            "Doctor email not found.",
            "error"
          );
          return;
        }

        const payload = {
          registrationId,
          email: doctorData.email,
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/submit`,
          payload
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Doctor registration submission failed."
          );
        }

        showSnackbar(
          response.data?.message ||
            "Doctor registration submitted successfully.",
          "success"
        );

        localStorage.removeItem(
          "doctorRegistrationId"
        );

        setRegistrationId(null);
      } catch (error) {
        showSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong while submitting registration.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <Box
        sx={{
          bgcolor: COLORS.pageBg,
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <OnboardingSidebar
              activeStep={activeStep}
              registrationId={registrationId}
              onStepChange={handleStepChange}
            />
          </Grid>

     <Grid size={{ xs: 12, md: 9 }}>
  {activeStep === 1 && (
    <PersonalInfoForm
      data={doctorData}
      onChange={updateDoctorData}
      onNext={handlePersonalInfoNext}
      loading={loading}
      errors={fieldErrors}
    />
  )}

  {activeStep === 2 && (
    <ProfessDetail
      data={doctorData}
      registrationId={registrationId}
      onChange={updateDoctorData}
      onNext={handleProfessionalDetailsNext}
      onBack={() => setActiveStep(1)}
      loading={loading}
    />
  )}

 {activeStep === 3 && (
  <HospitalDetail
    data={doctorData}
    registrationId={registrationId}
    onChange={updateDoctorData}
    onNext={handleHospitalDetailsNext}
    onBack={() => setActiveStep(2)}
    loading={loading}
  />
)}

  {activeStep === 4 && (
    <DocumentData
      data={doctorData}
      registrationId={registrationId}
      onChange={updateDoctorData}
      onNext={() => setActiveStep(5)}
      onBack={() => setActiveStep(3)}
    />
  )}

  {activeStep === 5 && (
    <Verification
      data={doctorData}
      registrationId={registrationId}
      onBack={() => setActiveStep(4)}
      onSubmit={handleFinalVerificationSubmit}
    />
  )}
</Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
          sx={{
            width: "100%",
            borderRadius: "10px",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

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

/* =========================================================
   INITIAL DATA
========================================================= */

const INITIAL_DOCTOR_DATA = {
  // STEP 1
  fullName: "",
  gender: "",
  dob: "",
  email: "",
  mobile: "",

  // IMPORTANT
  email_verified: 0,
  onboarding_status: "",

  // STEP 2
  medicalRegistrationNumber: "",
  medicalCouncil: "",
  qualification: "",
  specialization: "",
  registrationExpiryDate: "",

  // STEP 3
  hospitalDetail: {
    hospitalName: "",
    flatPlotNo: "",
    buildingSociety: "",
    streetName: "",
    areaLocality: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
  },

  // STEP 4
  medicalRegistrationCertificate: "",
  medicalDegreeCertificate: "",
  governmentIdProof: "",
  selfie: "",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function DoctorOnboardingPage() {
  const [activeStep, setActiveStep] =
    React.useState(1);

  const [loading, setLoading] =
    React.useState(false);

  const [registrationId, setRegistrationId] =
    React.useState(null);

  const [fieldErrors, setFieldErrors] =
    React.useState({});

  const [snackbar, setSnackbar] =
    React.useState({
      open: false,
      message: "",
      severity: "error",
    });

  const [doctorData, setDoctorData] =
    React.useState(INITIAL_DOCTOR_DATA);

  /* =======================================================
     SNACKBAR
  ======================================================= */

  const showSnackbar = (
    message,
    severity = "error"
  ) => {
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

  /* =======================================================
     MAP API -> FRONTEND DATA
  ======================================================= */

  const mapDoctorApiData = (doctor) => {
       const hospital =
      Array.isArray(doctor?.hospital_detail) &&
      doctor.hospital_detail.length > 0
        ? doctor.hospital_detail[0]
        : doctor?.hospital_detail &&
            typeof doctor.hospital_detail === "object"
          ? doctor.hospital_detail
          : {};

    return {
      fullName:
        doctor?.full_name || "",

      gender:
        doctor?.gender
          ? String(doctor.gender).toLowerCase()
          : "",

  dob: doctor?.dob?.split("T")[0] || "",

      email:
        doctor?.email || "",

      mobile:
        doctor?.mobile || "",

      /*
        VERY IMPORTANT

        API:
        email_verified: 1
      */
      email_verified:
        Number(doctor?.email_verified) === 1
          ? 1
          : 0,

      /*
        API:
        onboarding_status: "SUBMITTED"
      */
      onboarding_status:
        doctor?.onboarding_status || "",

      // =========================
      // STEP 2
      // =========================

      medicalRegistrationNumber:
        doctor?.medical_registration_number || "",

      medicalCouncil:
        doctor?.medical_council || "",

      qualification:
        doctor?.qualification || "",

      specialization:
        doctor?.specialization || "",

      registrationExpiryDate:
        doctor?.registration_expiry_date || "",

      // =========================
      // STEP 3
      // =========================

      hospitalDetail: {
        hospitalName:
          hospital?.hospitalName || "",

        flatPlotNo:
          hospital?.flatPlotNo || "",

        buildingSociety:
          hospital?.buildingSociety || "",

        streetName:
          hospital?.streetName || "",

        areaLocality:
          hospital?.areaLocality || "",

        landmark:
          hospital?.landmark || "",

        city:
          hospital?.city || "",

        district:
          hospital?.district || "",

        state:
          hospital?.state || "",

        pinCode:
          hospital?.pinCode || "",
      },

      // =========================
      // STEP 4
      // =========================

      medicalRegistrationCertificate:
        doctor?.medical_registration_certificate || "",

      medicalDegreeCertificate:
        doctor?.medical_degree_certificate || "",

      governmentIdProof:
        doctor?.government_id_proof || "",

      selfie:
        doctor?.selfie || "",
    };
  };

  /* =======================================================
     LOAD REGISTRATION ON REFRESH
  ======================================================= */

  React.useEffect(() => {
    const loadDoctorRegistration = async () => {
      try {
        const savedId =
          localStorage.getItem(
            "doctorRegistrationId"
          );

        if (!savedId) {
          return;
        }

        setRegistrationId(savedId);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/getDoctorRegistrationById/${savedId}`
        );

        const doctor =
          response?.data?.data;

        if (!doctor) {
          return;
        }

        console.log(
          "DOCTOR REGISTRATION:",
          doctor
        );

        /*
          IMPORTANT:
          API response is mapped here.
        */
        const mappedDoctor =
          mapDoctorApiData(doctor);

        console.log(
          "MAPPED DOCTOR:",
          mappedDoctor
        );

        setDoctorData(mappedDoctor);

        /*
          OPTIONAL BUT USEFUL:

          If registration is already SUBMITTED,
          directly open Verification/Status step
          after refresh.
        */
        if (
          String(
            doctor?.onboarding_status || ""
          )
            .trim()
            .toUpperCase() === "SUBMITTED"
        ) {
          setActiveStep(5);
        }
      } catch (error) {
        console.error(
          "GET DOCTOR REGISTRATION ERROR:",
          error?.response?.data ||
            error?.message
        );

        showSnackbar(
          error?.response?.data?.message ||
            "Unable to load registration details.",
          "error"
        );
      }
    };

    loadDoctorRegistration();
  }, []);

  /* =======================================================
     UPDATE FORM DATA
  ======================================================= */

  const updateDoctorData = (newData) => {
    setDoctorData((prev) => ({
      ...prev,
      ...newData,
    }));

    const changedFields =
      Object.keys(newData);

    setFieldErrors((prev) => {
      const updated = {
        ...prev,
      };

      changedFields.forEach(
        (field) => {
          delete updated[field];
        }
      );

      return updated;
    });
  };

  /* =======================================================
     STEP 1 - PERSONAL INFORMATION
  ======================================================= */

  const handlePersonalInfoNext =
    async () => {
      try {
        setFieldErrors({});

        const errors = {};

        const fullName =
          doctorData.fullName?.trim();

        const email =
          doctorData.email
            ?.trim()
            .toLowerCase();

        const mobile =
          doctorData.mobile?.trim();
const dob = new Date(`${doctorData.dob}T00:00:00`);
const today = new Date();

let age = today.getFullYear() - dob.getFullYear();

if (
  today.getMonth() < dob.getMonth() ||
  (today.getMonth() === dob.getMonth() &&
    today.getDate() < dob.getDate())
) {
  age--;
}

        if (!fullName) {
          errors.fullName =
            "Full name is required.";
        } else if (
          fullName.length < 3
        ) {
          errors.fullName =
            "Full name must be at least 3 characters.";
        } else if (
          fullName.length > 50
        ) {
          errors.fullName =
            "Full name must not exceed 50 characters.";
        } else if (
          !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(
            fullName
          )
        ) {
          errors.fullName =
            "Full name can contain only letters and single spaces.";
        }

        /* =========================
           GENDER
        ========================= */

        if (!doctorData.gender) {
          errors.gender =
            "Please select your gender.";
        }

      if (
  !doctorData.dob ||
  Number.isNaN(dob.getTime()) ||
  dob > today
) {
  errors.dob = "Please enter a valid date of birth.";
} else if (age < 18 || age > 100) {
  errors.dob = "Doctor age must be between 18 and 100 years.";
}

        if (!email) {
          errors.email =
            "Email address is required.";
        } else {
          const gmailRegex =
            /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@gmail\.com$/i;

          if (
            !gmailRegex.test(email)
          ) {
            errors.email =
              "Please enter a valid Gmail address.";
          }
        }

        /* =========================
           MOBILE
        ========================= */

        if (!mobile) {
          errors.mobile =
            "Mobile number is required.";
        } else if (
          !/^[6-9]\d{9}$/.test(
            mobile
          )
        ) {
          errors.mobile =
            "Please enter a valid 10-digit mobile number.";
        }

        /* =========================
           STOP IF ERROR
        ========================= */

        if (
          Object.keys(errors)
            .length > 0
        ) {
          setFieldErrors(errors);

          return;
        }

        setLoading(true);

        /* =========================
           PAYLOAD
        ========================= */

        const payload = {
          fullName,

          gender:
            doctorData.gender.toUpperCase(),

         dob: doctorData.dob,

          email,

          mobile,
        };

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/create`,
            payload
          );

        const id =
          response?.data?.data?.id ||
          response?.data?.data
            ?.registrationId ||
          response?.data?.id ||
          response?.data
            ?.registrationId;

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

        /*
          Keep normalized values.
        */
        setDoctorData(
          (previous) => ({
            ...previous,

            fullName,
            email,
            mobile,

            gender:
              doctorData.gender,
dob: doctorData.dob,
          })
        );

        setActiveStep(2);
      } catch (error) {
        console.error(
          "STEP 1 ERROR:",
          error?.response?.data ||
            error
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Something went wrong.";

        const normalizedMessage =
          message.toLowerCase();

        /* EMAIL */

        if (
          normalizedMessage.includes(
            "email"
          ) &&
          (normalizedMessage.includes(
            "already"
          ) ||
            normalizedMessage.includes(
              "exists"
            ))
        ) {
          setFieldErrors(
            (prev) => ({
              ...prev,

              email:
                message,
            })
          );

          return;
        }

        /* MOBILE */

        if (
          normalizedMessage.includes(
            "mobile"
          ) ||
          normalizedMessage.includes(
            "phone"
          )
        ) {
          setFieldErrors(
            (prev) => ({
              ...prev,

              mobile:
                message,
            })
          );

          return;
        }

        /* AGE */

        if (
          normalizedMessage.includes(
            "age"
          )
        ) {
          setFieldErrors(
            (prev) => ({
              ...prev,

              age: message,
            })
          );

          return;
        }

        /* GENDER */

        if (
          normalizedMessage.includes(
            "gender"
          )
        ) {
          setFieldErrors(
            (prev) => ({
              ...prev,

              gender:
                message,
            })
          );

          return;
        }

        showSnackbar(
          message,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     STEP 2 - PROFESSIONAL DETAILS
  ======================================================= */

  const handleProfessionalDetailsNext =
    async () => {
      try {
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

        const emptyField =
          Object.entries(
            requiredFields
          ).find(
            ([, value]) =>
              !String(
                value || ""
              ).trim()
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

        setLoading(true);

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
            doctorData.registrationExpiryDate ||
            null,
        };

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/create`,
            payload
          );

        if (
          !response?.data?.success
        ) {
          throw new Error(
            response?.data
              ?.message ||
              "Professional details save failed."
          );
        }

        setActiveStep(3);
      } catch (error) {
        showSnackbar(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Something went wrong.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     STEP 3 - HOSPITAL DETAILS
  ======================================================= */

  const handleHospitalDetailsNext =
    async () => {
      try {
        if (!registrationId) {
          showSnackbar(
            "Registration ID not found. Please complete Step 1 first.",
            "error"
          );

          return;
        }

        const hospital =
          doctorData.hospitalDetail ||
          {};

        const requiredFields = {
          hospitalName:
            hospital.hospitalName,

          flatPlotNo:
            hospital.flatPlotNo,

          buildingSociety:
            hospital.buildingSociety,

          streetName:
            hospital.streetName,

          areaLocality:
            hospital.areaLocality,

          city:
            hospital.city,

          district:
            hospital.district,

          state:
            hospital.state,

          pinCode:
            hospital.pinCode,
        };

        const emptyField =
          Object.entries(
            requiredFields
          ).find(
            ([, value]) =>
              !String(
                value || ""
              ).trim()
          );

        if (emptyField) {
          showSnackbar(
            "Please fill all required hospital details.",
            "warning"
          );

          return;
        }

        if (
          !/^[1-9]\d{5}$/.test(
            String(
              hospital.pinCode
            )
          )
        ) {
          showSnackbar(
            "Please enter a valid 6-digit PIN code.",
            "warning"
          );

          return;
        }

        setLoading(true);

        const payload = {
          registrationId,

          hospitalDetail: [
            {
              hospitalName:
                hospital.hospitalName,

              flatPlotNo:
                hospital.flatPlotNo,

              buildingSociety:
                hospital.buildingSociety,

              streetName:
                hospital.streetName,

              areaLocality:
                hospital.areaLocality,

              landmark:
                hospital.landmark ||
                "",

              city:
                hospital.city,

              district:
                hospital.district,

              state:
                hospital.state,

              pinCode:
                hospital.pinCode,
            },
          ],
        };

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/create`,
            payload
          );

        if (
          !response?.data?.success
        ) {
          throw new Error(
            response?.data
              ?.message ||
              "Hospital details save failed."
          );
        }

        showSnackbar(
          response?.data
            ?.message ||
            "Hospital details saved successfully.",
          "success"
        );

        setActiveStep(4);
      } catch (error) {
        console.error(
          "STEP 3 HOSPITAL DETAILS ERROR:",
          error?.response?.data ||
            error
        );

        showSnackbar(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Something went wrong while saving hospital details.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     STEP CHANGE
  ======================================================= */

  const handleStepChange = (
    stepId
  ) => {
    const savedRegistrationId =
      localStorage.getItem(
        "doctorRegistrationId"
      );

    if (
      !savedRegistrationId
    ) {
      return;
    }

    setRegistrationId(
      savedRegistrationId
    );

    setActiveStep(stepId);
  };

  /* =======================================================
     DOCUMENT NEXT
  ======================================================= */

  const handleDocumentsNext =
    () => {
      setActiveStep(5);
    };

  /* =======================================================
     FINAL SUBMIT
  ======================================================= */

  const handleFinalVerificationSubmit =
    async () => {
      try {
        /*
          Prevent duplicate submission.
        */
        if (
          String(
            doctorData.onboarding_status ||
              ""
          )
            .trim()
            .toUpperCase() ===
          "SUBMITTED"
        ) {
          showSnackbar(
            "Registration has already been submitted.",
            "info"
          );

          return;
        }

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

        /*
          Extra safety:
          frontend should not submit before
          email verification.
        */
        if (
          Number(
            doctorData.email_verified
          ) !== 1
        ) {
          showSnackbar(
            "Please verify your email before submitting.",
            "warning"
          );

          return;
        }

        setLoading(true);

        const payload = {
          registrationId,

          email:
            doctorData.email,
        };

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/submit`,
            payload
          );

        if (
          !response?.data?.success
        ) {
          throw new Error(
            response?.data
              ?.message ||
              "Doctor registration submission failed."
          );
        }

        /*
          VERY IMPORTANT:

          Update local state immediately,
          so Verification UI switches to
          submitted state without refresh.
        */
        setDoctorData(
          (previous) => ({
            ...previous,

            email_verified: 1,

            onboarding_status:
              "SUBMITTED",
          })
        );

        showSnackbar(
          response?.data
            ?.message ||
            "Doctor registration submitted successfully.",
          "success"
        );

        /*
          IMPORTANT:
          Do NOT remove registrationId here.

          If you remove:
          localStorage.removeItem("doctorRegistrationId")

          then after refresh frontend cannot GET
          this registration again.

          Keep ID until backend/account flow
          gives you another reliable way to
          fetch this registration.
        */
      } catch (error) {
        console.error(
          "FINAL SUBMIT ERROR:",
          error?.response?.data ||
            error
        );

        showSnackbar(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Something went wrong while submitting registration.",
          "error"
        );

        throw error;
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",

          bgcolor:
            COLORS.pageBg,

          display: "flex",

          alignItems: {
            xs: "flex-start",
            lg: "center",
          },

          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          py: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",

            maxWidth:
              "1500px",

            mx: "auto",
          }}
        >
          <Grid
            container
            sx={{
              bgcolor:
                "white",

              height: {
                xs: "auto",
                md: "650px",
              },

              maxHeight: {
                md: "calc(100vh - 48px)",
              },

              borderRadius:
                "18px",

              overflow:
                "hidden",

              border:
                "1px solid #E6EBE8",
            }}
          >
            {/* ============================================
                LEFT SIDEBAR
            ============================================ */}

            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
              sx={{
                height: {
                  xs: "auto",
                  md: "100%",
                },
              }}
            >
              <Box
                sx={{
                  height:
                    "100%",

                  overflow:
                    "hidden",
                }}
              >
                <OnboardingSidebar
                  activeStep={
                    activeStep
                  }
                  registrationId={
                    registrationId
                  }
                  onStepChange={
                    handleStepChange
                  }
                />
              </Box>
            </Grid>

            {/* ============================================
                RIGHT CONTENT
            ============================================ */}

            <Grid
              size={{
                xs: 12,
                md: 9,
              }}
              sx={{
                height: {
                  xs: "auto",
                  md: "100%",
                },

                minWidth: 0,

                overflowY: {
                  xs: "visible",
                  md: "auto",
                },

                overflowX:
                  "hidden",

                "&::-webkit-scrollbar":
                  {
                    width:
                      "6px",
                  },

                "&::-webkit-scrollbar-track":
                  {
                    background:
                      "transparent",
                  },

                "&::-webkit-scrollbar-thumb":
                  {
                    background:
                      "#D4DDD8",

                    borderRadius:
                      "20px",
                  },

                "&::-webkit-scrollbar-thumb:hover":
                  {
                    background:
                      "#B7C6BE",
                  },

                scrollbarWidth:
                  "thin",

                scrollbarColor:
                  "#D4DDD8 transparent",
              }}
            >
              {/* STEP 1 */}

              {activeStep === 1 && (
                <PersonalInfoForm
                  data={
                    doctorData
                  }
                  onChange={
                    updateDoctorData
                  }
                  onNext={
                    handlePersonalInfoNext
                  }
                  loading={
                    loading
                  }
                  errors={
                    fieldErrors
                  }
                />
              )}

              {/* STEP 2 */}

              {activeStep === 2 && (
                <ProfessDetail
                  data={
                    doctorData
                  }
                  onChange={
                    updateDoctorData
                  }
                  onNext={
                    handleProfessionalDetailsNext
                  }
                  onBack={() =>
                    setActiveStep(
                      1
                    )
                  }
                  loading={
                    loading
                  }
                  doctorRegistrationId={
                    registrationId
                  }
                />
              )}

              {/* STEP 3 */}

              {activeStep === 3 && (
                <HospitalDetail
                  data={
                    doctorData
                  }
                  onChange={
                    updateDoctorData
                  }
                  onNext={
                    handleHospitalDetailsNext
                  }
                  onBack={() =>
                    setActiveStep(
                      2
                    )
                  }
                  loading={
                    loading
                  }
                />
              )}

              {/* STEP 4 */}

              {activeStep === 4 && (
                <DocumentData
                  data={
                    doctorData
                  }
                  registrationId={
                    registrationId
                  }
                  onChange={
                    updateDoctorData
                  }
                  onNext={
                    handleDocumentsNext
                  }
                  onBack={() =>
                    setActiveStep(
                      3
                    )
                  }
                />
              )}

              {/* STEP 5 */}

              {activeStep === 5 && (
               <Verification
  data={doctorData}
  registrationId={registrationId}
  onBack={() => setActiveStep(4)}
  onSubmit={handleFinalVerificationSubmit}
  onEmailVerified={() => {
    setDoctorData((prev) => ({
      ...prev,
      email_verified: 1,
    }));
  }}
/>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* =================================================
          GLOBAL SNACKBAR
      ================================================= */}

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={
          4000
        }
        onClose={
          closeSnackbar
        }
        anchorOrigin={{
          vertical: "top",
          horizontal:
            "right",
        }}
      >
        <Alert
          severity={
            snackbar.severity
          }
          variant="filled"
          onClose={
            closeSnackbar
          }
          sx={{
            width: "100%",

            borderRadius:
              "10px",
          }}
        >
          {
            snackbar.message
          }
        </Alert>
      </Snackbar>
    </>
  );
}
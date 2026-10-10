"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Grid,
  Snackbar,
} from "@mui/material";

import Sidebar from "./Sidebar";
import StoreInformationForm from "./StoreInformationForm";
import LicenseBusinessForm from "./LicenseBusinessForm";
import AddressForm from "./AddressForm";
import DocumentsForm from "./DocumentsForm";
import Verification from "./Verification";

const INITIAL_DATA = {
  // STEP 1
  storeName: "",
  pharmacyCategory: "",
  registeredEntityName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  storefrontImage: "",

  shopUnitNumber: "",
  streetAddress: "",
  landmark: "",
  pinCode: "",
  city: "",
  state: "",

  // STEP 2
  gstin: "",
  drugLicenseNumber: "",
  licenseExpiryDate: "",

  // STEP 3
  openingTime: "",
  closingTime: "",
  prescriptionOrders: true,
  walkInOrders: true,
  pickupAvailable: true,
  homeDelivery: false,
  partialFulfillment: true,
  allowAlternatives: true,
  autoAcceptOrders: false,

  // STEP 4
  drugLicenseDocument: "",
  governmentIdProof: "",

  // FINAL
  onboardingStatus: "",
};

export default function MedicalStoreOnboarding() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(INITIAL_DATA);

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

  const handleNext = (nextStep) => {
    setActiveStep(nextStep);
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);

      console.log("FINAL MEDICAL STORE DATA:", data);

      // API will be added here later.

      await new Promise((resolve) => setTimeout(resolve, 700));

      setData((prev) => ({
        ...prev,
        onboardingStatus: "SUBMITTED",
      }));

      showSnackbar(
        "Medical store registration submitted successfully.",
        "success"
      );
    } catch (error) {
      showSnackbar(
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
          minHeight: "100vh",
          bgcolor: "#F6F8F7",
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
            maxWidth: "1500px",
            mx: "auto",
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "flex-start",
            }}
          >
            {/* LEFT SIDEBAR */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Sidebar
                activeStep={activeStep}
                onStepChange={setActiveStep}
              />
            </Grid>

            {/* RIGHT CONTENT */}
            <Grid size={{ xs: 12, md: 9 }}>
              {activeStep === 1 && (
                <StoreInformationForm
                  data={data}
                  onChange={updateData}
                  onNext={() => handleNext(2)}
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

"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

const firstValue = (...values) =>
  values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );

const displayValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const formatLabel = (value) =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

function DetailItem({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontSize: 12.5,
          mb: 0.6,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#172033",
          fontWeight: 700,
          lineHeight: 1.6,
          overflowWrap: "anywhere",
        }}
      >
        {displayValue(value)}
      </Typography>
    </Box>
  );
}

function Section({ title, icon, children }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        borderColor: "#e2e8f0",
        bgcolor: "#fff",
        boxShadow: "0 3px 12px rgba(15, 23, 42, 0.025)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.2}
        sx={{ mb: 2.5 }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: 16, sm: 18 },
            fontWeight: 800,
            color: "#172033",
          }}
        >
          {title}
        </Typography>
      </Stack>

      {children}
    </Paper>
  );
}

export default function RegistrationPreview({
  open = false,
  registration = null,
  onClose = () => {},
} = {}) {
  // Expected API structure:
  // data: { user, registration, profile }
  const safeData = registration ?? {};

  const user = safeData.user ?? {};
  const registrationInfo = safeData.registration ?? {};
  const registrationData =
    registrationInfo.registration_data ??
    registrationInfo.registrationData ??
    {};

  const labInformation = registrationData.labInformation ?? {};
  const labAddress = registrationData.labAddress ?? {};
  const licenseBusiness = registrationData.licenseBusiness ?? {};
  const documents = registrationInfo.documents ?? {};

  const registrationId = firstValue(
    registrationInfo.id,
    registrationInfo.registration_id,
    registrationInfo.registrationId,
    user.registration_id,
    user.registrationId,
    "N/A"
  );

  const labName = firstValue(
    labInformation.diagnosticLabName,
    registrationInfo.diagnosticLabName,
    user.name,
    user.fullName,
    "N/A"
  );

  const ownerName = firstValue(
    labInformation.ownerFullName,
    user.name,
    user.fullName,
    "N/A"
  );

  const labEmail = firstValue(
    registrationInfo.lab_email,
    registrationInfo.labEmail,
    labInformation.labContactEmail,
    user.email,
    "N/A"
  );

  const status = firstValue(
    registrationInfo.onboarding_status,
    registrationInfo.onboardingStatus,
    ""
  );

  const normalizedStatus = String(status).toUpperCase();

  const statusColor =
    normalizedStatus === "APPROVED"
      ? "success"
      : normalizedStatus === "REJECTED"
      ? "error"
      : normalizedStatus === "PENDING"
      ? "warning"
      : "default";

  const addressParts = [
    labAddress.shopUnitNumber,
    labAddress.buildingComplexName,
    labAddress.streetRoadName,
    labAddress.areaLocality,
    labAddress.landmark,
    labAddress.cityTown,
    labAddress.state,
    labAddress.pinCode,
  ].filter(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );

  const documentLabels = {
    businessProof: "Business Proof",
    gstCertificate: "GST Certificate",
    governmentIdProof: "Government ID Proof",
    labRegistrationCertificate: "Lab Registration Certificate",
  };

  const availableDocuments = Object.entries(documents).filter(
    ([, url]) =>
      typeof url === "string" && url.trim() !== ""
  );

  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      aria-labelledby="lab-registration-preview-title"
      PaperProps={{
        sx: {
          width: "100%",
          maxHeight: "90vh",
          borderRadius: { xs: 2, sm: 3 },
          overflow: "hidden",
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        id="lab-registration-preview-title"
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          pr: 7,
          borderBottom: "1px solid #e2e8f0",
          position: "relative",
          bgcolor: "#fff",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: { xs: 17, sm: 20 },
            color: "#172033",
          }}
        >
          Lab Registration Preview
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: 0.5 }}
        >
          Review lab information and submitted documents
        </Typography>

        <IconButton
          onClick={onClose}
          aria-label="Close preview"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "#475569",
            "&:hover": {
              bgcolor: "#f1f5f9",
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          p: { xs: 1.5, sm: 2.5, md: 3 },
          bgcolor: "#f8fafc",
        }}
      >
        {!registration ? (
          <Alert severity="info">
            Registration data is not available yet.
          </Alert>
        ) : (
          <Stack spacing={2.5}>
            {/* Registration Details */}
            <Section
              title="Registration Details"
              icon={<BusinessRoundedIcon fontSize="small" />}
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem
                    label="Registration ID"
                    value={registrationId}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem label="Lab Name" value={labName} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem label="Lab Email" value={labEmail} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem
                    label="Lab Type"
                    value={labInformation.labType}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ borderColor: "#edf0f4" }} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem
                    label="Owner Name"
                    value={ownerName}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem
                    label="Owner Age"
                    value={labInformation.ownerAge}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem
                    label="Owner Gender"
                    value={labInformation.ownerGender}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem
                    label="Owner Email"
                    value={labInformation.ownerEmail}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem
                    label="Owner Phone"
                    value={labInformation.ownerPhone}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DetailItem
                    label="Lab Contact Phone"
                    value={labInformation.labContactPhone}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: 12.5,
                        mb: 0.8,
                      }}
                    >
                      Email Verified
                    </Typography>

                    <Chip
                      label={
                        Number(registrationInfo.lab_email_verified) === 1
                          ? "Verified"
                          : Number(registrationInfo.lab_email_verified) === 0
                          ? "Not Verified"
                          : "Unknown"
                      }
                      color={
                        Number(registrationInfo.lab_email_verified) === 1
                          ? "success"
                          : "default"
                      }
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                </Grid>

            
              </Grid>
            </Section>

            {/* Lab Address */}
            <Section
              title="Lab Address"
              icon={<LocationOnOutlinedIcon fontSize="small" />}
            >
              {addressParts.length > 0 ? (
                <>
                  <Box
                    sx={{
                      p: 1.75,
                      mb: 2.5,
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      border: "1px solid #edf0f4",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#172033",
                        fontWeight: 700,
                        lineHeight: 1.8,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {addressParts.join(", ")}
                    </Typography>
                  </Box>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6} md={3}>
                      <DetailItem
                        label="Building / Complex"
                        value={labAddress.buildingComplexName}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <DetailItem
                        label="Shop / Unit Number"
                        value={labAddress.shopUnitNumber}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <DetailItem
                        label="Street / Road"
                        value={labAddress.streetRoadName}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <DetailItem
                        label="Area / Locality"
                        value={labAddress.areaLocality}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <DetailItem
                        label="Landmark"
                        value={labAddress.landmark}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <DetailItem
                        label="City / Town"
                        value={labAddress.cityTown}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <DetailItem
                        label="State"
                        value={labAddress.state}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <DetailItem
                        label="PIN Code"
                        value={labAddress.pinCode}
                      />
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No address information available.
                </Typography>
              )}
            </Section>

            {/* License Details */}
            <Section
              title="License & Business Details"
              icon={<DescriptionOutlinedIcon fontSize="small" />}
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <DetailItem
                    label="Registration / License Number"
                    value={licenseBusiness.registrationLicenseNumber}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <DetailItem
                    label="GSTIN"
                    value={licenseBusiness.gstin}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <DetailItem
                    label="License Expiry Date"
                    value={licenseBusiness.licenseExpiryDate}
                  />
                </Grid>
              </Grid>
            </Section>

            {/* Submitted Documents */}
            <Section
              title="Submitted Documents"
              icon={<DescriptionOutlinedIcon fontSize="small" />}
            >
              {availableDocuments.length > 0 ? (
                <Stack spacing={1.5}>
                  {availableDocuments.map(([key, url]) => (
                    <Paper
                      key={key}
                      variant="outlined"
                      sx={{
                        p: 1.75,
                        borderRadius: 2.5,
                        borderColor: "#e2e8f0",
                        bgcolor: "#fff",
                        transition:
                          "border-color 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          borderColor: "#93c5fd",
                          boxShadow:
                            "0 4px 14px rgba(15, 23, 42, 0.06)",
                        },
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        alignItems={{
                          xs: "stretch",
                          sm: "center",
                        }}
                        justifyContent="space-between"
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ minWidth: 0 }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2,
                              bgcolor: "#eff6ff",
                              color: "#2563eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <DescriptionOutlinedIcon />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 800,
                                color: "#172033",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {documentLabels[key] ?? formatLabel(key)}
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              Uploaded document
                            </Typography>
                          </Box>
                        </Stack>

                        <Button
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          size="medium"
                          endIcon={<OpenInNewRoundedIcon />}
                          sx={{
                            flexShrink: 0,
                            alignSelf: {
                              xs: "flex-start",
                              sm: "center",
                            },
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 2,
                            py: 0.8,
                          }}
                        >
                          View Document
                        </Button>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">
                  No documents have been uploaded.
                </Alert>
              )}
            </Section>
          </Stack>
        )}
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
          display: "flex",
          justifyContent: "flex-end",
          bgcolor: "#fff",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          startIcon={<CloseRoundedIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
}

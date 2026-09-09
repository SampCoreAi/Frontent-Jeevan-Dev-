"use client";

import React from "react";
import {
  Typography,
  TextField,
  Box,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import WorkingHoursModal from "./WorkingHoursModal";

const ProfileDetails = ({
  profileData,
  isEditing,
  onFieldChange,
  onLicenseUpload,
  onWorkingHoursChange,
}) => {
  const theme = useTheme();
  const [documentsModalOpen, setDocumentsModalOpen] =
  React.useState(false);
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const [workingHoursModalOpen, setWorkingHoursModalOpen] =
    React.useState(false);
// Component ke andar, return se pehle add karo
const formatDisplayTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
};
const documents = [
  {
    name: "Medical Registration Certificate",
    path: profileData?.medical_registration_certificate,
  },
  {
    name: "Medical Degree Certificate",
    path: profileData?.medical_degree_certificate,
  },
  {
    name: "Government ID Proof",
    path: profileData?.government_id_proof,
  },
  {
    name: "Selfie",
    path: profileData?.selfie,
  },
];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        mt: 2,
      }}
    >
      {/* Left Column */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {/* Language */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            padding: 1.5,
            gap: 1.5,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color="#153933"
            fontSize={{ xs: "1rem", sm: "1.25rem" }}
          >
            Language:
          </Typography>

          {isEditing ? (
            <TextField
              value={profileData.language?.join(", ") || ""}
              placeholder={!profileData.language ? "Enter language" : ""}
              sx={{
        
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#153933",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1D9E75",
                borderWidth: "2px",
              },
              "& textarea::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
              onChange={(e) =>
                onFieldChange(
                  "language",
                  e.target.value.split(",").map((lang) => lang.trim())
                )
              }
              variant="outlined"
              size="small"
            />
          ) : (
            <Typography
              component="span"
              sx={{
                fontSize: { xs: 14, sm: 16, md: 18 },
                lineHeight: 1.2,
                color: "#7e8180",
              }}
            >
              {Array.isArray(profileData.language)
                ? profileData.language.join(", ")
                : profileData.language || "Not provided"}
            </Typography>
          )}
        </Box>

        {/* Email */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            padding: 1.5,
            gap: 1.5,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color="#153933"
            fontSize={{ xs: "1rem", sm: "1.25rem" }}
          >
            Email:
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: { xs: 14, sm: 16, md: 18 },
              lineHeight: 1.2,
              color: "#7e8180",
            }}
          >
            {profileData.email || "Not provided"}
          </Typography>
        </Box>

        {/* Phone Number */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            padding: 1.5,
            gap: 1.5,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color="#153933"
            fontSize={{ xs: "1rem", sm: "1.25rem" }}
          >
            Phone Number:
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: { xs: 14, sm: 16, md: 18 },
              lineHeight: 1.2,
              color: "#7e8180",
            }}
          >
            {profileData.mobile || "Not provided"}
          </Typography>
        </Box>

        {/* Experience */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            padding: 1.5,
            gap: 1.5,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color="#153933"
            fontSize={{ xs: "1rem", sm: "1.25rem" }}
          >
            Experience:
          </Typography>

          {isEditing ? (
            <TextField
              value={profileData.experience}
              placeholder={
                !profileData.experience ? "Enter experience (in years)" : ""
              }
              sx={{
        
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#153933",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1D9E75",
                borderWidth: "2px",
              },
              "& textarea::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
              onChange={(e) => onFieldChange("experience", e.target.value)}
              variant="outlined"
              size="small"
              type="number"
            />
          ) : (
            <Typography
              component="span"
              sx={{
                fontSize: { xs: 14, sm: 16, md: 18 },
                lineHeight: 1.2,
                color: "#7e8180",
              }}
            >
              {profileData.experience || "Not provided"}
            </Typography>
          )}
        </Box>

        {/* Consultation Fee */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            padding: 1.5,
            gap: 1.5,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color="#153933"
            fontSize={{ xs: "1rem", sm: "1.25rem" }}
          >
            Consultation Fee:
          </Typography>

          {isEditing ? (
            <TextField
              value={profileData.consultation_fee }
              placeholder={
                !profileData.consultationFee ? "Enter consultation fee" : ""
              }
           onChange={(e) =>
  onFieldChange("consultation_fee", e.target.value)
}
              variant="outlined"
              size="small"
              type="number"
              sx={{
        
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#153933",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1D9E75",
                borderWidth: "2px",
              },
              "& textarea::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
            />
          ) : (
            <Typography
              component="span"
              sx={{
                fontSize: { xs: 14, sm: 16, md: 18 },
                lineHeight: 1.2,
                color: "#7e8180",
              }}
            >
              {profileData.consultation_fee || "Not provided"}
            </Typography>
          )}
        </Box>

        {/* Medical License */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            padding: 1.5,
            gap: 1.5,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color="#153933"
            fontSize={{ xs: "1rem", sm: "1.25rem" }}
          >
            Medical license / Reg. no:
          </Typography>

          {isEditing ? (
            <TextField
              value={profileData.medical_registration_number}
              placeholder={
                !profileData.medicalLicense
                  ? "Enter medical license / registration no."
                  : ""
              }
              onChange={(e) => onFieldChange("medicalLicense", e.target.value)}
              variant="outlined"
              size="small"
              sx={{
            
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#153933",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1D9E75",
                borderWidth: "2px",
              },
              "& textarea::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
            />
          ) : (
            <Typography
              component="span"
              sx={{
                fontSize: { xs: 14, sm: 16, md: 18 },
                lineHeight: 1.2,
                color: "#7e8180",
              }}
            >
              {profileData.medical_registration_number || "Not provided"}
            </Typography>
          )}
        </Box>

        {/* Working Hours Modal */}
        <WorkingHoursModal
          open={workingHoursModalOpen}
          onClose={() => setWorkingHoursModalOpen(false)}
          workingHours={profileData.workingHours}
          onWorkingHoursChange={onWorkingHoursChange}
        />
      </Box>

      {!isTablet && (
        <Divider
          orientation="vertical"
          flexItem
          sx={{ backgroundColor: "#14b8a6", width: 2 }}
        />
      )}

      {/* Right Column */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {/* Working Hours Section */}
        <Box
          sx={{
            width: "100%",

            backgroundColor: "#f5f5f5",
            borderRadius: 0.5,
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              color="#153933"
              fontSize={{ xs: "1rem", sm: "1.25rem" }}
            >
              Working Hours:
            </Typography>
            {isEditing && (
              <Button
                variant="contained"
                onClick={() => setWorkingHoursModalOpen(true)}
                sx={{
                  backgroundColor: "#14b8a6",
                  "&:hover": {
                    backgroundColor: "#0f7468",
                  },
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  padding: { xs: "6px 12px", sm: "8px 20px" },
                  borderRadius: "8px",
                }}
              >
                Set Working Hours
              </Button>
            )}
          </Box>

          {/* Display Working Hours Summary */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1,
              mt: 1,
            }}
          >
            {[
              { key: "monday", label: "Mon" },
              { key: "tuesday", label: "Tue" },
              { key: "wednesday", label: "Wed" },
              { key: "thursday", label: "Thu" },
              { key: "friday", label: "Fri" },
              { key: "saturday", label: "Sat" },
              { key: "sunday", label: "Sun" },
            ].map((day) => {
              const dayData = profileData.workingHours?.[day.key] || {
                start: "",
                end: "",
              };

              // Auto-determine if closed (no time set)
              const isClosed = !dayData.start || !dayData.end;

              return (
                <Box
                  key={day.key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#153933",
                      fontSize: "0.85rem",
                    }}
                  >
                    {day.label}
                  </Typography>

                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "6px",
                      backgroundColor: isClosed ? "#fdecea" : "#f3f4f6",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: isClosed ? "#d32f2f" : "#4b5563",
                        fontWeight: isClosed ? 600 : 500,
                      }}
                    >
                      {isClosed
                        ? "Closed"
                        : dayData.start && dayData.end
                          ? `${formatDisplayTime(dayData.start)} - ${formatDisplayTime(dayData.end)}`
                          : "Not set"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
       <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "flex-start", sm: "center" },
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 1,
    padding: 1.5,
    gap: 1.5,
  }}
>
  <Typography
    variant="h6"
    fontWeight={600}
    color="#153933"
    fontSize={{ xs: "1rem", sm: "1.25rem" }}
  >
    Documents:
  </Typography>

  <Button
    variant="contained"
    onClick={() => setDocumentsModalOpen(true)}
  
    sx={{
      backgroundColor: "#14b8a6",
      "&:hover": {
        backgroundColor: "#0f7468",
      },
      color: "white",
      textTransform: "none",
      fontWeight: 700,
      borderRadius: "8px",
    }}
  >
    View Documents
  </Button>
</Box>
      </Box>
     <Dialog
  open={documentsModalOpen}
  onClose={() => setDocumentsModalOpen(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle
    sx={{
      fontWeight: 700,
      color: "#153933",
    }}
  >
    Documents
  </DialogTitle>

  <DialogContent>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        mt: 1,
      }}
    >
      {documents.filter((document) => document.path).length > 0 ? (
        documents
          .filter((document) => document.path)
          .map((document) => (
            <Box
              key={document.name}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                p: 1.5,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                backgroundColor: "#f9faf9",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#153933",
                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.95rem",
                  },
                }}
              >
                {document.name}
              </Typography>

              <Button
                variant="outlined"
                size="small"
               onClick={() => {
  const baseUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

  const documentUrl = `${baseUrl}/${document.path}`;

  window.open(
    documentUrl,
    "_blank",
    "noopener,noreferrer"
  );
}}
                sx={{
                  flexShrink: 0,
                  textTransform: "none",
                  borderColor: "#14b8a6",
                  color: "#0f7468",
                  fontWeight: 600,

                  "&:hover": {
                    borderColor: "#0f7468",
                    backgroundColor: "#e6f6ed",
                  },
                }}
              >
                View
              </Button>
            </Box>
          ))
      ) : (
        <Typography color="text.secondary">
          No documents available.
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={() => setDocumentsModalOpen(false)}
        sx={{
          mt: 1,
          alignSelf: "flex-end",
          backgroundColor: "#14b8a6",
          textTransform: "none",

          "&:hover": {
            backgroundColor: "#0f7468",
          },
        }}
      >
        Close
      </Button>
    </Box>
  </DialogContent>
</Dialog>
    </Box>
  );
};

export default ProfileDetails;

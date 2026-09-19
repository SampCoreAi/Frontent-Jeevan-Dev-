
"use client";

import React from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function PrescriptionFooter({
  remark,
  setRemark,
  followUpDate,
  setFollowUpDate,
  editable,
  isDownloading,
  dateInputStyle,
  datePickerPopupStyle,
  doctor,
  qrImage,
}) {
  const hospital = doctor?.hospital_detail?.[0];
  const availability = doctor?.availability?.[0];

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        color: "#1f2937",
      }}
    >
      {/* =====================================================
          REMARK + FOLLOW UP
      ===================================================== */}

    <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr auto",
    },
    gap: 2,
    mb: 3,
  }}
>
        {/* REMARK */}
        <Box
          sx={{
            border: "1px solid #dce5e3",
            borderRadius: 1.5,
            backgroundColor: "#f8fbfa",
            p: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1e6658",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 1,
            }}
          >
            Remark
          </Typography>

          {!isDownloading ? (
            <TextField
              fullWidth
             
              minRows={2}
              maxRows={4}
              disabled={!editable}
              value={remark || ""}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter remark..."
              size="small"
              sx={{
                backgroundColor: "#fff",

                "& .MuiInputBase-input": {
                  color: "#111827",
                  fontSize: 14,
                },

                "& .MuiInputBase-input::placeholder": {
                  color: "#9ca3af",
                  opacity: 1,
                },

                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },

                "& .MuiOutlinedInput-root fieldset": {
                  borderColor: "#cbd5e1",
                },

                "& .MuiOutlinedInput-root:hover fieldset": {
                  borderColor: "#1e6658",
                },

                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#1e6658",
                  borderWidth: 1,
                },
              }}
            />
          ) : (
            <Typography
              sx={{
                minHeight: 45,
                fontSize: 14,
                color: "#374151",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {remark || " "}
            </Typography>
          )}
        </Box>

        {/* FOLLOW UP */}
        <Box
  sx={{
    border: "1px solid #dce5e3",
    borderRadius: 1.5,
    backgroundColor: "#f8fbfa",
    p: 1.5,
    width: "fit-content",
    minWidth: 190,
  }}
>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1e6658",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 1,
            }}
          >
            Next Follow-up
          </Typography>

          {!isDownloading ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={followUpDate}
                disabled={!editable}
                onChange={setFollowUpDate}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      backgroundColor: "#fff",

                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },

                      "& .MuiOutlinedInput-root fieldset": {
                        borderColor: "#cbd5e1",
                      },

                      "& .MuiOutlinedInput-root:hover fieldset": {
                        borderColor: "#1e6658",
                      },

                      "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                        borderColor: "#1e6658",
                        borderWidth: 1,
                      },

                      ...dateInputStyle,
                    },
                  },

                  popper: {
                    sx: datePickerPopupStyle,
                  },

                  desktopPaper: {
                    sx: datePickerPopupStyle,
                  },

                  mobilePaper: {
                    sx: datePickerPopupStyle,
                  },

                  layout: {
                    sx: datePickerPopupStyle,
                  },
                }}
              />
            </LocalizationProvider>
          ) : (
            <Typography
              sx={{
                minHeight: 40,
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                color: "#374151",
              }}
            >
              {followUpDate
                ? followUpDate.format("DD-MMM-YYYY")
                : " "}
            </Typography>
          )}
        </Box>
      </Box>

     
      {/* =====================================================
          DOCTOR / QR SECTION
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "center",
            sm: "flex-start",
          },
          gap: 3,
          mb: 3,
        }}
      >
        {/* QR CODE */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: {
                xs: 90,
                sm: 100,
              },

              height: {
                xs: 90,
                sm: 100,
              },

              border: "1px solid #d1d5db",
              borderRadius: 1.5,
              p: 1,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: "#fff",

              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            {qrImage ? (
              <img
                src={qrImage}
                alt="Doctor QR"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#9ca3af",
                  textAlign: "center",
                }}
              >
                QR Not Available
              </Typography>
            )}
          </Box>

          {qrImage && (
            <Typography
              sx={{
                mt: 0.7,
                fontSize: 10,
                color: "#6b7280",
              }}
            >
              Scan to connect
            </Typography>
          )}
        </Box>

        {/* DOCTOR SIGNATURE */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            textAlign: {
              xs: "center",
              sm: "right",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: "#6b7280",
              mb: 0.5,
            }}
          >
            Doctor's Signature
          </Typography>

          <Box
            sx={{
              width: {
                xs: "180px",
                sm: "230px",
              },

              height: 35,

              borderBottom: "1px solid #374151",

              ml: {
                xs: "auto",
                sm: "auto",
              },

              mr: {
                xs: "auto",
                sm: 0,
              },

              mb: 1,
            }}
          />

          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {doctor?.name || "Doctor"}
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "#4b5563",
              mt: 0.3,
            }}
          >
            {doctor?.qualification || ""}
          </Typography>

          {doctor?.specialization && (
            <Typography
              sx={{
                fontSize: 12,
                color: "#1e6658",
                fontWeight: 600,
                mt: 0.3,
              }}
            >
              {doctor.specialization}
            </Typography>
          )}
        </Box>
      </Box>

      {/* =====================================================
          CONTACT / HOSPITAL INFORMATION
      ===================================================== */}

      <Box
        sx={{
        
      
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          align="center"
          sx={{
            display: "block",
        
            color: "#666",
            fontSize: 12,
            borderTop: "1px solid #ddd",
            pt: 1,
          }}
        >
          For Appointment: <strong>+91 {doctor?.mobile}</strong>
          &nbsp;|&nbsp;
          {hospital?.flatPlotNo}, {hospital?.areaLocality}, {hospital?.buildingSociety},{" "}
          {hospital?.district}, {hospital?.city}, {hospital?.pinCode}, {hospital?.state}
          &nbsp;|&nbsp;
          <br />
          Timings: {availability?.startTime} - {availability?.endTime} ({availability?.day})
        </Typography>
      </Box>

      {/* =====================================================
          DISCLAIMER
      ===================================================== */}

      <Typography
        sx={{
          mt: 2,
          textAlign: "center",
          fontSize: 9,
          color: "#9ca3af",
        }}
      >
        This prescription is digitally generated and is valid
        as prescribed by the doctor.
      </Typography>
    </Box>
  );
}


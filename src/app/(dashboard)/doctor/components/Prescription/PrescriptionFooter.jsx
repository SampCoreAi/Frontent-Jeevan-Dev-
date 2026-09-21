"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
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
  const theme = useTheme();
  const [remarkAnchor, setRemarkAnchor] = useState(null);

  const hospital = doctor?.hospital_detail?.[0];
  const availability = doctor?.availability?.[0];

  const quickRemarks = [
    "Take adequate rest",
    "Drink plenty of water",
    "Take medicines on time",
    "Complete the prescribed medication course",
    "Avoid heavy physical activity",
    "Take medicines after food",
    "Monitor symptoms regularly",
    "Return if symptoms worsen",
  ];

  const address = [
    hospital?.flatPlotNo,
    hospital?.areaLocality,
    hospital?.buildingSociety,
    hospital?.district,
    hospital?.city,
    hospital?.pinCode,
    hospital?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const handleQuickRemark = (message) => {
    setRemark(message);
    setRemarkAnchor(null);
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      height: 40,
      fontSize: "13px",
      bgcolor: theme.palette.background.paper,
      borderRadius: 1,
      "& fieldset": {
        borderColor: "#D6D6D6",
      },
      "&:hover fieldset": {
        borderColor: "#B1B1B1",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "13px",
      color: theme.palette.text.primary,
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(0, 1fr) 220px",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Box>
          <Typography
            sx={{
              mb: 0.75,
              fontSize: "12px",
              fontWeight: 600,
              color: theme.palette.text.secondary,
            }}
          >
            Remark
          </Typography>

          {!isDownloading ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
              }}
            >
              <TextField
                fullWidth
                disabled={!editable}
                value={remark || ""}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add remark for patient"
                size="small"
                inputProps={{
                  maxLength: 300,
                }}
                sx={{
                  ...inputStyle,
                  "& .MuiOutlinedInput-root": {
                    ...inputStyle["& .MuiOutlinedInput-root"],
                    pr: editable ? "42px" : 1,
                  },
                }}
              />

              {editable && (
                <Tooltip title="Quick Remarks">
                  <IconButton
                    size="small"
                    onClick={(e) => setRemarkAnchor(e.currentTarget)}
                    sx={{
                      position: "absolute",
                      right: 5,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 30,
                      height: 30,
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        bgcolor: "#EDF7F2",
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ChatBubbleOutlineIcon
                      sx={{
                        fontSize: 17,
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                height: 40,
                px: 1.5,
                display: "flex",
                alignItems: "center",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  fontSize: "13px",
                  color: theme.palette.text.primary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {remark || "Not provided"}
              </Typography>
            </Box>
          )}
        </Box>

        <Box>
          <Typography
            sx={{
              mb: 0.75,
              fontSize: "12px",
              fontWeight: 600,
              color: theme.palette.text.secondary,
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
                      ...inputStyle,
                      ...dateInputStyle,
                      "& .MuiOutlinedInput-root": {
                        height: 40,
                        fontSize: "13px",
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 1,
                        "& fieldset": {
                          borderColor: "#D6D6D6",
                        },
                        "&:hover fieldset": {
                          borderColor: "#B1B1B1",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: "1px",
                        },
                      },
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
            <Box
              sx={{
                height: 40,
                px: 1.5,
                display: "flex",
                alignItems: "center",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  color: theme.palette.text.primary,
                }}
              >
                {followUpDate
                  ? followUpDate.format("DD-MMM-YYYY")
                  : "Not provided"}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Menu
        anchorEl={remarkAnchor}
        open={Boolean(remarkAnchor)}
        onClose={() => setRemarkAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 0.5,
            width: 290,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: 300,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1.5,
            boxShadow: theme.shadows[3],
          },
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Quick Remarks
          </Typography>

          <Typography
            sx={{
              mt: 0.15,
              fontSize: "10px",
              color: theme.palette.text.secondary,
            }}
          >
            Select a message
          </Typography>
        </Box>

        {quickRemarks.map((message) => (
          <MenuItem
            key={message}
            onClick={() => handleQuickRemark(message)}
            sx={{
              minHeight: 38,
              px: 1.5,
              py: 0.75,
              fontSize: "12px",
              lineHeight: 1.4,
              whiteSpace: "normal",
              color: theme.palette.text.primary,
              "&:hover": {
                bgcolor: "#EDF7F2",
                color: theme.palette.primary.main,
              },
            }}
          >
            {message}
          </MenuItem>
        ))}
      </Menu>

      <Box
        sx={{
          my: 2.5,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          alignItems: {
            xs: "center",
            sm: "flex-end",
          },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 82,
              height: 82,
              flexShrink: 0,
              p: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              bgcolor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {qrImage ? (
              <Box
                component="img"
                src={qrImage}
                alt="Doctor QR"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: "10px",
                  textAlign: "center",
                  color: theme.palette.text.disabled,
                }}
              >
                QR Not Available
              </Typography>
            )}
          </Box>

          {qrImage && (
            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Connect with Doctor
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: "10px",
                  color: theme.palette.text.secondary,
                }}
              >
                Scan QR code
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: {
              xs: "100%",
              sm: 250,
            },
            textAlign: {
              xs: "center",
              sm: "right",
            },
          }}
        >
          
          <Box
            sx={{
              width: 210,
              ml: "auto",
              mr: {
                xs: "auto",
                sm: 0,
              },
              borderTop: `1px solid ${theme.palette.text.secondary}`,
              pt: 0.75,
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {doctor?.name || "Doctor"}
            </Typography>

            {doctor?.qualification && (
              <Typography
                sx={{
                  mt: 0.15,
                  fontSize: "11px",
                  color: theme.palette.text.secondary,
                }}
              >
                {doctor.qualification}
              </Typography>
            )}

            {doctor?.specialization && (
              <Typography
                sx={{
                  mt: 0.15,
                  fontSize: "11px",
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                }}
              >
                {doctor.specialization}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2.5,
          pt: 1.25,
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            lineHeight: 1.6,
            color: theme.palette.text.secondary,
          }}
        >
          For Appointment:{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {doctor?.mobile
              ? `+91 ${doctor.mobile}`
              : "Not provided"}
          </Box>

          {address && (
            <Box component="span">
              {" · "}
              {address}
            </Box>
          )}
        </Typography>

        {availability?.startTime &&
          availability?.endTime && (
            <Typography
              sx={{
                mt: 0.25,
                fontSize: "11px",
                color: theme.palette.text.secondary,
              }}
            >
              Timings: {availability.startTime} -{" "}
              {availability.endTime}
              {availability?.day
                ? ` · ${availability.day}`
                : ""}
            </Typography>
          )}
      </Box>
    </Box>
  );
}
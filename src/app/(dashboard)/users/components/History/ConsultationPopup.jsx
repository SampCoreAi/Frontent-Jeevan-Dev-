"use client";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material"; 
import CloseIcon from "@mui/icons-material/Close";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Prescription from "../../../doctor/components/Prescription/Prescription";

export default function ConsultationPopup({
  open,
  handleClose,
  selectedConsultation,
  pdfRef,
}) {
  // =====================================================
  // STATUS
  // =====================================================

  const getStatusStyle = (status, theme) => {
    switch ((status || "").toUpperCase()) {
      case "COMPLETE":
      case "COMPLETED":
        return {
          bg: theme.palette.success.main + "12",
          color: theme.palette.success.main,
        };

      case "UPCOMING":
        return {
          bg: theme.palette.info.main + "12",
          color: theme.palette.info.main,
        };

      case "CANCELLED":
        return {
          bg: theme.palette.error.main + "12",
          color: theme.palette.error.main,
        };

      case "IN_PROGRESS":
        return {
          bg: theme.palette.info.main + "12",
          color: theme.palette.info.main,
        };

      case "PENDING":
      default:
        return {
          bg: theme.palette.warning.main + "12",
          color: theme.palette.warning.main,
        };
    }
  };

  // =====================================================
  // COMMON STYLES
  // =====================================================

  const labelSx = {
    fontSize: "10.5px",
    fontWeight: 500,
    color: "text.secondary",
    lineHeight: 1.25,
    mb: 0.25,
  };

  const valueSx = {
    fontSize: "12px",
    fontWeight: 600,
    color: "text.primary",
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  };

  const iconSx = {
    fontSize: 16,
    color: "primary.main",
    mt: "1px",
    flexShrink: 0,
  };

  const infoItemSx = {
    display: "flex",
    alignItems: "flex-start",
    gap: 0.8,
    minWidth: 0,
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: {
            xs: "calc(100% - 20px)",
            sm: "94%",
            lg: "70%",
          },

          // maxWidth: "1400px",

          height: {
            xs: "92vh",
            md: "86vh",
          },

          m: {
            xs: 1,
            sm: 2,
          },

          borderRadius: 2,

          bgcolor: "background.paper",

          border: "1px solid",
          borderColor: "divider",

          boxShadow: (theme) => theme.shadows[8],

          overflow: "hidden",
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <DialogTitle
        sx={{
          minHeight: 48,

          px: {
            xs: 1.5,
            sm: 2,
          },

          py: 0.9,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          bgcolor: "background.paper",

          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          <LocalHospitalOutlinedIcon
            sx={{
              fontSize: 18,
              color: "primary.main",
            }}
          />

          <Typography
            sx={{
              fontSize: {
                xs: "12.5px",
                sm: "13.5px",
              },

              fontWeight: 600,

              color: "text.primary",

              lineHeight: 1.3,
            }}
          >
            Consultation Details
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={handleClose}
          aria-label="Close consultation details"
          sx={{
            width: 29,
            height: 29,

            color: "text.secondary",

            "&:hover": {
              bgcolor: "action.hover",
              color: "text.primary",
            },
          }}
        >
          <CloseIcon
            sx={{
              fontSize: 17,
            }}
          />
        </IconButton>
      </DialogTitle>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <DialogContent
        sx={{
          p: {
            xs: 1,
            sm: 1.5,
          },

          bgcolor: "background.default",

          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(290px, 0.72fr) minmax(0, 1.28fr)",
            },

            gap: {
              xs: 1,
              sm: 1.5,
            },

            overflow: {
              xs: "auto",
              md: "hidden",
            },
          }}
        >
          {/* =================================================
              LEFT - CONSULTATION DETAILS
          ================================================= */}

       {/* LEFT - CONSULTATION DETAILS */}

<Box
  sx={{
    minWidth: 0,
    overflowY: {
      xs: "visible",
      md: "auto",
    },
    pr: {
      md: 0.3,
    },
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: 4,
    },
    "&::-webkit-scrollbar-thumb": {
      bgcolor: "divider",
      borderRadius: 10,
    },
  }}
>
  {selectedConsultation && (
    <Box ref={pdfRef}>
      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          borderRadius: 1.5,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* TOKEN + STATUS */}

        <Box
          sx={{
            px: {
              xs: 1.2,
              sm: 1.5,
            },
            py: 1.1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            bgcolor: "action.hover",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 500,
                color: "text.secondary",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Token Number
            </Typography>

            <Chip
              size="small"
              icon={<CheckCircleOutlineIcon />}
              label={selectedConsultation.token || "-"}
              sx={{
                height: 25,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontSize: "10.5px",
                fontWeight: 600,
                borderRadius: 1,
                "& .MuiChip-label": {
                  px: 0.8,
                },
                "& .MuiChip-icon": {
                  fontSize: 14,
                  ml: 0.6,
                  color: "primary.contrastText",
                },
              }}
            />
          </Box>

          <Box
            sx={(theme) => {
              const status = getStatusStyle(
                selectedConsultation.status,
                theme
              );

              return {
                display: "inline-flex",
                alignItems: "center",
                gap: 0.6,
                px: 0.9,
                py: 0.45,
                borderRadius: 1,
                bgcolor: status.bg,
                color: status.color,
                fontSize: "10.5px",
                fontWeight: 600,
                lineHeight: 1.2,
              };
            }}
          >
            <Box
              sx={(theme) => ({
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: getStatusStyle(
                  selectedConsultation.status,
                  theme
                ).color,
              })}
            />

            {selectedConsultation.status || "-"}
          </Box>
        </Box>

        {/* CONSULTATION DETAILS */}

        <Box
          sx={{
            p: {
              xs: 1.2,
              sm: 1.5,
            },
          }}
        >
          {/* DOCTOR + DEPARTMENT */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: {
                xs: 1.3,
                sm: 1.6,
              },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={labelSx}>
                Doctor Name
              </Typography>

              <Typography sx={valueSx}>
                {selectedConsultation.doctor || "-"}
              </Typography>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={labelSx}>
                Department
              </Typography>

              <Typography sx={valueSx}>
                {selectedConsultation.department || "-"}
              </Typography>
            </Box>

            <Box
              sx={{
                minWidth: 0,
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
              }}
            >
              <Typography sx={labelSx}>
                Reason For Visit
              </Typography>

              <Typography sx={valueSx}>
                {selectedConsultation.reasonForVisit ||
                  selectedConsultation.reason_for_visit ||
                  "-"}
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              my: 1.4,
              borderColor: "divider",
            }}
          />

          {/* DATE + TIME */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: {
                xs: 1.3,
                sm: 1.6,
              },
            }}
          >
            {/* DATE */}

            <Box sx={infoItemSx}>
              <CalendarTodayOutlinedIcon sx={iconSx} />

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={labelSx}>
                  Date
                </Typography>

                <Typography sx={valueSx}>
                  {selectedConsultation.date || "-"}
                </Typography>
              </Box>
            </Box>

            {/* TIME */}

      <Box sx={infoItemSx}>
  <AccessTimeOutlinedIcon sx={iconSx} />

  <Box sx={{ minWidth: 0 }}>
    <Typography sx={labelSx}>
      Time
    </Typography>

    <Typography sx={valueSx}>
      {selectedConsultation.startTime &&
      selectedConsultation.endTime
        ? `${selectedConsultation.startTime} - ${selectedConsultation.endTime}`
        : "-"}
    </Typography>
  </Box>
</Box>

            {/* HOSPITAL */}

            <Box
              sx={{
                ...infoItemSx,
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
              }}
            >
              <LocationOnOutlinedIcon sx={iconSx} />

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={labelSx}>
                  Hospital Name
                </Typography>

                <Typography sx={valueSx}>
                  {selectedConsultation.hospital_name ||
                    selectedConsultation.address ||
                    "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )}
</Box>

          {/* =================================================
              RIGHT - PRESCRIPTION
          ================================================= */}

          <Box
            sx={{
              minWidth: 0,

              height: "100%",

              overflowY: "auto",

              p: {
                xs: 0.8,
                sm: 1.2,
              },

              bgcolor: "background.paper",

              border: "1px solid",
              borderColor: "divider",

              borderRadius: 1.5,

              scrollbarWidth: "thin",

              "&::-webkit-scrollbar": {
                width: 4,
              },

              "&::-webkit-scrollbar-thumb": {
                bgcolor: "divider",
                borderRadius: 10,
              },
            }}
          >
            <Prescription
              consultation={
                selectedConsultation
              }
              appointmentId={
                selectedConsultation?.id
              }
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
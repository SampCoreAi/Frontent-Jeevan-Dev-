import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,

  Tooltip,
  Zoom,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckIcon from "@mui/icons-material/Check";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DownloadIcon from "@mui/icons-material/Download";
import EventIcon from "@mui/icons-material/Event";

const CardHistory = ({
  consultationHistory = [],
  searchQuery = "",
  setSnackbar,
  setSelectedConsultation,
  setPdfDialogOpen,
  handleCancelAppointment,
}) => {

  const [copiedId, setCopiedId] = useState(null);
  const [hoveredToken, setHoveredToken] = useState(null);
  const [mountedCards, setMountedCards] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showReason, setShowReason] = useState(false);
  const [expandedReasonId, setExpandedReasonId] = useState(null);
  useEffect(() => {
    let timers = [];

    setMountedCards([]);

    consultationHistory.forEach((item, index) => {
      const t = setTimeout(() => {
        setMountedCards((prev) => [...prev, item.id]);
      }, index * 150);

      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [consultationHistory]);

  const copyTokenAndCode = (token, code, id) => {
    navigator.clipboard.writeText(
      `Token: ${token}\nCode: ${code}`
    );

    setSnackbar({
      open: true,
      message: "Token & Code copied!",
      severity: "success",
    });

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const highlightText = (text, searchQuery) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span
          key={index}
          style={{
            backgroundColor: "yellow",
            fontWeight: 700,
            padding: "0 2px",
            borderRadius: "2px",
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  const getStatusColor = (status) => {
    switch ((status || "").toUpperCase()) {
      case "COMPLETED":
        return {
          bg: "#e8f5e9",
          color: "#1b5e20",
        };

      case "PENDING":
        return {
          bg: "#fff8e1",
          color: "#f57c00",
        };

      case "IN_PROGRESS":
        return {
          bg: "#e3f2fd",
          color: "#1976d2",
        };

      case "CANCELLED":
        return {
          bg: "#ffebee",
          color: "#c62828",
        };

      default:
        return {
          bg: "#f5f5f5",
          color: "#616161",
        };
    }
  };

  return (
    <Box sx={{ pb: 3 }}>
      {consultationHistory.map((item, index) => {
        const statusStyle = getStatusColor(item.status);
        const isMounted = mountedCards.includes(item.id);
        const isTokenHovered = hoveredToken === item.id;
        const isCopied = copiedId === item.id;
        const isUpcoming =
          (item.status || "").toUpperCase() === "PENDING" &&
          dayjs(item.dateObj).startOf("day").isAfter(dayjs().startOf("day"));
        return (
          <Zoom
            key={item.id}
            in={isMounted}
            timeout={500}
            style={{ transitionDelay: isMounted ? "0ms" : `${index * 100}ms` }}
          >
            <Card
              onClick={() => {
                if (confirmOpen || reasonOpen) return;

                if (
                  item.status === "Complete" ||
                  item.status === "COMPLETED"
                ) {
                  setSelectedConsultation(item);
                  setPdfDialogOpen(true);
                }
              }}

              sx={{
                cursor:
                  item.status === "Complete" ||
                    item.status === "COMPLETED"
                    ? "pointer"
                    : "not-allowed",
                mb: 3,
                borderRadius: 0.5,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #e0e0e0",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "translateY(0)",
                "&:hover":
                  item.status === "Complete" ||
                    item.status === "COMPLETED"
                    ? {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    }
                    : {},
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header with Avatar, Title, Status and Token */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                  <Avatar
                    src={item.avatar}
                    sx={{
                      width: 52,
                      height: 52,
                      border: "3px solid #e8f5e9",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="600" color="#1b5e20" sx={{ mb: 0.5 }}>
                      {item.title}
                    </Typography>

                  </Box>

                  {/* Status and Token Chips Container */}
               <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 3,
  }}
>
  <Tooltip
    title="Click to copy Token & Code"
    arrow
    placement="left"
  >
    <Chip
      icon={
        <VerifiedIcon
          sx={{
            fontSize: 16,
            transition: "all 0.3s ease",
            transform: isTokenHovered
              ? "scale(1.2)"
              : "scale(1)",
            color: isCopied
              ? "#2e7d32"
              : "#1b5e20",
          }}
        />
      }
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            transition:
              "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: isTokenHovered
              ? "scale(1.05)"
              : "scale(1)",
          }}
        >
          {/* Token */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: "#1b5e20" }}
            >
              Token:
            </Typography>

            <Typography
              variant="caption"
              fontWeight={800}
              sx={{
                fontFamily: "monospace",
                letterSpacing: 1.2,
                color: isCopied
                  ? "#2e7d32"
                  : "#1b5e20",
              }}
            >
              {item.token}
            </Typography>
          </Box>

          {/* Divider */}
          <Box
            sx={{
              width: "1px",
              height: "18px",
              backgroundColor: "#a5d6a7",
            }}
          />

          {/* Code */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: "#1b5e20" }}
            >
              Code:
            </Typography>

            <Typography
              variant="caption"
              fontWeight={800}
              sx={{
                fontFamily: "monospace",
                letterSpacing: 1.2,
                color: "#1b5e20",
              }}
            >
              {item.code}
            </Typography>
          </Box>

          {/* Copied */}
          {isCopied && (
            <CheckIcon
              sx={{
                fontSize: 14,
                color: "#2e7d32",
                animation: "popIn 0.3s ease",
                "@keyframes popIn": {
                  "0%": {
                    transform: "scale(0)",
                  },
                  "50%": {
                    transform: "scale(1.2)",
                  },
                  "100%": {
                    transform: "scale(1)",
                  },
                },
              }}
            />
          )}
        </Box>
      }
      onClick={(e) => {
        e.stopPropagation();
        copyTokenAndCode(
          item.token,
          item.code,
          item.id
        );
      }}
      onMouseEnter={() =>
        setHoveredToken(item.id)
      }
      onMouseLeave={() =>
        setHoveredToken(null)
      }
      sx={{
        backgroundColor: isCopied
          ? "#c8e6c9"
          : "#e8f5e9",

        border: `2px solid ${
          isCopied
            ? "#4caf50"
            : "#e8f5e9"
        }`,

        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.3s ease",

        px: 1.5,
        py: 0.5,

        "&:hover": {
          backgroundColor: "#c8e6c9",
          borderColor: "#4caf50",
          boxShadow:
            "0 4px 12px rgba(76, 175, 80, 0.3)",
        },

        "&:active": {
          transform: "scale(0.95)",
        },
      }}
    />
  </Tooltip>

  {/* Cancel */}
  {isUpcoming && (
    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setCancelId(item.id);
        setConfirmOpen(true);
      }}
    >
      Cancel
    </Button>
  )}
</Box>
                </Box>
                <Dialog
                  open={confirmOpen}
                  onClose={() => {
                    setConfirmOpen(false);
                    setCancelReason("");
                  }}
                  maxWidth="xs"
                  fullWidth
                  BackdropProps={{
                    sx: {
                      backgroundColor: "rgba(0, 0, 0, 0.08)", // bahut halka
                      backdropFilter: "blur(2px)", // optional, thoda premium look
                    },
                  }}
                >
                  <DialogTitle
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: 700,
                      color: "#d32f2f",
                      py: 2,
                    }}
                  >
                    <WarningAmberRoundedIcon color="warning" />
                    Cancel Appointment
                    <WarningAmberRoundedIcon color="warning" />
                  </DialogTitle>

                  <DialogContent>
                    <Typography
                      align="center"
                      sx={{
                        color: "#424242",
                        fontSize: 16,
                        mb: 3,
                      }}
                    >
                      Are you sure you want to cancel this appointment?
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Cancellation Reason"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      InputLabelProps={{
                        sx: {
                          color: "#616161",
                        },
                      }}
                      InputProps={{
                        sx: {
                          color: "#212121",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#bdbdbd",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d32f2f",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d32f2f",
                          },
                        },
                      }}
                    />
                  </DialogContent>

                  <DialogActions
                    sx={{
                      justifyContent: "center",
                      pb: 3,
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        setConfirmOpen(false);
                        setCancelReason("");
                      }}
                    >
                      Close
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        handleCancelAppointment(cancelId, cancelReason);
                        setConfirmOpen(false);
                        setCancelReason("");
                      }}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>



                {/* Info Grid */}
                <Box
                  sx={{
                    backgroundColor: "#f8faf8",
                    borderRadius: 2,
                    p: 2.5,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                    gap: 2.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <PersonIcon sx={{ fontSize: 18, color: "#1b5e20", mt: 0.3 }} />
                    <Box>
                      <Typography variant="caption" color="#1b5e20" fontWeight="600" display="block" mb={0.5}>
                        Doctor
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {highlightText(item.doctor, searchQuery)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <LocalHospitalIcon sx={{ fontSize: 18, color: "#1b5e20", mt: 0.3 }} />
                    <Box>
                      <Typography variant="caption" color="#1b5e20" fontWeight="600" display="block" mb={0.5}>
                        Department
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {highlightText(item.department, searchQuery)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: "#1b5e20", mt: 0.3 }} />
                    <Box>
                      <Typography variant="caption" color="#1b5e20" fontWeight="600" display="block" mb={0.5}>
                        Address
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {item.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: "#1b5e20", mt: 0.3 }} />
                    <Box>
                      <Typography variant="caption" color="#1b5e20" fontWeight="600" display="block" mb={0.5}>
                        Time
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {(() => {
                          const startTime = dayjs(`2000-01-01 ${item.startTime}`);

                          const beforeTime = startTime.subtract(10, "minute");
                          const afterTime = startTime.add(10, "minute");

                          return `${beforeTime.format("hh:mm A")} → ${afterTime.format(
                            "hh:mm A"
                          )}`;
                        })()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, color: "#1b5e20", mt: 0.3 }} />
                    <Box>
                      <Typography variant="caption" color="#1b5e20" fontWeight="600" display="block" mb={0.5}>
                        Date
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: statusStyle.bg,
                        border: `2px solid ${statusStyle.color}`,
                        mt: 0.3,
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="caption" color="#1b5e20" fontWeight="600" display="block" mb={0.5}>
                        Status
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: statusStyle.color,
                          fontWeight: 600,
                          display: "inline-block",
                          px: 1.5,
                          py: 0.25,
                          borderRadius: 1,
                          backgroundColor: statusStyle.bg,
                        }}
                      >
                        {item.status}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

              </CardContent>
            </Card>
          </Zoom>
        );
      })}
    </Box>
  );
};

export default CardHistory;
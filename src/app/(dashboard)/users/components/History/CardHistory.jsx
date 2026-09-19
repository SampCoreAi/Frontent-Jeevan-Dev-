import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";

import dayjs from "dayjs";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const CardHistory = ({
  consultationHistory = [],
  appointmentTracking = {},
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
  const [reasonOpen] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // =====================================================
  // CARD ANIMATION
  // =====================================================

  useEffect(() => {
    const timers = [];

    setMountedCards([]);

    consultationHistory.forEach((item, index) => {
      const timer = setTimeout(() => {
        setMountedCards((prev) => [...prev, item.id]);
      }, index * 150);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [consultationHistory]);

  // =====================================================
  // COPY TOKEN + CODE
  // =====================================================

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

  // =====================================================
  // SEARCH HIGHLIGHT
  // =====================================================

  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");

    return String(text || "")
      .split(regex)
      .map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={index}
            style={{
              backgroundColor: "#fff3b0",
              fontWeight: 600,
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

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusColor = (status) => {
    switch ((status || "").toUpperCase()) {
      case "COMPLETED":
        return {
          bg: "#EAF6EE",
          color: "#1B7A3E",
        };

      case "PENDING":
        return {
          bg: "#FFF6E5",
          color: "#C77800",
        };

      case "IN_PROGRESS":
        return {
          bg: "#EAF3FF",
          color: "#2563A9",
        };

      case "CANCELLED":
        return {
          bg: "#FDECEC",
          color: "#C62828",
        };

      default:
        return {
          bg: "#F2F4F3",
          color: "#66706C",
        };
    }
  };

  // =====================================================
  // COMMON INFO STYLES
  // =====================================================

  const infoItemSx = {
    display: "flex",
    alignItems: "flex-start",
    gap: 0.8,
    minWidth: 0,
  };

  const infoContentSx = {
    minWidth: 0,
    flex: 1,
  };

  const infoLabelSx = {
    display: "block",
    mb: 0.2,
    fontSize: "11px",
    lineHeight: 1.25,
    fontWeight: 600,
    color: "text.secondary",
  };

  const infoValueSx = {
    fontSize: "13px",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    lineHeight: 1.35,
    color: "text.primary",
  };

  const infoIconSx = {
    fontSize: 17,
    color: "primary.main",
    mt: "2px",
    flexShrink: 0,
  };

  return (
    <Box
      sx={{
        pb: 1.5,
        width: "100%",
        minWidth: 0,
      }}
    >
      {consultationHistory.map((item, index) => {
        const statusStyle = getStatusColor(item.status);

        const isMounted = mountedCards.includes(item.id);

        const isTokenHovered =
          hoveredToken === item.id;

        const isCopied =
          copiedId === item.id;

        const tracking =
          appointmentTracking[item.id];

        const isUpcoming =
          (item.status || "").toUpperCase() ===
            "PENDING" &&
          dayjs(item.dateObj)
            .startOf("day")
            .isAfter(dayjs().startOf("day"));

        return (
          <Zoom
            key={item.id}
            in={isMounted}
            timeout={500}
            style={{
              transitionDelay: isMounted
                ? "0ms"
                : `${index * 100}ms`,
            }}
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
                    : "default",

                mb: 1.5,

                width: "100%",
                minWidth: 0,

                bgcolor: "background.paper",

                border: "1px solid",
                borderColor: "divider",

                borderRadius: "8px",

                overflow: "hidden",

                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.04)",

                transition:
                  "border-color 0.18s ease, box-shadow 0.18s ease",

                "&:hover":
                  item.status === "Complete" ||
                  item.status === "COMPLETED"
                    ? {
                        borderColor:
                          "primary.light",

                        boxShadow:
                          "0 4px 14px rgba(0,0,0,0.06)",
                      }
                    : {},
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.2,
                    sm: 1.4,
                    md: 1.6,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.2,
                      sm: 1.4,
                      md: 1.6,
                    },
                  },
                }}
              >
                {/* =========================================
                    HEADER
                ========================================= */}

                <Box
                  sx={{
                    position: "relative",

                    display: "flex",

                    flexDirection: {
                      xs: "column",
                      md: "row",
                    },

                    alignItems: {
                      xs: "stretch",
                      md: "center",
                    },

                    gap: {
                      xs: 1,
                      md: 1.2,
                    },

                    mb: 1.3,

                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  {/* =====================================
                      LEFT
                  ===================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      gap: 1,

                      width: {
                        xs: "100%",
                        md: "auto",
                      },

                      mr: {
                        md: "auto",
                      },

                      minWidth: 0,
                    }}
                  >
                    <Avatar
                      src={item.avatar}
                      sx={{
                        width: {
                          xs: 38,
                          sm: 40,
                          md: 42,
                        },

                        height: {
                          xs: 38,
                          sm: 40,
                          md: 42,
                        },

                        flexShrink: 0,

                        border: "2px solid",
                        borderColor:
                          "secondary.light",

                        boxShadow: "none",
                      }}
                    />

                    <Typography
                      fontWeight={600}
                      sx={{
                        fontSize: {
                          xs: "13px",
                          md: "14px",
                        },

                        color: "text.primary",

                        lineHeight: 1.3,

                        minWidth: 0,

                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        whiteSpace: {
                          xs: "normal",
                          sm: "nowrap",
                        },

                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>

                  {/* =====================================
                      TRACKING
                  ===================================== */}

                  {item.title ===
                    "Online Consultation" &&
                    tracking && (
                      <Box
                        sx={{
                          position: {
                            xs: "static",
                            md: "absolute",
                          },

                          left: {
                            md: "50%",
                          },

                          top: {
                            md: "50%",
                          },

                          transform: {
                            md:
                              "translate(-50%, -50%)",
                          },

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          flexWrap: "wrap",

                          gap: 0.8,

                          px: 1,
                          py: 0.55,

                          borderRadius: "6px",

                          bgcolor:
                            "background.default",

                          border: "1px solid",
                          borderColor: "divider",

                          width: {
                            xs: "100%",
                            sm: "fit-content",
                          },

                          maxWidth: "100%",

                          boxSizing: "border-box",

                          zIndex: 1,
                        }}
                      >
                        {/* CURRENT */}

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "11px",
                              fontWeight: 500,
                              color:
                                "text.secondary",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            Currently Serving:
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "12px",

                              fontWeight: 700,

                              color:
                                "text.primary",

                              fontFamily:
                                "monospace",
                            }}
                          >
                            {tracking.currently_serving ??
                              0}
                          </Typography>
                        </Box>

                        {/* DIVIDER */}

                        <Box
                          sx={{
                            width: "1px",
                            height: 16,

                            bgcolor: "divider",

                            display: {
                              xs: "none",
                              sm: "block",
                            },
                          }}
                        />

                        {/* WAITING */}

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "11px",

                              fontWeight: 500,

                              color:
                                "text.secondary",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            Approx Waiting:
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "12px",

                              fontWeight: 700,

                              color:
                                "text.primary",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {tracking.approx_waiting_time ??
                              "--"}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                  {/* =====================================
                      RIGHT
                  ===================================== */}

                  <Box
                    sx={{
                      display: "flex",

                      flexDirection: {
                        xs: "row",
                        md: "column",
                      },

                      alignItems: {
                        xs: "center",
                        md: "flex-end",
                      },

                      justifyContent: {
                        xs: "space-between",
                        md: "center",
                      },

                      flexWrap: "wrap",

                      ml: {
                        md: "auto",
                      },

                      width: {
                        xs: "100%",
                        md: "auto",
                      },

                      gap: 0.7,

                      minWidth: 0,
                    }}
                  >
                    {/* =================================
                        TOKEN + CODE
                    ================================= */}

                    {(item.status || "")
                      .toUpperCase() !==
                      "CANCELLED" && (
                      <Tooltip
                        title="Click to copy Token & Code"
                        arrow
                        placement="left"
                      >
                        <Chip
                          icon={
                            <VerifiedIcon
                              sx={{
                                fontSize: 15,

                                color: isCopied
                                  ? "success.main"
                                  : "primary.main",

                                transition:
                                  "transform 0.18s ease",

                                transform:
                                  isTokenHovered
                                    ? "scale(1.1)"
                                    : "scale(1)",
                              }}
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",

                                gap: {
                                  xs: 0.6,
                                  sm: 0.8,
                                },

                                minWidth: 0,

                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {/* TOKEN */}

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems:
                                    "center",
                                  gap: 0.3,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize:
                                      "11px",

                                    fontWeight:
                                      600,

                                    color:
                                      "text.secondary",
                                  }}
                                >
                                  Token:
                                </Typography>

                                <Typography
                                  sx={{
                                    fontSize:
                                      "11px",

                                    fontWeight:
                                      700,

                                    fontFamily:
                                      "monospace",

                                    color:
                                      "primary.main",
                                  }}
                                >
                                  {item.token}
                                </Typography>
                              </Box>

                              {/* DIVIDER */}

                              <Box
                                sx={{
                                  width: "1px",
                                  height: 14,

                                  bgcolor:
                                    "divider",

                                  flexShrink: 0,
                                }}
                              />

                              {/* CODE */}

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems:
                                    "center",
                                  gap: 0.3,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize:
                                      "11px",

                                    fontWeight:
                                      600,

                                    color:
                                      "text.secondary",
                                  }}
                                >
                                  Code:
                                </Typography>

                                <Typography
                                  sx={{
                                    fontSize:
                                      "11px",

                                    fontWeight:
                                      700,

                                    fontFamily:
                                      "monospace",

                                    color:
                                      "primary.main",
                                  }}
                                >
                                  {item.code}
                                </Typography>
                              </Box>

                              {isCopied && (
                                <CheckIcon
                                  sx={{
                                    fontSize: 13,

                                    color:
                                      "success.main",
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
                            setHoveredToken(
                              item.id
                            )
                          }
                          onMouseLeave={() =>
                            setHoveredToken(null)
                          }
                          sx={{
                            bgcolor: isCopied
                              ? "secondary.light"
                              : "background.default",

                            border: "1px solid",

                            borderColor: isCopied
                              ? "primary.main"
                              : "divider",

                            borderRadius: "6px",

                            cursor: "pointer",

                            maxWidth: "100%",

                            height: 30,

                            boxShadow: "none",

                            transition:
                              "all 0.18s ease",

                            "& .MuiChip-label": {
                              px: 0.7,
                              overflow: "hidden",
                            },

                            "& .MuiChip-icon": {
                              ml: "6px",
                            },

                            "&:hover": {
                              bgcolor:
                                "secondary.light",

                              borderColor:
                                "primary.light",
                            },

                            "&:active": {
                              transform:
                                "scale(0.98)",
                            },
                          }}
                        />
                      </Tooltip>
                    )}

                    {/* =================================
                        CANCEL
                    ================================= */}

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
                        sx={{
                          minWidth: 68,

                          minHeight: 30,

                          px: 1.2,

                          fontSize: "12px",

                          fontWeight: 600,

                          textTransform: "none",

                          borderRadius: "6px",

                          flexShrink: 0,
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* =========================================
                    CANCEL DIALOG
                ========================================= */}

                <Dialog
                  open={confirmOpen}
                  onClose={() => {
                    setConfirmOpen(false);
                    setCancelReason("");
                  }}
                  maxWidth="xs"
                  fullWidth
                  PaperProps={{
                    sx: {
                      m: {
                        xs: 2,
                        sm: 3,
                      },

                      width: {
                        xs:
                          "calc(100% - 32px)",
                        sm: "100%",
                      },

                      borderRadius: "10px",

                      border: "1px solid",

                      borderColor: "divider",

                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                  BackdropProps={{
                    sx: {
                      backgroundColor:
                        "rgba(0,0,0,0.12)",

                      backdropFilter:
                        "blur(2px)",
                    },
                  }}
                >
                  <DialogTitle
                    sx={{
                      display: "flex",
                      justifyContent:
                        "center",
                      alignItems: "center",

                      gap: 0.6,

                      py: 1.5,

                      fontWeight: 600,

                      color: "error.main",

                      fontSize: "14px",

                      textAlign: "center",
                    }}
                  >
                    <WarningAmberRoundedIcon
                      color="warning"
                      sx={{
                        fontSize: 19,
                      }}
                    />

                    Cancel Appointment
                  </DialogTitle>

                  <DialogContent
                    sx={{
                      px: {
                        xs: 2,
                        sm: 2.5,
                      },
                    }}
                  >
                    <Typography
                      align="center"
                      sx={{
                        color:
                          "text.secondary",

                        fontSize: "13px",

                        lineHeight: 1.5,

                        mb: 2,
                      }}
                    >
                      Are you sure you want to
                      cancel this appointment?
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Cancellation Reason"
                      value={cancelReason}
                      onChange={(e) =>
                        setCancelReason(
                          e.target.value
                        )
                      }
                      InputLabelProps={{
                        sx: {
                          fontSize: "13px",
                        },
                      }}
                      InputProps={{
                        sx: {
                          fontSize: "13px",

                          borderRadius: "7px",

                          "& .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor:
                                "divider",
                            },

                          "&:hover .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor:
                                "error.light",
                            },

                          "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor:
                                "error.main",
                            },
                        },
                      }}
                    />
                  </DialogContent>

                  <DialogActions
                    sx={{
                      justifyContent:
                        "center",

                      flexDirection: {
                        xs: "column-reverse",
                        sm: "row",
                      },

                      px: 2,

                      pb: 2,

                      pt: 1,

                      gap: 1,

                      "& > :not(style) ~ :not(style)":
                        {
                          ml: 0,
                        },
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        setConfirmOpen(false);
                        setCancelReason("");
                      }}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "auto",
                        },

                        minHeight: 32,

                        px: 2,

                        fontSize: "12px",

                        textTransform: "none",

                        borderRadius: "6px",
                      }}
                    >
                      Close
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        handleCancelAppointment(
                          cancelId,
                          cancelReason
                        );

                        setConfirmOpen(false);

                        setCancelReason("");
                      }}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "auto",
                        },

                        minHeight: 32,

                        px: 2,

                        fontSize: "12px",

                        textTransform: "none",

                        borderRadius: "6px",

                        boxShadow: "none",

                        "&:hover": {
                          boxShadow: "none",
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* =========================================
                    INFORMATION
                ========================================= */}

             {/* =========================================
    INFORMATION
========================================= */}

<Box
  sx={{
    bgcolor: "background.default",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: "7px",

    px: {
      xs: 1.2,
      sm: 1.5,
      md: 2,
    },
    
    py: {
      xs: 1.2,
      sm: 1.4,
      md: 3,
    },

    display: "grid",

    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(3, minmax(0, 1fr))",
    },

    columnGap: {
      xs: 0,
      sm: 3,
      md: 4,
    },

    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
  }}
>
  {/* ================= LEFT COLUMN ================= */}

  <Box
    sx={{
      minWidth: 0,

      pr: {
        sm: 2,
        md: 3,
      },

     
    }}
  >
    {/* Doctor */}

    <Box
      sx={{
        ...infoItemSx,

        pb: 1.5,
        mb: 1.5,

        borderBottom: "1px solid",
        borderColor: "#bdbdbd",
      }}
    >
      <PersonIcon sx={infoIconSx} />

      <Box sx={infoContentSx}>
        <Typography sx={infoLabelSx}>
          Doctor
        </Typography>

        <Typography
          fontWeight={500}
          sx={infoValueSx}
        >
          {highlightText(
            item.doctor,
            searchQuery
          )}
        </Typography>
      </Box>
    </Box>

    {/* Time */}

    <Box sx={infoItemSx}>
      <AccessTimeIcon sx={infoIconSx} />

      <Box sx={infoContentSx}>
        <Typography sx={infoLabelSx}>
          Time
        </Typography>

        <Typography
          fontWeight={500}
          sx={{
            ...infoValueSx,

            whiteSpace: {
              xs: "normal",
              sm: "nowrap",
            },
          }}
        >
          {(() => {
            const startTime = dayjs(
              `2000-01-01 ${item.startTime}`
            );

            const beforeTime =
              startTime.subtract(
                10,
                "minute"
              );

            const afterTime =
              startTime.add(
                10,
                "minute"
              );

            return `${beforeTime.format(
              "hh:mm A"
            )} → ${afterTime.format(
              "hh:mm A"
            )}`;
          })()}
        </Typography>
      </Box>
    </Box>
  </Box>

  {/* ================= CENTER COLUMN ================= */}

  <Box
    sx={{
      minWidth: 0,

      px: {
        xs: 0,
        sm: 1,
        md: 2,
      },

      mt: {
        xs: 1.5,
        sm: 0,
      },

      pt: {
        xs: 1.5,
        sm: 0,
      },

    }}
  >
    {/* Department */}

    <Box
      sx={{
        ...infoItemSx,

        pb: 1.5,
        mb: 1.5,

        borderBottom: "1px solid",
        borderColor: "#bdbdbd",
      }}
    >
      <LocalHospitalIcon
        sx={infoIconSx}
      />

      <Box sx={infoContentSx}>
        <Typography sx={infoLabelSx}>
          Department
        </Typography>

        <Typography
          fontWeight={500}
          sx={infoValueSx}
        >
          {highlightText(
            item.department,
            searchQuery
          )}
        </Typography>
      </Box>
    </Box>

    {/* Date */}

    <Box sx={infoItemSx}>
      <CalendarTodayIcon
        sx={infoIconSx}
      />

      <Box sx={infoContentSx}>
        <Typography sx={infoLabelSx}>
          Date
        </Typography>

        <Typography
          fontWeight={500}
          sx={infoValueSx}
        >
          {item.date}
        </Typography>
      </Box>
    </Box>
  </Box>

  {/* ================= RIGHT COLUMN ================= */}

  <Box
    sx={{
      minWidth: 0,

      pl: {
        xs: 0,
        sm: 1,
        md: 2,
      },

      mt: {
        xs: 1.5,
        sm: 0,
      },

      pt: {
        xs: 1.5,
        sm: 0,
      },

      borderTop: {
        xs: "1px solid",
        sm: "none",
      },

      borderColor: "#bdbdbd",
    }}
  >
    {/* Address */}

    <Box
      sx={{
        ...infoItemSx,

        pb: 1.5,
        mb: 1.5,

        borderBottom: "1px solid",
        borderColor: "#bdbdbd",
      }}
    >
      <LocationOnIcon
        sx={infoIconSx}
      />

      <Box sx={infoContentSx}>
        <Typography sx={infoLabelSx}>
          Address
        </Typography>

        <Typography
          fontWeight={500}
          sx={infoValueSx}
        >
          {item.address}
        </Typography>
      </Box>
    </Box>

    {/* Status */}

    <Box sx={infoItemSx}>
      <Box
        sx={{
          width: 17,
          height: 17,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,
          mt: "1px",
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,

            borderRadius: "50%",

            bgcolor:
              statusStyle.color,

            boxShadow: `0 0 0 3px ${statusStyle.bg}`,
          }}
        />
      </Box>

      <Box sx={infoContentSx}>
        <Typography sx={infoLabelSx}>
          Status
        </Typography>

        <Typography
          sx={{
            display: "inline-block",

            fontSize: "12px",
            fontWeight: 600,
            lineHeight: 1.3,

            color:
              statusStyle.color,

            bgcolor:
              statusStyle.bg,

            px: 0.8,
            py: 0.25,

            borderRadius: "5px",
          }}
        >
          {item.status}
        </Typography>
      </Box>
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
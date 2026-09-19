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

  const copyTokenAndCode = (token, code, id) => {
    navigator.clipboard.writeText(`Token: ${token}\nCode: ${code}`);

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

  const infoItemSx = {
    display: "flex",
    alignItems: "flex-start",
    gap: {
      xs: 1,
      sm: 1.3,
      md: 1.5,
    },
    minWidth: 0,
  };

  const infoContentSx = {
    minWidth: 0,
    flex: 1,
  };

  const infoValueSx = {
    fontSize: {
      xs: "12px",
      sm: "13px",
      md: "14px",
    },
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    lineHeight: 1.5,
  };

  const infoIconSx = {
    fontSize: {
      xs: 17,
      sm: 18,
    },
    color: "#1b5e20",
    mt: 0.3,
    flexShrink: 0,
  };

  return (
    <Box
      sx={{
        pb: 3,
        width: "100%",
        minWidth: 0,
      }}
    >
      {consultationHistory.map((item, index) => {
        const statusStyle = getStatusColor(item.status);
        const isMounted = mountedCards.includes(item.id);
        const isTokenHovered = hoveredToken === item.id;
        const isCopied = copiedId === item.id;

        const tracking = appointmentTracking[item.id];

        const isUpcoming =
          (item.status || "").toUpperCase() === "PENDING" &&
          dayjs(item.dateObj)
            .startOf("day")
            .isAfter(dayjs().startOf("day"));

        return (
          <Zoom
            key={item.id}
            in={isMounted}
            timeout={500}
            style={{
              transitionDelay: isMounted ? "0ms" : `${index * 100}ms`,
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

                mb: {
                  xs: 2,
                  sm: 2.5,
                  md: 3,
                },

                borderRadius: {
                  xs: 1.5,
                  sm: 1,
                  md: 0.5,
                },

                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #e0e0e0",
                overflow: "hidden",
                width: "100%",
                minWidth: 0,

                transition:
                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                transform: "translateY(0)",

                "&:hover":
                  item.status === "Complete" ||
                  item.status === "COMPLETED"
                    ? {
                        transform: {
                          xs: "none",
                          md: "translateY(-4px)",
                        },
                        boxShadow: {
                          xs: "0 4px 20px rgba(0,0,0,0.08)",
                          md: "0 12px 40px rgba(0,0,0,0.12)",
                        },
                      }
                    : {},
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.5,
                    sm: 2,
                    md: 3,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.5,
                      sm: 2,
                      md: 3,
                    },
                  },
                }}
              >
                {/* ================= HEADER ================= */}

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

                    minHeight: {
                      xs: "auto",
                      md: 60,
                    },

                    gap: {
                      xs: 1.5,
                      sm: 2,
                      md: 1,
                    },

                    mb: {
                      xs: 2,
                      md: 2.5,
                    },

                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  {/* LEFT - AVATAR + TITLE */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      gap: {
                        xs: 1.2,
                        sm: 1.5,
                        md: 2,
                      },

                      width: {
                        xs: "100%",
                        md: "auto",
                      },

                      mr: {
                        xs: 0,
                        md: "auto",
                      },

                      minWidth: 0,
                    }}
                  >
                    <Avatar
                      src={item.avatar}
                      sx={{
                        width: {
                          xs: 42,
                          sm: 48,
                          md: 52,
                        },

                        height: {
                          xs: 42,
                          sm: 48,
                          md: 52,
                        },

                        flexShrink: 0,

                        border: {
                          xs: "2px solid #e8f5e9",
                          md: "3px solid #e8f5e9",
                        },

                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",

                        transition: "transform 0.3s ease",

                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="#1b5e20"
                      sx={{
                        fontSize: {
                          xs: "15px",
                          sm: "17px",
                          md: "20px",
                        },

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

                  {/* ================= TRACKING ================= */}

                  {item.title === "Online Consultation" && tracking && (
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
                          md: "translate(-50%, -50%)",
                        },

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        flexDirection: {
                          xs: "row",
                          sm: "row",
                        },

                        flexWrap: {
                          xs: "wrap",
                          sm: "nowrap",
                        },

                        gap: {
                          xs: 0.7,
                          sm: 1.5,
                        },

                        px: {
                          xs: 1,
                          sm: 1.5,
                          md: 2,
                        },

                        py: {
                          xs: 0.8,
                          sm: 1,
                        },

                        borderRadius: 2,

                        backgroundColor: "#f1f8f4",

                        border: "1px solid #d8eadc",

                        width: {
                          xs: "100%",
                          sm: "fit-content",
                        },

                        maxWidth: "100%",

                        boxSizing: "border-box",

                        zIndex: 1,
                      }}
                    >
                      {/* Currently Serving */}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: "#607d68",

                            fontSize: {
                              xs: "10px",
                              sm: "11px",
                              md: "12px",
                            },

                            whiteSpace: "nowrap",
                          }}
                        >
                          Currently Serving:
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            color: "#1b5e20",
                            fontFamily: "monospace",

                            fontSize: {
                              xs: "11px",
                              sm: "12px",
                            },
                          }}
                        >
                          {tracking.currently_serving ?? 0}
                        </Typography>
                      </Box>

                      {/* Divider */}

                      <Box
                        sx={{
                          width: "1px",
                          height: "20px",
                          backgroundColor: "#b7d7bd",
                          flexShrink: 0,

                          display: {
                            xs: "none",
                            sm: "block",
                          },
                        }}
                      />

                      {/* Waiting */}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: "#607d68",

                            fontSize: {
                              xs: "10px",
                              sm: "11px",
                              md: "12px",
                            },

                            whiteSpace: "nowrap",
                          }}
                        >
                          Approx Waiting:
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            color: "#1b5e20",

                            fontSize: {
                              xs: "11px",
                              sm: "12px",
                            },

                            whiteSpace: "nowrap",
                          }}
                        >
                          {tracking.approx_waiting_time ?? "--"}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* ================= RIGHT ================= */}

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
                        xs: 0,
                        md: "auto",
                      },

                      width: {
                        xs: "100%",
                        md: "auto",
                      },

                      gap: {
                        xs: 1,
                        md: 2,
                      },

                      minWidth: 0,
                    }}
                  >
                    {(item.status || "").toUpperCase() !== "CANCELLED" && (
                      <Tooltip
                        title="Click to copy Token & Code"
                        arrow
                        placement="left"
                      >
                        <Chip
                          icon={
                            <VerifiedIcon
                              sx={{
                                fontSize: {
                                  xs: 14,
                                  sm: 16,
                                },

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

                                gap: {
                                  xs: 0.7,
                                  sm: 1.5,
                                },

                                minWidth: 0,
                                whiteSpace: "nowrap",

                                transition:
                                  "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",

                                transform: isTokenHovered
                                  ? {
                                      xs: "none",
                                      md: "scale(1.05)",
                                    }
                                  : "scale(1)",
                              }}
                            >
                              {/* Token */}

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.4,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  fontWeight={700}
                                  sx={{
                                    color: "#1b5e20",

                                    fontSize: {
                                      xs: "10px",
                                      sm: "12px",
                                    },
                                  }}
                                >
                                  Token:
                                </Typography>

                                <Typography
                                  variant="caption"
                                  fontWeight={800}
                                  sx={{
                                    fontFamily: "monospace",

                                    letterSpacing: {
                                      xs: 0.5,
                                      sm: 1.2,
                                    },

                                    fontSize: {
                                      xs: "10px",
                                      sm: "12px",
                                    },

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
                                  flexShrink: 0,
                                }}
                              />

                              {/* Code */}

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.4,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  fontWeight={700}
                                  sx={{
                                    color: "#1b5e20",

                                    fontSize: {
                                      xs: "10px",
                                      sm: "12px",
                                    },
                                  }}
                                >
                                  Code:
                                </Typography>

                                <Typography
                                  variant="caption"
                                  fontWeight={800}
                                  sx={{
                                    fontFamily: "monospace",

                                    letterSpacing: {
                                      xs: 0.5,
                                      sm: 1.2,
                                    },

                                    fontSize: {
                                      xs: "10px",
                                      sm: "12px",
                                    },

                                    color: "#1b5e20",
                                  }}
                                >
                                  {item.code}
                                </Typography>
                              </Box>

                              {isCopied && (
                                <CheckIcon
                                  sx={{
                                    fontSize: {
                                      xs: 12,
                                      sm: 14,
                                    },
                                    color: "#2e7d32",
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

                            maxWidth: "100%",

                            height: {
                              xs: 34,
                              sm: 36,
                            },

                            transition: "all 0.3s ease",

                            px: {
                              xs: 0.3,
                              sm: 1,
                            },

                            "& .MuiChip-label": {
                              px: {
                                xs: 0.5,
                                sm: 1,
                              },
                              overflow: "hidden",
                            },

                            "& .MuiChip-icon": {
                              ml: {
                                xs: "5px",
                                sm: "8px",
                              },
                            },

                            "&:hover": {
                              backgroundColor: "#c8e6c9",
                              borderColor: "#4caf50",

                              boxShadow: {
                                xs: "none",
                                md:
                                  "0 4px 12px rgba(76, 175, 80, 0.3)",
                              },
                            },

                            "&:active": {
                              transform: "scale(0.95)",
                            },
                          }}
                        />
                      </Tooltip>
                    )}

                    {/* CANCEL BUTTON */}

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
                          flexShrink: 0,

                          minWidth: {
                            xs: 70,
                            sm: 80,
                          },

                          fontSize: {
                            xs: "11px",
                            sm: "13px",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* ================= CANCEL DIALOG ================= */}

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
                        xs: "calc(100% - 32px)",
                        sm: "100%",
                      },

                      borderRadius: {
                        xs: 2,
                        sm: 1,
                      },
                    },
                  }}
                  BackdropProps={{
                    sx: {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      backdropFilter: "blur(2px)",
                    },
                  }}
                >
                  <DialogTitle
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",

                      gap: {
                        xs: 0.5,
                        sm: 1,
                      },

                      fontWeight: 700,
                      color: "#d32f2f",

                      py: 2,

                      fontSize: {
                        xs: "17px",
                        sm: "20px",
                      },

                      textAlign: "center",
                    }}
                  >
                    <WarningAmberRoundedIcon
                      color="warning"
                      sx={{
                        fontSize: {
                          xs: 20,
                          sm: 24,
                        },
                      }}
                    />

                    Cancel Appointment

                    <WarningAmberRoundedIcon
                      color="warning"
                      sx={{
                        fontSize: {
                          xs: 20,
                          sm: 24,
                        },
                      }}
                    />
                  </DialogTitle>

                  <DialogContent>
                    <Typography
                      align="center"
                      sx={{
                        color: "#424242",

                        fontSize: {
                          xs: 14,
                          sm: 16,
                        },

                        mb: 3,
                      }}
                    >
                      Are you sure you want to cancel this
                      appointment?
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Cancellation Reason"
                      value={cancelReason}
                      onChange={(e) =>
                        setCancelReason(e.target.value)
                      }
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

                          "&:hover .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#d32f2f",
                            },

                          "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#d32f2f",
                            },
                        },
                      }}
                    />
                  </DialogContent>

                  <DialogActions
                    sx={{
                      justifyContent: "center",

                      flexDirection: {
                        xs: "column-reverse",
                        sm: "row",
                      },

                      px: {
                        xs: 3,
                        sm: 2,
                      },

                      pb: 3,

                      gap: {
                        xs: 1,
                        sm: 2,
                      },

                      "& > :not(style) ~ :not(style)": {
                        ml: {
                          xs: 0,
                          sm: 2,
                        },
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
                      }}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* ================= INFO GRID ================= */}

                <Box
                  sx={{
                    backgroundColor: "#f8faf8",

                    borderRadius: {
                      xs: 1.5,
                      sm: 2,
                    },

                    p: {
                      xs: 1.5,
                      sm: 2,
                      md: 2.5,
                    },

                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      md: "repeat(3, minmax(0, 1fr))",
                    },

                    columnGap: {
                      xs: 1.5,
                      sm: 2,
                      md: 2.5,
                    },

                    rowGap: {
                      xs: 1.8,
                      md: 2.5,
                    },

                    width: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                  }}
                >
                  {/* Doctor */}

                  <Box sx={infoItemSx}>
                    <PersonIcon sx={infoIconSx} />

                    <Box sx={infoContentSx}>
                      <Typography
                        variant="caption"
                        color="#1b5e20"
                        fontWeight="600"
                        display="block"
                        mb={0.5}
                      >
                        Doctor
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.primary"
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

                  {/* Department */}

                  <Box sx={infoItemSx}>
                    <LocalHospitalIcon sx={infoIconSx} />

                    <Box sx={infoContentSx}>
                      <Typography
                        variant="caption"
                        color="#1b5e20"
                        fontWeight="600"
                        display="block"
                        mb={0.5}
                      >
                        Department
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.primary"
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

                  {/* Address */}

                  <Box sx={infoItemSx}>
                    <LocationOnIcon sx={infoIconSx} />

                    <Box sx={infoContentSx}>
                      <Typography
                        variant="caption"
                        color="#1b5e20"
                        fontWeight="600"
                        display="block"
                        mb={0.5}
                      >
                        Address
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                        sx={infoValueSx}
                      >
                        {item.address}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Time */}

                  <Box sx={infoItemSx}>
                    <AccessTimeIcon sx={infoIconSx} />

                    <Box sx={infoContentSx}>
                      <Typography
                        variant="caption"
                        color="#1b5e20"
                        fontWeight="600"
                        display="block"
                        mb={0.5}
                      >
                        Time
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          ...infoValueSx,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {(() => {
                          const startTime = dayjs(
                            `2000-01-01 ${item.startTime}`
                          );

                          const beforeTime =
                            startTime.subtract(10, "minute");

                          const afterTime =
                            startTime.add(10, "minute");

                          return `${beforeTime.format(
                            "hh:mm A"
                          )} → ${afterTime.format(
                            "hh:mm A"
                          )}`;
                        })()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Date */}

                  <Box sx={infoItemSx}>
                    <CalendarTodayIcon sx={infoIconSx} />

                    <Box sx={infoContentSx}>
                      <Typography
                        variant="caption"
                        color="#1b5e20"
                        fontWeight="600"
                        display="block"
                        mb={0.5}
                      >
                        Date
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={infoValueSx}
                      >
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status */}

                  <Box sx={infoItemSx}>
                    <Box
                      sx={{
                        width: {
                          xs: 16,
                          sm: 18,
                        },

                        height: {
                          xs: 16,
                          sm: 18,
                        },

                        borderRadius: "50%",

                        backgroundColor: statusStyle.bg,

                        border: `2px solid ${statusStyle.color}`,

                        mt: 0.3,

                        flexShrink: 0,
                      }}
                    />

                    <Box sx={infoContentSx}>
                      <Typography
                        variant="caption"
                        color="#1b5e20"
                        fontWeight="600"
                        display="block"
                        mb={0.5}
                      >
                        Status
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: statusStyle.color,

                          fontWeight: 600,

                          display: "inline-block",

                          fontSize: {
                            xs: "11px",
                            sm: "13px",
                            md: "14px",
                          },

                          px: {
                            xs: 1,
                            sm: 1.5,
                          },

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
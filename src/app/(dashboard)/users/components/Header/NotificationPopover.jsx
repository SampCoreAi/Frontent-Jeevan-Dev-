"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Badge,
  Popover,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  NotificationsNone as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";

const NotificationPopover = ({ sidebar = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  const unreadCount = notifications.filter(
    (item) => Number(item.is_read) === 0
  ).length;

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
      }

      const response = await fetch(
        `${API_URL}/api/notification/getNotifications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to fetch notifications"
        );
      }

      if (result.success) {
        setNotifications(result.data || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Notification Error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "SUCCESS":
        return (
          <CheckCircleIcon
            sx={{
              color: "#16a34a",
              fontSize: 22,
            }}
          />
        );

      case "ERROR":
        return (
          <ErrorOutlineIcon
            sx={{
              color: "#dc2626",
              fontSize: 22,
            }}
          />
        );

      default:
        return (
          <InfoIcon
            sx={{
              color: "#2563eb",
              fontSize: 22,
            }}
          />
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(
        date.replace(" ", "T")
      ).toLocaleString();
    } catch {
      return date;
    }
  };

  return (
    <>
      <Tooltip title="Notifications">
        <Box
          onClick={handleOpen}
          sx={{
            display: { xs: "flex", sm: "none" },
            width: "100%",
            minHeight: sidebar ? "42px" : 52,
            px: sidebar ? "11px" : 1.5,
            mb: sidebar ? 0 : 1.5,
            alignItems: "center",
            gap: sidebar ? "10px" : 1,
            border: sidebar ? "none" : "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            color: "text.secondary",
            cursor: "pointer",
            boxSizing: "border-box",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: sidebar
                ? "secondary.light"
                : "transparent",
              color: sidebar
                ? "primary.main"
                : "text.secondary",
            },
          }}
        >
          <Box
            sx={{
              width: sidebar ? "23px" : "auto",
              minWidth: sidebar ? "23px" : "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              max={99}
              invisible={unreadCount === 0}
            >
              <NotificationsIcon
                sx={{
                  fontSize: sidebar ? "19px" : "24px",
                }}
              />
            </Badge>
          </Box>

          <Typography
            sx={{
              flex: sidebar ? 1 : "initial",
              minWidth: 0,
              fontSize: sidebar ? "12.5px" : "inherit",
              fontWeight: 600,
              color: "inherit",
              textAlign: "left",
              whiteSpace: "nowrap",
            }}
          >
            Notifications
          </Typography>
        </Box>
      </Tooltip>

      <Tooltip title="Notifications">
        <Box
          onClick={handleOpen}
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 0.8,
            height: 40,
            px: 1.4,
            borderRadius: "8px",
            border: "1px solid #d5eee7",
            backgroundColor: "#f0faf7",
            color: "#586762",
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#e5f7f1",
              borderColor: "#b9e5d9",
              color: "#0a9f7d",
            },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
            invisible={unreadCount === 0}
          >
            <NotificationsIcon
              sx={{
                fontSize: 20,
              }}
            />
          </Badge>

          <Typography
            component="span"
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "inherit",
            }}
          >
            Notifications
          </Typography>
        </Box>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: sidebar ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: sidebar ? "left" : "right",
        }}
        PaperProps={{
          sx: {
            mt: { xs: 1, sm: 1.5 },
            width: {
              xs: "calc(100vw - 32px)",
              sm: 420,
            },
            maxWidth: {
              xs: "calc(100vw - 32px)",
              sm: 420,
            },
            maxHeight: {
              xs: "70vh",
              sm: 550,
            },
            backgroundColor: "#ffffff",
            color: "#111827",
            borderRadius: {
              xs: "12px",
              sm: "16px",
            },
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 20px 50px rgba(15, 23, 42, 0.15)",
          },
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 17, sm: 20 },
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Notifications
          </Typography>

          <Badge
            badgeContent={unreadCount}
            color="error"
            invisible={unreadCount === 0}
          >
            <NotificationsIcon
              sx={{
                color: "#2563eb",
                fontSize: 26,
              }}
            />
          </Badge>
        </Box>

        <Box
          sx={{
            maxHeight: 430,
            overflowY: "auto",
            backgroundColor: "#ffffff",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f8fafc",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#94a3b8",
            },
          }}
        >
          {loading ? (
            <Box
              sx={{
                height: 180,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                py: 7,
                px: 3,
                textAlign: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <Box
                sx={{
                  width: 65,
                  height: 65,
                  margin: "0 auto 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "#f1f5f9",
                }}
              >
                <NotificationsIcon
                  sx={{
                    fontSize: 34,
                    color: "#94a3b8",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                No notifications
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "#6b7280",
                  mt: 0.5,
                }}
              >
                New notifications will appear here.
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => {
              const isUnread =
                Number(notification.is_read) === 0;

              return (
                <Box
                  key={notification.id}
                  sx={{
                    position: "relative",
                    display: "flex",
                    gap: 1.5,
                    px: 2.2,
                    py: 2,
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    ...(isUnread && {
                      borderLeft: "4px solid #2563eb",
                    }),
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      borderRadius: "50%",
                      backgroundColor:
                        notification.type?.toUpperCase() ===
                        "SUCCESS"
                          ? "#ecfdf5"
                          : notification.type?.toUpperCase() ===
                              "ERROR"
                            ? "#fef2f2"
                            : "#eff6ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getNotificationIcon(
                      notification.type
                    )}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: isUnread
                            ? 700
                            : 600,
                          color: "#111827",
                          wordBreak: "break-word",
                        }}
                      >
                        {notification.title ||
                          "Notification"}
                      </Typography>

                      {isUnread && (
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            minWidth: 7,
                            borderRadius: "50%",
                            backgroundColor: "#2563eb",
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 13,
                        color: "#4b5563",
                        lineHeight: 1.55,
                        fontWeight: 400,
                        wordBreak: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {notification.message ||
                        "No message available"}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: "11.5px",
                        color: "#9ca3af",
                        fontWeight: 500,
                      }}
                    >
                      {formatDate(
                        notification.created_at
                      )}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPopover;
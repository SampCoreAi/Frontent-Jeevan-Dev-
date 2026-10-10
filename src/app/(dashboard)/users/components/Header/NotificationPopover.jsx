"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  Typography,
  Badge,
  Popover,
  Tooltip,
  CircularProgress,
  Button,
  ButtonBase,
} from "@mui/material";
import {
  NotificationsNone as NotificationsIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";
import { socket } from "../../../../../socket/socket";

const styles = {
  SUCCESS: { Icon: SuccessIcon, color: "#16a34a", bg: "#edf9f0" },
  ERROR: { Icon: ErrorIcon, color: "#dc2626", bg: "#fff1f1" },
  INFO: { Icon: InfoIcon, color: "#2563eb", bg: "#eff6ff" },
};

const sameId = (a, b) => String(a) === String(b);

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
};

export default function NotificationPopover({ sidebar = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [clearing, setClearing] = useState(false);
const visibleNotifications = notifications.filter(
  ({ is_read }) => Number(is_read) === 0
);

const unreadCount = visibleNotifications.length;

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");

      const response = await fetch(
        `${API_URL}/api/notification/getNotifications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load notifications");
      }

      setNotifications(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
  setClearing(true);
  setError("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notification/read-all`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) throw new Error("Unable to clear notifications");

    setNotifications((prev) =>
      prev.map((item) => ({ ...item, is_read: 1 }))
    );
  } catch (error) {
    setError(error.message);
  } finally {
    setClearing(false);
  }
};

  useEffect(() => {
    const handlers = {
      "notification:new": (notification) =>
        setNotifications((prev) =>
          prev.some((item) => sameId(item.id, notification.id))
            ? prev
            : [notification, ...prev]
        ),

      "notification:read": (notification) =>
        setNotifications((prev) =>
          prev.map((item) =>
            sameId(item.id, notification.id)
              ? { ...item, ...notification }
              : item
          )
        ),

      "notification:read-all": () =>
        setNotifications((prev) =>
          prev.map((item) => ({ ...item, is_read: 1 }))
        ),

      "notification:deleted": ({ notificationId }) =>
        setNotifications((prev) =>
          prev.filter((item) => !sameId(item.id, notificationId))
        ),
    };

    Object.entries(handlers).forEach(([event, handler]) =>
      socket.on(event, handler)
    );

    return () =>
      Object.entries(handlers).forEach(([event, handler]) =>
        socket.off(event, handler)
      );
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  return (
    <>
      <Tooltip title="Notifications">
        <ButtonBase
          onClick={handleOpen}
          aria-label="Open notifications"
          aria-expanded={Boolean(anchorEl)}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 1.2,
            width: sidebar ? "100%" : "auto",
            minHeight: 40,
            px: 1.4,
            borderRadius: "8px",
            border: sidebar ? "none" : "1px solid #dfe9e5",
            bgcolor: sidebar ? "transparent" : "#fff",
            color: "#52635d",
            transition: "0.2s",
            "&:hover": { bgcolor: "#f0f7f4", color: "#07876a" },
          }}
        >
         <Badge
  badgeContent={unreadCount}
  color="error"
  max={99}
  sx={{
    "& .MuiBadge-badge": {
      fontSize: 10,
      fontWeight: 700,
      height: 16,
      minWidth: 16,
      px: 0.5,
      color: "#fff",
      bgcolor: "#dc2626",
      border: "2px solid #fff",
      top: 2,
      right: 2,
    },
  }}
>
  <NotificationsIcon sx={{ fontSize: 20 }} />
</Badge>

          <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
            Notifications
          </Typography>
        </ButtonBase>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: sidebar ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: sidebar ? "left" : "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 390,
              maxWidth: "calc(100vw - 32px)",
              maxHeight: "70vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px",
              border: "1px solid #e3ebe7",
              boxShadow: "0 12px 36px rgba(23,32,51,0.12)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #edf1ef",
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: 15, fontWeight: 700, color: "#172033" }}
            >
              Notifications
            </Typography>

            <Typography sx={{ mt: 0.3, fontSize: 11.5, color: "#74807b" }}>
              {unreadCount ? `${unreadCount} unread notifications` : "You're all caught up"}
            </Typography>
          </Box>

        <Button
  size="small"
  disabled={loading || clearing || !unreadCount}
  onClick={handleClear}
  sx={{
    minWidth: 0,
    px: 1,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "none",
    color: "#07876a",
    borderRadius: "6px",
    "&:hover": { bgcolor: "#edf7f2" },
  }}
>
  {clearing ? "Clearing..." : "Clear"}
</Button>
        </Box>

        <Box
          sx={{
            minHeight: 0,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#d2ddd7",
              borderRadius: 4,
            },
          }}
        >
         {loading ? (
  <Box sx={{ py: 6, textAlign: "center" }}>
    <CircularProgress size={24} sx={{ color: "#07876a" }} />
  </Box>
) : error ? (
  <Box sx={{ p: 3, textAlign: "center" }}>
    <Typography sx={{ fontSize: 12, color: "#dc2626" }}>
      {error}
    </Typography>
    <Button
      onClick={fetchNotifications}
      sx={{ fontSize: 12, textTransform: "none" }}
    >
      Retry
    </Button>
  </Box>
) : (
  <AnimatePresence initial={false} mode="wait">
    {visibleNotifications.length ? (
      visibleNotifications.map((notification) => {
        const { Icon, color, bg } =
          styles[notification.type?.toUpperCase()] || styles.INFO;

        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", x: 0 }}
            exit={{ opacity: 0, height: 0, x: 35 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.3,
                px: 2,
                py: 1.6,
                bgcolor: "#f7fbf9",
                borderBottom: "1px solid #edf1ef",
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "9px",
                  bgcolor: bg,
                }}
              >
                <Icon sx={{ fontSize: 19, color }} />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#172033",
                    overflowWrap: "anywhere",
                  }}
                >
                  {notification.title || "Notification"}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: "#64748b",
                    overflowWrap: "anywhere",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {notification.message || "No message available"}
                </Typography>

                <Typography
                  sx={{ mt: 0.8, fontSize: 10.5, color: "#8b9892" }}
                >
                  {formatDate(notification.created_at)}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        );
      })
    ) : (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
          <NotificationsIcon
            sx={{ fontSize: 36, color: "#a5b5ae", mb: 1 }}
          />
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: "#172033" }}
          >
            No notifications
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 12, color: "#74807b" }}>
            New updates will appear here.
          </Typography>
        </Box>
      </motion.div>
    )}
  </AnimatePresence>
)}
        </Box>
      </Popover>
    </>
  );
}
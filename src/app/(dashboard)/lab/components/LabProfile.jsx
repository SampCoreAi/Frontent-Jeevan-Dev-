"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import api from "../../../../utils/axiosInstance";
import { SectionTitle } from "./LabUi";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TIME_OPTIONS = Array.from({ length: 96 }, (_, index) => {
  const totalMinutes = index * 15;
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
});

const formatTimeLabel = (value) => {
  if (!value) return "Closed";
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const parseWeeklyHours = (value) => {
  let source = value || {};

  if (typeof source === "string") {
    try {
      source = JSON.parse(source);
    } catch (error) {
      source = {};
    }
  }

  return DAY_NAMES.reduce((acc, day) => {
    const current = source?.[day] || {};
    acc[day] = {
      open: current.open || "",
      close: current.close || "",
    };
    return acc;
  }, {});
};

export default function LabProfile({ profile, onProfileUpdate }) {
  const status = String(profile?.status || "UNKNOWN").toUpperCase();
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(
    Number(
      profile?.slot_duration_minutes || profile?.slotDurationMinutes || 30,
    ),
  );
  const [weeklyHours, setWeeklyHours] = useState(
    parseWeeklyHours(profile?.weekly_hours || profile?.weeklyHours),
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setSlotDurationMinutes(
      Number(
        profile?.slot_duration_minutes || profile?.slotDurationMinutes || 30,
      ),
    );
    setWeeklyHours(
      parseWeeklyHours(profile?.weekly_hours || profile?.weeklyHours),
    );
  }, [profile]);

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fields = useMemo(
    () => [
      {
        label: "Registration Number",
        value: profile?.registration_number,
        icon: BadgeOutlinedIcon,
      },
      {
        label: "Phone Number",
        value: profile?.phone_number,
        icon: PhoneOutlinedIcon,
      },
      {
        label: "Address",
        value: profile?.address,
        icon: LocationOnOutlinedIcon,
      },
      {
        label: "Lab Owner",
        value: profile?.full_name || profile?.admin_name,
        icon: PersonOutlineOutlinedIcon,
      },
      {
        label: "Owner Email",
        value: profile?.email,
        icon: EmailOutlinedIcon,
      },
      {
        label: "Created On",
        value: formatDate(profile?.created_at),
        icon: CalendarTodayOutlinedIcon,
      },
    ],
    [profile],
  );

  const getStatusStyle = () => {
    if (status === "ACTIVE") {
      return {
        bgcolor: "#ECFDF3",
        color: "#15803D",
        borderColor: "#BBF7D0",
      };
    }

    if (status === "INACTIVE") {
      return {
        bgcolor: "#FEF2F2",
        color: "#DC2626",
        borderColor: "#FECACA",
      };
    }

    return {
      bgcolor: "#F8FAFC",
      color: "#64748B",
      borderColor: "#E2E8F0",
    };
  };

  const handleDayChange = (day, field, value) => {
    setWeeklyHours((current) => ({
      ...current,
      [day]: {
        ...(current[day] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveTiming = async () => {
    const duration = Number(slotDurationMinutes);
    if (!Number.isInteger(duration) || duration < 10 || duration > 240) {
      setSaveError("Enter a whole number of minutes between 10 and 240.");
      setSaveMessage("");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");
      setSaveMessage("");
      const payload = {
        slotDurationMinutes: duration,
        weeklyHours,
      };
      const response = await api.patch("/api/labs/profile", payload);
      const updated = response?.data?.data || {};
      onProfileUpdate?.({
        ...profile,
        ...updated,
        slot_duration_minutes: updated.slot_duration_minutes ?? duration,
        weekly_hours: updated.weekly_hours ?? weeklyHours,
      });
      setSaveMessage("Lab collection timing updated successfully.");
    } catch (error) {
      setSaveError(
        error?.response?.data?.message || "Unable to update lab timing.",
      );
    } finally {
      setSaving(false);
    }
  };

  const statusStyle = getStatusStyle();

  const renderTimeSelect = (day, field, label) => (
    <TextField
      select
      fullWidth
      size="small"
      label={label}
      value={weeklyHours[day]?.[field] || ""}
      onChange={(event) => handleDayChange(day, field, event.target.value)}
      SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 320 } } } }}
      sx={{
        maxWidth: 180,
        "& .MuiInputBase-root": { bgcolor: "#FFFFFF", borderRadius: "8px" },
      }}
    >
      <MenuItem value="">Closed</MenuItem>
      {TIME_OPTIONS.map((time) => (
        <MenuItem key={`${day}-${field}-${time}`} value={time}>
          {formatTimeLabel(time)}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#FFFFFF" }}>
      <SectionTitle
        title="Lab Profile"
        description="View your registered laboratory details and account status."
      />

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          border: "1px solid #DFE7EB",
          borderRadius: "8px",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={1.5}
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1.75,
            bgcolor: "#F8FBFA",
            borderBottom: "1px solid #E8EDF0",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                bgcolor: "#E8F4F0",
                color: "#07876A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ScienceOutlinedIcon sx={{ fontSize: 21 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  color: "#172033",
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "15px" },
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                }}
              >
                {profile?.lab_name || "Lab Profile"}
              </Typography>

              <Typography sx={{ color: "#64748B", fontSize: "11px", mt: 0.3 }}>
                Lab code:{" "}
                <Box
                  component="span"
                  sx={{ color: "#334155", fontWeight: 600 }}
                >
                  {profile?.lab_code || "-"}
                </Box>
              </Typography>
            </Box>
          </Stack>

          <Chip
            size="small"
            label={status}
            variant="outlined"
            sx={{
              height: 24,
              bgcolor: "transparent",
              color: statusStyle.color,
              border: 0,
              fontSize: "9.5px",
              fontWeight: 700,
              "& .MuiChip-label": { px: 1.1 },
            }}
          />
        </Stack>

        <Box sx={{ px: { xs: 1.5, sm: 2 }, pt: 1.75, pb: 1 }}>
          <Typography
            sx={{ fontSize: "12.5px", fontWeight: 700, color: "#334155" }}
          >
            Laboratory Information
          </Typography>
          <Typography sx={{ mt: 0.2, fontSize: "10.5px", color: "#84959B" }}>
            Registered laboratory and account information
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            px: { xs: 1.5, sm: 2 },
            pb: 2,
            gap: 1,
          }}
        >
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <Box
                key={field.label}
                sx={{
                  minWidth: 0,
                  minHeight: 78,
                  p: 1.4,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.1,
                  border: "1px solid #E8EDF0",
                  borderRadius: "7px",
                  bgcolor: "#FFFFFF",
                  transition: "0.15s ease",
                  "&:hover": { bgcolor: "#FAFCFC", borderColor: "#CFE0D9" },
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "6px",
                    bgcolor: "#EDF7F3",
                    color: "#07876A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "9.5px",
                      color: "#84959B",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {field.label}
                  </Typography>
                  <Typography
                    title={String(field.value || "-")}
                    sx={{
                      mt: 0.45,
                      fontSize: "12.5px",
                      lineHeight: 1.4,
                      color: "#26373D",
                      fontWeight: 600,
                      wordBreak: "break-word",
                    }}
                  >
                    {field.value || "-"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          border: "1px solid #E3EBE7",
          borderRadius: "10px",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* =========================
      HEADER
  ========================== */}
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1.4,

            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 1.5,

            bgcolor: "#F8FBFA",
            borderBottom: "1px solid #E3EBE7",
          }}
        >
          {/* TITLE */}
          <Stack direction="row" alignItems="center" spacing={1.1}>
            <Box
              sx={{
                width: 34,
                height: 34,

                display: "grid",
                placeItems: "center",

                borderRadius: "8px",

                bgcolor: "#E8F5F0",
                border: "1px solid #D2EAE1",

                flexShrink: 0,
              }}
            >
              <AccessTimeIcon
                sx={{
                  color: "#07876A",
                  fontSize: 18,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 750,
                  color: "#172033",
                  lineHeight: 1.3,
                }}
              >
                Collection timings
              </Typography>

              <Typography
                sx={{
                  mt: 0.15,
                  fontSize: "10.5px",
                  color: "#7A8A84",
                  lineHeight: 1.4,
                }}
              >
                Set daily sample collection hours
              </Typography>
            </Box>
          </Stack>

          {/* SLOT DURATION */}
          <TextField
            type="number"
            label="Slot duration"
            value={slotDurationMinutes}
            onChange={(event) => setSlotDurationMinutes(event.target.value)}
            inputProps={{
              min: 10,
              max: 240,
              step: 1,
            }}
            size="small"
            InputProps={{
              endAdornment: (
                <Typography
                  sx={{
                    mr: 0.5,
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#94A3B8",
                    whiteSpace: "nowrap",
                  }}
                >
                  min
                </Typography>
              ),
            }}
            sx={{
              width: {
                xs: "100%",
                md: 170,
              },

              "& .MuiOutlinedInput-root": {
                height: 38,
                bgcolor: "#FFFFFF",
                borderRadius: "7px",

                "& fieldset": {
                  borderColor: "#D7E1DD",
                },

                "&:hover fieldset": {
                  borderColor: "#B9CBC4",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#07876A",
                  borderWidth: "1px",
                },
              },

              "& .MuiInputBase-input": {
                fontSize: "11.5px",
                fontWeight: 600,
                color: "#334155",
              },

              "& .MuiInputLabel-root": {
                fontSize: "11px",
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "#07876A",
              },
            }}
          />
        </Box>

        {/* =========================
      DAYS
  ========================== */}
     <Box
  sx={{
    px: { xs: 1.5, sm: 2 },
    py: 1,
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      lg: "repeat(2, minmax(0, 1fr))",
    },
    columnGap: 2.5,
  }}
>
  {DAY_NAMES.map((day, index) => (
    <Box
      key={day}
      sx={{
        minWidth: 0,
        minHeight: 62,

        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "105px minmax(0, 1fr)",
        },
        alignItems: "center",

        gap: {
          xs: 0.8,
          sm: 1.2,
        },

        py: 1,

        borderBottom: "1px solid #EDF1EF",

        // Desktop: left/right columns ke beech divider
        ...(index % 2 === 0 && {
          lg: {
            pr: 2.5,
            borderRight: "1px solid #EDF1EF",
          },
        }),

        ...(index % 2 === 1 && {
          lg: {
            pl: 2.5,
          },
        }),
      }}
    >
      {/* DAY */}
      <Typography
        sx={{
          fontSize: "11.5px",
          fontWeight: 700,
          color: "#334155",
          whiteSpace: "nowrap",
        }}
      >
        {day}
      </Typography>

      {/* OPEN / CLOSE */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.8}
        useFlexGap
        sx={{
          minWidth: 0,

          "& .MuiFormControl-root": {
            minWidth: "0 !important",
            width: "100%",
            maxWidth: 150,
          },
        }}
      >
        {renderTimeSelect(day, "open", "Open")}

        <Box
          sx={{
            width: 24,
            height: 24,
            flexShrink: 0,

            display: "grid",
            placeItems: "center",

            bgcolor: "#F2F6F4",
            borderRadius: "50%",
          }}
        >
          <Typography
            sx={{
              fontSize: "8.5px",
              fontWeight: 700,
              color: "#82918B",
            }}
          >
            to
          </Typography>
        </Box>

        {renderTimeSelect(day, "close", "Close")}
      </Stack>
    </Box>
  ))}
</Box>

        {/* =========================
      MESSAGE
  ========================== */}
        {saveError || saveMessage ? (
          <Box
            sx={{
              mx: { xs: 1.5, sm: 2 },
              mb: 1.3,

              px: 1.2,
              py: 0.8,

              borderRadius: "6px",

              bgcolor: saveError ? "#FFF6F5" : "#F1F9F5",

              border: `1px solid ${saveError ? "#F4D5D2" : "#D6EDE2"}`,
            }}
          >
            {saveError ? (
              <Typography
                sx={{
                  color: "#B42318",
                  fontSize: "10.5px",
                  fontWeight: 600,
                }}
              >
                {saveError}
              </Typography>
            ) : null}

            {saveMessage ? (
              <Typography
                sx={{
                  color: "#07876A",
                  fontSize: "10.5px",
                  fontWeight: 600,
                }}
              >
                {saveMessage}
              </Typography>
            ) : null}
          </Box>
        ) : null}

        {/* =========================
      FOOTER
  ========================== */}
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1.2,

            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",

            bgcolor: "#FAFCFB",
            borderTop: "1px solid #E8EEEB",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSaveTiming}
            disabled={saving}
            sx={{
              minWidth: 160,
              height: 36,

              px: 1.8,

              bgcolor: "#07876A",
              color: "#FFFFFF",

              borderRadius: "7px",

              fontSize: "10.5px",
              fontWeight: 700,

              textTransform: "none",
              boxShadow: "none",

              "&:hover": {
                bgcolor: "#06745B",
                boxShadow: "none",
              },

              "&.Mui-disabled": {
                bgcolor: "#DDE8E3",
                color: "#82918B",
              },
            }}
          >
            {saving ? "Saving..." : "Save collection timings"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

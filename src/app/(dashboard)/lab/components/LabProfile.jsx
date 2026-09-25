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

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
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
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(Number(profile?.slot_duration_minutes || profile?.slotDurationMinutes || 30));
  const [weeklyHours, setWeeklyHours] = useState(parseWeeklyHours(profile?.weekly_hours || profile?.weeklyHours));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setSlotDurationMinutes(Number(profile?.slot_duration_minutes || profile?.slotDurationMinutes || 30));
    setWeeklyHours(parseWeeklyHours(profile?.weekly_hours || profile?.weeklyHours));
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

  const fields = useMemo(() => [
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
  ], [profile]);

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
      setSaveError(error?.response?.data?.message || "Unable to update lab timing.");
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
      <SectionTitle title="Lab Profile" description="View your registered laboratory details and account status." />

      <Paper elevation={0} sx={{ mt: 1.5, border: "1px solid #DFE7EB", borderRadius: "8px", bgcolor: "#FFFFFF", overflow: "hidden" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={1.5} sx={{ px: { xs: 1.5, sm: 2 }, py: 1.75, bgcolor: "#F8FBFA", borderBottom: "1px solid #E8EDF0" }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box sx={{ width: 40, height: 40, borderRadius: "8px", bgcolor: "#E8F4F0", color: "#07876A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ScienceOutlinedIcon sx={{ fontSize: 21 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: "#172033", fontWeight: 700, fontSize: { xs: "14px", sm: "15px" }, lineHeight: 1.3, wordBreak: "break-word" }}>
                {profile?.lab_name || "Lab Profile"}
              </Typography>

              <Typography sx={{ color: "#64748B", fontSize: "11px", mt: 0.3 }}>
                Lab code: <Box component="span" sx={{ color: "#334155", fontWeight: 600 }}>{profile?.lab_code || "-"}</Box>
              </Typography>
            </Box>
          </Stack>

          <Chip size="small" label={status} variant="outlined" sx={{ height: 24, bgcolor: "transparent", color: statusStyle.color, border: 0, fontSize: "9.5px", fontWeight: 700, "& .MuiChip-label": { px: 1.1 } }} />
        </Stack>

        <Box sx={{ px: { xs: 1.5, sm: 2 }, pt: 1.75, pb: 1 }}>
          <Typography sx={{ fontSize: "12.5px", fontWeight: 700, color: "#334155" }}>Laboratory Information</Typography>
          <Typography sx={{ mt: 0.2, fontSize: "10.5px", color: "#84959B" }}>Registered laboratory and account information</Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" }, px: { xs: 1.5, sm: 2 }, pb: 2, gap: 1 }}>
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <Box key={field.label} sx={{ minWidth: 0, minHeight: 78, p: 1.4, display: "flex", alignItems: "flex-start", gap: 1.1, border: "1px solid #E8EDF0", borderRadius: "7px", bgcolor: "#FFFFFF", transition: "0.15s ease", "&:hover": { bgcolor: "#FAFCFC", borderColor: "#CFE0D9" } }}>
                <Box sx={{ width: 30, height: 30, borderRadius: "6px", bgcolor: "#EDF7F3", color: "#07876A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon sx={{ fontSize: 16 }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: "9.5px", color: "#84959B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{field.label}</Typography>
                  <Typography title={String(field.value || "-")} sx={{ mt: 0.45, fontSize: "12.5px", lineHeight: 1.4, color: "#26373D", fontWeight: 600, wordBreak: "break-word" }}>{field.value || "-"}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ mt: 2.5, border: "1px solid #DFE7EB", borderRadius: "8px", p: 2.25, bgcolor: "#FFFFFF" }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }} spacing={2} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <AccessTimeIcon sx={{ color: "#0B5C8E", fontSize: 20 }} />
            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#123F66" }}>Collection timings</Typography>
          </Stack>
          <TextField
            type="number"
            label="Slot duration (minutes)"
            value={slotDurationMinutes}
            onChange={(event) => setSlotDurationMinutes(event.target.value)}
            inputProps={{ min: 10, max: 240, step: 1 }}
            helperText="Enter 10 to 240 minutes"
            size="small"
            sx={{ minWidth: { xs: "100%", md: 220 }, "& .MuiInputBase-root": { bgcolor: "#F8FBFF", borderRadius: "8px" } }}
          />
        </Stack>

        <Box sx={{ borderTop: "1px solid #E8EDF0" }}>
          {DAY_NAMES.map((day) => (
            <Box key={day} sx={{ minHeight: 68, px: { xs: 0, sm: 1 }, py: 1, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.25, borderBottom: "1px solid #E8EDF0" }}>
              <Typography sx={{ width: { xs: "100%", sm: 110 }, fontSize: "13px", fontWeight: 600, color: "#334155" }}>{day}</Typography>
              <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap sx={{ flex: 1, alignItems: "center" }}>
                {renderTimeSelect(day, "open", "Open")}
                <Typography sx={{ color: "#84959B", fontSize: "12px" }}>to</Typography>
                {renderTimeSelect(day, "close", "Close")}
              </Stack>
            </Box>
          ))}
        </Box>

        {(saveError || saveMessage) ? (
          <Box sx={{ mt: 2 }}>
            {saveError ? <Typography sx={{ color: "#DC2626", fontSize: "12px" }}>{saveError}</Typography> : null}
            {saveMessage ? <Typography sx={{ color: "#15803D", fontSize: "12px" }}>{saveMessage}</Typography> : null}
          </Box>
        ) : null}

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleSaveTiming} disabled={saving} sx={{ textTransform: "none", borderRadius: "8px" }}>
            {saving ? "Saving..." : "Save collection timings"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
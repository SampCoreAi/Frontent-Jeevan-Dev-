"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Chip, Paper, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";

const getResponseData = (response) =>
  response.data?.data?.data || response.data?.data || [];

const getToday = () => {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const toMinutes = (time) => {
  const [hours = 0, minutes = 0] = String(time || "00:00")
    .split(":")
    .map(Number);
  return hours * 60 + minutes;
};

const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`;

const formatTime = (time) => {
  const [hours, minutes] = String(time || "").split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time || "—";

  return `${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )} ${hours >= 12 ? "PM" : "AM"}`;
};

const getTodayHours = (profile) => {
  const workingHours = profile?.profile?.working_hours;
  if (!workingHours?.isOpen) return { start: "", end: "" };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todayHours = workingHours.days?.find(
    (item) => item.day?.toLowerCase() === today.toLowerCase(),
  );

  return {
    start: todayHours?.openingTime || "",
    end: todayHours?.closingTime || "",
  };
};

const statusColors = {
  PENDING: { bgcolor: "#EEF1F5", color: "#526176" },
  REQUESTED: { bgcolor: "#EEF1F5", color: "#526176" },
  SAMPLE_SCHEDULED: { bgcolor: "#FFF5E5", color: "#A76500" },
  SAMPLE_COLLECTED: { bgcolor: "#E4F6F0", color: "#14856D" },
  IN_PROGRESS: { bgcolor: "#E8F1FF", color: "#2670C8" },
  PROCESSING: { bgcolor: "#E8F1FF", color: "#2670C8" },
  REPORT_READY: { bgcolor: "#E5F6E8", color: "#268544" },
  COMPLETED: { bgcolor: "#E5F6E8", color: "#268544" },
  CANCELLED: { bgcolor: "#FDE8E8", color: "#DC4545" },
};

function DataChip({ label }) {
  const text = String(label || "—").replaceAll("_", " ");

  return (
    <Chip
      label={text}
      size="small"
      sx={{
        height: 23,
        borderRadius: 1.5,
        fontSize: 12,
        ...(statusColors[String(label || "").toUpperCase()] || {
          bgcolor: "#EEF1F5",
          color: "#526176",
        }),
      }}
    />
  );
}

function getPatientTests(request) {
  const tests = request?.requested_tests || request?.tests || [];
  return Array.isArray(tests)
    ? tests
        .map((test) =>
          typeof test === "string" ? test : test?.test_name || test?.name,
        )
        .filter(Boolean)
        .join(", ")
    : String(tests || "—");
}

export default function TodayWorkQuickActions({ api, profile, onAction }) {
  const { start, end } = useMemo(() => getTodayHours(profile), [profile]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!api) return;

    let cancelled = false;

    const loadSlots = async () => {
      setLoading(true);
      setError("");

      try {
const startMinutes = toMinutes(start);
const endMinutes = toMinutes(end);

if (!start || !end || endMinutes <= startMinutes) {
  setSlots([]);
  setSelectedSlot(null);
  setError("Lab working hours are not configured.");
  setLoading(false);
  return;
}

const ranges = [];

for (let minute = startMinutes; minute < endMinutes; minute += 120) {
  ranges.push({
    startTime: toTime(minute),
    endTime: toTime(Math.min(minute + 120, endMinutes)),
  });
}
        const results = await Promise.all(
          ranges.map(async (range) => {
            const response = await api.get(
              "/api/lab-requests/collection-slot",
              {
                params: { ...range, date: getToday() },
              },
            );

            const result = response.data?.data || {};
            return {
              ...range,
              count: Number(result.count) || 0,
              patients: Array.isArray(result.data) ? result.data : [],
            };
          }),
        );

        if (!cancelled) {
          setSlots(results);
          setSelectedSlot((current) =>
            results.find(
              (slot) =>
                slot.startTime === current?.startTime &&
                slot.endTime === current?.endTime,
            ) || results[0] || null,
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load today's collection slots.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [api, start, end]);

  const patients = selectedSlot?.patients || [];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(0, 2fr) minmax(340px, 1fr)",
        },
        gap: 2,
        mt: 2,
        alignItems: "start",
      }}
    >
      <Paper
        elevation={0}
        sx={{ p: 2, border: "1px solid #E2EBE9", borderRadius: 2 }}
      >
        <Typography sx={{ color: "#172033", fontSize: 17, fontWeight: 700 }}>
          Patients in selected slot
        </Typography>
        <Typography sx={{ mt: 0.3, mb: 1.5, color: "#64748B", fontSize: 12.5 }}>
          {selectedSlot
            ? `${formatTime(selectedSlot.startTime)} – ${formatTime(
                selectedSlot.endTime,
              )} · ${selectedSlot.count} patients`
            : loading
              ? "Loading collection slots…"
              : "No collection slots"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}

        <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              minWidth: 650,
              tableLayout: "fixed",
              borderCollapse: "collapse",
              "& th": {
                p: 1,
                bgcolor: "#F3F6F8",
                color: "#40516A",
                fontSize: 12.5,
                fontWeight: 700,
                textAlign: "left",
              },
              "& td": {
                p: 1,
                borderBottom: "1px solid #EDF1F2",
                color: "#40516A",
                fontSize: 12.5,
                verticalAlign: "middle",
                overflowWrap: "anywhere",
              },
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "18%" }}>Order</th>
                <th style={{ width: "23%" }}>Patient</th>
                <th style={{ width: "19%" }}>Test</th>
                <th style={{ width: "22%" }}>Ordered by</th>
                <th style={{ width: "18%" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.request_id || patient.order_id}>
                  <td>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
                      {patient.order_id || `#${patient.request_id}`}
                    </Typography>
                    <Typography sx={{ color: "#748196", fontSize: 12 }}>
                      {patient.collection_slot || "—"}
                    </Typography>
                  </td>
                  <td>
                    <Typography sx={{ color: "#172033", fontSize: 12.5, fontWeight: 600 }}>
                      {patient.patient_name || "—"}
                    </Typography>
                    <Typography sx={{ color: "#748196", fontSize: 12 }}>
                      {patient.patient_gender || "—"}
                      {patient.patient_age ? ` • ${patient.patient_age} yrs` : ""}
                    </Typography>
                  </td>
                  <td>{getPatientTests(patient) || "—"}</td>
                  <td>{patient.doctor_username || patient.doctor_name || "—"}</td>
                  <td><DataChip label={patient.status} /></td>
                </tr>
              ))}
              {!patients.length && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                    {loading ? "Loading…" : "No patients in this slot."}
                  </td>
                </tr>
              )}
            </tbody>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 1.5, border: "1px solid #E2EBE9", borderRadius: 2 }}
      >
        <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Box>
            <Typography sx={{ color: "#172033", fontSize: 17, fontWeight: 700 }}>
              Today&apos;s Work
            </Typography>
            <Typography sx={{ color: "#748196", fontSize: 12.5 }}>
              Sample collection slots
            </Typography>
          </Box>
          <Button
            onClick={() => onAction?.("schedule")}
            endIcon={<ArrowRight size={15} />}
            sx={{ color: "#2670C8", fontSize: 12.5, textTransform: "none" }}
          >
            View schedule
          </Button>
        </Box>

        {slots.map((slot) => {
          const selected =
            selectedSlot?.startTime === slot.startTime &&
            selectedSlot?.endTime === slot.endTime;

          return (
            <Box
              component="button"
              key={`${slot.startTime}-${slot.endTime}`}
              onClick={() => setSelectedSlot(slot)}
              sx={{
                width: "100%",
                minHeight: 40,
                px: 0.8,
                display: "grid",
                gridTemplateColumns: "5px 1.5fr 1fr auto",
                alignItems: "center",
                gap: 1,
                border: 0,
                borderBottom: "1px solid #EDF1F3",
                borderRadius: selected ? 1 : 0,
                bgcolor: selected ? "#EFF9F6" : "#FFFFFF",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 20,
                  borderRadius: 2,
                  bgcolor: selected ? "#159879" : "#CBD5E1",
                }}
              />
              <Typography sx={{ color: "#40516A", fontSize: 12.5, fontWeight: 600 }}>
                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
              </Typography>
              <Typography sx={{ color: "#748196", fontSize: 12.5 }}>
                {slot.count} patients
              </Typography>
              <DataChip label={slot.count ? "SAMPLE_COLLECTED" : "UPCOMING"} />
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
}
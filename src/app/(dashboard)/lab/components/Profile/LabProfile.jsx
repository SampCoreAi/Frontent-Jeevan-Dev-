
"use client";

import { useEffect, useRef, useState } from "react";
import api from "../../../../../utils/axiosInstance";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Snackbar,
  Switch,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import LabRegistrationPreview from "./LabRegistrationPreview";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const createDefaultDays = () =>
  DAYS.map((day) => ({
    day,
    enabled: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
      day
    ),
    openingTime: "09:00",
    closingTime: "19:00",
  }));

const createDefaultForm = () => ({
  bio: "",
  slotDurationMinutes: 30,
  isOpen: true,
  days: createDefaultDays(),
  patientServices: {
    walkIn: true,
    appointmentBooking: true,
    homeSampleCollection: true,
  },
  serviceCoverageArea: [
    { city: "", areaLocality: "", pinCode: "" },
  ],
});

const cardSx = {
  p: { xs: 1.75, sm: 2.25 },
  border: "1px solid #E3EBE8",
  borderRadius: "14px",
  bgcolor: "#fff",
  boxShadow: "0 3px 12px rgba(25, 60, 50, 0.035)",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 40,
    borderRadius: "8px",
    bgcolor: "#fff",
    fontSize: 12,
    "& fieldset": { borderColor: "#DDE6E3" },
    "&:hover fieldset": { borderColor: "#A8C7BC" },
    "&.Mui-focused fieldset": { borderColor: "#07876A" },
  },
  "& .MuiInputLabel-root": {
    fontSize: 12,
  },
};

const greenSwitchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#07876A",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    bgcolor: "#07876A",
    opacity: 1,
  },
};

const BRANDING_RULES = {
  logo: {
    folder: "lab-logo",
    title: "Upload clinic logo",
    types: ["image/png", "image/webp"],
    accept: "image/png,image/webp",
    maxSize: 500 * 1024,
    width: 500,
    height: 500,
    details: "PNG or WebP · 500 × 500 px · Max 500 KB",
  },
  signature: {
    folder: "lab-signature",
    title: "Upload your signature",
    types: ["image/png"],
    accept: "image/png",
    maxSize: 200 * 1024,
    width: 600,
    height: 200,
    details: "Transparent PNG · 600 × 200 px · Max 200 KB",
  },
};

const getBrandingUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  const bucketUrl = (process.env.NEXT_PUBLIC_S3_BUCKET_URL || "").replace(
    /\/+$/,
    "",
  );
  const rawValue = value.trim();
  let objectPath;
  let query = "";

  try {
    const parsed = new URL(rawValue, "https://lab-profile-image.invalid");
    objectPath = parsed.pathname;
    query = parsed.search;
  } catch {
    return "";
  }

  const key = objectPath.replace(/^\/+/, "");
  return key && bucketUrl ? `${bucketUrl}/${key}${query}` : "";
};

const findBrandingValue = (profile, keys) => {
  for (const key of keys) {
    const value = profile?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
};

async function validateBrandingImage(file, type) {
  const rule = BRANDING_RULES[type];
  if (!rule.types.includes(file.type)) {
    return type === "logo"
      ? "Choose a PNG or WebP image for the logo."
      : "Choose a PNG image for the signature.";
  }

  if (file.size > rule.maxSize) {
    return `Image must be ${type === "logo" ? "500 KB" : "200 KB"} or smaller.`;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("Image could not be opened."));
      image.src = objectUrl;
    });

    if (image.width !== rule.width || image.height !== rule.height) {
      return `Image dimensions must be ${rule.width} × ${rule.height} px.`;
    }

    if (type === "signature") {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return "Could not validate the signature image.";

      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const alphaAt = (x, y) =>
        pixels.data[(y * canvas.width + x) * 4 + 3];
      const corners = [
        alphaAt(0, 0),
        alphaAt(canvas.width - 1, 0),
        alphaAt(0, canvas.height - 1),
        alphaAt(canvas.width - 1, canvas.height - 1),
      ];
      if (corners.some((alpha) => alpha !== 0)) {
        return "Signature must have a transparent background.";
      }
    }
  } catch {
    return "Could not verify this image. Choose another file.";
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  return "";
}

function SectionTitle({ icon, title, subtitle, action }) {
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={1.5}
      sx={{ mb: 2 }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: "9px",
            color: "#08785E",
            bgcolor: "#EAF6F1",
            "& > svg": {
              display: "block",
              width: 22,
              height: 22,
              flexShrink: 0,
              color: "#08785E",
            },
            "& > svg path": {
              fill: "currentColor",
            },
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 750,
              color: "#172033",
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 0.3,
                fontSize: 11,
                lineHeight: 1.5,
                color: "#77847F",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>

      {action}
    </Stack>
  );
}

function LabBrandingCard({ type, imageUrl, onUpload, editable }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const rule = BRANDING_RULES[type];
  const title = type === "logo" ? "Lab logo" : "Lab signature";
  const previewUrl = imageFailed ? "" : imageUrl;

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const handleSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || uploading || !editable) return;

    setError("");
    const validationError = await validateBrandingImage(file, type);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    try {
      await onUpload(type, file);
    } catch (uploadError) {
      setError(
        uploadError.message || `Unable to upload ${title.toLowerCase()}.`,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={0} sx={cardSx}>
      <SectionTitle
        icon={
          type === "logo" ? (
            <ImageOutlinedIcon fontSize="small" />
          ) : (
            <DrawOutlinedIcon fontSize="small" />
          )
        }
        title={title}
        subtitle="This will appear on reports and documents."
      />

      <Box
        sx={{
          minHeight: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          border: "1px dashed #C9D8D2",
          borderRadius: "10px",
          bgcolor: "#FBFDFC",
          textAlign: "center",
          p: 2,
        }}
      >
        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt={title}
            sx={{
              maxWidth: "100%",
              width: type === "logo" ? 120 : 240,
              height: type === "logo" ? 100 : 80,
              objectFit: "contain",
            }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <>
            <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "#64748B" }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              {rule.title}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#64748B" }}>
              {rule.details}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#64748B" }}>
              {type === "logo"
                ? "Transparent background preferred"
                : "Use a clear signature on transparent background"}
            </Typography>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={rule.accept}
          hidden
          onChange={handleSelect}
        />
        <Button
          variant="outlined"
          disabled={uploading || !editable}
          onClick={() => inputRef.current?.click()}
          startIcon={
            uploading ? (
              <CircularProgress size={16} />
            ) : (
              <CloudUploadOutlinedIcon />
            )
          }
          sx={{
            mt: previewUrl ? 0 : 0.5,
            color: "#07876A",
            borderColor: "#07876A",
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {uploading
            ? "Uploading..."
            : `${previewUrl ? "Change" : "Choose"} Image`}
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 1, py: 0 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}

export default function LabProfile() {
  const [form, setForm] = useState(createDefaultForm);
  const [branding, setBranding] = useState({ logo: "", signature: "" });
  const savedValues = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [bulkStartTime, setBulkStartTime] = useState("09:00");
  const [bulkEndTime, setBulkEndTime] = useState("19:00");
  const [editingDay, setEditingDay] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/labs/getLabProfile", {
          signal: controller.signal,
        });

        if (response.data?.success === false) {
          throw new Error(
            response.data?.message || "Lab profile could not be loaded."
          );
        }

        const responseData = response.data?.data;
        const data = responseData?.profile ?? responseData;

        if (!data || typeof data !== "object") {
          throw new Error("Lab profile data was not found.");
        }

        const loadedBranding = {
          logo: getBrandingUrl(
            findBrandingValue(data, [
              "lab_logo_url",
              "logo_url",
              "lab_logo",
              "lab_logo_path",
              "logo",
            ]),
          ),
          signature: getBrandingUrl(
            findBrandingValue(data, [
              "lab_signature_url",
              "signature_url",
              "lab_signature",
              "lab_signature_path",
              "signature",
            ]),
          ),
        };
        setBranding(loadedBranding);

        const workingHours = data.working_hours || {};

        const savedDays = Array.isArray(workingHours.days)
          ? workingHours.days
          : [];

        const savedDayMap = new Map(
          savedDays.map((item) => [item.day, item])
        );

        const days = DAYS.map((day) => {
          const saved = savedDayMap.get(day);

          return {
            day,
            enabled: Boolean(saved),
            openingTime: saved?.openingTime || "09:00",
            closingTime: saved?.closingTime || "19:00",
          };
        });

        const savedAreas = data.serviceCoverageArea ?? data.service_coverage_area;
        const areas = Array.isArray(savedAreas)
          ? savedAreas.map((area) => ({
              city: area.city || "",
              areaLocality: area.areaLocality || "",
              pinCode: area.pinCode || "",
            }))
          : [];

        const loadedBulkStartTime =
          days.find((day) => day.enabled)?.openingTime || "09:00";
        const loadedBulkEndTime =
          days.find((day) => day.enabled)?.closingTime || "19:00";
        const loadedForm = {
          bio: data.bio ?? "",
          slotDurationMinutes:
            data.slot_duration_minutes ?? 30,

          isOpen: workingHours.isOpen ?? true,

          days,

          patientServices: {
            walkIn:
              data.patientServices?.walkIn ??
              data.patient_service_options?.walkIn ??
              true,

            appointmentBooking:
              data.patientServices?.appointmentBooking ??
              data.patient_service_options?.appointmentBooking ??
              true,

            homeSampleCollection:
              data.patientServices?.homeSampleCollection ??
              data.patient_service_options?.homeSampleCollection ??
              true,
          },

          serviceCoverageArea: areas.length
            ? areas
            : [{ city: "", areaLocality: "", pinCode: "" }],
        };

        savedValues.current = {
          form: loadedForm,
          branding: loadedBranding,
          bulkStartTime: loadedBulkStartTime,
          bulkEndTime: loadedBulkEndTime,
        };
        setBulkStartTime(loadedBulkStartTime);
        setBulkEndTime(loadedBulkEndTime);
        setForm(loadedForm);
      } catch (err) {
        if (
          err.name !== "CanceledError" &&
          err.code !== "ERR_CANCELED"
        ) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Lab profile could not be loaded."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => controller.abort();
  }, []);

  const handleBrandingUpload = async (type, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/api/licenseFile/imageUpload?folder=${BRANDING_RULES[type].folder}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (response.data?.success === false) {
      throw new Error(response.data?.message || "Image upload failed.");
    }

    const uploaded = response.data?.data ?? response.data;
    const uploadedPath =
      uploaded?.fileUrl ||
      uploaded?.url ||
      uploaded?.path ||
      uploaded?.key ||
      (typeof uploaded === "string" ? uploaded : "");
    if (!uploadedPath) {
      throw new Error("Upload completed, but the server returned no image URL.");
    }

    const uploadedUrl = getBrandingUrl(uploadedPath);
    const updatedBranding = { ...branding, [type]: uploadedUrl };
    setBranding(updatedBranding);
    if (savedValues.current) {
      savedValues.current = {
        ...savedValues.current,
        branding: updatedBranding,
      };
    }
    setSuccess(
      `${type === "logo" ? "Lab logo" : "Lab signature"} uploaded successfully.`,
    );
    setError("");
  };

  // Fetch registration data when Preview is clicked.
  const handlePreview = async () => {
    try {
      setPreviewLoading(true);
      setError("");

      const response = await api.get("/api/labs/getLabProfile");

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Preview could not be loaded."
        );
      }

      const data = response.data?.data;

      if (!data || typeof data !== "object") {
        throw new Error("Lab registration data was not found.");
      }

      setPreviewData(data);
      setPreviewOpen(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Preview could not be loaded."
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const updateDay = (index, key, value) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day, dayIndex) =>
        dayIndex === index
          ? { ...day, [key]: value }
          : day
      ),
    }));
  };

  const applyHoursToAllDays = () => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day) => ({
        ...day,
        openingTime: bulkStartTime,
        closingTime: bulkEndTime,
      })),
    }));

    setEditingDay(null);
  };

  const updateService = (key, value) => {
    setForm((current) => ({
      ...current,
      patientServices: {
        ...current.patientServices,
        [key]: value,
      },
    }));
  };

  const updateArea = (index, key, value) => {
    setForm((current) => ({
      ...current,
      serviceCoverageArea: current.serviceCoverageArea.map(
        (area, areaIndex) =>
          areaIndex === index
            ? { ...area, [key]: value }
            : area
      ),
    }));
  };

  const addArea = () => {
    setForm((current) => ({
      ...current,
      serviceCoverageArea: [
        ...current.serviceCoverageArea,
        { city: "", areaLocality: "", pinCode: "" },
      ],
    }));
  };

  const removeArea = (index) => {
    setForm((current) => ({
      ...current,
      serviceCoverageArea: current.serviceCoverageArea.filter(
        (_, areaIndex) => areaIndex !== index
      ),
    }));
  };

  const handleSave = async () => {
    if (!isEditing) return;

    setError("");
    setSuccess("");

    const slotDurationMinutes = Number(form.slotDurationMinutes);

    if (!slotDurationMinutes || slotDurationMinutes < 1) {
      setError("Slot duration must be at least 1 minute.");
      return;
    }

    for (const day of form.days) {
      if (!day.enabled) continue;

      if (
        !day.openingTime ||
        !day.closingTime ||
        day.openingTime >= day.closingTime
      ) {
        setError(
          `Please enter valid opening and closing times for ${day.day}.`
        );
        return;
      }
    }

    const serviceCoverageArea = form.serviceCoverageArea
      .filter(
        (area) =>
          area.city.trim() ||
          area.areaLocality.trim() ||
          area.pinCode.trim()
      )
      .map((area) => ({
        city: area.city.trim(),
        areaLocality: area.areaLocality.trim(),
        pinCode: area.pinCode.trim(),
      }));

    const invalidArea = serviceCoverageArea.find(
      (area) =>
        !area.city ||
        !area.areaLocality ||
        !/^\d{6}$/.test(area.pinCode)
    );

    if (invalidArea) {
      setError(
        "Enter city, locality and a valid 6-digit PIN code for every coverage area."
      );
      return;
    }

    const payload = {
      bio: form.bio.trim(),
      slotDurationMinutes,

      workingHours: {
        isOpen: form.isOpen,
        days: form.days
          .filter((day) => day.enabled)
          .map(({ day, openingTime, closingTime }) => ({
            day,
            openingTime,
            closingTime,
          })),
      },

      patientServices: form.patientServices,
      serviceCoverageArea,
    };

    try {
      setSaving(true);

      const response = await api.patch("/api/labs/LabProfileCreate", payload);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Profile could not be saved."
        );
      }

      setSuccess(
        response.data?.message || "Lab profile settings saved successfully."
      );
      const savedForm = { ...form, bio: form.bio.trim() };
      setForm(savedForm);
      savedValues.current = {
        form: savedForm,
        branding,
        bulkStartTime,
        bulkEndTime,
      };
      setIsEditing(false);
      setEditingDay(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Profile could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    const saved = savedValues.current;
    if (saved) {
      setForm(saved.form);
      setBranding(saved.branding);
      setBulkStartTime(saved.bulkStartTime);
      setBulkEndTime(saved.bulkEndTime);
    }
    setIsEditing(false);
    setEditingDay(null);
    setError("");
  };

  const services = [
    {
      key: "walkIn",
      title: "Walk-in patients",
      description: "Patients can visit the lab without an appointment.",
    },
    {
      key: "appointmentBooking",
      title: "Appointment booking",
      description: "Patients can book appointments in advance.",
    },
    {
      key: "homeSampleCollection",
      title: "Home sample collection",
      description: "Staff can collect samples from patients' homes.",
    },
  ];

  if (loading) {
    return (
      <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#07876A" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 8,
        minHeight: "100vh",
        p: { xs: 1.5, sm: 2.5, lg: 3 },
        bgcolor: "white",
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: "auto" }}>
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "minmax(0, 1.7fr) minmax(280px, 0.8fr)",
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <LabBrandingCard
                type="logo"
                imageUrl={branding.logo}
                onUpload={handleBrandingUpload}
                editable={isEditing}
              />

              <LabBrandingCard
                type="signature"
                imageUrl={branding.signature}
                onUpload={handleBrandingUpload}
                editable={isEditing}
              />
            </Box>

            <Paper elevation={0} sx={cardSx}>
              <SectionTitle
                icon={<AccessTimeOutlinedIcon fontSize="small" />}
                title="Working hours"
                subtitle={`Lab is ${form.isOpen ? "open" : "closed"}. Set common hours for all days, or edit a day individually.`}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.25,
                  mb: 1.5,
                }}
              >
                <TextField
                  label="Slot duration (minutes)"
                  type="number"
                  size="small"
                  value={form.slotDurationMinutes}
                  disabled={!isEditing}
                  inputProps={{ min: 1 }}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slotDurationMinutes: event.target.value,
                    }))
                  }
                  sx={inputSx}
                />

                <TextField
                  label="Start time for all days"
                  type="time"
                  size="small"
                  value={bulkStartTime}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setBulkStartTime(event.target.value)
                  }
                  sx={inputSx}
                />

                <TextField
                  label="End time for all days"
                  type="time"
                  size="small"
                  value={bulkEndTime}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setBulkEndTime(event.target.value)
                  }
                  sx={inputSx}
                />

                <Button
                  variant="outlined"
                  onClick={applyHoursToAllDays}
                  disabled={!isEditing}
                  sx={{
                    minHeight: 40,
                    borderRadius: "8px",
                    borderColor: "#07876A",
                    color: "#07876A",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Apply to all days
                </Button>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1,
                }}
              >
                {form.days.map((day, index) => (
                  <Box
                    key={day.day}
                    sx={{
                      gridColumn: {
                        xs: "auto",
                        sm: day.day === "Sunday" ? "1 / -1" : "auto",
                      },
                      p: 1.1,
                      border: "1px solid #E7EEEB",
                      borderRadius: "9px",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box>
                        <Typography
                          sx={{ fontSize: 12, fontWeight: 700 }}
                        >
                          {day.day}
                        </Typography>

                        <Typography
                          sx={{ fontSize: 10, color: "#66746F" }}
                        >
                          {day.openingTime} – {day.closingTime}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.25}
                      >
                        <Switch
                          size="small"
                          checked={day.enabled}
                          disabled={!isEditing}
                          onChange={(event) =>
                            updateDay(
                              index,
                              "enabled",
                              event.target.checked
                            )
                          }
                          sx={greenSwitchSx}
                        />

                        <Typography
                          sx={{
                            fontSize: 10,
                            color: day.enabled ? "#52665F" : "#8A9691",
                          }}
                        >
                          {day.enabled ? "Open" : "Closed"}
                        </Typography>

                        <Button
                          size="small"
                          disabled={!isEditing}
                          onClick={() =>
                            setEditingDay((current) =>
                              current === day.day ? null : day.day
                            )
                          }
                          sx={{
                            minWidth: 0,
                            px: 0.75,
                            fontSize: 10,
                            textTransform: "none",
                            color: "#07876A",
                          }}
                        >
                          {editingDay === day.day ? "Done" : "Edit time"}
                        </Button>
                      </Stack>
                    </Stack>

                    {editingDay === day.day && (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <TextField
                          label="Start time"
                          type="time"
                          size="small"
                          value={day.openingTime}
                          disabled={!isEditing || !day.enabled}
                          onChange={(event) =>
                            updateDay(
                              index,
                              "openingTime",
                              event.target.value
                            )
                          }
                          sx={inputSx}
                        />

                        <TextField
                          label="End time"
                          type="time"
                          size="small"
                          value={day.closingTime}
                          disabled={!isEditing || !day.enabled}
                          onChange={(event) =>
                            updateDay(
                              index,
                              "closingTime",
                              event.target.value
                            )
                          }
                          sx={inputSx}
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Stack>

          <Stack spacing={2}>
            <Paper elevation={0} sx={cardSx}>
              <SectionTitle
                icon={<DescriptionOutlinedIcon fontSize="small" />}
                title="Sub Title"
                subtitle="Add a short description for your lab."
              />

              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Write a short description about your lab"
                value={form.bio}
                disabled={!isEditing}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    bio: event.target.value,
                  }))
                }
                sx={inputSx}
              />
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <SectionTitle
                icon={<PeopleAltOutlinedIcon fontSize="small" />}
                title="Patient services"
                subtitle="Choose which services are available to patients."
              />

              <Stack
                divider={<Box sx={{ borderBottom: "1px solid #EDF1EF" }} />}
              >
                {services.map((service) => (
                  <Stack
                    key={service.key}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ py: 1.2 }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontSize: 12, fontWeight: 700 }}
                      >
                        {service.title}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.25,
                          fontSize: 10,
                          color: "#7B8782",
                        }}
                      >
                        {service.description}
                      </Typography>
                    </Box>

                    <Switch
                      checked={Boolean(
                        form.patientServices[service.key]
                      )}
                      disabled={!isEditing}
                      onChange={(event) =>
                        updateService(
                          service.key,
                          event.target.checked
                        )
                      }
                      sx={greenSwitchSx}
                    />
                  </Stack>
                ))}
              </Stack>
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <SectionTitle
                icon={<LocationOnOutlinedIcon fontSize="small" />}
                title="Service coverage areas"
                subtitle="Add cities and localities where your lab provides service."
                action={
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={addArea}
                    disabled={!isEditing}
                    sx={{
                      flexShrink: 0,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: 11,
                      color: "#08785E",
                      borderColor: "#B8D8CC",
                    }}
                  >
                    Add area
                  </Button>
                }
              />

              <Box
                sx={{
                  display: { xs: "none", sm: "grid" },
                  gridTemplateColumns: "1fr 1.3fr 0.8fr 42px",
                  gap: 1,
                  px: 1.25,
                  py: 0.9,
                  mb: 0.75,
                  bgcolor: "#F4F7F6",
                  borderRadius: "8px",
                }}
              >
                {["City", "Area / Locality", "PIN code", ""].map(
                  (label, index) => (
                    <Typography
                      key={`${label}-${index}`}
                      sx={{
                        fontSize: 10,
                        fontWeight: 750,
                        color: "#66746F",
                      }}
                    >
                      {label}
                    </Typography>
                  )
                )}
              </Box>

              <Stack spacing={1}>
                {form.serviceCoverageArea.map((area, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr 1fr 38px",
                        sm: "1fr 1.3fr 0.8fr 42px",
                      },
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      placeholder="City"
                      size="small"
                      value={area.city}
                      disabled={!isEditing}
                      onChange={(event) =>
                        updateArea(index, "city", event.target.value)
                      }
                      sx={inputSx}
                    />

                    <TextField
                      placeholder="Area / Locality"
                      size="small"
                      value={area.areaLocality}
                      disabled={!isEditing}
                      onChange={(event) =>
                        updateArea(
                          index,
                          "areaLocality",
                          event.target.value
                        )
                      }
                      sx={inputSx}
                    />

                    <TextField
                      placeholder="PIN code"
                      size="small"
                      value={area.pinCode}
                      disabled={!isEditing}
                      inputProps={{
                        maxLength: 6,
                        inputMode: "numeric",
                      }}
                      onChange={(event) =>
                        updateArea(
                          index,
                          "pinCode",
                          event.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      sx={inputSx}
                    />

                    <IconButton
                      aria-label="Remove area"
                      disabled={
                        !isEditing || form.serviceCoverageArea.length === 1
                      }
                      onClick={() => removeArea(index)}
                      sx={{
                        width: 38,
                        height: 38,
                        color: "#9A5B5B",
                        border: "1px solid #E8DEDE",
                        borderRadius: "8px",
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1.5}
          sx={{
            mt: 2,
            position: { xs: "static", sm: "sticky" },
            bottom: 0,
            py: 1.5,
            bgcolor: "#F7F9F8",
            zIndex: 1,
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              previewLoading ? (
                <CircularProgress size={16} />
              ) : (
                <VisibilityOutlinedIcon />
              )
            }
            onClick={handlePreview}
            disabled={previewLoading}
            sx={{
              minWidth: 120,
              minHeight: 42,
              borderRadius: "9px",
              borderColor: "#07876A",
              color: "#07876A",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {previewLoading ? "Loading..." : "Preview"}
          </Button>

          {isEditing ? (
            <>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                disabled={saving}
                sx={{
                  minWidth: 100,
                  minHeight: 42,
                  borderRadius: "9px",
                  borderColor: "#07876A",
                  color: "#07876A",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  minWidth: 145,
                  minHeight: 42,
                  borderRadius: "9px",
                  bgcolor: "#07876A",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#066F58",
                    boxShadow: "none",
                  },
                }}
              >
                {saving ? (
                  <CircularProgress size={19} color="inherit" />
                ) : (
                  "Save changes"
                )}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setError("");
                setIsEditing(true);
              }}
              sx={{
                minWidth: 120,
                minHeight: 42,
                borderRadius: "9px",
                bgcolor: "#07876A",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#066F58",
                  boxShadow: "none",
                },
              }}
            >
              Edit
            </Button>
          )}
        </Stack>
      </Box>

      <LabRegistrationPreview
        open={previewOpen}
        registration={previewData}
        onClose={() => setPreviewOpen(false)}
      />

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3500}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccess("")}
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

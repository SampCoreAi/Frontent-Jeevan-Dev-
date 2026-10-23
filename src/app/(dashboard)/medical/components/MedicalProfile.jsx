"use client";

import { useEffect, useRef, useState } from "react";
import api from "../../../../utils/axiosInstance";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

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
      day,
    ),
    openingTime: "09:00",
    closingTime: "19:00",
  }));

const createDefaultForm = () => ({
  description: "",
  isOpen: true,
  days: createDefaultDays(),
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
  "& .MuiInputLabel-root": { fontSize: 12 },
};

const brandingRules = {
  logo: {
    folder: "pharmacy-logo",
    accept: "image/png,image/webp",
    title: "Medical store logo",
    details: "PNG or WebP · 500 × 500 px · Max 500 KB",
    types: ["image/png", "image/webp"],
    maxSize: 500 * 1024,
    width: 500,
    height: 500,
  },
  signature: {
    folder: "pharmacy-signature",
    accept: "image/png",
    title: "Medical store signature",
    details: "Transparent PNG · 600 × 200 px · Max 200 KB",
    types: ["image/png"],
    maxSize: 200 * 1024,
    width: 600,
    height: 200,
  },
};

const getProfileData = (profile) => profile?.profile ?? profile ?? {};

const firstValue = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
};

const getBrandingUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";

  const bucketUrl = (process.env.NEXT_PUBLIC_S3_BUCKET_URL || "").replace(
    /\/+$/,
    "",
  );
  const rawValue = value.trim();

  if (/^https?:\/\//i.test(rawValue)) return rawValue;
  if (rawValue.startsWith("data:") || rawValue.startsWith("blob:")) {
    return rawValue;
  }

  const path = rawValue.replace(/^\/+/, "");
  return bucketUrl ? `${bucketUrl}/${path}` : `/${path}`;
};

function SectionTitle({ icon, title, subtitle }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ mb: 2 }}>
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
          "& > svg": { width: 22, height: 22 },
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 750, color: "#172033" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{ mt: 0.3, fontSize: 11, lineHeight: 1.5, color: "#77847F" }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function BrandingCard({ type, imageUrl, editable, onUpload }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const rule = brandingRules[type];
  const previewUrl = imageFailed ? "" : imageUrl;

  useEffect(() => setImageFailed(false), [imageUrl]);

  const selectImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || uploading || !editable) return;

    if (!rule.types.includes(file.type)) {
      setError(
        type === "logo"
          ? "Choose a PNG or WebP image for the logo."
          : "Choose a PNG image for the signature.",
      );
      return;
    }

    if (file.size > rule.maxSize) {
      setError(
        `Image must be ${type === "logo" ? "500 KB" : "200 KB"} or smaller.`,
      );
      return;
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
        throw new Error(
          `Image dimensions must be ${rule.width} × ${rule.height} px.`,
        );
      }

      setError("");
      setUploading(true);
      await onUpload(type, file);
    } catch (uploadError) {
      setError(uploadError.message || `Unable to upload ${rule.title}.`);
    } finally {
      URL.revokeObjectURL(objectUrl);
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
        title={rule.title}
        subtitle="Displayed on your medical store profile and documents."
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
            alt={rule.title}
            onError={() => setImageFailed(true)}
            sx={{
              maxWidth: "100%",
              width: type === "logo" ? 120 : 240,
              height: type === "logo" ? 100 : 80,
              objectFit: "contain",
            }}
          />
        ) : (
          <>
            <CloudUploadOutlinedIcon sx={{ fontSize: 38, color: "#64748B" }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              {rule.details}
            </Typography>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={rule.accept}
          hidden
          onChange={selectImage}
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
          {uploading ? "Uploading..." : `${previewUrl ? "Change" : "Choose"} image`}
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

export default function MedicalStoreProfile({ profile, onProfileUpdate }) {
  const [form, setForm] = useState(createDefaultForm);
  const [branding, setBranding] = useState({ logo: "", signature: "" });
  const [pharmacyProfile, setPharmacyProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const data = { ...getProfileData(profile), ...pharmacyProfile };

  useEffect(() => {
    const controller = new AbortController();

    const loadPharmacyProfile = async () => {
      try {
        const response = await api.get("/api/pharmacy/getProfile", {
          signal: controller.signal,
        });

        if (response.data?.success === false) {
          throw new Error(
            response.data?.message || "Medical store profile could not be loaded.",
          );
        }

        const responseProfile = response.data?.data;
        if (!responseProfile || typeof responseProfile !== "object") {
          throw new Error("Medical store profile data was not found.");
        }

        setPharmacyProfile(responseProfile);
      } catch (loadError) {
        if (
          loadError.name !== "CanceledError" &&
          loadError.code !== "ERR_CANCELED"
        ) {
          setError(
            loadError?.response?.data?.message ||
              loadError.message ||
              "Medical store profile could not be loaded.",
          );
        }
      }
    };

    loadPharmacyProfile();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!profile && !Object.keys(pharmacyProfile).length) return;

    const currentProfile = { ...getProfileData(profile), ...pharmacyProfile };
    const currentHours =
      currentProfile.workingHours || currentProfile.working_hours || {};
    const savedDays = Array.isArray(currentHours.days) ? currentHours.days : [];
    const savedDayMap = new Map(savedDays.map((day) => [day.day, day]));

    setForm({
      description:
        currentProfile.StoreDescription ??
        currentProfile.storeDescription ??
        currentProfile.store_description ??
        "",
      isOpen: currentHours.isOpen ?? true,
      days: DAYS.map((day) => {
        const saved = savedDayMap.get(day);
        return {
          day,
          enabled: Boolean(saved),
          openingTime: saved?.openingTime || "09:00",
          closingTime: saved?.closingTime || "19:00",
        };
      }),
    });

    setBranding({
      logo: getBrandingUrl(
        firstValue(currentProfile, [
          "pharmacy_logo_url",
          "store_logo_url",
          "logo_url",
          "pharmacyLogo",
          "pharmacy_logo",
          "store_logo",
          "logo",
        ]),
      ),
      signature: getBrandingUrl(
        firstValue(currentProfile, [
          "pharmacy_signature_url",
          "store_signature_url",
          "signature_url",
          "pharmacySignature",
          "pharmacy_signature",
          "store_signature",
          "signature",
        ]),
      ),
    });
  }, [profile, pharmacyProfile]);

  const handleBrandingUpload = async (type, file) => {
    const body = new FormData();
    body.append("file", file);

    const response = await api.post(
      `/api/licenseFile/imageUpload?folder=${brandingRules[type].folder}`,
      body,
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

    setBranding((current) => ({
      ...current,
      [type]: getBrandingUrl(uploadedPath),
    }));
    setSuccess(`${type === "logo" ? "Logo" : "Signature"} uploaded successfully.`);
    setError("");
  };

  const updateDay = (index, key, value) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day, dayIndex) =>
        dayIndex === index ? { ...day, [key]: value } : day,
      ),
    }));
  };

  const handleSave = async () => {
    if (!isEditing || saving) return;

    for (const day of form.days) {
      if (
        day.enabled &&
        (!day.openingTime ||
          !day.closingTime ||
          day.openingTime >= day.closingTime)
      ) {
        setError(`Please enter valid opening and closing times for ${day.day}.`);
        return;
      }
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        StoreDescription: form.description.trim(),
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
      };
      const response = await api.patch("/api/pharmacy/profile", payload);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Medical store profile could not be saved.",
        );
      }

      const responseData = response.data?.data ?? {};
      setForm((current) => ({
        ...current,
        description: payload.StoreDescription,
      }));
      onProfileUpdate?.({
        ...responseData,
        StoreDescription: payload.StoreDescription,
        workingHours: payload.workingHours,
      });
      setPharmacyProfile((current) => ({
        ...current,
        ...responseData,
        StoreDescription: payload.StoreDescription,
        workingHours: payload.workingHours,
      }));
      setIsEditing(false);
      setSuccess(
        response.data?.message || "Medical store profile saved successfully.",
      );
    } catch (saveError) {
      setError(
        saveError?.response?.data?.message ||
          saveError.message ||
          "Medical store profile could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };

  const storeName =
    data.store_name || data.storeName || data.name || "Medical Store";
  const address = [
    data.address?.shopUnit || data.flat_plot_no || data.flatPlotNo,
    data.address?.street || data.street_name || data.streetName,
    data.address?.area || data.area_locality || data.areaLocality,
    data.address?.cityDistrict || data.city || data.district,
    data.address?.state || data.state,
    data.address?.pinCode || data.pincode || data.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 1.5, sm: 2.5, lg: 3 }, bgcolor: "#fff" }}>
      <Box sx={{ maxWidth: 1440, mx: "auto" }}>
       

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
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: 2,
              }}
            >
              <BrandingCard
                type="logo"
                imageUrl={branding.logo}
                editable={isEditing}
                onUpload={handleBrandingUpload}
              />
              <BrandingCard
                type="signature"
                imageUrl={branding.signature}
                editable={isEditing}
                onUpload={handleBrandingUpload}
              />
            </Box>

            <Paper elevation={0} sx={cardSx}>
              <SectionTitle
                icon={<AccessTimeOutlinedIcon />}
                title="Working hours"
                subtitle={`Store is ${form.isOpen ? "open" : "closed"}. Set the days and hours when customers can visit.`}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  mb: 1.25,
                  p: 1.25,
                  border: "1px solid #E7EEEB",
                  borderRadius: "9px",
                }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                  Store accepting customers
                </Typography>
                <Switch
                  size="small"
                  checked={form.isOpen}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isOpen: event.target.checked,
                    }))
                  }
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#07876A" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      bgcolor: "#07876A",
                      opacity: 1,
                    },
                  }}
                />
              </Stack>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  gap: 1,
                }}
              >
                {form.days.map((day, index) => (
                  <Box
                    key={day.day}
                    sx={{
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
                        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                          {day.day}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "#66746F" }}>
                          {day.enabled
                            ? `${day.openingTime} – ${day.closingTime}`
                            : "Closed"}
                        </Typography>
                      </Box>
                      <Switch
                        size="small"
                        checked={day.enabled}
                        disabled={!isEditing || !form.isOpen}
                        onChange={(event) =>
                          updateDay(index, "enabled", event.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#07876A",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            bgcolor: "#07876A",
                            opacity: 1,
                          },
                        }}
                      />
                    </Stack>
                    {day.enabled && (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <TextField
                          label="Opens"
                          type="time"
                          size="small"
                          value={day.openingTime}
                          disabled={!isEditing}
                          onChange={(event) =>
                            updateDay(index, "openingTime", event.target.value)
                          }
                          sx={inputSx}
                        />
                        <TextField
                          label="Closes"
                          type="time"
                          size="small"
                          value={day.closingTime}
                          disabled={!isEditing}
                          onChange={(event) =>
                            updateDay(index, "closingTime", event.target.value)
                          }
                          sx={inputSx}
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <SectionTitle
                icon={<LocalPharmacyOutlinedIcon />}
                title="Store bio"
                subtitle="Add a short description to introduce your medical store."
              />
              <TextField
                fullWidth
                multiline
                minRows={4}
                maxRows={8}
                placeholder="Tell customers about your store..."
                value={form.description}
                disabled={!isEditing}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                sx={inputSx}
              />
            </Paper>
          </Stack>

          <Paper elevation={0} sx={cardSx}>
            <SectionTitle
              icon={<LocationOnOutlinedIcon />}
              title="Store details"
              subtitle="Your registered contact and location information."
            />
            <Stack spacing={1.4}>
              {[
                ["Store code", data.store_code || data.storeCode],
                ["Owner", data.owner_name || data.ownerName || profile?.full_name],
                ["Phone", data.phone || data.phone_number || data.phoneNumber],
                ["Email", data.email || profile?.email],
                ["Address", address],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <Box key={label}>
                    <Typography sx={{ fontSize: 10, color: "#77847F" }}>
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.2,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#172033",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Paper>
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
          <Tooltip title="Profile preview is not available yet">
            <span>
              <Button
                variant="outlined"
                startIcon={<VisibilityOutlinedIcon />}
                disabled
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
                Preview
              </Button>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setError("");
                setIsEditing(true);
              }
            }}
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={{
              minWidth: 130,
              minHeight: 42,
              borderRadius: "9px",
              bgcolor: "#07876A",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#066F58", boxShadow: "none" },
            }}
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Edit"}
          </Button>
        </Stack>

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
    </Box>
  );
}

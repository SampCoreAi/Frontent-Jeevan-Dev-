"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  IconButton,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LabRegistrationPreview from "./LabRegistrationPreview";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const initialHours = DAYS.map((day) => ({
  day,
  open: day !== "Sunday",
  startTime: "09:00",
  endTime: "19:00",
}));

const cardSx = {
  p: 2.5,
  bgcolor: "#fff",
  border: "1px solid #DDE9E5",
  borderRadius: 2,
};

export default function LabProfile({ labId, onSave }) {
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [useRegistrationAddress, setUseRegistrationAddress] = useState(true);
  const [sameCollectionHours, setSameCollectionHours] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [notice, setNotice] = useState("");

  const [profile, setProfile] = useState({
    labName: "",
    labType: "",
    description: "",
    phone: "",
    email: "",
    address: "",
  });

  const [hours, setHours] = useState(initialHours);
  const [services, setServices] = useState({
    walkIn: true,
    appointmentBooking: true,
    homeSampleCollection: false,
  });
  const [areas, setAreas] = useState([
    { city: "", locality: "", pinCode: "" },
  ]);

  useEffect(() => {
    if (!labId) {
      setError("Lab registration ID missing hai.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadRegistration = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/lab-registration/getLabRegistrationById/${labId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            signal: controller.signal,
          }
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Registration load nahi hui."
          );
        }

        const data = response.data.data;
        const info = data.registrationData?.labInformation || {};
        const address = data.registrationData?.labAddress || {};

        setRegistration(data);
        setProfile({
          labName: info.diagnosticLabName || "",
          labType: info.labType || "",
          description: "",
          phone: info.labContactPhone || "",
          email: info.labContactEmail || "",
          address: [
            address.shopUnitNumber,
            address.buildingComplexName,
            address.streetRoadName,
            address.areaLocality,
            address.landmark,
            address.cityTown,
            address.state,
            address.pinCode,
          ]
            .filter(Boolean)
            .join(", "),
        });

        if (address.cityTown || address.areaLocality || address.pinCode) {
          setAreas([
            {
              city: address.cityTown || "",
              locality: address.areaLocality || "",
              pinCode: address.pinCode || "",
            },
          ]);
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Registration load nahi hui."
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadRegistration();
    return () => controller.abort();
  }, [labId]);

  const updateProfile = (key, value) =>
    setProfile((current) => ({ ...current, [key]: value }));

  const updateHour = (index, key, value) =>
    setHours((current) =>
      current.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );

  const updateArea = (index, key, value) =>
    setAreas((current) =>
      current.map((area, i) => (i === index ? { ...area, [key]: value } : area))
    );

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!onSave) {
      setNotice("Profile save API abhi connect nahi hai.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        registrationId: registration?.id,
        ...profile,
        useRegistrationAddress,
        hours,
        sameCollectionHours,
        services,
        serviceAreas: services.homeSampleCollection ? areas : [],
        logoFile,
      });
      setNotice("Profile save ho gaya.");
    } catch (err) {
      setError(err.message || "Profile save nahi hua.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: 300, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 },mt:8, bgcolor: "white", minHeight: "100vh" }}>
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 21, fontWeight: 700, color: "#172033" }}>
            Lab Profile
          </Typography>
          <Typography sx={{ mt: 0.4, fontSize: 13, color: "#74807B" }}>
            Patients ko dikhne wali profile details manage karein.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => setPreviewOpen(true)}
          sx={{ textTransform: "none" }}
        >
          Preview profile
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.7fr) minmax(280px, 1fr)" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box sx={cardSx}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>
              Public profile
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#74807B", mb: 2 }}>
              Lab name, type aur contact registration se liye gaye hain.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "140px 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 130,
                    height: 130,
                    border: "1px dashed #CBD5E1",
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                    bgcolor: "#F4FAF8",
                  }}
                >
                  {logoPreview ? (
                    <Box
                      component="img"
                      src={logoPreview}
                      alt="Lab logo"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: 12, color: "#74807B" }}>
                      Lab logo
                    </Typography>
                  )}
                </Box>

                <Button
                  component="label"
                  size="small"
                  startIcon={<UploadOutlinedIcon />}
                  sx={{ mt: 1, textTransform: "none" }}
                >
                  Upload logo
                  <input hidden type="file" accept="image/*" onChange={handleLogoChange} />
                </Button>
              </Box>

              <Box sx={{ display: "grid", gap: 1.5 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                  }}
                >
                  <TextField
                    label="Lab name"
                    size="small"
                    value={profile.labName}
                    onChange={(e) => updateProfile("labName", e.target.value)}
                  />
                  <TextField
                    select
                    label="Lab type"
                    size="small"
                    value={profile.labType}
                    onChange={(e) => updateProfile("labType", e.target.value)}
                  >
                    {["PATHOLOGY", "RADIOLOGY", "DIAGNOSTIC", "OTHER"].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <TextField
                  label="Short description"
                  multiline
                  minRows={2}
                  inputProps={{ maxLength: 300 }}
                  value={profile.description}
                  onChange={(e) => updateProfile("description", e.target.value)}
                  placeholder="Apne lab ke baare mein chhota sa description likhein"
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                  }}
                >
                  <TextField
                    label="Contact phone"
                    size="small"
                    value={profile.phone}
                    onChange={(e) => updateProfile("phone", e.target.value)}
                  />
                  <TextField
                    label="Contact email"
                    size="small"
                    value={profile.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useRegistrationAddress}
                      onChange={(e) => setUseRegistrationAddress(e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography sx={{ fontSize: 12 }}>Registration address use karein</Typography>}
                />

                <TextField
                  label="Lab address"
                  size="small"
                  value={profile.address}
                  disabled={useRegistrationAddress}
                  onChange={(e) => updateProfile("address", e.target.value)}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={cardSx}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
              Working hours
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#74807B", mb: 1.5 }}>
              Har din ke lab opening aur closing hours set karein.
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "110px 100px 1fr 1fr", gap: 1, alignItems: "center" }}>
              {["Day", "Open", "Opening time", "Closing time"].map((label) => (
                <Typography key={label} sx={{ fontSize: 11, fontWeight: 700, color: "#74807B" }}>
                  {label}
                </Typography>
              ))}

              {hours.map((item, index) => (
                <>
                  <Typography key={`${item.day}-name`} sx={{ fontSize: 12 }}>
                    {item.day}
                  </Typography>
                  <Switch
                    key={`${item.day}-switch`}
                    size="small"
                    checked={item.open}
                    onChange={(e) => updateHour(index, "open", e.target.checked)}
                  />
                  <TextField
                    key={`${item.day}-start`}
                    size="small"
                    type="time"
                    value={item.startTime}
                    disabled={!item.open}
                    onChange={(e) => updateHour(index, "startTime", e.target.value)}
                  />
                  <TextField
                    key={`${item.day}-end`}
                    size="small"
                    type="time"
                    value={item.endTime}
                    disabled={!item.open}
                    onChange={(e) => updateHour(index, "endTime", e.target.value)}
                  />
                </>
              ))}
            </Box>

       
          </Box>
        </Box>

      <Box sx={cardSx}>
  <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>
    Patient services
  </Typography>

  <Typography sx={{ fontSize: 12, color: "#74807B", mb: 1.5 }}>
    Patients ko milne wali services select karein.
  </Typography>

  {[
    ["walkIn", "Walk-in", "Patients bina appointment aa sakte hain."],
    ["appointmentBooking", "Appointment booking", "Patients online appointment book kar sakte hain."],
    ["homeSampleCollection", "Home sample collection", "Patient ke ghar se sample collect karein."],
  ].map(([key, label, description]) => {
    const selected = Boolean(services[key]);

    return (
      <Box
        key={key}
        sx={{
          mb: 1,
          border: "1px solid",
          borderColor: selected ? "#A8D8CA" : "#E5ECE9",
          borderRadius: 1.5,
          bgcolor: selected ? "#F0FAF7" : "#fff",
          transition: "0.2s",
          "&:hover": { borderColor: "#07876A" },
        }}
      >
        <FormControlLabel
          sx={{ m: 0, p: 1, width: "100%", alignItems: "center" }}
          control={
            <Checkbox
              checked={selected}
              onChange={(event) =>
                setServices((current) => ({
                  ...current,
                  [key]: event.target.checked,
                }))
              }
              icon={
                <Box
                  sx={{
                    width: 19,
                    height: 19,
                    border: "2px solid #94A3A0",
                    borderRadius: "5px",
                  }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: 19,
                    height: 19,
                    borderRadius: "5px",
                    bgcolor: "#07876A",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 16 }} />
                </Box>
              }
              sx={{ p: 0.75, mr: 1 }}
            />
          }
          label={
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#74807B" }}>
                {description}
              </Typography>
            </Box>
          }
        />
      </Box>
    );
  })}

 {services.homeSampleCollection && (
  <Box
    sx={{
      mt: 1.5,
      p: 1.5,
      border: "1px solid #DDE9E5",
      borderRadius: 1.5,
      bgcolor: "#FBFDFC",
      minWidth: 0,
    }}
  >
    <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}>
      Service coverage area
    </Typography>

    <Typography sx={{ fontSize: 11, color: "#74807B", mb: 1.5 }}>
      Jahan home sample collection available hai, woh areas add karein.
    </Typography>

    {areas.map((area, index) => (
      <Box
        key={index}
        sx={{
          mb: 1.5,
          p: 1.2,
          border: "1px solid #E5ECE9",
          borderRadius: 1.5,
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1,
          }}
        >
          <TextField
            label="City"
            size="small"
            fullWidth
            value={area.city}
            onChange={(event) =>
              updateArea(index, "city", event.target.value)
            }
          />

          <TextField
            label="Area / Locality"
            size="small"
            fullWidth
            value={area.locality}
            onChange={(event) =>
              updateArea(index, "locality", event.target.value)
            }
          />
        </Box>

        <Box
          sx={{
            mt: 1,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 40px",
            gap: 1,
            alignItems: "center",
          }}
        >
          <TextField
            label="PIN code"
            size="small"
            value={area.pinCode}
            inputProps={{ maxLength: 6, inputMode: "numeric" }}
            onChange={(event) =>
              updateArea(
                index,
                "pinCode",
                event.target.value.replace(/\D/g, "").slice(0, 6)
              )
            }
          />

          {areas.length > 1 && (
            <IconButton
              color="error"
              aria-label="Remove area"
              onClick={() =>
                setAreas((current) =>
                  current.filter((_, areaIndex) => areaIndex !== index)
                )
              }
              sx={{
                width: 38,
                height: 38,
                border: "1px solid #F1D5D5",
                borderRadius: 1.5,
                bgcolor: "#FFF7F7",
              }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    ))}

    <Button
      variant="outlined"
      size="small"
      startIcon={<AddRoundedIcon />}
      onClick={() =>
        setAreas((current) => [
          ...current,
          { city: "", locality: "", pinCode: "" },
        ])
      }
      sx={{
        minHeight: 36,
        px: 1.5,
        whiteSpace: "nowrap",
        textTransform: "none",
        fontSize: 12,
      }}
    >
      Add another area
    </Button>
  </Box>
)}
</Box>
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button variant="outlined" onClick={() => window.history.back()} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ textTransform: "none" }}>
          {saving ? <CircularProgress size={18} color="inherit" /> : "Save profile"}
        </Button>
      </Box>

      <LabRegistrationPreview
        open={previewOpen}
        registration={registration}
        onClose={() => setPreviewOpen(false)}
      />

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        message={notice}
        onClose={() => setNotice("")}
      />
    </Box>
  );
}
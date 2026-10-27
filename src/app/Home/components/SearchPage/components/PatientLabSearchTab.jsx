"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import AccessibilityNewOutlinedIcon from "@mui/icons-material/AccessibilityNewOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import api from "../../../../../utils/axiosInstance";

const SAMPLE_TYPES = [
  "BLOOD",
  "URINE",
  "SERUM",
  "PLASMA",
  "SWAB",
  "STOOL",
  "SPUTUM",
  "OTHER",
];

const categories = [
  { name: "Full Body Checkup", icon: <AccessibilityNewOutlinedIcon />, color: "#E87542" },
  { name: "Diabetes", icon: <MonitorHeartOutlinedIcon />, color: "#D79B22" },
  { name: "Heart", icon: <FavoriteBorderOutlinedIcon />, color: "#D96C5F" },
  { name: "Blood Tests", icon: <BloodtypeOutlinedIcon />, color: "#D96C5F" },
  { name: "Kidney", icon: <ScienceOutlinedIcon />, color: "#5598BD" },
  { name: "Thyroid", icon: <LocalHospitalOutlinedIcon />, color: "#8C76B7" },
];

const popularTests = [
  {
    name: "CBC Test (Complete Blood Count)",
    search: "CBC",
    description: "Measures different types of blood cells.",
    icon: <BloodtypeOutlinedIcon />,
    color: "#D96C5F",
  },
  {
    name: "HbA1c Test",
    search: "HbA1c",
    description: "Shows average blood sugar over recent months.",
    icon: <MonitorHeartOutlinedIcon />,
    color: "#D79B22",
  },
  {
    name: "Fasting Blood Sugar (FBS)",
    search: "Fasting Blood Sugar",
    description: "Measures blood sugar after fasting.",
    icon: <ScienceOutlinedIcon />,
    color: "#5598BD",
  },
  {
    name: "Lipid Profile Test",
    search: "Lipid Profile",
    description: "Measures cholesterol and triglyceride levels.",
    icon: <FavoriteBorderOutlinedIcon />,
    color: "#D96C5F",
  },
];

const formatAddress = (value) => {
  let address = value;

  if (typeof address === "string") {
    try {
      address = JSON.parse(address);
    } catch {
      // Keep plain-text addresses.
    }
  }

  if (address && typeof address === "object") {
    return [
      address.building || address.buildingComplexName || address.shopUnitNumber,
      address.street || address.streetRoadName,
      address.locality || address.areaLocality || address.area,
      address.landmark,
      address.city || address.cityTown || address.cityDistrict,
      address.district,
      address.state,
      address.pinCode,
    ]
      .filter(Boolean)
      .join(", ") || "Address not provided";
  }

  return !address || address === "[object Object]"
    ? "Address not provided"
    : address;
};

function LabCard({ lab, onRequest }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        bgcolor: "#fff",
        borderColor: "#DDE9E5",
        borderRadius: 2,
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 1.5,
              bgcolor: "#EAF7F3",
              color: "#07876A",
              "& svg": { width: 23, height: 23, display: "block" },
            }}
          >
            <ScienceOutlinedIcon />
          </Box>

          <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#172033" }}>
            {lab.lab_name || "Laboratory"}
          </Typography>

          {lab.status && (
            <Chip
              size="small"
              label={lab.status}
              sx={{
                height: 23,
                fontSize: 10,
                fontWeight: 700,
                color: "#08785E",
                bgcolor: "#E7F6F0",
              }}
            />
          )}
        </Stack>

        <Typography sx={{ fontSize: 12, color: "#64748B" }}>
          Lab code: {lab.lab_code || "-"} · Registration: {lab.registration_number || "-"}
        </Typography>

        <Stack direction="row" spacing={0.75} alignItems="flex-start">
          <PlaceOutlinedIcon sx={{ fontSize: 17, color: "#07876A", mt: "1px" }} />
          <Typography sx={{ fontSize: 12, color: "#52646B", overflowWrap: "anywhere" }}>
            {formatAddress(lab.address)}
          </Typography>
        </Stack>

        {lab.phone_number && (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <LocalPhoneOutlinedIcon sx={{ fontSize: 16, color: "#07876A" }} />
            <Typography sx={{ fontSize: 12, color: "#52646B" }}>
              {lab.phone_number}
            </Typography>
          </Stack>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={() => onRequest(lab)}
          sx={{
            borderRadius: 1.5,
            borderColor: "#07876A",
            color: "#07876A",
            textTransform: "none",
            "&:hover": { bgcolor: "#F2FAF7", borderColor: "#066F57" },
          }}
        >
          Request tests
        </Button>
      </Stack>
    </Paper>
  );
}

export default function PatientLabSearchTab({ location = "Bhandup, Mumbai" }) {
  const [query, setQuery] = useState("");
  const [labs, setLabs] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [nearbyLabs, setNearbyLabs] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const [selectedLab, setSelectedLab] = useState(null);
  const [testsInput, setTestsInput] = useState("");
  const [sampleType, setSampleType] = useState("BLOOD");
  const [priority, setPriority] = useState("NORMAL");
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [success, setSuccess] = useState("");

  const searching = Boolean(query.trim());

  // Load nearby labs for the normal discovery screen.
  useEffect(() => {
    let active = true;
    const area = location.split(",")[0].trim();

    if (!area) return undefined;

    setNearbyLoading(true);

    api
      .get("/api/labs/search", { params: { search: area } })
      .then((response) => {
        if (active) {
          setNearbyLabs(
            Array.isArray(response.data?.data) ? response.data.data : []
          );
        }
      })
      .catch(() => {
        if (active) setNearbyLabs([]);
      })
      .finally(() => {
        if (active) setNearbyLoading(false);
      });

    return () => {
      active = false;
    };
  }, [location]);

  // Search after the user pauses typing. Clearing the input restores discovery.
  useEffect(() => {
    const search = query.trim();

    if (!search) {
      setLabs([]);
      setSearchError("");
      setSearchLoading(false);
      return undefined;
    }

    let active = true;
    setLabs([]);
    setSearchError("");
    setSearchLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await api.get("/api/labs/search", {
          params: { search },
        });

        if (active) {
          setLabs(Array.isArray(response.data?.data) ? response.data.data : []);
        }
      } catch (error) {
        if (active) {
          setLabs([]);
          setSearchError(
            error?.response?.data?.message || "Unable to search labs right now."
          );
        }
      } finally {
        if (active) setSearchLoading(false);
      }
    }, 450);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const submitRequest = async (event) => {
    event.preventDefault();

    const tests = [
      ...new Set(
        testsInput
          .split(/[\n,]+/)
          .map((test) => test.trim())
          .filter(Boolean)
      ),
    ];

    if (
      !tests.length ||
      tests.length > 20 ||
      tests.some((test) => test.length < 2 || test.length > 150)
    ) {
      setRequestError("Enter 1 to 20 test names, each between 2 and 150 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setRequestError("");

      const response = await api.post("/api/lab-requests/create", {
        labId: Number(selectedLab.id),
        tests,
        sampleType,
        priority,
        doctorNote: "Requested by patient from lab search.",
      });

      const request = response.data?.data || {};
      const requestCode = request.order_id || request.id;

      setSuccess(
        `Request sent to ${selectedLab.lab_name}${
          requestCode ? `. Request ID: ${requestCode}` : ""
        }.`
      );
      setSelectedLab(null);
      setTestsInput("");
      setSampleType("BLOOD");
      setPriority("NORMAL");
    } catch (error) {
      setRequestError(
        error?.response?.data?.message || "Unable to send your lab request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startSearch = (value) => setQuery(value);

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1.5, sm: 2.5, md: 3 },
        py: 2.5,
        mt:8.5,
        bgcolor: "white",
      }}
    >
      <Typography sx={{ mb: 0.5, fontSize: 22, fontWeight: 700, color: "#172033" }}>
        Find labs & tests
      </Typography>
      <Typography sx={{ mb: 2.5, fontSize: 13, color: "#64748B" }}>
        Search for a test or find a laboratory near you.
      </Typography>

     <Paper
  variant="outlined"
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 1,
    mb: 3,
    bgcolor: "#fff",
    borderColor: "#DDE9E5",
    borderRadius: 2,
  }}
>
  <TextField
    fullWidth
    size="small"
    placeholder="Search test, lab, or area"
    value={query}
    onChange={(event) => setQuery(event.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchRoundedIcon sx={{ color: "#64748B" }} />
        </InputAdornment>
      ),
      endAdornment: query && (
        <InputAdornment position="end">
          <IconButton
            size="small"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </InputAdornment>
      ),
    }}
    sx={{
      flex: 1,
      minWidth: 0,
      "& .MuiOutlinedInput-root": {
        minHeight: 48,
        borderRadius: 1.5,
        "& fieldset": { border: 0 },
      },
    }}
  />

  <Button
    variant="outlined"
    startIcon={<FilterListRoundedIcon />}
    sx={{
      minWidth: 105,
      minHeight: 42,
      bgcolor:"#07876a",
      borderRadius: 1.5,
      borderColor: "#DDE9E5",
      color: "white",
      textTransform: "none",
      whiteSpace: "nowrap",
      "&:hover": {
        borderColor: "#07876A",
        bgcolor: "#066e57",
      },
    }}
  >
    Filter
  </Button>
</Paper>
   

      {searching ? (
        <Box>
         

          {searchLoading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
              <CircularProgress size={28} sx={{ color: "#07876A" }} />
            </Box>
          ) : labs.length ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                gap: 1.5,
              }}
            >
              {labs.map((lab) => (
                <LabCard
                  key={lab.id}
                  lab={lab}
                  onRequest={(item) => {
                    setRequestError("");
                    setSelectedLab(item);
                  }}
                />
              ))}
            </Box>
          ) : (
            !searchError && (
              <Paper
                variant="outlined"
                sx={{
                  py: 4,
                  textAlign: "center",
                  bgcolor: "#fff",
                  borderColor: "#DDE9E5",
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#172033" }}>
                  No matching labs found
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 13, color: "#64748B" }}>
                  Try another test, lab name, code, or area.
                </Typography>
              </Paper>
            )
          )}
        </Box>
      ) : (
        <Stack spacing={3}>
          <Box>
            <Typography sx={{ mb: 1.5, fontSize: 18, fontWeight: 700, color: "#172033" }}>
              Browse by health check
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(6, minmax(0, 1fr))",
                },
                gap: 1.25,
              }}
            >
              {categories.map((category) => (
                <Paper
                  key={category.name}
                  component="button"
                  type="button"
                  variant="outlined"
                  onClick={() => startSearch(category.name)}
                  sx={{
                    minHeight: 76,
                    px: 1.25,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textAlign: "left",
                    cursor: "pointer",
                    bgcolor: "#fff",
                    borderColor: "#DDE9E5",
                    borderRadius: 2,
                    "&:hover": { borderColor: "#A8D5C7" },
                    "& svg": {
                      width: 25,
                      height: 25,
                      display: "block",
                      flexShrink: 0,
                      color: category.color,
                    },
                  }}
                >
                  {category.icon}
                  <Typography sx={{ fontSize: 13, color: "#172033" }}>
                    {category.name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ mb: 1.5, fontSize: 18, fontWeight: 700, color: "#172033" }}>
              Popular tests
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  xl: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              {popularTests.map((test) => (
                <Paper
                  key={test.name}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fff",
                    borderColor: "#DDE9E5",
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" spacing={1.25} sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        border: "1px solid #DDE9E5",
                        borderRadius: 1.5,
                        "& svg": {
                          width: 26,
                          height: 26,
                          display: "block",
                          color: test.color,
                        },
                      }}
                    >
                      {test.icon}
                    </Box>

                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#172033" }}>
                        {test.name}
                      </Typography>
                      <Typography sx={{ mt: 0.5, fontSize: 12, color: "#64748B" }}>
                        {test.description}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="outlined"
                    onClick={() => startSearch(test.search)}
                    sx={{
                      mt: 1.5,
                      borderRadius: 1.5,
                      borderColor: "#07876A",
                      color: "#07876A",
                      textTransform: "none",
                    }}
                  >
                    Find labs
                  </Button>
                </Paper>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ mb: 1.5, fontSize: 18, fontWeight: 700, color: "#172033" }}>
              Labs near {location}
            </Typography>

            {nearbyLoading ? (
              <Box sx={{ display: "grid", placeItems: "center", py: 3 }}>
                <CircularProgress size={24} sx={{ color: "#07876A" }} />
              </Box>
            ) : nearbyLabs.length ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 1.5,
                }}
              >
                {nearbyLabs.slice(0, 4).map((lab) => (
                  <LabCard
                    key={lab.id}
                    lab={lab}
                    onRequest={(item) => {
                      setRequestError("");
                      setSelectedLab(item);
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  py: 3,
                  textAlign: "center",
                  bgcolor: "#fff",
                  borderColor: "#DDE9E5",
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontSize: 13, color: "#64748B" }}>
                  Nearby labs will appear here.
                </Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      )}

      <Dialog
        open={Boolean(selectedLab)}
        onClose={() => !submitting && setSelectedLab(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <Box component="form" onSubmit={submitRequest}>
          <DialogTitle sx={{ fontSize: 17, fontWeight: 700, color: "#172033" }}>
            Request tests from {selectedLab?.lab_name}
          </DialogTitle>

          <DialogContent sx={{ display: "grid", gap: 1.75, pt: "8px !important" }}>
            <TextField
              required
              multiline
              minRows={3}
              label="Tests"
              placeholder="Example: CBC, Blood sugar"
              value={testsInput}
              onChange={(event) => setTestsInput(event.target.value)}
              helperText="Separate test names with commas or new lines."
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                select
                fullWidth
                label="Sample type"
                value={sampleType}
                onChange={(event) => setSampleType(event.target.value)}
              >
                {SAMPLE_TYPES.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </TextField>
            </Stack>

            {requestError && <Alert severity="error">{requestError}</Alert>}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setSelectedLab(null)}
              disabled={submitting}
              sx={{ textTransform: "none", color: "#64748B" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                bgcolor: "#07876A",
                "&:hover": { bgcolor: "#066F57" },
              }}
            >
              {submitting ? "Sending..." : "Send request"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
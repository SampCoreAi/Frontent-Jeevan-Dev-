"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import ElderlyOutlinedIcon from "@mui/icons-material/ElderlyOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import api from "../../../../../utils/axiosInstance";

const C = {
  ink: "#172033",
  muted: "#64748B",
  teal: "#07876A",
  border: "#DDE9E5",
  pale: "#E8F4F0",
};
const conditions = [
  ["Diabetes care", MonitorHeartOutlinedIcon, "#EAF5EE"],
  ["Heart care", FavoriteBorderOutlinedIcon, "#FFF0EF"],
  ["Stomach care", RestaurantOutlinedIcon, "#FFF4E6"],
  ["Pain relief", HealingOutlinedIcon, "#EEF2FF"],
  ["Liver care", SpaOutlinedIcon, "#FFF6E7"],
  ["Oral care", MedicalServicesOutlinedIcon, "#F4EEFF"],
  ["Respiratory", AirOutlinedIcon, "#EAF5FB"],
  ["Women's health", WcOutlinedIcon, "#FFF0F5"],
  ["Elderly care", ElderlyOutlinedIcon, "#F2F5F7"],
  ["Cold & immunity", HealthAndSafetyOutlinedIcon, "#EEF7E9"],
];
const popular = [
  "Paracetamol",
  "Vitamin D",
  "ORS",
  "Cough syrup",
  "First aid",
  "Personal care",
];

function addressOf(value) {
  if (!value) return "Address not available";
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return value === "[object Object]" ? "Address not available" : value;
    }
  }
  return typeof value === "object"
    ? [value.locality, value.city, value.state].filter(Boolean).join(", ") ||
        "Address not available"
    : "Address not available";
}

function getMedicines(payload) {
  const data = payload?.data;
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.medicines)
      ? data.medicines
      : Array.isArray(payload?.medicines)
        ? payload.medicines
        : [];
}

function MedicineCard({ item, onSelect }) {
  const name =
    item.medicine_name || item.name || item.product_name || "Medicine";
  const image = item.image_url || item.image || item.thumbnail;
  const price = item.price ?? item.selling_price;
  const details =
    item.strength ||
    item.composition ||
    item.generic_name ||
    item.pack_size ||
    item.form;
  const prescription =
    item.prescription_required || item.is_prescription_required;
  return (
    <Paper
      variant="outlined"
      sx={{ p: 1.5, borderColor: C.border, borderRadius: 2.5, bgcolor: "#fff" }}
    >
      <Box
        sx={{
          height: 120,
          mb: 1.25,
          borderRadius: 2,
          bgcolor: "#F6F9F8",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        }}
      >
        {image ? (
          <Box
            component="img"
            src={image}
            alt={name}
            sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1 }}
          />
        ) : (
          <MedicationOutlinedIcon sx={{ fontSize: 42, color: "#82B9A9" }} />
        )}
      </Box>
      <Typography
        sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, color: C.ink }}
      >
        {name}
      </Typography>
      {details && (
        <Typography sx={{ mt: 0.4, fontSize: 12, color: C.muted }}>
          {details}
        </Typography>
      )}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1.25 }}
      >
        <Box>
          {price != null && (
            <Typography sx={{ fontWeight: 700, color: C.ink }}>
              ₹{price}
            </Typography>
          )}
          {prescription && (
            <Typography sx={{ fontSize: 10, color: "#B45309" }}>
              Prescription required
            </Typography>
          )}
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onSelect?.(item)}
          sx={{
            textTransform: "none",
            color: C.teal,
            borderColor: C.teal,
            borderRadius: 1.5,
          }}
        >
          View
        </Button>
      </Stack>
    </Paper>
  );
}

export default function PatientMedicineSearchTab() {
  const searchEndpoint = "/api/medicines/search";
  const nearbyPharmacies = [];
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [stock, setStock] = useState("all");
  const [prescription, setPrescription] = useState("all");
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    const search = query.trim();
    if (!search) {
      setMedicines([]);
      setLoading(false);
      setError("");
      return;
    }
    let active = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(searchEndpoint, { params: { search } });
        if (active) setMedicines(getMedicines(response.data));
      } catch (e) {
        if (active) {
          setMedicines([]);
          setError(
            e?.response?.data?.message ||
              "Medicines could not be loaded. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, searchEndpoint]);

  const results = useMemo(() => {
    let list = medicines.filter((item) => {
      const needsRx =
        item.prescription_required || item.is_prescription_required;
      const inStock =
        item.available !== false &&
        item.in_stock !== false &&
        item.stock_status !== "OUT_OF_STOCK";
      return (
        (stock !== "available" || inStock) &&
        (prescription === "all" || (prescription === "rx" ? needsRx : !needsRx))
      );
    });
    if (sort === "low")
      list.sort(
        (a, b) =>
          Number(a.price ?? a.selling_price ?? Infinity) -
          Number(b.price ?? b.selling_price ?? Infinity),
      );
    if (sort === "high")
      list.sort(
        (a, b) =>
          Number(b.price ?? b.selling_price ?? -Infinity) -
          Number(a.price ?? a.selling_price ?? -Infinity),
      );
    return list;
  }, [medicines, stock, prescription, sort]);
  const searching = Boolean(query.trim());
  const filterCount =
    Number(stock !== "all") +
    Number(prescription !== "all") +
    Number(sort !== "relevance");
  const selectSearch = (term) => {
    setQuery(term);
  };
  const sectionTitle = { fontSize: 18, fontWeight: 750, color: C.ink };
  const grid = {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2,minmax(0,1fr))",
      sm: "repeat(3,minmax(0,1fr))",
      lg: "repeat(5,minmax(0,1fr))",
    },
    gap: 1.25,
  };

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        px: { xs: 1.5, sm: 2.5, lg: 3 },
        py: 2.5,
        bgcolor: "white",
        minHeight: "100%",
        mt:8
      }}
    >
      {!searching && (
        <Box sx={{ mb: 2.25 }}>
          <Typography
            sx={{ fontSize: { xs: 21, sm: 25 }, fontWeight: 750, color: C.ink }}
          >
            Find medicines
          </Typography>
          <Typography sx={{ mt: 0.4, fontSize: 13, color: C.muted }}>
            Search medicines and browse nearby pharmacies
          </Typography>
        </Box>
      )}

      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          px: 0.75,
          mb: searching ? 2 : 3,
          bgcolor: "#fff",
          borderColor: C.border,
          borderRadius: 2.5,
          boxShadow: "0 4px 16px rgba(23,32,51,.045)",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search medicine, brand, or health need"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{ "aria-label": "Search medicines" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: C.muted }} />
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
            "& .MuiOutlinedInput-root": {
              minHeight: 50,
              "& fieldset": { border: 0 },
            },
          }}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ my: 1, borderColor: C.border }}
        />
        <Button
          onClick={() => setFilterOpen(true)}
          startIcon={<FilterListRoundedIcon />}
          sx={{
            minWidth: { xs: 48, sm: 100 },
            height: 44,
            color: C.ink,
            textTransform: "none",
            "& .MuiButton-startIcon": { mr: { xs: 0, sm: 0.75 } },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Filter
          </Box>
          {filterCount > 0 && (
            <Box component="span" sx={{ ml: 0.5, color: C.teal }}>
              {filterCount}
            </Box>
          )}
        </Button>
      </Paper>

      {searching ? (
        <Box>
         
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 7 }}>
              <CircularProgress size={28} sx={{ color: C.teal }} />
            </Box>
          ) : !error && results.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                borderColor: C.border,
                borderRadius: 2.5,
              }}
            >
              <MedicationOutlinedIcon sx={{ fontSize: 38, color: "#9AA8A4" }} />
              <Typography sx={{ mt: 1, fontWeight: 700, color: C.ink }}>
                No medicines found
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 13, color: C.muted }}>
                Try another name or clear the filters.
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2,minmax(0,1fr))",
                  sm: "repeat(3,minmax(0,1fr))",
                  lg: "repeat(4,minmax(0,1fr))",
                },
                gap: 1.5,
              }}
            >
              {results.map((item, i) => (
                <MedicineCard
                  key={item.id || item.medicine_id || i}
                  item={item}
                />
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <Stack spacing={3}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography sx={sectionTitle}>
                Browse by health condition
              </Typography>
              <Button
                sx={{ color: C.teal, textTransform: "none", fontSize: 13 }}
              >
                View all
              </Button>
            </Stack>
            <Box sx={grid}>
              {conditions.map(([label, Icon, color]) => (
                <Paper
                  key={label}
                  component="button"
                  type="button"
                  onClick={() => {
                    setQuery(label);
                  }}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    p: 1.25,
                    minHeight: 76,
                    textAlign: "left",
                    borderColor: C.border,
                    borderRadius: 2.5,
                    bgcolor: "#fff",
                    cursor: "pointer",
                    transition: ".15s",
                    "&:hover": {
                      borderColor: "#9CCDBE",
                      transform: "translateY(-2px)",
                      boxShadow: "0 5px 14px rgba(23,32,51,.05)",
                    },
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 46,
                      height: 46,
                      bgcolor: color,
                      color: C.teal,
                    }}
                  >
                    <Icon sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 650,
                      lineHeight: 1.3,
                      color: C.ink,
                    }}
                  >
                    {label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

       <Box sx={{ mb: 1 }}>
  <Typography sx={{ ...sectionTitle, mb: 0.5 }}>
    Popular medicine searches
  </Typography>
  <Typography sx={{ mb: 1.5, fontSize: 13, color: C.muted }}>
    Tap a search to find matching medicines
  </Typography>

  <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
    {popular.map((term) => (
      <Button
        key={term}
        variant="outlined"
        startIcon={<SearchRoundedIcon />}
        onClick={() => selectSearch(term)}
        sx={{
          minHeight: 42,
          px: 1.75,
          borderColor: C.border,
          borderRadius: 2,
          bgcolor: "#fff",
          color: C.ink,
          fontSize: 13,
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.18s ease",
          "& .MuiButton-startIcon": { color: C.teal },
          "&:hover": {
            borderColor: C.teal,
            bgcolor: "#F2FAF7",
            transform: "translateY(-1px)",
          },
        }}
      >
        {term}
      </Button>
    ))}
  </Stack>
</Box>

        

        <Box>
  <Box sx={{ mb: 1.5 }}>
    <Typography sx={{ ...sectionTitle, mb: 0.4 }}>
      Pharmacies near you
    </Typography>
    <Typography sx={{ fontSize: 13, color: C.muted }}>
      Find a nearby pharmacy and contact them directly
    </Typography>
  </Box>

  {nearbyPharmacies.length ? (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
        },
        gap: 1.25,
      }}
    >
      {nearbyPharmacies.slice(0, 3).map((shop, i) => (
        <Paper
          key={shop.id || i}
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderColor: C.border,
            borderRadius: 2.5,
            bgcolor: "#fff",
            transition: "all 0.18s ease",
            "&:hover": {
              borderColor: "#A8CFC3",
              boxShadow: "0 5px 16px rgba(23,32,51,.06)",
              transform: "translateY(-1px)",
            },
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              bgcolor: C.pale,
              color: C.teal,
              borderRadius: 2,
            }}
          >
            <LocalPharmacyOutlinedIcon />
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: C.ink,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {shop.pharmacy_name || shop.name || "Pharmacy"}
            </Typography>

            <Typography
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.4,
                mt: 0.5,
                fontSize: 12,
                lineHeight: 1.4,
                color: C.muted,
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 16, flexShrink: 0 }} />
              <Box component="span">
                {addressOf(shop.address || shop.location)}
                {shop.distance ? ` · ${shop.distance}` : ""}
              </Box>
            </Typography>
          </Box>

          {shop.phone_number && (
            <Button
              component="a"
              href={`tel:${shop.phone_number}`}
              size="small"
              variant="outlined"
              sx={{
                flexShrink: 0,
                borderColor: C.border,
                color: C.teal,
                borderRadius: 1.5,
                textTransform: "none",
                "&:hover": { borderColor: C.teal, bgcolor: "#F2FAF7" },
              }}
            >
              Call
            </Button>
          )}
        </Paper>
      ))}
    </Box>
  ) : (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2,
        borderColor: C.border,
        borderRadius: 2.5,
        bgcolor: "#fff",
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 48,
          height: 48,
          bgcolor: C.pale,
          color: C.teal,
          borderRadius: 2,
        }}
      >
        <LocalPharmacyOutlinedIcon sx={{ width: 24, height: 24, fontSize: 24 }} />
      </Avatar>

      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
          No nearby pharmacies to show
        </Typography>
        <Typography sx={{ mt: 0.3, fontSize: 13, color: C.muted }}>
          Pharmacy listings will appear when location data is available.
        </Typography>
      </Box>
    </Paper>
  )}
</Box>
        </Stack>
      )}

      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontSize: 17, fontWeight: 750, color: C.ink }}>
          Filter medicines
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
          <FormControl>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.ink }}>
              Availability
            </Typography>
            <RadioGroup
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label="All medicines"
              />
              <FormControlLabel
                value="available"
                control={<Radio size="small" />}
                label="In stock only"
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.ink }}>
              Prescription
            </Typography>
            <RadioGroup
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label="Show all"
              />
              <FormControlLabel
                value="otc"
                control={<Radio size="small" />}
                label="No prescription required"
              />
              <FormControlLabel
                value="rx"
                control={<Radio size="small" />}
                label="Prescription required"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            select
            size="small"
            label="Sort by"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="relevance">Relevance</MenuItem>
            <MenuItem value="low">Price: low to high</MenuItem>
            <MenuItem value="high">Price: high to low</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setStock("all");
              setPrescription("all");
              setSort("relevance");
            }}
            sx={{ mr: "auto", color: C.muted, textTransform: "none" }}
          >
            Reset
          </Button>
          <Button
            onClick={() => setFilterOpen(false)}
            variant="contained"
            sx={{ bgcolor: C.teal, textTransform: "none" }}
          >
            Apply filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

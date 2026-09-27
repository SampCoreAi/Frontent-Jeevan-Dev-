"use client";

import React from "react";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const medicalStore = {
  store_name: "Vishal Medical Store",
  store_code: "MED-866711",
  phone_number: "9876543210",
  owner_name: "Vishal Sharma",
  email: "vishal@gmail.com",
  status: "ACTIVE",
  created_at: "2026-09-20T10:30:00",

  flat_plot_no: "24",
  building_society: "Green Plaza",
  street_name: "80 Feet Road",
  area_locality: "Koramangala",
  landmark: "Near Forum Mall",
  city: "Bengaluru",
  district: "Bengaluru Urban",
  state: "Karnataka",
  pincode: "560095",
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="center"
      sx={{
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 1.5,
          bgcolor: "#F1F8F6",
          color: "#07876A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,

          "& svg": {
            fontSize: 19,
          },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "11.5px",
            color: "#718096",
            fontWeight: 500,
            lineHeight: 1.3,
            mb: 0.3,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: "12.5px",
            color: "#172033",
            fontWeight: 600,
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >
          {value || "—"}
        </Typography>
      </Box>
    </Stack>
  );
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function MedicalStoreProfile() {
  const store = medicalStore;

  const fullAddress = [
    store.flat_plot_no,
    store.building_society,
    store.street_name,
    store.area_locality,
    store.landmark,
    store.city,
    store.district,
    store.state,
    store.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "white",
        p: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          bgcolor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 2,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            py: 2.2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 1.5,
                  bgcolor: "#EAF7F3",
                  color: "#07876A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LocalPharmacyOutlinedIcon
                  sx={{
                    fontSize: 24,
                  }}
                />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "15px",
                      sm: "17px",
                    },
                    fontWeight: 700,
                    color: "#172033",
                    lineHeight: 1.3,
                  }}
                >
                  {store.store_name}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize: "11.5px",
                    color: "#718096",
                  }}
                >
                  Medical Store Profile
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={store.status}
              size="small"
              sx={{
                height: 27,
                bgcolor:
                  store.status === "ACTIVE"
                    ? "#E7F6F1"
                    : "#FDECEC",
                color:
                  store.status === "ACTIVE"
                    ? "#07876A"
                    : "#D14343",
                fontSize: "10.5px",
                fontWeight: 700,
                borderRadius: 1.2,
                px: 0.7,
              }}
            />
          </Stack>
        </Box>

        <Divider />

        {/* Store Information */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            py: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#172033",
              mb: 2.2,
            }}
          >
            Store Information
          </Typography>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },

              columnGap: {
                sm: 4,
                md: 6,
                lg: 8,
              },

              rowGap: 2.5,
            }}
          >
            <InfoItem
              icon={<BadgeOutlinedIcon />}
              label="Store Code"
              value={store.store_code}
            />

            <InfoItem
              icon={<PersonOutlineOutlinedIcon />}
              label="Owner Name"
              value={store.owner_name}
            />

            <InfoItem
              icon={<PhoneOutlinedIcon />}
              label="Phone Number"
              value={store.phone_number}
            />

            <InfoItem
              icon={<EmailOutlinedIcon />}
              label="Email Address"
              value={store.email}
            />

            <InfoItem
              icon={<CalendarTodayOutlinedIcon />}
              label="Registered On"
              value={formatDate(store.created_at)}
            />
          </Box>
        </Box>

        <Divider />

        {/* Medical Store Address */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            py: 2.5,
          }}
        >
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{
              mb: 2,
            }}
          >
            <LocationOnOutlinedIcon
              sx={{
                fontSize: 18,
                color: "#07876A",
              }}
            />

            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              Medical Store Address
            </Typography>
          </Stack>

          {/* Complete Address */}

          <Box
            sx={{
              width: "100%",
              p: 1.7,
              mb: 2.5,
              bgcolor: "#FAFCFB",
              border: "1px solid #E2E8F0",
              borderRadius: 1.5,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.2,
            }}
          >
            <LocationOnOutlinedIcon
              sx={{
                mt: "2px",
                fontSize: 18,
                color: "#07876A",
                flexShrink: 0,
              }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#718096",
                  fontWeight: 500,
                  mb: 0.4,
                }}
              >
                Complete Address
              </Typography>

              <Typography
                sx={{
                  fontSize: "12.5px",
                  color: "#172033",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                }}
              >
                {fullAddress}
              </Typography>
            </Box>
          </Box>

          {/* Address Details */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },

              columnGap: {
                sm: 4,
                md: 6,
                lg: 8,
              },

              rowGap: 2.5,
            }}
          >
            <InfoItem
              icon={<ApartmentOutlinedIcon />}
              label="Flat / Plot No."
              value={store.flat_plot_no}
            />

            <InfoItem
              icon={<ApartmentOutlinedIcon />}
              label="Building / Society"
              value={store.building_society}
            />

            <InfoItem
              icon={<MapOutlinedIcon />}
              label="Street"
              value={store.street_name}
            />

            <InfoItem
              icon={<LocationOnOutlinedIcon />}
              label="Area / Locality"
              value={store.area_locality}
            />

            <InfoItem
              icon={<LocationOnOutlinedIcon />}
              label="Landmark"
              value={store.landmark}
            />

            <InfoItem
              icon={<LocationOnOutlinedIcon />}
              label="City"
              value={store.city}
            />

            <InfoItem
              icon={<MapOutlinedIcon />}
              label="District"
              value={store.district}
            />

            <InfoItem
              icon={<MapOutlinedIcon />}
              label="State"
              value={store.state}
            />

            <InfoItem
              icon={<LocationOnOutlinedIcon />}
              label="Pincode"
              value={store.pincode}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
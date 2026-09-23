"use client";

import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { SectionTitle } from "../../lab/components/LabUi";

export default function MedicalProfile({ profile }) {
  const status = String(profile?.status || "UNKNOWN").toUpperCase();

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

  const fields = [
    {
      label: "Store Name",
      value: profile?.store_name || profile?.medical_store_name,
      icon: LocalPharmacyOutlinedIcon,
    },
    {
      label: "Store Code",
      value: profile?.store_code || profile?.medical_store_code,
      icon: BadgeOutlinedIcon,
    },
    {
      label: "Phone Number",
      value: profile?.phone_number || profile?.phone,
      icon: PhoneOutlinedIcon,
    },
    {
      label: "Address",
      value: profile?.address,
      icon: LocationOnOutlinedIcon,
    },
    {
      label: "Store Owner",
      value: profile?.full_name || profile?.owner_name || profile?.admin_name,
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
  ];

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

  const statusStyle = getStatusStyle();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
      }}
    >
      <SectionTitle
        title="Medical Store Profile"
        description="View your registered medical store details and account status."
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
              <LocalPharmacyOutlinedIcon sx={{ fontSize: 21 }} />
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
                {profile?.store_name || profile?.medical_store_name || "Medical Store Profile"}
              </Typography>

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: "11px",
                  mt: 0.3,
                }}
              >
                Store code:{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#334155",
                    fontWeight: 600,
                  }}
                >
                  {profile?.store_code || profile?.medical_store_code || "-"}
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
              bgcolor: statusStyle.bgcolor,
              color: statusStyle.color,
              borderColor: statusStyle.borderColor,
              fontSize: "9.5px",
              fontWeight: 700,
              "& .MuiChip-label": {
                px: 1.1,
              },
            }}
          />
        </Stack>

        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            pt: 1.75,
            pb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "12.5px",
              fontWeight: 700,
              color: "#334155",
            }}
          >
            Store Information
          </Typography>

          <Typography
            sx={{
              mt: 0.2,
              fontSize: "10.5px",
              color: "#84959B",
            }}
          >
            Registered medical store and account information
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
                  "&:hover": {
                    bgcolor: "#FAFCFC",
                    borderColor: "#CFE0D9",
                  },
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
    </Box>
  );
}

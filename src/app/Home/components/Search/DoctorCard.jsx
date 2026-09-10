"use client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Rating,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AccessTime,
  LocationOn,
  School,
  FavoriteBorder,
  Share,
  CalendarToday,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function DoctorCard({ doctor }) {
  if (!doctor) return null;
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const primaryColor = "#1e6658";
  const lightGreen = "#e8f5e9";
  const darkGreen = "#2e7d32";
  const borderColor = "#e0e0e0";
  const ratingColor = "#ffa726";
  const textGray = "#666666";
  const nameColor = "#333333";
  const handleShare = async () => {
    try {
      const shareData = {
        title: `Dr. ${doctor.name}`,
        text: `Check out Dr. ${doctor.name} (${doctor.speciality})`,
        url: `${window.location.origin}/doctor/${doctor.userId}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.log("Share cancelled or failed", error);
    }
  };


  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: { xs: 1.5, md: 2 },
        overflow: "hidden",
        border: `1px solid ${borderColor}`,
        transition: "all 0.3s ease",
        backgroundColor: "#ffffff",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          border: `1px solid ${primaryColor}`,
        },
      }}
    >
      <CardContent
        sx={{ p: { xs: 1.5, sm: 2, md: 3 }, "&:last-child": { pb: { xs: 1.5, sm: 2, md: 3 } } }}
      >

        {/* ── TOP SECTION ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 3 },
            alignItems: "flex-start",
          }}
        >

          {/* ── LEFT: Avatar + Info ── */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, md: 3 },
              flex: { md: 1 },
              width: { xs: "100%", md: "auto" },
            }}
          >
            {/* Avatar */}

            <Avatar
              src={doctor?.profileImage || "/img/IconDoctor.png"}
              alt={doctor?.fullName || doctor?.name}
              sx={{
                width: { xs: 70, md: 100 },
                height: { xs: 70, md: 100 },
                border: `3px solid ${lightGreen}`,
                bgcolor: "#f5f5f5",
                flexShrink: 0,
              }}
            />

            {/* Name / Speciality / Rating */}
            <Box sx={{ flex: 1, pt: { md: 0.5 } }}>
              <Typography
                variant="h6"
                sx={{
                  color: nameColor,
                  fontWeight: 600,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  mb: 0.5,
                  lineHeight: 1.2,
                }}
              >
                Dr. {doctor.name}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: primaryColor,
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  mb: 1.5,
                }}
              >
                {doctor.speciality}
              </Typography>

              {/* Rating + Experience */}
              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
                <Rating
                  value={doctor.rating}
                  readOnly
                  size="small"
                  precision={0.1}
                  sx={{
                    fontSize: { xs: "1rem", md: "1.25rem" },
                    "& .MuiRating-iconFilled": { color: ratingColor },
                    "& .MuiRating-iconEmpty": { color: "#e0e0e0" },
                  }}
                />
                <Typography sx={{ fontSize: "0.8rem", color: textGray, fontWeight: 500 }}>
                  ({doctor.rating})
                </Typography>
                <Typography sx={{ fontSize: "0.8rem", color: textGray }}>•</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: textGray, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box component="span" sx={{ fontSize: "0.9rem" }}>⚕️</Box>
                  {doctor.experience}+ yrs
                </Typography>
              </Box>

              {/* ── LOCATION & EDUCATION (PC only, inline with info) ── */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                  mt: 1.5,
                }}
              >
                <LocationOn sx={{ color: textGray, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: textGray, fontSize: "0.9rem" }}>
                  {doctor.hospitalDetail?.[0]
                    ? `${doctor.hospitalDetail[0].areaLocality}, ${doctor.hospitalDetail[0].city}`
                    : "Location not available"}
                </Typography>
                <School sx={{ color: textGray, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: textGray, fontSize: "0.9rem" }}>
                  {doctor.education}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── RIGHT: Price + Availability + Buttons (PC only) ── */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 1.5,
              minWidth: 140,
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: nameColor, fontWeight: 700, fontSize: "1.5rem" }}
            >
              ₹{doctor.fee}
            </Typography>

            {doctor.availability === "Available Today" && (
              <Chip
                icon={<AccessTime sx={{ fontSize: 16, color: darkGreen }} />}
                label="Available Today"
                size="small"
                sx={{
                  bgcolor: lightGreen,
                  color: darkGreen,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 28,
                  borderRadius: 1,
                  "& .MuiChip-icon": { color: darkGreen, marginLeft: "8px" },
                  "& .MuiChip-label": { paddingLeft: "4px", paddingRight: "8px" },
                }}
              />
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>


              <Tooltip title="Share">
                <IconButton
                  onClick={handleShare}
                  size="small"
                  sx={{
                    width: 36,
                    height: 36,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 1,
                    color: textGray,
                    "&:hover": {
                      bgcolor: lightGreen,
                      border: `1px solid ${primaryColor}`,
                      color: primaryColor,
                    },
                  }}
                >
                  <Share fontSize="small" />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<CalendarToday sx={{ fontSize: 18 }} />}
                onClick={() => router.push("/Home/pages/Login")}
                sx={{
                  bgcolor: primaryColor,
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#164d42" },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Box>

          {/* ── RIGHT: Price + Availability (Mobile only, inline with avatar row) ── */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              mt: -1,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "1.25rem", color: primaryColor }}>
              ₹{doctor.fee}
            </Typography>

            {doctor.availability === "Available Today" && (
              <Chip
                icon={<AccessTime sx={{ fontSize: 14 }} />}
                label="Available Today"
                size="small"
                sx={{
                  bgcolor: lightGreen,
                  color: darkGreen,
                  fontWeight: 600,
                  height: 24,
                  fontSize: "0.75rem",
                }}
              />
            )}
          </Box>
        </Box>

        {/* ── LOCATION & EDUCATION (Mobile only, below top section) ── */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            gap: 1,
            mt: 2,
            color: textGray,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: "0.85rem" }}>
              {doctor.hospitalDetail?.[0]
                ? `${doctor.hospitalDetail[0].areaLocality}, ${doctor.hospitalDetail[0].city}`
                : "Location not available"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <School sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: "0.85rem" }}>{doctor.education}</Typography>
          </Box>
        </Box>

        {/* ── BUTTONS (Mobile only) ── */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            gap: 1.5,
            mt: 2.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>

            <Tooltip title="Share">
              <IconButton
                onClick={handleShare}
                size="small"
                sx={{
                  border: `1px solid ${borderColor}`,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <Share fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<CalendarToday />}
            sx={{
              bgcolor: primaryColor,
              textTransform: "none",
              fontWeight: 600,
              py: 0.75,
              fontSize: "0.85rem",
              "&:hover": { bgcolor: "#164d42" },
            }}
          >
            Book Now
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
}
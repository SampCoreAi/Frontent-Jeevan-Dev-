"use client";

import {
  Box,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";

import TuneIcon from "@mui/icons-material/Tune";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";

export default function SearchActions({
  onFilterClick,
  onNearbyClick,
  onEmergencyClick,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: {
          xs: "6px",
          sm: "8px",
        },
        flexShrink: 0,
      }}
    >
      {/* =========================
          FILTER
      ========================= */}

      <Tooltip
        title="Filter doctors by specialization, experience, fee and more"
        placement="bottom"
        arrow
      >
        <Button
          type="button"
          onClick={onFilterClick}
          startIcon={
            <TuneIcon
              sx={{
                fontSize: "18px !important",
              }}
            />
          }
          sx={{
            height: {
              xs: "44px",
              sm: "46px",
            },

            minWidth: {
              xs: "44px",
              sm: "88px",
            },

            px: {
              xs: 0,
              sm: 1.5,
            },

            bgcolor: "secondary.light",
            color: "primary.main",

            border: "1px solid",
            borderColor: "primary.light",

            borderRadius: 1,

            fontSize: "12.5px",
            fontWeight: 600,

            whiteSpace: "nowrap",

            transition: "all 0.2s ease",

            "&:hover": {
              bgcolor: "secondary.light",
              borderColor: "primary.main",
              color: "primary.dark",

              transform: "translateY(-1px)",
            },

            "&:active": {
              transform: "scale(0.97)",
            },

            "& .MuiButton-startIcon": {
              margin: {
                xs: 0,
                sm: "0 6px 0 0",
              },
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            Filters
          </Box>
        </Button>
      </Tooltip>

      {/* =========================
          NEARBY
      ========================= */}

      <Tooltip
        title="Find doctors near your current location"
        placement="bottom"
        arrow
      >
        <Button
          type="button"
          onClick={onNearbyClick}
          startIcon={
            <LocationOnOutlinedIcon
              sx={{
                fontSize: "19px !important",
              }}
            />
          }
          sx={{
            height: {
              xs: "44px",
              sm: "46px",
            },

            minWidth: {
              xs: "44px",
              sm: "92px",
            },

            px: {
              xs: 0,
              sm: 1.5,
            },

            bgcolor: "background.paper",
            color: "primary.main",

            border: "1px solid",
            borderColor: "primary.main",

            borderRadius: 1,

            fontSize: "12.5px",
            fontWeight: 600,

            whiteSpace: "nowrap",

            transition: "all 0.2s ease",

            "&:hover": {
              bgcolor: "secondary.light",
              borderColor: "primary.dark",
              color: "primary.dark",

              transform: "translateY(-1px)",
            },

            "&:active": {
              transform: "scale(0.97)",
            },

            "& .MuiButton-startIcon": {
              margin: {
                xs: 0,
                sm: "0 6px 0 0",
              },
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            Nearby
          </Box>
        </Button>
      </Tooltip>

      {/* =========================
          EMERGENCY
      ========================= */}

      <Tooltip
        placement="bottom"
        arrow
        enterDelay={250}
              title="Find doctors available for emergency care."
      >
        <Button
          type="button"
          onClick={onEmergencyClick}
          startIcon={
            <EmergencyOutlinedIcon
              sx={{
                fontSize: "19px !important",
              }}
            />
          }
          sx={{
            height: {
              xs: "44px",
              sm: "46px",
            },

            minWidth: {
              xs: "44px",
              sm: "105px",
            },

            px: {
              xs: 0,
              sm: 1.5,
            },

            bgcolor: "#FFF5F5",
            color: "#D32F2F",

            border: "1px solid",
            borderColor: "#EF9A9A",

            borderRadius: 1,

            fontSize: "12.5px",
            fontWeight: 600,

            whiteSpace: "nowrap",

            transition: "all 0.2s ease",

            "&:hover": {
              bgcolor: "#FFEBEE",
              borderColor: "#D32F2F",
              color: "#B71C1C",

              transform: "translateY(-1px)",

              boxShadow:
                "0 4px 10px rgba(211,47,47,0.12)",
            },

            "&:active": {
              transform: "scale(0.97)",
            },

            "& .MuiButton-startIcon": {
              margin: {
                xs: 0,
                sm: "0 6px 0 0",
              },

              transition: "transform 0.2s ease",
            },

            "&:hover .MuiButton-startIcon": {
              transform: "scale(1.1)",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            Emergency
          </Box>
        </Button>
      </Tooltip>
    </Box>
  );
}
"use client";

import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

export const TABLE_COLUMNS =
  "minmax(210px, 1.45fr) minmax(220px, 1.5fr) minmax(135px, 0.9fr) 70px 105px 115px 72px";

const getInitials = (name) => {
  if (!name) return "DR";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export default function DoctorRow({
  doctor,
  onMenuOpen,
}) {
  const isActive = doctor?.status === "ACTIVE";
const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

const getDoctorPhoto = (photo) => {
  if (!photo) return "";

  return `${S3_BASE_URL}${photo}`;
};
const doctorPhoto = getDoctorPhoto(doctor?.photo);
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: TABLE_COLUMNS,
        alignItems: "center",
        minHeight: 64,
        bgcolor: "#fff",
        borderBottom: "1px solid #EDF1EF",
        transition: "0.15s",

        "&:last-child": {
          borderBottom: "none",
        },

        "&:hover": {
          bgcolor: "#F8FCFA",
        },
      }}
    >
      {/* Doctor */}

      <Box
        sx={{
          px: 2,
          py: 1.1,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          minWidth: 0,
        }}
      >
        <Avatar
  src={doctorPhoto}
  alt={doctor?.name || "Doctor"}
  sx={{
    width: 38,
    height: 38,
    flexShrink: 0,
    bgcolor: "#E4F5EF",
    color: "#07876A",
    border: "1px solid #CDEBE1",
    fontSize: 11,
    fontWeight: 700,

    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  }}
>
  {getInitials(doctor?.name)}
</Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "text.primary",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {doctor.name || "-"}
          </Typography>

          <Typography
            sx={{
              mt: 0.2,
              fontSize: 10.5,
              color: "text.fourth",
            }}
          >
            ID #{doctor.userId || "-"}
          </Typography>
        </Box>
      </Box>

      {/* Email */}

      <Cell>
        <Typography
          title={doctor.email}
          sx={{
            fontSize: 12,
            color: "text.fourth",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {doctor.email || "-"}
        </Typography>
      </Cell>

      {/* Mobile */}

      <Cell>
        <Typography
          sx={{
            fontSize: 12,
            color: "text.fourth",
          }}
        >
          {doctor.mobile || "-"}
        </Typography>
      </Cell>

      {/* Age */}

      <Cell center>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {doctor.age ?? "-"}
        </Typography>
      </Cell>

      {/* Gender */}

      <Cell>
        <Box
          sx={{
            px: 1,
            py: 0.45,
            bgcolor: "#F4F6F6",
            border: "1px solid #E7EBEA",
            borderRadius: "6px",
            fontSize: 10.5,
            color: "#596575",
            textTransform: "capitalize",
          }}
        >
          {doctor.gender?.toLowerCase() || "-"}
        </Box>
      </Cell>

      {/* Status */}

      <Cell>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            px: 1,
            py: 0.5,

            bgcolor: isActive
              ? "#EAF8F3"
              : "#FFF1F1",

            color: isActive
              ? "#087A61"
              : "#D14343",

            border: isActive
              ? "1px solid #CDEDE2"
              : "1px solid #F5D2D2",

            borderRadius: "20px",

            fontSize: 10.5,
            fontWeight: 600,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: isActive
                ? "#0A9F7D"
                : "#D14343",
            }}
          />

          {isActive
            ? "Active"
            : doctor.status || "Unknown"}
        </Box>
      </Cell>

      {/* Action */}

      <Cell center>
        <IconButton
          onClick={(e) => onMenuOpen(e, doctor)}
          sx={{
            width: 30,
            height: 30,
            border: "1px solid #E3E9E7",
            borderRadius: "7px",
            color: "#697773",

            "&:hover": {
              bgcolor: "#EAF7F2",
              borderColor: "#BFE4D8",
              color: "#07876A",
            },
          }}
        >
          <MoreVertIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Cell>
    </Box>
  );
}

function Cell({ children, center = false }) {
  return (
    <Box
      sx={{
        px: center ? 1 : 2,
        py: 1.1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: center
          ? "center"
          : "flex-start",
      }}
    >
      {children}
    </Box>
  );
}
"use client";

import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

// Helper function to format values
const formatValue = (value) => value || "-";

const RegistrationTableRow = ({
  doctor,
  getStatusColor,
  onViewDocuments,
}) => {
  return (
    <TableRow
      hover
      sx={{
        "&:last-child td": {
          borderBottom: 0,
        },
      }}
    >
      {/* ID */}
      <TableCell>
        <Typography
          sx={{
            fontWeight: 600,
            color: "#475569",
          }}
        >
          #{doctor.id}
        </Typography>
      </TableCell>

      {/* DOCTOR */}
      <TableCell sx={{ minWidth: 180 }}>
        <Typography
          sx={{
            fontWeight: 600,
            color: "#173f38",
          }}
        >
          {formatValue(doctor.full_name)}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.78rem",
            color: "#64748b",
            mt: 0.3,
          }}
        >
          {formatValue(doctor.specialization)}
        </Typography>
      </TableCell>

      {/* GENDER */}
      <TableCell>
        {formatValue(doctor.gender)}
      </TableCell>

      {/* AGE */}
      <TableCell>
        {formatValue(doctor.age)}
      </TableCell>

      {/* CONTACT */}
      <TableCell sx={{ minWidth: 180 }}>
        <Typography sx={{ fontSize: "0.85rem" }}>
          {formatValue(doctor.mobile)}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#64748b",
            mt: 0.3,
          }}
        >
          {formatValue(doctor.email)}
        </Typography>
      </TableCell>

      {/* MEDICAL REGISTRATION */}
      <TableCell sx={{ minWidth: 200 }}>
        <Typography
          sx={{
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {formatValue(doctor.medical_registration_number)}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "#64748b",
            mt: 0.4,
          }}
        >
          {formatValue(doctor.medical_council)}
        </Typography>
      </TableCell>

      {/* QUALIFICATION */}
      <TableCell sx={{ minWidth: 150 }}>
        <Typography sx={{ fontWeight: 600 }}>
          {formatValue(doctor.qualification)}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#64748b",
          }}
        >
          {formatValue(doctor.specialization)}
        </Typography>
      </TableCell>

      {/* STATUS */}
      <TableCell>
        <Chip
          label={formatValue(doctor.onboarding_status)}
          size="small"
          color={getStatusColor(doctor.status)}
        />
      </TableCell>

      {/* 3 DOT MENU */}
      <TableCell align="center">
        <Tooltip title="More">
          <IconButton
            onClick={() => onViewDocuments(doctor)}
            aria-label={`View documents for ${doctor.full_name || 'doctor'}`}
            sx={{
              color: "#475569",
            }}
          >
            <MoreVert />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default RegistrationTableRow;
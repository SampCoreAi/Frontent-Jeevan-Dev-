"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";

import DoctorRow, {
  TABLE_COLUMNS,
} from "./DoctorRow";

import DoctorActionMenu from "./DoctorActionMenu";
import TablePagination from "./TablePagination";

export default function DoctorsTable({
  doctors = [],
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  onView,
  onEdit,
  onAssignQR,        // 👈 YE ADD KARO
  onStatusChange,
}) {
  const [anchorEl, setAnchorEl] =
    useState(null);

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const handleMenuOpen = (event, doctor) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoctor(doctor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoctor(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* TABLE */}

      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #DDE7E3",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 1px 3px rgba(16,24,40,0.03)",
        }}
      >
        {/* HORIZONTAL SCROLL */}

        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",

            "&::-webkit-scrollbar": {
              height: "6px",
            },

            "&::-webkit-scrollbar-track": {
              bgcolor: "#F1F4F3",
            },

            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#BCC9C5",
              borderRadius: "10px",
            },
          }}
        >
          <Box
            sx={{
              width: {
                xs: "1000px",
                lg: "100%",
              },

              minWidth: "1000px",
            }}
          >
            {/* HEADER */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  TABLE_COLUMNS,

                alignItems: "center",

                minHeight: 48,

                bgcolor: "#F6FAF8",

                borderBottom:
                  "1px solid #DDE7E3",
              }}
            >
              <HeaderCell>Doctor</HeaderCell>
              <HeaderCell>Email</HeaderCell>
              <HeaderCell>Mobile</HeaderCell>
              <HeaderCell center>Age</HeaderCell>
              <HeaderCell>Gender</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell center>
                Action
              </HeaderCell>
            </Box>

            {/* ROWS */}

            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <DoctorRow
                  key={doctor.userId}
                  doctor={doctor}
                  onMenuOpen={
                    handleMenuOpen
                  }
                />
              ))
            ) : (
              <Box
                sx={{
                  py: 7,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  No doctors found
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: 11,
                    color: "text.fourth",
                  }}
                >
                  Try changing your search
                  or filters.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* PAGINATION */}

     <TablePagination
  page={page}
  totalPages={totalPages}
  total={total}
  limit={limit}
  count={doctors.length}
  onPageChange={onPageChange}
/>

      {/* ACTION MENU */}

      <DoctorActionMenu
  anchorEl={anchorEl}
  doctor={selectedDoctor}
  onClose={handleMenuClose}
  onView={onView}
  onEdit={onEdit}
  onAssignQR={onAssignQR}   
  onStatusChange={onStatusChange}
/>
    </Box>
  );
}

function HeaderCell({
  children,
  center = false,
}) {
  return (
    <Box
      sx={{
        height: 48,
        px: 2,

        display: "flex",
        alignItems: "center",

        justifyContent: center
          ? "center"
          : "flex-start",

        fontSize: 11.5,
        fontWeight: 600,

        color: "#44534F",

        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}
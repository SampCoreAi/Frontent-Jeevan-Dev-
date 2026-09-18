"use client";

import { Menu, MenuItem } from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";

export default function DoctorActionMenu({
  anchorEl,
  doctor,
  onClose,
  onView,
  onEdit,
  onAssignQR,
  onStatusChange,
}) {
  const isActive = doctor?.status === "ACTIVE";

  const handleView = () => {
    if (!doctor) return;

    onView?.(doctor);
    onClose();
  };

  const handleEdit = () => {
    if (!doctor) return;

    onEdit?.(doctor);
    onClose();
  };

  const handleAssignQR = () => {
      console.log("ASSIGN QR CLICKED:", doctor);
    if (!doctor) return;

    onAssignQR?.(doctor);
    onClose();
  };

  const handleStatus = () => {
    if (!doctor) return;

    onStatusChange?.(doctor);
    onClose();
  };

  const menuStyle = {
    mx: 0.5,
    minHeight: 36,
    px: 1.2,
    gap: 1,
    borderRadius: "6px",
    fontSize: 12,
    fontWeight: 500,

    "&:hover": {
      bgcolor: "#F3F8F6",
    },
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl) && Boolean(doctor)}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 165,
          mt: 0.5,
          p: 0.4,

          borderRadius: "8px",
          border: "1px solid #E3E9E7",

          boxShadow:
            "0 8px 24px rgba(16,24,40,0.10)",
        },
      }}
    >
      {/* VIEW */}

      <MenuItem
        onClick={handleView}
        sx={menuStyle}
      >
        <VisibilityOutlinedIcon
          sx={{ fontSize: 17 }}
        />

        View Details
      </MenuItem>

      {/* EDIT */}

      <MenuItem
        onClick={handleEdit}
        sx={menuStyle}
      >
        <EditOutlinedIcon
          sx={{ fontSize: 17 }}
        />

        Edit Doctor
      </MenuItem>

      {/* ASSIGN QR */}

      <MenuItem
      
        onClick={handleAssignQR}
        sx={{
          ...menuStyle,
          color: "#07876A",

          "&:hover": {
            bgcolor: "#EAF7F2",
          },
        }}
      >
        <QrCode2OutlinedIcon
          sx={{ fontSize: 17 }}
        />

        Assign QR
      </MenuItem>

      {/* ACTIVE / DEACTIVE */}

      <MenuItem
        onClick={handleStatus}
        sx={{
          ...menuStyle,

          color: isActive
            ? "#D14343"
            : "#07876A",

          "&:hover": {
            bgcolor: isActive
              ? "#FFF1F1"
              : "#EAF7F2",
          },
        }}
      >
        {isActive ? (
          <BlockOutlinedIcon
            sx={{ fontSize: 17 }}
          />
        ) : (
          <CheckCircleOutlineIcon
            sx={{ fontSize: 17 }}
          />
        )}

        {isActive
          ? "Deactivate"
          : "Activate"}
      </MenuItem>
    </Menu>
  );
}
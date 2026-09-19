"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const FileGridItem = ({
  file,
  handleFileClick,
  handleDownload,
  removeFile,
  getFileIcon,
  isMobile,
  isTablet,
  hoveredFile,
  setHoveredFile,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  // ================= MENU =================

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) {
      event.stopPropagation();
    }

    setAnchorEl(null);
  };

  const handleDownloadClick = (event) => {
    event.stopPropagation();

    handleDownload(file);

    setAnchorEl(null);
  };

  const handleOpenClick = (event) => {
    event.stopPropagation();

    handleFileClick(file);

    setAnchorEl(null);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();

    setAnchorEl(null);

    setTimeout(() => {
      removeFile(file.id);
    }, 100);
  };

  // ================= DATE =================

  const formattedDate = file.date
    ? new Date(file.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  // ================= UI =================

  return (
    <Paper
      elevation={0}
      onClick={() => handleFileClick(file)}
      onMouseEnter={() => setHoveredFile?.(file.id)}
      onMouseLeave={() => setHoveredFile?.(null)}
      sx={{
        width: "100%",
        height: isMobile ? 140 : isTablet ? 150 : 165,

        p: isMobile ? 1 : isTablet ? 1.25 : 1.5,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        position: "relative",
        boxSizing: "border-box",

        cursor: "pointer",

        bgcolor: "#fff",

        border: "1px solid #e5e7eb",
        borderRadius: 2,

        transition: "all 0.18s ease",

        "&:hover": {
          bgcolor: "#f8fbfa",
          borderColor: "#b8d5ce",
          boxShadow: "0 4px 12px rgba(15, 79, 63, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* ================= 3 DOT MENU ================= */}

      <IconButton
        size="small"
        onClick={handleMenuClick}
        aria-label="file options"
        aria-controls={open ? `file-menu-${file.id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          position: "absolute",

          top: 6,
          right: 6,

          width: 30,
          height: 30,

          color: "#6b7280",

          zIndex: 2,

          "&:hover": {
            bgcolor: "#edf5f2",
            color: "#0f4f3f",
          },
        }}
      >
        <MoreVertIcon
          sx={{
            fontSize: isMobile ? 18 : 20,
          }}
        />
      </IconButton>

      {/* ================= MENU ================= */}

      <Menu
        id={`file-menu-${file.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        MenuListProps={{
          dense: true,
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        sx={{
          "& .MuiPaper-root": {
            mt: 0.5,

            minWidth: 180,

            borderRadius: 2,

            border: "1px solid #e5e7eb",

            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        {/* OPEN */}

        <MenuItem
          onClick={handleOpenClick}
          sx={{
            py: 1,
          }}
        >
          <ListItemIcon>
            <OpenInNewIcon
              fontSize="small"
              sx={{
                color: "#0f4f3f",
              }}
            />
          </ListItemIcon>

          <ListItemText primary="Open" />
        </MenuItem>

        {/* DOWNLOAD */}

        <MenuItem
          onClick={handleDownloadClick}
          sx={{
            py: 1,
          }}
        >
          <ListItemIcon>
            <DownloadIcon
              fontSize="small"
              sx={{
                color: "#0f4f3f",
              }}
            />
          </ListItemIcon>

          <ListItemText primary="Download" />
        </MenuItem>

        <Divider />

        {/* DELETE */}

        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            py: 1,
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon
              fontSize="small"
              sx={{
                color: "#dc2626",
              }}
            />
          </ListItemIcon>

          <ListItemText
            primary="Delete"
            sx={{
              color: "#dc2626",
            }}
          />
        </MenuItem>
      </Menu>

      {/* ================= FILE ICON ================= */}

      <Box
        sx={{
          width: isMobile ? 54 : isTablet ? 60 : 64,
          height: isMobile ? 54 : isTablet ? 60 : 64,

          mt: isMobile ? 0.8 : 1,
          mb: 0.7,

          borderRadius: 2,

          bgcolor: "#f2f8f6",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,
        }}
      >
        {getFileIcon(file)}
      </Box>

      {/* ================= FILE NAME ================= */}

      <Box
        sx={{
          width: "100%",
          minWidth: 0,

          flex: 1,

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",

          px: 0.5,
        }}
      >
        <Tooltip
          title={file.name || ""}
          arrow
          placement="top"
          disableHoverListener={isMobile}
        >
          <Typography
            variant="body2"
            sx={{
              width: "100%",

              fontWeight: 600,

              color: "#1f2937",

              textAlign: "center",

              fontSize: isMobile
                ? "0.72rem"
                : isTablet
                  ? "0.8rem"
                  : "0.85rem",

              lineHeight: 1.3,

              overflow: "hidden",

              textOverflow: "ellipsis",

              display: "-webkit-box",

              WebkitLineClamp: 2,

              WebkitBoxOrient: "vertical",

              wordBreak: "break-word",
            }}
          >
            {file.name || "Unknown file"}
          </Typography>
        </Tooltip>
      </Box>

      {/* ================= SIZE + DATE ================= */}

      <Typography
        variant="caption"
        sx={{
          mt: 0.4,

          width: "100%",

          textAlign: "center",

          color: "#8a9491",

          fontWeight: 400,

          fontSize: isMobile
            ? "0.62rem"
            : isTablet
              ? "0.68rem"
              : "0.72rem",

          lineHeight: 1.3,

          whiteSpace: "nowrap",

          overflow: "hidden",

          textOverflow: "ellipsis",
        }}
      >
        {file.size || "0 MB"} • {formattedDate}
      </Typography>
    </Paper>
  );
};
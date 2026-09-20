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

  return (
    <Paper
      elevation={0}
      onClick={() => handleFileClick(file)}
      onMouseEnter={() => setHoveredFile?.(file.id)}
      onMouseLeave={() => setHoveredFile?.(null)}
      sx={{
        width: "100%",
        height: {
          xs: 138,
          sm: 145,
          md: 152,
        },

        p: {
          xs: 1,
          sm: 1.15,
          md: 1.25,
        },

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        position: "relative",

        boxSizing: "border-box",

        bgcolor: "background.paper",

        border: "1px solid",
        borderColor: "divider",

        borderRadius: "8px",

        cursor: "pointer",

        transition:
          "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",

        "&:hover": {
          borderColor: "primary.light",

          boxShadow:
            "0 3px 10px rgba(0, 0, 0, 0.06)",

          transform: "translateY(-1px)",
        },
      }}
    >
      {/* ================= 3 DOT ================= */}

      <IconButton
        size="small"
        onClick={handleMenuClick}
        aria-label="File options"
        aria-controls={
          open ? `file-menu-${file.id}` : undefined
        }
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          position: "absolute",

          top: 5,
          right: 5,

          width: 27,
          height: 27,

          color: "text.secondary",

          zIndex: 2,

          "&:hover": {
            bgcolor: "action.hover",
            color: "text.primary",
          },
        }}
      >
        <MoreVertIcon
          sx={{
            fontSize: 18,
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
          sx: {
            py: 0.5,
          },
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
            mt: 0.4,

            minWidth: 155,

            borderRadius: "8px",

            border: "1px solid",
            borderColor: "divider",

            boxShadow:
              "0 6px 20px rgba(0,0,0,0.10)",
          },

          "& .MuiMenuItem-root": {
            minHeight: 34,
            py: 0.5,
            px: 1.2,
            fontSize: "13px",
          },

          "& .MuiListItemIcon-root": {
            minWidth: 30,
          },

          "& .MuiListItemText-primary": {
            fontSize: "13px",
          },
        }}
      >
        <MenuItem onClick={handleOpenClick}>
          <ListItemIcon>
            <OpenInNewIcon
              sx={{
                fontSize: 17,
                color: "text.secondary",
              }}
            />
          </ListItemIcon>

          <ListItemText primary="Open" />
        </MenuItem>

        <MenuItem onClick={handleDownloadClick}>
          <ListItemIcon>
            <DownloadIcon
              sx={{
                fontSize: 17,
                color: "text.secondary",
              }}
            />
          </ListItemIcon>

          <ListItemText primary="Download" />
        </MenuItem>

        <Divider sx={{ my: 0.4 }} />

        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteOutlineIcon
              sx={{
                fontSize: 17,
                color: "error.main",
              }}
            />
          </ListItemIcon>

          <ListItemText
            primary="Delete"
            sx={{
              color: "error.main",
            }}
          />
        </MenuItem>
      </Menu>

      {/* ================= FILE ICON ================= */}

      <Box
        sx={{
          width: {
            xs: 48,
            sm: 52,
            md: 54,
          },

          height: {
            xs: 48,
            sm: 52,
            md: 54,
          },

          mt: {
            xs: 0.8,
            md: 1,
          },

          mb: 0.7,

          borderRadius: "10px",

          bgcolor: "secondary.light",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,

          "& svg": {
            fontSize: {
              xs: 27,
              sm: 29,
              md: 30,
            },
          },
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
          alignItems: "center",
          justifyContent: "center",

          px: 0.4,
        }}
      >
        <Tooltip
          title={file.name || ""}
          arrow
          placement="top"
          disableHoverListener={isMobile}
        >
          <Typography
            sx={{
              width: "100%",

              fontSize: "12.5px",

              fontWeight: 600,

              color: "text.primary",

              textAlign: "center",

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
        sx={{
          width: "100%",

          mt: 0.3,

          textAlign: "center",

           fontSize: "12.5px",

          fontWeight: 400,

          color: "text.secondary",

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
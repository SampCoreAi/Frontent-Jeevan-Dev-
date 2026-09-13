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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const FileListItem = ({
  file,
  handleFileClick,
  handleDownload,
  removeFile,
  getSmallFileIcon,
  isMobile,
  isTablet,
  isDesktop,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleDownloadClick = (event) => {
    event.stopPropagation();
    handleDownload(file);
    handleMenuClose();
  };

  const handleOpenClick = (event) => {
    event.stopPropagation();
    handleFileClick(file);
    handleMenuClose();
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    handleMenuClose();
    setTimeout(() => removeFile(file.id), 100);
  };

  return (
    <Paper
  elevation={0}
  onClick={() => handleFileClick(file)}
  sx={{
    display: "flex",
    alignItems: "center",
    width: "100%",
    minHeight: { xs: 64, sm: 68, md: 72 },
    px: { xs: 1.2, sm: 1.5, md: 2 },
    py: 0.8,
    mb: 1,

    border: "1px solid #e5e7eb",
    borderRadius: 2,
    bgcolor: "#fff",
    boxSizing: "border-box",
    cursor: "pointer",

    transition: "all 0.18s ease",

    "&:hover": {
      bgcolor: "#f8fbfa",
      borderColor: "#c7ddd7",
      boxShadow: "0 2px 8px rgba(15, 79, 63, 0.08)",
    },
  }}
>
  {/* FILE TYPE ICON */}
  <Box
    sx={{
      width: { xs: 36, sm: 38, md: 40 },
      height: { xs: 36, sm: 38, md: 40 },
      borderRadius: 2,
      bgcolor: "#edf7f4",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      flexShrink: 0,
      mr: { xs: 1.2, sm: 1.5 },
    }}
  >
    {getSmallFileIcon(file.fileType)}
  </Box>

  {/* FILE INFO */}
  <Box
    sx={{
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
    }}
  >
    <Typography
      title={file.name}
      noWrap
      sx={{
        fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.9rem" },
        fontWeight: 600,
        color: "#1f2937",
        lineHeight: 1.35,
        mb: 0.25,
      }}
    >
      {file.name || "Unknown file"}
    </Typography>

    <Typography
      noWrap
      sx={{
        fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.72rem" },
        fontWeight: 400,
        color: "#8a9491",
        lineHeight: 1.3,
      }}
    >
      {file.size || "0 MB"}

      {file.date && (
        <>
          {" • "}
          {new Date(file.date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </>
      )}
    </Typography>
  </Box>

  {/* ACTIONS */}
  {isDesktop ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.4,
        flexShrink: 0,
        ml: 2,
        p: 0.3,
        borderRadius: 2,
        bgcolor: "#f8faf9",
      }}
    >
      <IconButton
        size="small"
        title="Download"
        onClick={(e) => {
          e.stopPropagation();
          handleDownload(file);
        }}
        sx={{
          width: 34,
          height: 34,
          color: "#0f5c4b",

          "&:hover": {
            bgcolor: "#e5f3ef",
          },
        }}
      >
        <DownloadIcon sx={{ fontSize: 19 }} />
      </IconButton>

      <IconButton
        size="small"
        title="Open"
        onClick={(e) => {
          e.stopPropagation();
          handleFileClick(file);
        }}
        sx={{
          width: 34,
          height: 34,
          color: "#0f5c4b",

          "&:hover": {
            bgcolor: "#e5f3ef",
          },
        }}
      >
        <OpenInNewIcon sx={{ fontSize: 19 }} />
      </IconButton>

      <IconButton
        size="small"
        title="Delete"
        onClick={(e) => {
          e.stopPropagation();
          removeFile(file.id);
        }}
        sx={{
          width: 34,
          height: 34,
          color: "#dc2626",

          "&:hover": {
            bgcolor: "#feecec",
          },
        }}
      >
        <DeleteOutlineIcon sx={{ fontSize: 19 }} />
      </IconButton>
    </Box>
  ) : (
    <>
      <IconButton
        size="small"
        onClick={handleMenuClick}
        sx={{
          width: 34,
          height: 34,
          ml: 1,
          flexShrink: 0,
          color: "#64706c",

          "&:hover": {
            bgcolor: "#edf5f2",
            color: "#0f4f3f",
          },
        }}
      >
        <MoreVertIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <Menu
        id={`list-menu-${file.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
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
        <MenuItem onClick={handleOpenClick} sx={{ py: 1 }}>
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Open" />
        </MenuItem>

        <MenuItem onClick={handleDownloadClick} sx={{ py: 1 }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDeleteClick} sx={{ py: 1 }}>
          <ListItemIcon>
            <DeleteOutlineIcon
              fontSize="small"
              sx={{ color: "#dc2626" }}
            />
          </ListItemIcon>

          <ListItemText
            primary="Delete"
            sx={{ color: "#dc2626" }}
          />
        </MenuItem>
      </Menu>
    </>
  )}
</Paper>
  );
};
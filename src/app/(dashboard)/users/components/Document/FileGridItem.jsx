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
  const [showFullName, setShowFullName] = useState(false);
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
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: isMobile ? 1 : isTablet ? 1.5 : 2,
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        height: isMobile ? 140 : isTablet ? 160 : 180,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#0f4f3f",
          bgcolor: "#fafafa",
          boxShadow: "0 2px 8px rgba(15, 79, 63, 0.1)",
        },
      }}
      onClick={() => handleFileClick(file)}
      onMouseEnter={() => setHoveredFile(file.id)}
      onMouseLeave={() => setHoveredFile(null)}
    >
      <IconButton
        size="small"
        onClick={handleMenuClick}
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          color: "#666",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 1)",
            color: "#0f4f3f",
          },
          padding: "4px",
          minWidth: "auto",
          width: 28,
          height: 28,
          zIndex: 2,
        }}
        aria-label="file options"
        aria-controls={open ? `file-menu-${file.id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreVertIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
      </IconButton>

      <Menu
        id={`file-menu-${file.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        MenuListProps={{
          "aria-labelledby": `file-button-${file.id}`,
          dense: true,
        }}
        transformOrigin={{
          horizontal: isMobile ? "center" : "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: isMobile ? "center" : "right",
          vertical: "bottom",
        }}
        sx={{
          "& .MuiPaper-root": {
            mt: 1,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            borderRadius: 2,
            minWidth: isMobile ? 180 : 200,
            maxWidth: isMobile ? "calc(100vw - 32px)" : "none",
            position: isMobile ? "fixed" : "absolute",
            left: isMobile ? "50%" : "auto",
            transform: isMobile ? "translateX(-50%)" : "none",
            top: isMobile ? "auto" : undefined,
            bottom: isMobile ? "80px" : undefined,
          },
        }}
        disableScrollLock={false}
      >
        <MenuItem
          onClick={handleOpenClick}
          sx={{
            py: 1,
            fontSize: isMobile ? "0.875rem" : "0.875rem",
          }}
        >
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Open"
            sx={{ fontSize: isMobile ? "0.875rem" : "0.875rem" }}
          />
        </MenuItem>
        <MenuItem
          onClick={handleDownloadClick}
          sx={{
            py: 1,
            fontSize: isMobile ? "0.875rem" : "0.875rem",
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Download"
            sx={{ fontSize: isMobile ? "0.875rem" : "0.875rem" }}
          />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            py: 1,
            fontSize: isMobile ? "0.875rem" : "0.875rem",
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" sx={{ color: "#d32f2f" }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            sx={{
              color: "#d32f2f",
              fontSize: isMobile ? "0.875rem" : "0.875rem",
            }}
          />
        </MenuItem>
      </Menu>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: isMobile ? 60 : isTablet ? 70 : 80,
          width: "100%",
          mb: 1,
          mt: 1,
        }}
      >
        {getFileIcon(file)}
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        onMouseEnter={() => setShowFullName(true)}
        onMouseLeave={() => setShowFullName(false)}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            width: "100%",
            fontSize: isMobile ? "0.7rem" : isTablet ? "0.8rem" : "0.875rem",
            lineHeight: 1.3,
            maxHeight: "2.6em",
            wordBreak: "break-word",
          }}
          title={file.name}
        >
          {file.name}
        </Typography>

        {showFullName && !isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 0.5,
              bgcolor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              p: 1,
              borderRadius: 1,
              fontSize: "0.75rem",
              zIndex: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {file.name}
          </Box>
        )}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontSize: isMobile ? "0.6rem" : isTablet ? "0.7rem" : "0.75rem",
          mt: 0.5,
          color:"black"
        }}
      >
        {file.size} • {file.date}
      </Typography>
    </Paper>
  );
};
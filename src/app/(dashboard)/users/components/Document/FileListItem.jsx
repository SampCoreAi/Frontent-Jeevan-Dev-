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
      sx={{
        display: "flex",
        alignItems: "center",
        p: isMobile ? 1 : isTablet ? 1.5 : 2,
        mb: isMobile ? 0.5 : 1,
        border: "2px solid #cecece",
        borderRadius: 1,
        cursor: "pointer",
        width: "100%",
        boxSizing: "border-box",
        "&:hover": {
          bgcolor: "#fafafa",
          borderColor: "#0f4f3f",
          boxShadow: "0 1px 4px rgba(15, 79, 63, 0.1)",
        },
        position: "relative",
      }}
      onClick={() => handleFileClick(file)}
    >
      <Box
        sx={{
          mr: isMobile ? 1 : isTablet ? 1.5 : 2,
          flexShrink: 0,
        }}
      >
        {getSmallFileIcon(file.fileType)}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" ,  }}>
        <Typography
          variant="body1"
          fontWeight={500}
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: isMobile ? "0.8rem" : isTablet ? "0.9rem" : "1rem",
          }}
          title={file.name}
        >
          {file.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: isMobile ? "0.65rem" : isTablet ? "0.7rem" : "0.75rem",
            color:"black"
          }}
        >
          {file.size} • {file.date}
        </Typography>
      </Box>

      {isDesktop ? (
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            gap: isMobile ? 0.25 : 0.5,
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(file);
            }}
            sx={{
              color: "#0f4f3f",
              padding: isMobile ? "2px" : "4px",
              "&:hover": { bgcolor: "#e6f2ef" },
            }}
            title="Download"
          >
            <DownloadIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleFileClick(file);
            }}
            sx={{
              color: "#0f4f3f",
              padding: isMobile ? "2px" : "4px",
              "&:hover": { bgcolor: "#e6f2ef" },
            }}
            title="Open"
          >
            <OpenInNewIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              removeFile(file.id);
            }}
            sx={{
              color: "#d32f2f",
              padding: isMobile ? "2px" : "4px",
              "&:hover": { bgcolor: "#ffebee" },
            }}
            title="Delete"
          >
            <DeleteOutlineIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
      ) : (
        <>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              color: "#666",
              padding: "4px",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
                color: "#0f4f3f",
              },
            }}
            aria-label="file options"
            aria-controls={open ? `list-menu-${file.id}` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            id={`list-menu-${file.id}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
            MenuListProps={{
              "aria-labelledby": `list-button-${file.id}`,
              dense: true,
            }}
            transformOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
            sx={{
              "& .MuiPaper-root": {
                mt: 1,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                borderRadius: 2,
                minWidth: 180,
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
                <DeleteOutlineIcon fontSize="small" sx={{ color: "#d32f2f" }} />
              </ListItemIcon>
              <ListItemText primary="Delete" sx={{ color: "#d32f2f" }} />
            </MenuItem>
          </Menu>
        </>
      )}
    </Paper>
  );
};
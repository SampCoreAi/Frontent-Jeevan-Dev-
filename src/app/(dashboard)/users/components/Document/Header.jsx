"use client";

import { Box, Typography, Button, IconButton } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import MenuIcon from "@mui/icons-material/Menu";

export const Header = ({
  isMobile,
  isTablet,
  drawerOpen,
  setDrawerOpen,
  currentFolderName,
  setOpenUpload,
  viewMode,
  setViewMode,
}) => {
  return (
    <Box
      sx={{
        height: isMobile ? 50 : 56,
        minHeight: isMobile ? 50 : 56,
        borderBottom: "1px solid #898989",
        px: isMobile ? 1.5 : isTablet ? 2 : 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#ffffff",
        flexShrink: 0,
        gap: isMobile ? 1 : 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flex: 1,
          minWidth: 0,
        }}
      >
        {isMobile && (
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 0.5 }}
            size="small"
          >
            <MenuIcon sx={{ color: "#0f4f3f", fontSize: 20 }} />
          </IconButton>
        )}
        <Typography
          fontWeight={600}
          color="#0f4f3f"
          noWrap
          sx={{
            fontSize: isMobile
              ? "0.85rem"
              : isTablet
              ? "0.95rem"
              : "1rem",
            maxWidth: isMobile ? "120px" : isTablet ? "200px" : "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={currentFolderName}
        >
          {currentFolderName}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: isMobile ? 0.5 : 1,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Button
          size={isMobile ? "small" : isTablet ? "medium" : "medium"}
          startIcon={!isMobile && <UploadIcon />}
          variant="contained"
          onClick={() => setOpenUpload(true)}
          sx={{
            bgcolor: "#0f4f3f",
            "&:hover": { bgcolor: "#0c3f33" },
            textTransform: "none",
            fontSize: isMobile
              ? "0.7rem"
              : isTablet
              ? "0.8rem"
              : "0.875rem",
            padding: isMobile
              ? "3px 8px"
              : isTablet
              ? "4px 12px"
              : "6px 16px",
            minWidth: isMobile ? "60px" : "auto",
            whiteSpace: "nowrap",
          }}
        >
          {isMobile ? <UploadIcon sx={{ fontSize: 16 }} /> : "Upload"}
        </Button>

        <IconButton
          size="small"
          onClick={() => setViewMode("grid")}
          sx={{
            bgcolor: viewMode === "grid" ? "#e6f2ef" : "transparent",
            color: viewMode === "grid" ? "#0f4f3f" : "inherit",
            padding: isMobile ? "4px" : "8px",
          }}
        >
          <ViewModuleIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => setViewMode("list")}
          sx={{
            bgcolor: viewMode === "list" ? "#e6f2ef" : "transparent",
            color: viewMode === "list" ? "#0f4f3f" : "inherit",
            padding: isMobile ? "4px" : "8px",
          }}
        >
          <ViewListIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
};
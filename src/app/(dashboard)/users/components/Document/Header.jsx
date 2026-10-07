"use client";

import { Box, Typography, Button, IconButton, InputBase } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export const Header = ({
  isMobile,
  isTablet,
  setDrawerOpen,
  currentFolderName,
  setOpenUpload,
  setUploadSuccess,
  setUploadProgress,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
}) => (
  <Box
    sx={{
      minHeight: isMobile ? 50 : 56,
      px: isMobile ? 1.5 : isTablet ? 2 : 3,
      py: isMobile ? 1 : 0,
      display: "flex",
      alignItems: "center",
      flexWrap: isMobile ? "wrap" : "nowrap",
      gap: 1,
      borderBottom: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      flexShrink: 0,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
      {isMobile && (
        <IconButton
          aria-label="Open folders"
          size="small"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </IconButton>
      )}

      <Typography
        noWrap
        title={currentFolderName}
        sx={{ fontSize: 13, fontWeight: 600 }}
      >
        {currentFolderName}
      </Typography>
    </Box>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.7,
        order: isMobile ? 2 : 0,
        width: isMobile ? "100%" : isTablet ? 180 : 240,
        height: 34,
        px: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "7px",
        "&:focus-within": { borderColor: "primary.main" },
      }}
    >
      <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />

      <InputBase
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search documents..."
        inputProps={{ "aria-label": "Search documents" }}
        sx={{ flex: 1, minWidth: 0, fontSize: 13 }}
      />

      {searchQuery && (
        <IconButton
          aria-label="Clear search"
          size="small"
          onClick={() => setSearchQuery("")}
          sx={{ p: 0.25 }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
      <Button
        aria-label="Upload documents"
        size="small"
        variant="contained"
        startIcon={!isMobile && <UploadIcon />}
        onClick={() => {
          setUploadSuccess?.("");
          setUploadProgress?.(0);
          setOpenUpload(true);
        }}
        sx={{
          minHeight: 34,
          minWidth: isMobile ? 38 : "auto",
          px: isMobile ? 1 : 1.7,
          fontSize: 13,
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "7px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        }}
      >
        {isMobile ? <UploadIcon sx={{ fontSize: 18 }} /> : "Upload"}
      </Button>

      {[
        ["grid", ViewModuleIcon],
        ["list", ViewListIcon],
      ].map(([mode, Icon]) => (
        <IconButton
          key={mode}
          aria-label={`${mode} view`}
          aria-pressed={viewMode === mode}
          size="small"
          onClick={() => setViewMode(mode)}
          sx={{
            width: 34,
            height: 34,
            borderRadius: "7px",
            bgcolor: viewMode === mode ? "secondary.light" : "transparent",
            color: viewMode === mode ? "primary.main" : "text.secondary",
            "&:hover": { bgcolor: "secondary.light", color: "primary.main" },
          }}
        >
          <Icon sx={{ fontSize: 19 }} />
        </IconButton>
      ))}
    </Box>
  </Box>
);
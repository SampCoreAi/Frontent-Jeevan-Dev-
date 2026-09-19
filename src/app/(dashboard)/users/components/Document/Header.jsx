"use client";

import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";

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

  // NEW
  setUploadSuccess,
  setUploadProgress,

  viewMode,
  setViewMode,
}) => {
  // ============================================
  // OPEN UPLOAD DIALOG
  // ============================================

  const handleOpenUpload = () => {
    // Previous upload result clear
    setUploadSuccess?.("");

    // Previous progress clear
    setUploadProgress?.(0);

    // Fresh upload dialog open
    setOpenUpload(true);
  };

  return (
    <Box
      sx={{
        height: isMobile ? 50 : 56,
        minHeight: isMobile ? 50 : 56,

        borderBottom: "1px solid",
        borderColor: "divider",

        px: isMobile ? 1.5 : isTablet ? 2 : 3,

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        bgcolor: "background.paper",

        flexShrink: 0,

        gap: isMobile ? 1 : 2,
      }}
    >
      {/* ============================================
          LEFT SIDE
      ============================================ */}

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
            size="small"
            sx={{
              mr: 0.5,

              width: 30,
              height: 30,

              color: "text.primary",
            }}
          >
            <MenuIcon
              sx={{
                fontSize: 20,
              }}
            />
          </IconButton>
        )}

        <Typography
          noWrap
          title={currentFolderName}
          sx={{
            fontSize: "13px",

            fontWeight: 600,

            color: "text.primary",

            maxWidth: isMobile
              ? "120px"
              : isTablet
              ? "200px"
              : "none",

            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currentFolderName}
        </Typography>
      </Box>

      {/* ============================================
          RIGHT SIDE
      ============================================ */}

      <Box
        sx={{
          display: "flex",

          gap: isMobile ? 0.4 : 0.7,

          alignItems: "center",

          flexShrink: 0,
        }}
      >
        {/* ============================================
            UPLOAD BUTTON
        ============================================ */}

        <Button
          size="small"
          startIcon={!isMobile && <UploadIcon />}
          variant="contained"
          onClick={handleOpenUpload}
          sx={{
            minHeight: 34,

            minWidth: isMobile ? 38 : "auto",

            px: isMobile ? 1 : 1.7,
            py: 0.5,

            bgcolor: "primary.main",

            color: "primary.contrastText",

            textTransform: "none",

            fontSize: "13px",

            fontWeight: 600,

            borderRadius: "7px",

            boxShadow: "none",

            whiteSpace: "nowrap",

            "&:hover": {
              bgcolor: "primary.dark",
              boxShadow: "none",
            },

            "& .MuiButton-startIcon": {
              mr: 0.6,

              "& svg": {
                fontSize: 17,
              },
            },
          }}
        >
          {isMobile ? (
            <UploadIcon
              sx={{
                fontSize: 17,
              }}
            />
          ) : (
            "Upload"
          )}
        </Button>

        {/* ============================================
            GRID VIEW
        ============================================ */}

        <IconButton
          size="small"
          onClick={() => setViewMode("grid")}
          sx={{
            width: 34,
            height: 34,

            borderRadius: "50%",

            bgcolor:
              viewMode === "grid"
                ? "secondary.light"
                : "transparent",

            color:
              viewMode === "grid"
                ? "primary.main"
                : "text.secondary",

            transition: "all 0.2s ease",

            "&:hover": {
              bgcolor: "secondary.light",
              color: "primary.main",
            },
          }}
        >
          <ViewModuleIcon
            sx={{
              fontSize: 19,
            }}
          />
        </IconButton>

        {/* ============================================
            LIST VIEW
        ============================================ */}

        <IconButton
          size="small"
          onClick={() => setViewMode("list")}
          sx={{
            width: 34,
            height: 34,

            borderRadius: "50%",

            bgcolor:
              viewMode === "list"
                ? "secondary.light"
                : "transparent",

            color:
              viewMode === "list"
                ? "primary.main"
                : "text.secondary",

            transition: "all 0.2s ease",

            "&:hover": {
              bgcolor: "secondary.light",
              color: "primary.main",
            },
          }}
        >
          <ViewListIcon
            sx={{
              fontSize: 19,
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};
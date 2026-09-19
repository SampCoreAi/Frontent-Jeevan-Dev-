"use client";

import { Box } from "@mui/material";

export const FileView = ({
  viewMode,
  currentFiles,
  isMobile,
  isTablet,
  isDesktop,
  GridFileItem,
  ListFileItem,
  EmptyState,
  emptyStateProps,
}) => {
  return (
    <Box
      sx={{
        flex: 1,

        p: {
          xs: 1.2,
          sm: 1.5,
          md: 2,
        },

        overflowY: "auto",
        overflowX: "hidden",

        bgcolor: "background.default",

        // ===============================
        // GRID / LIST
        // ===============================

        display:
          viewMode === "grid"
            ? "grid"
            : "block",

        gridTemplateColumns:
          viewMode === "grid"
            ? {
                xs: "repeat(2, minmax(0, 1fr))",

                sm: "repeat(auto-fill, minmax(145px, 1fr))",

                md: "repeat(auto-fill, minmax(155px, 180px))",
              }
            : "none",

        gap:
          viewMode === "grid"
            ? {
                xs: 1,
                sm: 1.2,
                md: 1.5,
              }
            : 0,

        alignContent: "flex-start",

        justifyContent:
          viewMode === "grid"
            ? "start"
            : "stretch",

        // ===============================
        // SCROLLBAR
        // ===============================

        scrollbarWidth: "thin",

        "&::-webkit-scrollbar": {
          width: 5,
        },

        "&::-webkit-scrollbar-track": {
          bgcolor: "transparent",
        },

        "&::-webkit-scrollbar-thumb": {
          bgcolor: "divider",
          borderRadius: 10,
        },
      }}
    >
      {currentFiles.length === 0 ? (
        <EmptyState {...emptyStateProps} />
      ) : viewMode === "grid" ? (
        currentFiles.map((file) => (
          <GridFileItem
            key={file.id}
            file={file}
          />
        ))
      ) : (
        <Box
          sx={{
            width: "100%",

            maxWidth: "100%",

            mx: "auto",
          }}
        >
          {currentFiles.map((file) => (
            <ListFileItem
              key={file.id}
              file={file}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
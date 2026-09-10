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
        p: isMobile ? 1.5 : isTablet ? 2 : 3,
        overflowY: "auto",
        overflowX: "hidden",
        display: viewMode === "grid" ? "grid" : "block",
        gridTemplateColumns:
          viewMode === "grid"
            ? isMobile
              ? "repeat(auto-fill, minmax(120px, 1fr))"
              : isTablet
              ? "repeat(auto-fill, minmax(140px, 1fr))"
              : "repeat(auto-fill, minmax(160px, 1fr))"
            : "none",
        gap: isMobile ? 1 : isTablet ? 1.5 : 2,
        alignContent: "flex-start",
      }}
    >
      {currentFiles.length === 0 ? (
        <EmptyState {...emptyStateProps} />
      ) : viewMode === "grid" ? (
        currentFiles.map((file) => (
          <GridFileItem key={file.id} file={file} />
        ))
      ) : (
        <Box sx={{ width: "100%" }}>
          {currentFiles.map((file) => (
            <ListFileItem key={file.id} file={file} />
          ))}
        </Box>
      )}
    </Box>
  );
};
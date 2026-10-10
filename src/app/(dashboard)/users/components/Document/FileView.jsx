"use client";

import { Box, Button, Typography } from "@mui/material";

export const FileView = ({
  viewMode,
  currentFiles,
  GridFileItem,
  ListFileItem,
  EmptyState,
  emptyStateProps,
  searchQuery = "",
  onOpenFolder,
  highlightedFileId,
}) => {
  const searching = Boolean(searchQuery.trim());
  const grid = viewMode === "grid";
  const Item = grid ? GridFileItem : ListFileItem;

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 1.2, sm: 1.5, md: 2 },
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: "white",
        display: grid ? "grid" : "block",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(auto-fill, minmax(145px, 1fr))",
          md: "repeat(auto-fill, minmax(155px, 180px))",
        },
        gap: { xs: 1, sm: 1.2, md: 1.5 },
        alignContent: "start",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: 5 },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "divider",
          borderRadius: 10,
        },
      }}
    >
      {!currentFiles.length ? (
        <Box sx={{ gridColumn: "1 / -1" }}>
          {searching ? (
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              No matching documents found.
            </Typography>
          ) : (
            <EmptyState {...emptyStateProps} />
          )}
        </Box>
      ) : (
        currentFiles.map((file) => (
          <Box
            key={file.id}
            ref={(node) => {
              if (node && highlightedFileId === file.id && !searching) {
                node.scrollIntoView({ block: "nearest" });
              }
            }}
            sx={{
              minWidth: 0,
              borderRadius: "7px",
              ...(highlightedFileId === file.id && !searching && {
                outline: "2px solid",
                outlineColor: "primary.main",
              }),
            }}
          >
            <Item file={file} />

            {searching && (
              <Button
                size="small"
                onClick={() => onOpenFolder(file)}
                sx={{ fontSize: 12, textTransform: "none" }}
              >
                Open folder
              </Button>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};
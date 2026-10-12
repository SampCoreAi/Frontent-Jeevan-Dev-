"use client";

import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
  Tooltip,
  LinearProgress,
  Popover,
  Button,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const DocumentExplorer = ({
  folders,
  expandedFolders,
  selectedFolder,
  toggleFolder,
  setSelectedFolder,
  setDrawerOpen,
  isMobile,
  onRenameFolder,
  creatingFolder,
  parentForNewFolder,
  newFolderName,
  setNewFolderName,
  folderNameError,
  setFolderNameError,
  saveNewFolder,
  setCreatingFolder,
  setParentForNewFolder,
storage,
storageError,
  removeFolder,
  deleting,
  createFolder,
}) => {
  const [rulesAnchor, setRulesAnchor] = useState(null);
  const findSelectedFolder = (nodes) => {
    for (const node of nodes) {
      if (node.type !== "folder") continue;
      if (node.id === selectedFolder) return node;

      const found = findSelectedFolder(node.children || []);
      if (found) return found;
    }
  };
const storagePercent = storage?.total_bytes > 0
  ? Math.min(100, Math.max(0,
      (storage.used_bytes / storage.total_bytes) * 100,
    ))
  : 0;
  const activeFolder = findSelectedFolder(folders);

  const renderTree = (nodes = [], depth = 0) => {
    return (
      <>
        {nodes.map((node) => {
          if (node.type !== "folder") return null;

          const isExpanded = expandedFolders?.[node.id] || false;
          const isSelected = selectedFolder === node.id;

          return (
            <Box
              key={node.id}
              sx={{
                width: "100%",
              }}
            >
              {/* =================================================
                  FOLDER ROW
              ================================================= */}

              <ListItem
                disableGutters
                onClick={(e) => {
                  e.stopPropagation();

                  toggleFolder(node.id);
                  setSelectedFolder(node.id);

                  if (isMobile) {
                    setDrawerOpen(false);
                  }
                }}
                sx={{
                  minHeight: 38,

                  pl: `${7 + depth * 14}px`,
                  pr: 0.8,
                  py: 0.25,

                  mb: 0.35,

                  position: "relative",

                  cursor: "pointer",

                  borderRadius: "7px",

                  bgcolor: isSelected ? "secondary.light" : "transparent",

                  transition: "background-color 0.18s ease, color 0.18s ease",

                  "&:hover": {
                    bgcolor: isSelected ? "secondary.light" : "action.hover",
                  },

                  ...(isSelected && {
                    "&::before": {
                      content: '""',

                      position: "absolute",

                      left: 0,
                      top: 7,
                      bottom: 7,

                      width: 3,

                      borderRadius: "0 4px 4px 0",

                      bgcolor: "primary.main",
                    },
                  }),
                }}
              >
                {/* =================================================
                    ARROW
                ================================================= */}

                <Box
                  sx={{
                    width: 22,
                    height: 28,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    color: isSelected ? "primary.main" : "text.secondary",
                  }}
                >
                  {isExpanded ? (
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: 18,
                      }}
                    />
                  ) : (
                    <KeyboardArrowRightIcon
                      sx={{
                        fontSize: 18,
                      }}
                    />
                  )}
                </Box>

                {/* =================================================
                    FOLDER ICON
                ================================================= */}

                <Box
                  sx={{
                    width: 25,
                    height: 28,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    mr: 0.6,
                  }}
                >
                  {isExpanded ? (
                    <FolderOpenOutlinedIcon
                      sx={{
                        fontSize: 19,
                        color: "primary.main",
                      }}
                    />
                  ) : (
                    <FolderOutlinedIcon
                      sx={{
                        fontSize: 19,
                        color: "primary.main",
                      }}
                    />
                  )}
                </Box>

                {/* =================================================
                    FOLDER NAME
                ================================================= */}

                <ListItemText
                  sx={{
                    m: 0,
                    minWidth: 0,
                  }}
                  primary={
                    <Typography
                      noWrap
                      title={node.name}
                      sx={{
                        fontSize: "12.5px",
                        lineHeight: 1.35,

                        fontWeight: isSelected ? 600 : 500,

                        color: isSelected ? "text.primary" : "text.primary",

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {node.name}
                    </Typography>
                  }
                />
              </ListItem>

              {/* =================================================
                  CHILDREN
              ================================================= */}

              {node.children && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List
                    dense
                    disablePadding
                    sx={{
                      width: "100%",
                    }}
                  >
                    {/* =============================================
                        CREATE NEW FOLDER INPUT
                    ============================================= */}

                    {creatingFolder && parentForNewFolder === node.id && (
                      <ListItem
                        disableGutters
                        sx={{
                          minHeight: 38,

                          pl: `${44 + depth * 14}px`,

                          pr: 1,
                          py: 0.35,
                        }}
                      >
                        <FolderOutlinedIcon
                          sx={{
                            mr: 0.8,

                            flexShrink: 0,

                            fontSize: 18,

                            color: "primary.main",
                          }}
                        />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            component="input"
                            autoFocus
                            value={newFolderName}
                            placeholder="Folder name or path"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s+/g, "-");

                              setNewFolderName(value);
                              setFolderNameError("");
                            }}
                            onBlur={saveNewFolder}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              e.stopPropagation();

                              if (e.key === "Enter") {
                                saveNewFolder();
                              }

                              if (e.key === "Escape") {
                                setCreatingFolder(false);
                                setParentForNewFolder(null);
                                setNewFolderName("");
                                setFolderNameError("");
                              }
                            }}
                            sx={{
                              width: "100%",
                              minWidth: 0,
                              height: 30,
                              px: 1,
                              boxSizing: "border-box",
                              border: "1px solid",
                              borderColor: folderNameError
                                ? "error.main"
                                : "divider",
                              borderRadius: "6px",
                              outline: "none",
                              fontFamily: "inherit",
                              fontSize: "13px",
                              color: "text.primary",
                              bgcolor: "background.paper",
                              transition:
                                "border-color 0.2s ease, box-shadow 0.2s ease",
                              "&::placeholder": {
                                color: "text.secondary",
                                opacity: 0.7,
                              },
                              "&:hover": { borderColor: "primary.light" },
                              "&:focus": {
                                borderColor: "primary.main",
                                boxShadow: (theme) =>
                                  `0 0 0 2px ${theme.palette.secondary.light}`,
                              },
                            }}
                          />
                          {folderNameError && (
                            <Typography
                              color="error"
                              sx={{ mt: 0.4, fontSize: 11, lineHeight: 1.3 }}
                            >
                              {folderNameError}
                            </Typography>
                          )}
                        </Box>
                      </ListItem>
                    )}

                    {/* =============================================
                        CHILD FOLDERS
                    ============================================= */}

                    {renderTree(node.children, depth + 1)}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </>
    );
  };

  // =====================================================
  // EXPLORER
  // =====================================================

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 250,

        minWidth: isMobile ? "auto" : 250,

        height: "100%",

        display: "flex",
        flexDirection: "column",

        flexShrink: 0,

        bgcolor: "background.paper",

        borderRight: isMobile ? "none" : "1px solid",

        borderColor: "divider",

        fontSize: "13px",
      }}
    >
      {/* =================================================
          EXPLORER HEADER
      ================================================= */}

      <Box
        sx={{
          height: 56,

          px: 1.5,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          flexShrink: 0,

          borderBottom: "1px solid",
          borderColor: "divider",

          bgcolor: "background.paper",
        }}
      >
        {/* TITLE */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            minWidth: 0,
          }}
        >
          <FolderOutlinedIcon
            sx={{
              fontSize: 18,
              color: "primary.main",
            }}
          />

          <Typography
            sx={{
              fontSize: "12.5px",

              fontWeight: 600,

              // EXPLORER BLACK
              color: "text.primary",

              letterSpacing: "0.2px",

              lineHeight: 1,
            }}
          >
            EXPLORER
          </Typography>
        </Box>
       <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, ml: "auto" }}>
  <Tooltip title="Rename selected folder">
    <span>
      <IconButton
        size="small"
        aria-label="Rename selected folder"
        disabled={deleting || !activeFolder || selectedFolder === "root"}
        onClick={() => onRenameFolder(activeFolder)}
        sx={{ color: "text.secondary", borderRadius: "6px" }}
      >
        <EditOutlinedIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </span>
  </Tooltip>

  <Tooltip title="Delete selected folder">
    <span>
      <IconButton
        size="small"
        aria-label="Delete selected folder"
        disabled={deleting || selectedFolder === "root"}
        onClick={removeFolder}
        sx={{
          color: "error.main",
          borderRadius: "6px",
          "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
        }}
      >
        <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </span>
  </Tooltip>

  <Tooltip title="Create Folder" arrow>
    <IconButton
      size="small"
      aria-label="Create folder"
      onClick={(e) => {
        e.stopPropagation();
        createFolder();
      }}
      sx={{
        width: 30,
        height: 30,
        color: "text.primary",
        borderRadius: "6px",
        "&:hover": {
          bgcolor: "secondary.light",
          color: "primary.main",
        },
      }}
    >
      <AddIcon sx={{ fontSize: 20 }} />
    </IconButton>
  </Tooltip>
</Box>
      </Box>

      {/* =================================================
          FOLDER LIST
      ================================================= */}

      <Box
        sx={{
          flex: 1,

          overflowY: "auto",
          overflowX: "hidden",

          px: 0.8,
          py: 0.8,

          bgcolor: "background.paper",

          // Firefox
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",

          // Chrome / Edge / Safari
          "&::-webkit-scrollbar": {
            width: 4,
          },

          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },

          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: 10,
          },

          // scrollbar sirf hover par halka visible
          "&:hover::-webkit-scrollbar-thumb": {
            bgcolor: "divider",
          },
        }}
      >
        <List
          dense
          disablePadding
          sx={{
            width: "100%",
          }}
        >
          {renderTree(folders)}
        </List>
      </Box>

      <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
  <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 1 }}>
    Storage
  </Typography>

  {storageError ? (
    <Typography color="error" sx={{ fontSize: 12 }}>
      {storageError}
    </Typography>
  ) : storage ? (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          {storage.used_mb} MB of {storage.total_mb} MB
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          {storagePercent.toFixed(1)}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={storagePercent}
        color={storagePercent >= 90 ? "error" : "primary"}
        sx={{ height: 5, borderRadius: 3, bgcolor: "action.hover" }}
      />

      <Typography sx={{ mt: 0.8, fontSize: 11.5, color: "text.secondary" }}>
        {storage.remaining_mb} MB available
      </Typography>
    </>
  ) : (
    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
      Loading storage…
    </Typography>
  )}
</Box>
    </Box>
  );
};

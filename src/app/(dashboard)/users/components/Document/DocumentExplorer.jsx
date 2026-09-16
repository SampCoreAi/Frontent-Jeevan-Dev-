"use client";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
} from "@mui/material";

import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const DocumentExplorer = ({
  folders,
  expandedFolders,
  selectedFolder,
  toggleFolder,
  setSelectedFolder,
  setDrawerOpen,
  isMobile,
  creatingFolder,
  parentForNewFolder,
  newFolderName,
  setNewFolderName,
  saveNewFolder,
  setCreatingFolder,
  setParentForNewFolder,
  createFolder,
  removeFolder,
}) => {
  // =========================
  // FOLDER TREE
  // =========================

  const renderTree = (nodes, depth = 0) => {
    return (
      <>
        {nodes.map((node) => {
          const isExpanded = expandedFolders[node.id] || false;
          const isSelected = selectedFolder === node.id;

          if (node.type !== "folder") return null;

          return (
            <Box key={node.id}>
              {/* FOLDER ROW */}
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
                  minHeight: 36,

                  pl: `${8 + depth * 14}px`,
                  pr: 0.8,
                  py: 0.3,
                  mb: 0.2,

                  cursor: "pointer",

                  borderRadius: 1.5,

                  bgcolor: isSelected ? "#e8f4f1" : "transparent",

                  transition: "all 0.15s ease",

                  "&:hover": {
                    bgcolor: isSelected ? "#e1f0ec" : "#f5f8f7",
                  },

                  ...(isSelected && {
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 3,
                      borderRadius: "0 4px 4px 0",
                      bgcolor: "#0f7468",
                    },
                  }),
                }}
              >
                {/* ARROW */}
                <Box
                  sx={{
                    width: 24,
                    height: 28,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    color: "#69736f",
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

                {/* FOLDER */}
                <Box
                  sx={{
                    width: 27,
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
                        fontSize: 20,
                        color: "#e8a92e",
                      }}
                    />
                  ) : (
                    <FolderOutlinedIcon
                      sx={{
                        fontSize: 20,
                        color: "#e8a92e",
                      }}
                    />
                  )}
                </Box>

                {/* NAME */}
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
                        fontSize: "0.8rem",
                        lineHeight: 1.3,

                        fontWeight: isSelected ? 600 : 500,

                        color: isSelected ? "#0f4f3f" : "#37413e",

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {node.name}
                    </Typography>
                  }
                />
              </ListItem>

              {/* CHILDREN */}
              {node.children && (
                <Collapse
                  in={isExpanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    dense
                    disablePadding
                    sx={{
                      width: "100%",
                    }}
                  >
                    {/* CREATE NEW FOLDER INPUT */}
                    {creatingFolder &&
                      parentForNewFolder === node.id && (
                        <ListItem
                          disableGutters
                          sx={{
                            minHeight: 36,
                            pl: `${46 + depth * 14}px`,
                            pr: 1,
                            py: 0.4,
                          }}
                        >
                          <FolderOutlinedIcon
                            sx={{
                              mr: 0.8,
                              flexShrink: 0,
                              fontSize: 19,
                              color: "#e8a92e",
                            }}
                          />

                          <Box
                            component="input"
                            autoFocus
                            value={newFolderName}
                            placeholder="Folder name"
                            onChange={(e) =>
                              setNewFolderName(e.target.value)
                            }
                            onBlur={saveNewFolder}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveNewFolder();
                              }

                              if (e.key === "Escape") {
                                setCreatingFolder(false);
                                setParentForNewFolder(null);
                              }
                            }}
                            sx={{
                              width: "100%",
                              minWidth: 0,

                              height: 28,

                              px: 1,

                              boxSizing: "border-box",

                              border: "1px solid #b7c8c3",
                              borderRadius: 1,

                              outline: "none",

                              fontSize: "0.78rem",

                              color: "#26332f",

                              bgcolor: "#fff",

                              "&:focus": {
                                borderColor: "#0f7468",
                                boxShadow:
                                  "0 0 0 2px rgba(15,116,104,0.08)",
                              },
                            }}
                          />
                        </ListItem>
                      )}

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

  // =========================
  // EXPLORER
  // =========================

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 260,
        minWidth: isMobile ? "auto" : 260,

        height: "100%",

        display: "flex",
        flexDirection: "column",

        flexShrink: 0,

        bgcolor: "#fff",

        borderRight: isMobile
          ? "none"
          : "1px solid #898989",
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          height: 56,

          px: 1.5,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          flexShrink: 0,

          borderBottom: "1px solid #898989",

          bgcolor: "#fff",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.78rem",
            fontWeight: 700,

            color: "#0f4f3f",

            letterSpacing: "0.5px",
          }}
        >
          EXPLORER
        </Typography>

        {/* HEADER ACTIONS */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.3,
          }}
        >
          {/* CREATE FOLDER */}

          <IconButton
            size="small"
            onClick={createFolder}
            title="Create Folder"
            sx={{
              width: 32,
              height: 32,

              color: "#0f4f3f",

              "&:hover": {
                bgcolor: "#e8f4f1",
              },
            }}
          >
            <AddIcon
              sx={{
                fontSize: 19,
              }}
            />
          </IconButton>

          
        </Box>
      </Box>

      {/* ================= FOLDER LIST ================= */}

      <Box
        sx={{
          flex: 1,

          overflowY: "auto",
          overflowX: "hidden",

          px: 0.8,
          py: 1,

          // cleaner scrollbar
          "&::-webkit-scrollbar": {
            width: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#d5ddda",
            borderRadius: 10,
          },

          "&::-webkit-scrollbar-thumb:hover": {
            bgcolor: "#b7c5c1",
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
    </Box>
  );
};
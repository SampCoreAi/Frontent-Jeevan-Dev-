"use client";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
  Tooltip,
} from "@mui/material";

import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";

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
}) => {
  // =====================================================
  // FOLDER TREE
  // =====================================================

  const renderTree = (nodes = [], depth = 0) => {
    return (
      <>
        {nodes.map((node) => {
          if (node.type !== "folder") return null;

          const isExpanded =
            expandedFolders?.[node.id] || false;

          const isSelected =
            selectedFolder === node.id;

          return (
            <Box
              key={node.id}
              sx={{
                width: "100%",
              }}
            >
              {/* =========================================
                  FOLDER ROW
              ========================================== */}

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

                  pl: `${8 + depth * 14}px`,
                  pr: 0.8,
                  py: 0.35,

                  mb: 0.3,

                  position: "relative",

                  cursor: "pointer",

                  borderRadius: 1,

                  bgcolor: isSelected
                    ? "secondary.light"
                    : "transparent",

                  transition:
                    "background-color 0.18s ease, color 0.18s ease",

                  "&:hover": {
                    bgcolor: isSelected
                      ? "secondary.light"
                      : "action.hover",
                  },

                  ...(isSelected && {
                    "&::before": {
                      content: '""',

                      position: "absolute",

                      left: 0,
                      top: 6,
                      bottom: 6,

                      width: 3,

                      borderRadius:
                        "0 4px 4px 0",

                      bgcolor: "primary.main",
                    },
                  }),
                }}
              >
                {/* =====================================
                    ARROW
                ====================================== */}

                <Box
                  sx={{
                    width: 24,
                    height: 28,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    color: isSelected
                      ? "primary.main"
                      : "text.disabled",
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

                {/* =====================================
                    FOLDER ICON
                ====================================== */}

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

                        // Folder icon ko yellow hi rakha
                        // natural folder feel ke liye
                        color: "warning.main",
                      }}
                    />
                  ) : (
                    <FolderOutlinedIcon
                      sx={{
                        fontSize: 20,
                        color: "warning.main",
                      }}
                    />
                  )}
                </Box>

                {/* =====================================
                    FOLDER NAME
                ====================================== */}

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

                        fontWeight: isSelected
                          ? 600
                          : 500,

                        color: isSelected
                          ? "primary.dark"
                          : "text.primary",

                        overflow: "hidden",

                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {node.name}
                    </Typography>
                  }
                />
              </ListItem>

              {/* =========================================
                  CHILDREN
              ========================================== */}

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
                    {/* =================================
                        CREATE NEW FOLDER INPUT
                    ================================== */}

                    {creatingFolder &&
                      parentForNewFolder ===
                        node.id && (
                        <ListItem
                          disableGutters
                          sx={{
                            minHeight: 38,

                            pl: `${
                              46 +
                              depth * 14
                            }px`,

                            pr: 1,
                            py: 0.45,
                          }}
                        >
                          {/* Folder Icon */}

                          <FolderOutlinedIcon
                            sx={{
                              mr: 0.8,

                              flexShrink: 0,

                              fontSize: 19,

                              color:
                                "warning.main",
                            }}
                          />

                          {/* Input */}

                          <Box
                            component="input"
                            autoFocus
                            value={
                              newFolderName
                            }
                            placeholder="Folder name"
                            onChange={(e) =>
                              setNewFolderName(
                                e.target.value
                              )
                            }
                            onBlur={
                              saveNewFolder
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            onKeyDown={(e) => {
                              e.stopPropagation();

                              if (
                                e.key === "Enter"
                              ) {
                                saveNewFolder();
                              }

                              if (
                                e.key === "Escape"
                              ) {
                                setCreatingFolder(
                                  false
                                );

                                setParentForNewFolder(
                                  null
                                );

                                setNewFolderName(
                                  ""
                                );
                              }
                            }}
                            sx={{
                              width: "100%",

                              minWidth: 0,

                              height: 30,

                              px: 1,

                              boxSizing:
                                "border-box",

                              border:
                                "1px solid",

                              borderColor:
                                "divider",

                              borderRadius: 1,

                              outline: "none",

                              fontFamily:
                                "inherit",

                              fontSize:
                                "0.78rem",

                              color:
                                "text.primary",

                              bgcolor:
                                "background.paper",

                              transition:
                                "all 0.2s ease",

                              "&::placeholder": {
                                color:
                                  "text.disabled",
                                opacity: 1,
                              },

                              "&:hover": {
                                borderColor:
                                  "primary.light",
                              },

                              "&:focus": {
                                borderColor:
                                  "primary.main",

                                boxShadow: (
                                  theme
                                ) =>
                                  `0 0 0 3px ${theme.palette.secondary.light}`,
                              },
                            }}
                          />
                        </ListItem>
                      )}

                    {/* CHILD FOLDERS */}

                    {renderTree(
                      node.children,
                      depth + 1
                    )}
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
        width: isMobile
          ? "100%"
          : 260,

        minWidth: isMobile
          ? "auto"
          : 260,

        height: "100%",

        display: "flex",

        flexDirection: "column",

        flexShrink: 0,

        bgcolor:
          "background.paper",

        borderRight: isMobile
          ? "none"
          : "1px solid",

        borderColor: "divider",
      }}
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <Box
        sx={{
          height: 56,

          px: 1.5,

          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          flexShrink: 0,

          borderBottom:
            "1px solid",

          borderColor: "divider",

          bgcolor:
            "background.paper",
        }}
      >
        {/* TITLE */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            gap: 0.8,
          }}
        >
          <FolderOutlinedIcon
            sx={{
              fontSize: 18,

              color:
                "primary.main",
            }}
          />

          <Typography
            sx={{
              fontSize:
                "0.78rem",

              fontWeight: 700,

              color:
                "primary.dark",

              letterSpacing:
                "0.5px",
            }}
          >
            EXPLORER
          </Typography>
        </Box>

        {/* =============================================
            HEADER ACTION
        ============================================== */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 0.3,
          }}
        >
          <Tooltip
            title="Create Folder"
            arrow
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                createFolder();
              }}
              sx={{
                width: 32,
                height: 32,

                color:
                  "primary.main",

                borderRadius: 1,

                transition:
                  "all 0.2s ease",

                "&:hover": {
                  bgcolor:
                    "secondary.light",

                  color:
                    "primary.dark",
                },
              }}
            >
              <AddIcon
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* =================================================
          FOLDER LIST
      ================================================== */}

      <Box
        sx={{
          flex: 1,

          overflowY: "auto",

          overflowX: "hidden",

          px: 0.8,

          py: 1,

          bgcolor:
            "background.paper",

          // Scrollbar

          "&::-webkit-scrollbar":
            {
              width: 5,
            },

          "&::-webkit-scrollbar-track":
            {
              bgcolor:
                "transparent",
            },

          "&::-webkit-scrollbar-thumb":
            {
              bgcolor: "divider",

              borderRadius: 10,
            },

          "&::-webkit-scrollbar-thumb:hover":
            {
              bgcolor:
                "text.disabled",
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
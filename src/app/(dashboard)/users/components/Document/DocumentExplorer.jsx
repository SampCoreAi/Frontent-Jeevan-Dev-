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

                    color: isSelected
                      ? "primary.main"
                      : "text.secondary",
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

                        color: isSelected
                          ? "text.primary"
                          : "text.primary",

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
                    {/* =============================================
                        CREATE NEW FOLDER INPUT
                    ============================================= */}

                    {creatingFolder &&
                      parentForNewFolder === node.id && (
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

                          <Box
                            component="input"
                            autoFocus
                            value={newFolderName}
                            placeholder="Folder name"
                            onChange={(e) =>
                              setNewFolderName(
                                e.target.value
                              )
                            }
                            onBlur={saveNewFolder}
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            onKeyDown={(e) => {
                              e.stopPropagation();

                              if (e.key === "Enter") {
                                saveNewFolder();
                              }

                              if (e.key === "Escape") {
                                setCreatingFolder(false);

                                setParentForNewFolder(
                                  null
                                );

                                setNewFolderName("");
                              }
                            }}
                            sx={{
                              width: "100%",
                              minWidth: 0,

                              height: 30,

                              px: 1,

                              boxSizing: "border-box",

                              border: "1px solid",
                              borderColor: "divider",

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

                              "&:hover": {
                                borderColor:
                                  "primary.light",
                              },

                              "&:focus": {
                                borderColor:
                                  "primary.main",

                                boxShadow: (theme) =>
                                  `0 0 0 2px ${theme.palette.secondary.light}`,
                              },
                            }}
                          />
                        </ListItem>
                      )}

                    {/* =============================================
                        CHILD FOLDERS
                    ============================================= */}

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
        width: isMobile ? "100%" : 250,

        minWidth: isMobile ? "auto" : 250,

        height: "100%",

        display: "flex",
        flexDirection: "column",

        flexShrink: 0,

        bgcolor: "background.paper",

        borderRight: isMobile
          ? "none"
          : "1px solid",

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

        {/* =================================================
            CREATE FOLDER BUTTON
        ================================================= */}

        <Tooltip title="Create Folder" arrow>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              createFolder();
            }}
            sx={{
              width: 30,
              height: 30,

              color: "text.primary",

              borderRadius: "6px",

              transition:
                "background-color 0.18s ease, color 0.18s ease",

              "&:hover": {
                bgcolor: "secondary.light",
                color: "primary.main",
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
    </Box>
  );
};
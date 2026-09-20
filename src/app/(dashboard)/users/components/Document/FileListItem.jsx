"use client";

import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const FileListItem = ({
  file,
  handleFileClick,
  handleDownload,
  removeFile,
  getSmallFileIcon,
  isMobile,
  isTablet,
  isDesktop,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  // ================= MENU =================

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) {
      event.stopPropagation();
    }

    setAnchorEl(null);
  };

  const handleDownloadClick = (event) => {
    event.stopPropagation();

    handleDownload(file);

    handleMenuClose();
  };

  const handleOpenClick = (event) => {
    event.stopPropagation();

    handleFileClick(file);

    handleMenuClose();
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();

    handleMenuClose();

    setTimeout(() => {
      removeFile(file.id);
    }, 100);
  };

  return (
    <Paper
      elevation={0}
      onClick={() => handleFileClick(file)}
      sx={{
        display: "flex",
        alignItems: "center",

        width: "100%",

        minHeight: {
          xs: 58,
          sm: 60,
          md: 62,
        },

        px: {
          xs: 1,
          sm: 1.3,
          md: 1.5,
        },

        py: 0.65,

        mb: 0.7,

        border: "1px solid",
        borderColor: "divider",

        borderRadius: "8px",

        bgcolor: "background.paper",

        boxSizing: "border-box",

        cursor: "pointer",

        transition:
          "border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease",

        "&:hover": {
          bgcolor: "background.default",

          borderColor: "primary.light",

          boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* ================= FILE ICON ================= */}

      <Box
        sx={{
          width: {
            xs: 36,
            sm: 38,
            md: 40,
          },

          height: {
            xs: 36,
            sm: 38,
            md: 40,
          },

          borderRadius: "8px",

          bgcolor: "secondary.light",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,

          mr: {
            xs: 1.1,
            sm: 1.3,
          },

          "& svg": {
            fontSize: {
              xs: 21,
              sm: 22,
            },
          },
        }}
      >
        {getSmallFileIcon(file.fileType)}
      </Box>

      {/* ================= FILE INFO ================= */}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Typography
          title={file.name}
          noWrap
          sx={{
            fontSize: "12.5px",
            fontWeight: 600,

            color: "text.primary",

            lineHeight: 1.35,

            mb: 0.25,
          }}
        >
          {file.name || "Unknown file"}
        </Typography>

        <Typography
          noWrap
          sx={{
            fontSize: "11px",

            fontWeight: 400,

            color: "text.secondary",

            lineHeight: 1.3,
          }}
        >
          {file.size || "0 MB"}

          {file.date && (
            <>
              {" • "}

              {new Date(file.date).toLocaleString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </>
          )}
        </Typography>
      </Box>

      {/* ================= DESKTOP ACTIONS ================= */}

      {isDesktop ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            gap: 0.2,

            flexShrink: 0,

            ml: 1.5,
          }}
        >
          {/* DOWNLOAD */}

          <IconButton
            size="small"
            title="Download"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(file);
            }}
            sx={{
              width: 31,
              height: 31,

              color: "text.secondary",

              "&:hover": {
                bgcolor: "secondary.light",
                color: "primary.main",
              },
            }}
          >
            <DownloadIcon
              sx={{
                fontSize: 17,
              }}
            />
          </IconButton>

          {/* OPEN */}

          <IconButton
            size="small"
            title="Open"
            onClick={(e) => {
              e.stopPropagation();
              handleFileClick(file);
            }}
            sx={{
              width: 31,
              height: 31,

              color: "text.secondary",

              "&:hover": {
                bgcolor: "secondary.light",
                color: "primary.main",
              },
            }}
          >
            <OpenInNewIcon
              sx={{
                fontSize: 17,
              }}
            />
          </IconButton>

          {/* DELETE */}

          <IconButton
            size="small"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              removeFile(file.id);
            }}
            sx={{
              width: 31,
              height: 31,

              color: "error.main",

              "&:hover": {
                bgcolor: "error.light",
              },
            }}
          >
            <DeleteOutlineIcon
              sx={{
                fontSize: 17,
              }}
            />
          </IconButton>
        </Box>
      ) : (
        <>
          {/* MOBILE / TABLET MENU */}

          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              width: 31,
              height: 31,

              ml: 0.5,

              flexShrink: 0,

              color: "text.secondary",

              "&:hover": {
                bgcolor: "action.hover",
                color: "text.primary",
              },
            }}
          >
            <MoreVertIcon
              sx={{
                fontSize: 19,
              }}
            />
          </IconButton>

          <Menu
            id={`list-menu-${file.id}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={(e) =>
              e.stopPropagation()
            }
            MenuListProps={{
              dense: true,
              sx: {
                py: 0.5,
              },
            }}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
            transformOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            sx={{
              "& .MuiPaper-root": {
                mt: 0.4,

                minWidth: 155,

                borderRadius: "8px",

                border: "1px solid",
                borderColor: "divider",

                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.10)",
              },

              "& .MuiMenuItem-root": {
                minHeight: 34,
                py: 0.5,
                px: 1.2,
              },

              "& .MuiListItemIcon-root": {
                minWidth: 30,
              },

              "& .MuiListItemText-primary": {
                fontSize: "13px",
              },
            }}
          >
            <MenuItem
              onClick={handleOpenClick}
            >
              <ListItemIcon>
                <OpenInNewIcon
                  sx={{
                    fontSize: 17,
                    color: "text.secondary",
                  }}
                />
              </ListItemIcon>

              <ListItemText primary="Open" />
            </MenuItem>

            <MenuItem
              onClick={handleDownloadClick}
            >
              <ListItemIcon>
                <DownloadIcon
                  sx={{
                    fontSize: 17,
                    color: "text.secondary",
                  }}
                />
              </ListItemIcon>

              <ListItemText primary="Download" />
            </MenuItem>

            <Divider sx={{ my: 0.4 }} />

            <MenuItem
              onClick={handleDeleteClick}
            >
              <ListItemIcon>
                <DeleteOutlineIcon
                  sx={{
                    fontSize: 17,
                    color: "error.main",
                  }}
                />
              </ListItemIcon>

              <ListItemText
                primary="Delete"
                sx={{
                  color: "error.main",
                }}
              />
            </MenuItem>
          </Menu>
        </>
      )}
    </Paper>
  );
};
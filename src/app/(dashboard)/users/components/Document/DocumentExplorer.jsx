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
import DeleteIcon from "@mui/icons-material/Delete";

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
  const renderTree = (nodes, depth = 0) => {
    return (
      <>
        {nodes.map((node) => {
          const isExpanded = expandedFolders[node.id] || false;
          const isSelected = selectedFolder === node.id;

          if (node.type === "folder") {
            return (
              <Box key={node.id}>
                <ListItem
                  sx={{
                    pl: depth * 2 + 2,
                    cursor: "pointer",
                    borderRadius: 1,
                    bgcolor: isSelected ? "#e6f2ef" : "transparent",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(node.id);
                    setSelectedFolder(node.id);
                    if (isMobile) {
                      setDrawerOpen(false);
                    }
                  }}
                >
                  <IconButton size="small" sx={{ mr: 0.5, p: 0.5 }}>
                    {isExpanded ? (
                      <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />
                    )}
                  </IconButton>

                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {isExpanded ? (
                          <FolderOpenOutlinedIcon
                            fontSize="small"
                            sx={{ color: "#f8c159" }}
                          />
                        ) : (
                          <FolderOutlinedIcon
                            fontSize="small"
                            sx={{ color: "#f8c159" }}
                          />
                        )}
                        <Typography fontSize={13}>{node.name}</Typography>
                      </Box>
                    }
                  />
                </ListItem>

                {node.children && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List dense sx={{ p: 0 }}>
                      {creatingFolder && parentForNewFolder === node.id && (
                        <ListItem sx={{ pl: depth * 2 + 4 }}>
                          <FolderOutlinedIcon sx={{ mr: 1, color: "#f8c159" }} />
                          <input
                            autoFocus
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onBlur={saveNewFolder}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveNewFolder();
                              if (e.key === "Escape") {
                                setCreatingFolder(false);
                                setParentForNewFolder(null);
                              }
                            }}
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: 4,
                              padding: "2px 6px",
                              fontSize: 13,
                              width: "100%",
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
          }

          return null;
        })}
      </>
    );
  };

  const ExplorerContent = () => (
    <Box
      sx={{
        width: isMobile ? "100%" : 260,
        minWidth: isMobile ? "auto" : 260,
        borderRight: isMobile ? "none" : "1px solid #1e6658",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          p: isMobile ? 1.5 : 1.75,
          borderBottom: "1px solid #1e6658",
          bgcolor: "#ffffff",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontSize={isMobile ? 13 : 14} fontWeight={600} color="#0f4f3f">
          EXPLORER
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton size="small" onClick={createFolder} title="Create Folder">
            <AddIcon sx={{ fontSize: 18, color: "#0f4f3f" }} />
          </IconButton>

          <IconButton
            size="small"
            onClick={removeFolder}
            disabled={selectedFolder === "Document" || selectedFolder === "root"}
            title="Delete Folder"
          >
            <DeleteIcon
              sx={{
                fontSize: 18,
                color:
                  selectedFolder === "Document" || selectedFolder === "root"
                    ? "#ccc"
                    : "#d32f2f",
              }}
            />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: isMobile ? 1.5 : 2,
        }}
      >
        <List dense sx={{ p: 0, width: "100%" }}>
          {renderTree(folders)}
        </List>
      </Box>
    </Box>
  );

  return <ExplorerContent />;
};
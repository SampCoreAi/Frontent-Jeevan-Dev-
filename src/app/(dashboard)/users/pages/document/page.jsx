"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config/api";

import {
  Dialog,
  Typography, Box, Paper, Drawer, IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, useMediaQuery } from "@mui/material";
import { DocumentExplorer } from "../../components/Document/DocumentExplorer";
import { FileGridItem } from "../../components/Document/FileGridItem";
import { FileListItem } from "../../components/Document/FileListItem";
import { UploadDialog } from "../../components/Document/UploadDialog";
import { PdfViewerModal } from "../../components/Document/PdfViewerModal";
import { ImageViewerModal } from "../../components/Document/ImageViewerModal";
import { EmptyState } from "../../components/Document/EmptyState";
import { Header } from "../../components/Document/Header";
import { FileView } from "../../components/Document/FileView";

import {
  getFileIcon,
  getSmallFileIcon,
} from "../../components/Document/FileIcons";

export default function DocumentPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [folders, setFolders] = useState([
    {
      id: "root",
      name: "Document",
      type: "folder",
      children: [],
    },
  ]);

  const [allFiles, setAllFiles] = useState([]);

  const [selectedFolder, setSelectedFolder] = useState("root");

  const [openUpload, setOpenUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [selectedFile, setSelectedFile] = useState(null);
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});

  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [parentForNewFolder, setParentForNewFolder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredFile, setHoveredFile] = useState(null);

  useEffect(() => {
    if (!isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile, drawerOpen]);

  const fetchFiles = async () => {

    const token = localStorage.getItem("token");


    if (!token) {
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/licenseFile/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const filesData = response.data.data;
        const rootFolder = {
          id: "root",
          name: "Document",
          type: "folder",
          children: [],
        };

        const foldersMap = {
          "root": rootFolder
        };

        // Helper to find or create a folder in the tree
        // pathParts: ["Adi Hospital", "Reports"]
        // parentId: "root"
        const findOrCreatePath = (pathParts, parentId) => {
          let currentParentId = parentId;

          for (const part of pathParts) {
            if (!part) continue;

            const currentParent = foldersMap[currentParentId];
            if (!currentParent) break;

            let foundFolder = currentParent.children.find(child => child.type === 'folder' && child.name.toLowerCase() === part.toLowerCase());

            if (!foundFolder) {
            const newFolderId = `${currentParentId}/${part}`;
              foundFolder = {
                id: newFolderId,
                name: part,
                type: "folder",
                children: []
              };
              currentParent.children.push(foundFolder);

            }

            currentParentId = foundFolder.id;
            foldersMap[currentParentId] = foundFolder;
          }
          return currentParentId;
        };

        const mappedFiles = filesData.map((file) => {
          let dbFolder = file.folderName || "";

          dbFolder = dbFolder.replace(/\\/g, "/");

          const parts = dbFolder.split("/").filter(Boolean);

          // "Document" root already frontend me bana hua hai
          if (parts[0]?.toLowerCase() === "document") {
            parts.shift();
          }

          const targetFolderId = findOrCreatePath(parts, "root");
          const fileKey = file.fileUrl?.split("?")[0];

          const extension = fileKey
            ?.split(".")
            .pop()
            ?.toLowerCase();

          const S3_BUCKET_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

          const fileObj = {
            id: file.id,

            name: file.originalName || "Unknown file",

            size: file.fileSize || "0 MB",

            type:
              extension === "pdf"
                ? "application/pdf"
                : ["jpg", "jpeg", "png", "webp"].includes(extension)
                  ? "image"
                  : "file",

            fileType: extension,

            folderId: targetFolderId,

            url: `${S3_BUCKET_URL}${file.fileUrl}`,

            date: file.createdAt || "-",
          };



          if (foldersMap[targetFolderId]) {
            foldersMap[targetFolderId].children.push({
              id: fileObj.id,
              name: fileObj.name,
              type: "file",
              fileType: fileObj.fileType,
              folderId: targetFolderId,
            });
          }

          return fileObj;
        });


        setFolders([rootFolder]);
        setAllFiles(mappedFiles);
      } else {
        console.warn("Response success was false:", response.data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ================= HANDLERS =================
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };
const createFolder = () => {
  const parentId = selectedFolder || "root";

  // Parent folder automatically open karo
  setExpandedFolders((prev) => ({
    ...prev,
    [parentId]: true,
  }));

  // Create folder input show karo
  setParentForNewFolder(parentId);
  setNewFolderName("");
  setCreatingFolder(true);
};

  const saveNewFolder = () => {
    if (!newFolderName.trim()) {
      setCreatingFolder(false);
      setParentForNewFolder(null);
      return;
    }

    const newFolder = {
      id: `folder_${Date.now()}`,
      name: newFolderName.trim(),
      type: "folder",
      children: [],
    };

    setFolders((prev) => {
      const addFolder = (nodes) =>
        nodes.map((node) => {
          if (node.id === parentForNewFolder) {
            return {
              ...node,
              children: node.children
                ? [...node.children, newFolder]
                : [newFolder],
            };
          }
          if (node.children) {
            return { ...node, children: addFolder(node.children) };
          }
          return node;
        });

      return addFolder(prev);
    });

    setExpandedFolders((prev) => ({
      ...prev,
      [parentForNewFolder]: true,
    }));

    setSelectedFolder(newFolder.id);
    setCreatingFolder(false);
    setNewFolderName("");
    setParentForNewFolder(null);
  };

  const getFolderNameById = (folderId) => {
    if (folderId === "Document" || folderId === "root") {
      return "Document";
    }

    const findFolder = (nodes) => {
      for (const node of nodes) {
        if (node.id === folderId) {
          return node.name;
        }
        if (node.children) {
          const found = findFolder(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findFolder(folders) || "Document";
  };

  const getFolderPath = (folderId) => {
    if (folderId === "root" || folderId === "Document") return "Document";

    const findPath = (nodes, currentPath) => {
      for (const node of nodes) {
        if (node.id === folderId) {

          return currentPath ? `${currentPath}/${node.name}` : node.name;
        }

        if (node.children) {

          const newPath = currentPath ? `${currentPath}/${node.name}` : node.name;
          const found = findPath(node.children, newPath);
          if (found) return found;
        }
      }
      return null;
    };

    return findPath(folders, "") || "Document";
  };

  const removeFolder = () => {
    if (!selectedFolder) {
      alert("No folder selected");
      return;
    }

    if (selectedFolder === "root" || selectedFolder === "Document") {
      alert("Cannot delete the root folder!");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete this folder and all its contents?`
      )
    ) {
      return;
    }

    const getAllFileIdsInFolder = (folderId) => {
      const fileIds = [];
      const traverse = (nodes) => {
        for (const node of nodes) {
          if (node.id === folderId) {
            if (node.children) {
              node.children.forEach((child) => {
                if (child.type === "file") {
                  fileIds.push(child.id);
                }
                if (child.type === "folder" && child.children) {
                  traverse([child]);
                }
              });
            }
          } else if (node.children) {
            traverse(node.children);
          }
        }
      };
      traverse(folders);
      return fileIds;
    };

    const fileIdsToDelete = getAllFileIdsInFolder(selectedFolder);
    setAllFiles((prev) =>
      prev.filter((file) => !fileIdsToDelete.includes(file.id))
    );

    setFolders((prev) => {
      const removeFromTree = (nodes) => {
        return nodes
          .filter((node) => node.id !== selectedFolder)
          .map((node) => {
            if (node.children) {
              return {
                ...node,
                children: removeFromTree(node.children),
              };
            }
            return node;
          });
      };
      return removeFromTree(prev);
    });

    setExpandedFolders((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[selectedFolder];
      return newExpanded;
    });

    setSelectedFolder("root");
  };

const processFiles = async (files) => {
  if (!files || files.length === 0) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Authentication token missing. Please log in.");
    return;
  }

  // Jis folder me abhi user hai
  const uploadFolderId = selectedFolder;

  try {
    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess("");

    const folderNameParam = getFolderPath(uploadFolderId);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `${API_BASE_URL}/licenseFile/upload?folder=${folderNameParam}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;

            const fileProgress =
              progressEvent.loaded / progressEvent.total;

            const overallProgress = Math.round(
              ((i + fileProgress) / files.length) * 100
            );

            setUploadProgress(overallProgress);
          },
        }
      );
    }

    setUploadProgress(100);

    // Fresh data
    await fetchFiles();

    // SAME FOLDER SELECT RAHEGA
    setSelectedFolder(uploadFolderId);

    setUploading(false);

    setUploadSuccess(
      files.length === 1
        ? "File uploaded successfully!"
        : `${files.length} files uploaded successfully!`
    );
  } catch (error) {
    console.error("Upload error:", error);

    setUploading(false);
    setUploadProgress(0);

    alert(
      error.response?.data?.message ||
        "File upload failed. Please try again."
    );
  }
};

  const uploadFiles = (e) => {
    processFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const removeFile = (fileId) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication token missing. Please log in.");
      return;
    }

    try {
      setDeleting(true);

      const response = await axios.delete(
        `${API_BASE_URL}/licenseFile/deleteFiles/${fileToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setAllFiles((prev) =>
          prev.filter((file) => file.id !== fileToDelete)
        );

        setFolders((prev) => {
          const removeFromTree = (nodes) =>
            nodes
              .map((node) => {
                if (
                  node.type === "file" &&
                  node.id === fileToDelete
                ) {
                  return null;
                }

                if (node.children) {
                  return {
                    ...node,
                    children: removeFromTree(
                      node.children
                    ).filter(Boolean),
                  };
                }

                return node;
              })
              .filter(Boolean);

          return removeFromTree(prev);
        });

        if (selectedFile?.id === fileToDelete) {
          setSelectedFile(null);
          setOpenPdfViewer(false);
          setOpenImageViewer(false);
        }

        setDeleteDialogOpen(false);
        setFileToDelete(null);
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to delete file."
      );
    } finally {
      setDeleting(false);
    }
  };
  const handleFileClick = (file) => {
    const fileType = (file.fileType || "").toLowerCase();

    setSelectedFile(file);

    if (fileType === "pdf") {
      setOpenPdfViewer(true);
    } else if (["jpg", "jpeg", "png", "webp"].includes(fileType)) {
      setOpenImageViewer(true);

    } else {
      alert("Not supported yet");
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.url, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name || "download";
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Download error:", error);

    }
  };

  const getFilesForCurrentFolder = () => {
    return allFiles.filter(
      (file) => file.folderId === selectedFolder
    );
  };
  const currentFiles = getFilesForCurrentFolder();
  const currentFolderName = getFolderNameById(selectedFolder);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
     mt: { xs: 7, md: 8 },
       
        height: "91vh",
        width: "100%",
        
        boxShadow: "0 4px 12px #0f7468",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          bgcolor: "#ccff01",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: 0,

            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {!isMobile && (
            <DocumentExplorer
              folders={folders}
              expandedFolders={expandedFolders}
              selectedFolder={selectedFolder}
              toggleFolder={toggleFolder}
              setSelectedFolder={setSelectedFolder}
              setDrawerOpen={setDrawerOpen}
              isMobile={isMobile}
              creatingFolder={creatingFolder}
              parentForNewFolder={parentForNewFolder}
              newFolderName={newFolderName}
              setNewFolderName={setNewFolderName}
              saveNewFolder={saveNewFolder}
              setCreatingFolder={setCreatingFolder}
              setParentForNewFolder={setParentForNewFolder}
              createFolder={createFolder}
              removeFolder={removeFolder}
            />
          )}

          {isMobile && (
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  width: 260,
                  boxSizing: "border-box",
                  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderBottom: "1px solid #dc4545",
                  bgcolor: "#fafafa",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontSize={13} fontWeight={600} color="#0f4f3f">
                  EXPLORER
                </Typography>
                <IconButton size="small" onClick={() => setDrawerOpen(false)}>
                  <CloseIcon sx={{ fontSize: 18, color: "#0f4f3f" }} />
                </IconButton>
              </Box>
              <DocumentExplorer
                folders={folders}
                expandedFolders={expandedFolders}
                selectedFolder={selectedFolder}
                toggleFolder={toggleFolder}
                setSelectedFolder={setSelectedFolder}
                setDrawerOpen={setDrawerOpen}
                isMobile={isMobile}
                creatingFolder={creatingFolder}
                parentForNewFolder={parentForNewFolder}
                newFolderName={newFolderName}
                setNewFolderName={setNewFolderName}
                saveNewFolder={saveNewFolder}
                setCreatingFolder={setCreatingFolder}
                setParentForNewFolder={setParentForNewFolder}
                createFolder={createFolder}
                removeFolder={removeFolder}
              />
            </Drawer>
          )}

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Header
  isMobile={isMobile}
  isTablet={isTablet}
  drawerOpen={drawerOpen}
  setDrawerOpen={setDrawerOpen}
  currentFolderName={currentFolderName}
  setOpenUpload={setOpenUpload}
  setUploadSuccess={setUploadSuccess}
  setUploadProgress={setUploadProgress}
  viewMode={viewMode}
  setViewMode={setViewMode}
/>

            <FileView
              viewMode={viewMode}
              currentFiles={currentFiles}
              isMobile={isMobile}
              isTablet={isTablet}
              isDesktop={isDesktop}
              GridFileItem={({ file }) => (
                <FileGridItem
                  file={file}
                  handleFileClick={handleFileClick}
                  handleDownload={handleDownload}
                  removeFile={removeFile}
                  getFileIcon={(file) => getFileIcon(file, isMobile, isTablet)}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  hoveredFile={hoveredFile}
                  setHoveredFile={setHoveredFile}
                />
              )}
              ListFileItem={({ file }) => (
                <FileListItem
                  file={file}
                  handleFileClick={handleFileClick}
                  handleDownload={handleDownload}
                  removeFile={removeFile}
                  getSmallFileIcon={getSmallFileIcon}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  isDesktop={isDesktop}
                />
              )}
              EmptyState={EmptyState}
              emptyStateProps={{
                selectedFolder,
                currentFolderName,
                createFolder,
                setOpenUpload,
                isMobile,
                isTablet,
              }}
            />
          </Box>
        </Paper>

        <UploadDialog
           openUpload={openUpload}
  setOpenUpload={setOpenUpload}
  uploadFiles={uploadFiles}
  handleDrop={handleDrop}
  handleDragOver={handleDragOver}
  handleDragLeave={handleDragLeave}
  isDragging={isDragging}
  uploading={uploading}
  uploadProgress={uploadProgress}
  uploadSuccess={uploadSuccess}
  currentFolderName={currentFolderName}
  isMobile={isMobile}
        />

        <PdfViewerModal
          openPdfViewer={openPdfViewer}
          setOpenPdfViewer={setOpenPdfViewer}
          selectedFile={selectedFile}
          handleDownload={handleDownload}
          currentFolderName={currentFolderName}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        <ImageViewerModal
          openImageViewer={openImageViewer}
          setOpenImageViewer={setOpenImageViewer}
          selectedFile={selectedFile}
          handleDownload={handleDownload}
          currentFolderName={currentFolderName}
          isMobile={isMobile}
          isTablet={isTablet}
        />
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            if (!deleting) {
              setDeleteDialogOpen(false);
              setFileToDelete(null);
            }
          }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              width: "100%",
              maxWidth: 400,
              mx: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              pb: 1,
            }}
          >
            Delete File?
          </DialogTitle>

          <DialogContent>
            <DialogContentText
              sx={{
                fontSize: "0.9rem",
                color: "#6b7280",
              }}
            >
              Are you sure you want to delete this file? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              disabled={deleting}
              onClick={() => {
                setDeleteDialogOpen(false);
                setFileToDelete(null);
              }}
              sx={{
                color: "#4b5563",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={deleting}
              onClick={confirmDeleteFile}
              sx={{
                bgcolor: "#dc2626",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,

                "&:hover": {
                  bgcolor: "#b91c1c",
                },
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

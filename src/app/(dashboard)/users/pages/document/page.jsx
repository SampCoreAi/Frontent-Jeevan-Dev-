"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config/api";

import {
  Dialog,
  Typography,
  Box,
  Paper,
  Drawer,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Alert,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [folderNameError, setFolderNameError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [storage, setStorage] = useState(null);
const [storageError, setStorageError] = useState("");
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
  const [renameFolder, setRenameFolder] = useState(null);
  const [renameName, setRenameName] = useState("");
  const [renameError, setRenameError] = useState("");
  const [renaming, setRenaming] = useState(false);

  const openRenameFolder = (folder) => {
    setRenameFolder(folder);
    setRenameName(folder.name);
    setRenameError("");
  };

  const closeRenameFolder = () => {
    if (renaming) return;
    setRenameFolder(null);
    setRenameError("");
  };


const fetchStorage = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const { data } = await axios.get(`${API_BASE_URL}/storage/usage`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!data?.success) {
      throw new Error(data?.message || "Storage usage unavailable.");
    }

    setStorage(data.data);
    setStorageError("");
  } catch {
    setStorageError("Storage usage unavailable.");
  }
};

  const saveFolderRename = async () => {
    if (renaming || !renameFolder) return;

    const name = renameName.trim();

    if (!name || /[/\\]/.test(name)) {
      setRenameError("Enter a folder name without / or \\.");
      return;
    }

    if (name === renameFolder.name) {
      closeRenameFolder();
      return;
    }

    const dbId = renameFolder.dbId;
    if (!dbId) {
      setRenameError(
        "Backend folder ID missing. Folder data mein dbId chahiye.",
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setRenameError("Please log in again.");
      return;
    }

    setRenaming(true);
    setRenameError("");

    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/folders/${encodeURIComponent(dbId)}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!data?.success) {
        throw new Error(data?.message || "Folder rename failed.");
      }

      // Frontend IDs stable rakho, taaki selection aur file links na tootein.
      const updateTree = (nodes) =>
        nodes.map((node) => ({
          ...node,
          ...(node.id === renameFolder.id ? { name } : {}),
          ...(node.children ? { children: updateTree(node.children) } : {}),
        }));

      setFolders(updateTree);
      setRenameFolder(null);
    } catch (error) {
      setRenameError(
        error.response?.data?.message ||
          error.message ||
          "Folder rename failed.",
      );
    } finally {
      setRenaming(false);
    }
  };
  const [selectedFolder, setSelectedFolder] = useState("root");

  const [openUpload, setOpenUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [selectedFile, setSelectedFile] = useState(null);
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [folderDeleteError, setFolderDeleteError] = useState("");
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
          root: rootFolder,
        };

       
        const findOrCreatePath = (pathParts, parentId) => {
          let currentParentId = parentId;

          for (const part of pathParts) {
            if (!part) continue;

            const currentParent = foldersMap[currentParentId];
            if (!currentParent) break;

            let foundFolder = currentParent.children.find(
              (child) =>
                child.type === "folder" &&
                child.name.toLowerCase() === part.toLowerCase(),
            );

            if (!foundFolder) {
              const newFolderId = `${currentParentId}/${part}`;
              foundFolder = {
                id: newFolderId,
                name: part,
                type: "folder",
                children: [],
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
          if (targetFolderId !== "root" && foldersMap[targetFolderId]) {
            foldersMap[targetFolderId].dbId ??= file.id;
          }
          const fileKey = file.fileUrl?.split("?")[0];

          const extension = fileKey?.split(".").pop()?.toLowerCase();

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
        return [rootFolder];
      } else {
        console.warn("Response success was false:", response.data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

useEffect(() => {
  fetchFiles();
  fetchStorage();
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
          const newPath = currentPath
            ? `${currentPath}/${node.name}`
            : node.name;
          const found = findPath(node.children, newPath);
          if (found) return found;
        }
      }
      return null;
    };

    return findPath(folders, "") || "Document";
  };

  const removeFolder = () => {
    if (selectedFolder === "root") return;

    const findFolder = (nodes) => {
      for (const node of nodes) {
        if (node.type !== "folder") continue;
        if (node.id === selectedFolder) return node;
        const found = findFolder(node.children || []);
        if (found) return found;
      }
    };

    const folder = findFolder(folders);
    if (!folder) return;

    setFolderDeleteError("");
    setFolderToDelete(folder);
  };

  const confirmDeleteFolder = async () => {
    if (deleting || !folderToDelete) return;

    if (!folderToDelete.dbId) {
      setFolderDeleteError("Folder reference ID missing.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setFolderDeleteError("Please log in again.");
      return;
    }

    setDeleting(true);
    setFolderDeleteError("");

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/folders/${folderToDelete.dbId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!data?.success) {
        throw new Error(data?.message || "Folder delete failed.");
      }

      setSelectedFolder("root");
      setSelectedFile(null);
      setOpenPdfViewer(false);
      setOpenImageViewer(false);
      setFolderToDelete(null);
      await fetchFiles();
    } catch (error) {
      setFolderDeleteError(error.response?.data?.message || error.message);
    } finally {
      setDeleting(false);
    }
  };

  const ALLOWED_FILES = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
  };

const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateFile = (file) => {
   if (file.size > MAX_FILE_SIZE) {
  return `${file.name} is larger than 5 MB.`;
}
    // Extension
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    const allowedExtensions = Object.values(ALLOWED_FILES).flat();

    if (!allowedExtensions.includes(extension)) {
      return `${file.name}: File type not allowed.`;
    }

    // MIME type
    if (!ALLOWED_FILES[file.type]) {
      return `${file.name}: Invalid file type.`;
    }

    // MIME + extension must match
    if (!ALLOWED_FILES[file.type].includes(extension)) {
      return `${file.name}: File extension does not match file type.`;
    }

    return null;
  };

const processFiles = async (files) => {
  if (!files?.length || uploading) return;

  for (const file of files) {
    const error = validateFile(file);
    if (error) return alert(error);
  }

  const token = localStorage.getItem("token");
  if (!token) return alert("Please log in again.");

  // Upload start par destination capture karo.
  const folderPath = getFolderPath(selectedFolder);
  const parts = folderPath.split("/").filter(Boolean);
  if (parts[0]?.toLowerCase() === "document") parts.shift();

  const folderIds = ["root"];
  for (const part of parts) {
    folderIds.push(`${folderIds.at(-1)}/${part}`);
  }
  const destinationId = folderIds.at(-1);

  setUploading(true);
  setUploadProgress(0);
  setUploadSuccess("");

  let uploaded = 0;

  try {
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      const { data } = await axios.post(
        `${API_BASE_URL}/licenseFile/upload`,
        formData,
        {
          params: { folder: folderPath },
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: ({ loaded, total }) => {
            if (total) {
              setUploadProgress(
                Math.round(((i + loaded / total) / files.length) * 100),
              );
            }
          },
        },
      );

      if (data?.success === false) {
        throw new Error(data.message || "Upload failed.");
      }

      uploaded++;

      // Har file successfully save hote hi actual storage update.
      await fetchStorage();
    }

    setUploadProgress(100);
    setUploadSuccess(
      `${uploaded} file${uploaded === 1 ? "" : "s"} uploaded successfully!`,
    );
  } catch (error) {
    alert(error.response?.data?.message || error.message || "Upload failed.");
  } finally {
  const [freshFolders] = await Promise.all([
    fetchFiles(),
    fetchStorage(),
  ]);

  if (uploaded > 0 && freshFolders) {
    const findByPath = (nodes, parentPath = "") => {
      for (const node of nodes) {
        if (node.type !== "folder") continue;

        const path = parentPath
          ? `${parentPath}/${node.name}`
          : node.name;

        if (path === folderPath) return node;

        const found = findByPath(node.children || [], path);
        if (found) return found;
      }
    };

    const destination = findByPath(freshFolders);

    if (destination) {
      setSearchQuery("");
      setSelectedFolder(destination.id);

      const expandParents = (nodes, parents = []) => {
        for (const node of nodes) {
          if (node.type !== "folder") continue;
          const path = [...parents, node.id];

          if (node.id === destination.id) return path;

          const found = expandParents(node.children || [], path);
          if (found) return found;
        }
      };

      const ids = expandParents(freshFolders) || [];
      setExpandedFolders((prev) => ({
        ...prev,
        ...Object.fromEntries(ids.map((id) => [id, true])),
      }));
    }
  }

  setUploading(false);
}
};

  const [highlightedFileId, setHighlightedFileId] = useState(null);

  const openFileFolder = (file) => {
    setSelectedFolder(file.folderId);
    setSearchQuery("");
    setHighlightedFileId(file.id);

    // Matching folder tak sidebar ka path expand karo
    const findPath = (nodes, path = []) => {
      for (const node of nodes) {
        const next = [...path, node.id];
        if (node.id === file.folderId) return next;
        const found = findPath(node.children || [], next);
        if (found) return found;
      }
    };

    const path = findPath(folders) || [];
    setExpandedFolders((prev) => ({
      ...prev,
      ...Object.fromEntries(path.map((id) => [id, true])),
    }));
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
        },
      );

      if (response.data?.success) {
        setAllFiles((prev) => prev.filter((file) => file.id !== fileToDelete));

        setFolders((prev) => {
          const removeFromTree = (nodes) =>
            nodes
              .map((node) => {
                if (node.type === "file" && node.id === fileToDelete) {
                  return null;
                }

                if (node.children) {
                  return {
                    ...node,
                    children: removeFromTree(node.children).filter(Boolean),
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
      console.error("Delete error:", error?.response?.data || error);

      alert(error?.response?.data?.message || "Failed to delete file.");
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
    return allFiles.filter((file) => file.folderId === selectedFolder);
  };

  const query = searchQuery.trim().toLowerCase();

  const currentFiles = query
    ? allFiles.filter((file) => (file.name || "").toLowerCase().includes(query))
    : getFilesForCurrentFolder();

  const currentFolderName = query
    ? `Search results (${currentFiles.length})`
    : getFolderNameById(selectedFolder);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        mt: { xs: 7, md: 8.5 },

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
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            px: 2,
            py: 0.5,
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
              storage={storage}
storageError={storageError}
              onRenameFolder={openRenameFolder}
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
                removeFolder={removeFolder}
                deleting={deleting}
                setCreatingFolder={setCreatingFolder}
                folderNameError={folderNameError}
                setFolderNameError={setFolderNameError}
                setParentForNewFolder={setParentForNewFolder}
                createFolder={createFolder}
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
              setDrawerOpen={setDrawerOpen}
              currentFolderName={currentFolderName}
              setOpenUpload={setOpenUpload}
              setUploadSuccess={setUploadSuccess}
              setUploadProgress={setUploadProgress}
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <FileView
              viewMode={viewMode}
              currentFiles={currentFiles}
              isMobile={isMobile}
              isTablet={isTablet}
              isDesktop={isDesktop}
              searchQuery={searchQuery}
              onOpenFolder={openFileFolder}
              highlightedFileId={highlightedFileId}
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
              Are you sure you want to delete this file? This action cannot be
              undone.
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
        <Dialog
  open={Boolean(folderToDelete)}
  onClose={() => !deleting && setFolderToDelete(null)}
  fullWidth
  maxWidth="xs"
  PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}
>
  <DialogTitle sx={{ fontSize: 16, fontWeight: 600 }}>
    Delete folder?
  </DialogTitle>

  <DialogContent>
    <DialogContentText sx={{ fontSize: 13, lineHeight: 1.7 }}>
      “{folderToDelete?.name}” and all files and subfolders inside it
      will be permanently deleted. This cannot be undone.
      Are you sure?
    </DialogContentText>

    {folderDeleteError && (
      <Typography color="error" sx={{ mt: 1.5, fontSize: 13 }}>
        {folderDeleteError}
      </Typography>
    )}
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2, gap: 0.5 }}>
    <Button
      disabled={deleting}
      onClick={() => setFolderToDelete(null)}
      sx={{ textTransform: "none", color: "text.secondary" }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      color="error"
      disabled={deleting}
      onClick={confirmDeleteFolder}
      sx={{ textTransform: "none", borderRadius: 2, boxShadow: "none" }}
    >
      {deleting ? "Deleting..." : "Yes, delete"}
    </Button>
  </DialogActions>
</Dialog>
        <Dialog
          open={Boolean(renameFolder)}
          onClose={closeRenameFolder}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle sx={{ fontSize: 16, fontWeight: 600 }}>
            Rename folder
          </DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label="Folder name"
              value={renameName}
              disabled={renaming}
              sx={{ mt: 1 }}
              onChange={(e) => {
                setRenameName(e.target.value);
                setRenameError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveFolderRename();
                }
              }}
            />

            {renameError && (
              <Alert severity="error" sx={{ mt: 1.5 }}>
                {renameError}
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button disabled={renaming} onClick={closeRenameFolder}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={renaming || !renameName.trim()}
              onClick={saveFolderRename}
            >
              {renaming ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

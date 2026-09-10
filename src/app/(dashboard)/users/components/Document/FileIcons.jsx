"use client";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ImageIcon from "@mui/icons-material/Image";

export const getFileIcon = (file, isMobile, isTablet) => {
  const fileType = file.fileType || file.type?.split("/")[0];
  const isImage = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "image",
  ].includes(fileType);

  if (fileType === "pdf" || file.type === "application/pdf") {
    return (
      <PictureAsPdfIcon
        sx={{
          color: "#d32f2f",
          fontSize: isMobile ? 32 : isTablet ? 40 : 48,
        }}
      />
    );
  } else if (isImage) {
    return (
      <ImageIcon
        sx={{
          color: "#388e3c",
          fontSize: isMobile ? 32 : isTablet ? 40 : 48,
        }}
      />
    );
  } else if (fileType.includes("doc") || fileType === "application/msword") {
    return (
      <DescriptionIcon
        sx={{
          color: "#2b579a",
          fontSize: isMobile ? 32 : isTablet ? 40 : 48,
        }}
      />
    );
  } else if (fileType.includes("xls") || fileType.includes("excel")) {
    return (
      <DescriptionIcon
        sx={{
          color: "#217346",
          fontSize: isMobile ? 32 : isTablet ? 40 : 48,
        }}
      />
    );
  } else if (fileType.includes("txt") || fileType.includes("text")) {
    return (
      <TextSnippetIcon
        sx={{
          color: "#757575",
          fontSize: isMobile ? 32 : isTablet ? 40 : 48,
        }}
      />
    );
  } else {
    return (
      <InsertDriveFileIcon
        sx={{
          color: "#757575",
          fontSize: isMobile ? 32 : isTablet ? 40 : 48,
        }}
      />
    );
  }
};

export const getSmallFileIcon = (fileType) => {
  const isImage = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "image",
  ].includes(fileType);

  if (fileType === "pdf") {
    return <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: 16 }} />;
  } else if (isImage) {
    return <ImageIcon sx={{ color: "#388e3c", fontSize: 16 }} />;
  } else if (fileType === "doc" || fileType === "docx") {
    return <DescriptionIcon sx={{ color: "#2b579a", fontSize: 16 }} />;
  } else if (fileType === "xls" || fileType === "xlsx") {
    return <DescriptionIcon sx={{ color: "#217346", fontSize: 16 }} />;
  } else if (fileType === "txt") {
    return <TextSnippetIcon sx={{ color: "#757575", fontSize: 16 }} />;
  } else {
    return <InsertDriveFileIcon sx={{ color: "#757575", fontSize: 16 }} />;
  }
};
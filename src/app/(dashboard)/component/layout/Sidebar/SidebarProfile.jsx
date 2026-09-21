"use client";
import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { Share } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";

const SidebarProfile = ({
  isOpen,
  isMobile,
  roleId,
  userName,
  qualification,
  specialization,
  avatarSrc,
}) => {
  const theme = useTheme();
  const showContent = isOpen || isMobile;
  const canShareProfile = Number(roleId) === 2;

  const getProfileSubtitle = () => {
    if (Number(roleId) === 1) return "Patient Account";
    if (specialization) return specialization;
    if (qualification) return qualification;
    return "Account";
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: showContent ? "row" : "column",
          alignItems: "center",
          justifyContent: showContent ? "flex-start" : "center",
          gap: showContent ? "10px" : "6px",
          bgcolor: "secondary.light",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "10px",
          p: showContent ? "10px" : "7px",
          flexShrink: 0,
          transition: "all 0.25s ease",
          "&:hover": {
            borderColor: "primary.light",
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.08)}`,
            "& .profile-avatar": {
              transform: "scale(1.04)",
            },
          },
        }}
      >
        <Avatar
          className="profile-avatar"
          src={avatarSrc}
          alt={userName}
          sx={{
            width: showContent ? 46 : 40,
            height: showContent ? 46 : 40,
            flexShrink: 0,
            bgcolor: "background.paper",
            border: "1.5px solid",
            borderColor: "primary.light",
            color: "primary.main",
            boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.08)}`,
            transition: "transform 0.25s ease",
          }}
        />
        {showContent && (
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: "13.5px",
                lineHeight: 1.2,
                fontWeight: 700,
                color: "text.primary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </Typography>
            <Typography
              sx={{
                mt: "3px",
                fontSize: "10.5px",
                lineHeight: 1.3,
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {getProfileSubtitle()}
            </Typography>
            <Box
              sx={{
                mt: "5px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Box
                sx={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  bgcolor: "success.main",
                }}
              />
              <Typography
                sx={{
                  fontSize: "9.5px",
                  fontWeight: 600,
                  color: "success.dark",
                }}
              >
                Active
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      {canShareProfile && showContent && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Share sx={{ fontSize: "15px !important" }} />}
          sx={{
            width: "100%",
            height: "36px",
            mt: "9px",
            fontSize: "11.5px",
            fontWeight: 600,
            borderRadius: "8px",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          }}
        >
          Share Profile
        </Button>
      )}
    </>
  );
};

export default SidebarProfile;
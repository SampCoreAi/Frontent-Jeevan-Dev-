"use client";

import React from "react";

import {
  Box,
  Button,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

const ProfileActions = ({
  isEditing,
  onUpdateClick,
  onSaveClick,
}) => {
  return (
    <Box
      sx={{
        width: "100%",

        display: "flex",
        justifyContent: {
          xs: "stretch",
          sm: "flex-end",
        },

        mt: "12px",
        pt: "12px",

        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Button
        fullWidth={false}
        variant="contained"
        color="primary"
        startIcon={
          isEditing ? (
            <SaveOutlinedIcon />
          ) : (
            <EditOutlinedIcon />
          )
        }
        onClick={
          isEditing
            ? onSaveClick
            : onUpdateClick
        }
        sx={{
          minWidth: {
            xs: "100%",
            sm: "135px",
          },

          height: "38px",

          px: "16px",

          borderRadius: "8px",

          textTransform: "none",

          fontSize: "12.5px",
          fontWeight: 650,

          boxShadow: "none",

          "& .MuiButton-startIcon svg":
            {
              fontSize: "16px",
            },

          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        {isEditing
          ? "Save Changes"
          : "Edit Profile"}
      </Button>
    </Box>
  );
};

export default ProfileActions;
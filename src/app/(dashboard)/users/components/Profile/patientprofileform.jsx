"use client";

import React from "react";
import {
  Box,
  Stack,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";

import UserAddress from "../Profile/UserAddress";

const PatientProfileForm = ({
  formData,
  editable,
  handleChange,
}) => {
  const theme = useTheme();

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "12.5px",
    padding: "6px 4px",
    color: theme.palette.text.primary,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const boxStyle = {
    backgroundColor: theme.palette.background.default,
    px: 1.5,
    py: 0.7,
    minHeight: 43,
    borderRadius: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1,
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${theme.palette.divider}`,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",

    "&:hover": {
      borderColor: editable
        ? theme.palette.primary.main
        : theme.palette.divider,
    },

    "&:focus-within": {
      borderColor: editable
        ? theme.palette.primary.main
        : theme.palette.divider,
      boxShadow: editable
        ? `0 0 0 2px ${theme.palette.primary.main}12`
        : "none",
    },
  };

  const labelStyle = {
    fontSize: "12.5px",
    fontWeight: 600,
    color: theme.palette.text.primary,
    minWidth: {
      xs: "105px",
      sm: "125px",
    },
    flexShrink: 0,
    whiteSpace: "nowrap",
  };

  const sanitizeCommaSeparatedText = (value) => {
    return value
      .replace(/[<>]/g, "")
      .replace(/\s{2,}/g, " ")
      .slice(0, 250);
  };

  const handleListChange = (field, value) => {
    if (!editable) return;

    handleChange(
      field,
      sanitizeCommaSeparatedText(value)
    );
  };

  const handleBioChange = (value) => {
    if (!editable) return;

    handleChange(
      "bio",
      value
        .replace(/[<>]/g, "")
        .slice(0, 500)
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: {
            xs: 1.2,
            md: 2.5,
          },
          width: "100%",
        }}
      >
        <Stack
          spacing={1.2}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box sx={boxStyle}>
            <Typography sx={labelStyle}>
              Blood Group
            </Typography>

            <select
              value={formData?.bloodGroup || ""}
              onChange={(e) =>
                handleChange(
                  "bloodGroup",
                  e.target.value
                )
              }
              disabled={!editable}
              aria-label="Blood Group"
              style={{
                ...inputStyle,
                cursor: editable
                  ? "pointer"
                  : "default",
              }}
            >
              <option value="">
                Select Blood Group
              </option>

              {[
                "A+",
                "A-",
                "B+",
                "B-",
                "O+",
                "O-",
                "AB+",
                "AB-",
              ].map((bloodGroup) => (
                <option
                  key={bloodGroup}
                  value={bloodGroup}
                >
                  {bloodGroup}
                </option>
              ))}
            </select>
          </Box>

          <Box sx={boxStyle}>
            <Typography sx={labelStyle}>
              Allergies
            </Typography>

            <input
              type="text"
              value={formData?.allergies || ""}
              placeholder={
                editable
                  ? "e.g. Dust, Pollen"
                  : "Not provided"
              }
              disabled={!editable}
              maxLength={250}
              onChange={(e) =>
                handleListChange(
                  "allergies",
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                cursor: editable
                  ? "text"
                  : "default",
              }}
            />
          </Box>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            borderColor: theme.palette.divider,
          }}
        />

        <Stack
          spacing={1.2}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box sx={boxStyle}>
            <Typography sx={labelStyle}>
              Existing Conditions
            </Typography>

            <input
              type="text"
              value={
                formData?.existingConditions || ""
              }
              placeholder={
                editable
                  ? "e.g. Diabetes, Asthma"
                  : "Not provided"
              }
              disabled={!editable}
              maxLength={250}
              onChange={(e) =>
                handleListChange(
                  "existingConditions",
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                cursor: editable
                  ? "text"
                  : "default",
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Short Bio
          </Typography>

          {editable && (
            <Typography
              sx={{
                fontSize: "11px",
                color: theme.palette.text.secondary,
              }}
            >
              {(formData?.bio || "").length}/500
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            backgroundColor:
              theme.palette.background.default,
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
            border: `1px solid ${theme.palette.divider}`,
            transition:
              "border-color 0.2s ease, box-shadow 0.2s ease",

            "&:hover": {
              borderColor: editable
                ? theme.palette.primary.main
                : theme.palette.divider,
            },

            "&:focus-within": {
              borderColor: editable
                ? theme.palette.primary.main
                : theme.palette.divider,
              boxShadow: editable
                ? `0 0 0 2px ${theme.palette.primary.main}12`
                : "none",
            },
          }}
        >
          <textarea
            value={formData?.bio || ""}
            onChange={(e) =>
              handleBioChange(e.target.value)
            }
            disabled={!editable}
            placeholder={
              editable
                ? "Write a short bio..."
                : "No bio provided"
            }
            rows={2}
            maxLength={500}
            style={{
              width: "100%",
              minHeight: 48,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              resize: "vertical",
              padding: 0,
              margin: 0,
              fontSize: "12.5px",
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <UserAddress
          address={formData?.address || {}}
          emergencyContact={
            formData?.emergencyContact || {}
          }
          editable={editable}
          handleChange={handleChange}
        />
      </Box>
    </Box>
  );
};

export default PatientProfileForm;
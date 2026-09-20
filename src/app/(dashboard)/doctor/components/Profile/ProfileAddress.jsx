"use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

// ============================================================
// FIELD STYLE
// ============================================================

const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: "12.5px",
  },

  "& .MuiOutlinedInput-root": {
    minHeight: "36px",

    fontSize: "12.5px",

    borderRadius: "7px",

    bgcolor: "background.paper",

    "& fieldset": {
      borderColor: "divider",
    },

    "&:hover fieldset": {
      borderColor: "primary.light",
    },

    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      borderWidth: "1px",
    },
  },
};

// ============================================================
// ADDRESS
// ============================================================

const getAddressSummary = (
  hospital
) => {
  if (!hospital)
    return "Address not provided";

  const values = [
    hospital.flatNo,
    hospital.building,
    hospital.street,
    hospital.area,
    hospital.landmark,
    hospital.city,
    hospital.district,
    hospital.state,
    hospital.pinCode,
  ].filter(Boolean);

  return values.length
    ? values.join(", ")
    : "Address not provided";
};

// ============================================================
// HOSPITAL CARD
// ============================================================

const HospitalCard = ({
  hospital,
  index,
  isEditing,
  canRemove,
  onChange,
  onRemove,
}) => {
  const [open, setOpen] =
    useState(false);

  const fields = [
    ["flatNo", "Flat / Plot No.", 4],
    ["building", "Building / Society", 8],
    ["street", "Street Name", 6],
    ["area", "Area / Locality", 6],
    ["landmark", "Landmark", 6],
    ["city", "City / Town", 6],
    ["district", "District", 4],
    ["state", "State", 4],
    ["pinCode", "PIN Code", 4],
  ];

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",

        borderRadius: "8px",

        bgcolor: "background.paper",

        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <Box
        onClick={() =>
          setOpen((prev) => !prev)
        }
        sx={{
          minHeight: "56px",

          display: "flex",
          alignItems: "center",

          gap: "10px",

          px: "12px",

          cursor: "pointer",

          "&:hover": {
            bgcolor:
              "secondary.light",
          },
        }}
      >
        <Box
          sx={{
            width: "32px",
            height: "32px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,

            borderRadius: "7px",

            bgcolor:
              "secondary.light",

            color: "primary.main",
          }}
        >
          <BusinessOutlinedIcon
            sx={{
              fontSize: "18px",
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "12.5px",
              fontWeight: 650,

              color: "text.primary",
            }}
          >
            {hospital.hospitalName ||
              `Hospital ${index + 1}`}
          </Typography>

          <Typography
            sx={{
              mt: "2px",

              fontSize: "11px",

              color:
                "text.secondary",

              overflow: "hidden",
              textOverflow:
                "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {getAddressSummary(
              hospital
            )}
          </Typography>
        </Box>

        {isEditing && canRemove && (
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();

              onRemove();
            }}
            sx={{
              color: "error.main",
            }}
          >
            <DeleteOutlineIcon
              sx={{
                fontSize: "17px",
              }}
            />
          </IconButton>
        )}

        <IconButton size="small">
          {open ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </IconButton>
      </Box>

      {/* BODY */}

      <Collapse in={open}>
        <Box
          sx={{
            p: "12px",

            borderTop:
              "1px solid",

            borderColor:
              "divider",
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Hospital Name"
            value={
              hospital.hospitalName ||
              ""
            }
            disabled={!isEditing}
            onChange={(event) =>
              onChange(
                "hospitalName",
                event.target.value
              )
            }
            sx={{
              ...fieldSx,

              mb: "10px",
            }}
          />

          <Grid
            container
            spacing={1.25}
          >
            {fields.map(
              ([
                key,
                label,
                size,
              ]) => (
                <Grid
                  item
                  xs={12}
                  sm={size}
                  key={key}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label={label}
                    value={
                      hospital?.[
                        key
                      ] || ""
                    }
                    disabled={
                      !isEditing
                    }
                    onChange={(
                      event
                    ) =>
                      onChange(
                        key,
                        event
                          .target
                          .value
                      )
                    }
                    sx={
                      fieldSx
                    }
                  />
                </Grid>
              )
            )}
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

// ============================================================
// MAIN
// ============================================================

const ProfileAddress = ({
  profileData,
  isEditing,
  onHospitalChange,
  onAddHospital,
  onRemoveHospital,
}) => {
  const hospitals =
    profileData?.hospitalDetail ||
    [];

  return (
    <Box
      sx={{
        mt: "12px",

        p: "12px",

        bgcolor: "background.paper",

        border: "1px solid",
        borderColor: "divider",

        borderRadius: "10px",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",

          mb: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            gap: "8px",
          }}
        >
          <Box
            sx={{
              width: "30px",
              height: "30px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "7px",

              bgcolor:
                "secondary.light",

              color:
                "primary.main",
            }}
          >
            <LocalHospitalOutlinedIcon
              sx={{
                fontSize: "18px",
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,

                color:
                  "text.primary",
              }}
            >
              Hospital Address
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",

                color:
                  "text.secondary",
              }}
            >
              {hospitals.length}{" "}
              {hospitals.length === 1
                ? "hospital"
                : "hospitals"}{" "}
              added
            </Typography>
          </Box>
        </Box>

        {/* Add Hospital sirf editing me */}

        {isEditing && (
          <Button
            variant="outlined"
            size="small"
            startIcon={
              <AddIcon
                sx={{
                  fontSize:
                    "16px !important",
                }}
              />
            }
            onClick={onAddHospital}
            sx={{
              height: "32px",

              fontSize: "12.5px",

              textTransform: "none",

              borderRadius: "7px",
            }}
          >
            Add Hospital
          </Button>
        )}
      </Box>

      {/* HOSPITAL LIST */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",

          gap: "7px",
        }}
      >
        {hospitals.map(
          (hospital, index) => (
            <HospitalCard
              key={index}
              hospital={hospital}
              index={index}
              isEditing={isEditing}
              canRemove={
                hospitals.length > 1
              }
              onChange={(
                field,
                value
              ) =>
                onHospitalChange?.(
                  index,
                  field,
                  value
                )
              }
              onRemove={() =>
                onRemoveHospital?.(
                  index
                )
              }
            />
          )
        )}

        {!hospitals.length && (
          <Box
            sx={{
              py: "18px",

              textAlign: "center",

              border: "1px dashed",
              borderColor: "divider",

              borderRadius: "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12.5px",

                color:
                  "text.secondary",
              }}
            >
              No hospital address
              added
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileAddress;
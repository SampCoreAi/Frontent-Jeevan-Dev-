"use client";

import React from "react";
import {
  Box,
  Stack,
  Divider,
  Typography,
  useTheme,
  Autocomplete,
  TextField,
  Button,
  IconButton,
} from "@mui/material";

import UserAddress from "../Profile/UserAddress";

const PatientProfileForm = ({
  formData,
  editable,
  handleChange,
}) => {
  const theme = useTheme();

  const allergyOptions = [
    "Dust",
    "Eggs",
    "Wheat",
    "Soy",
    "Shellfish",
    "Milk",
    "Peanuts",
    "Fish",
    "Insect Sting",
    "Penicillin",
    "Pollen",
    "Latex",
    "Dust Mites",
    "Pet Dander",
  ];

  const conditionOptions = [
    "Diabetes",
    "Hypertension",
    "Thyroid Disorder",
    "Heart Disease",
    "Arthritis",
    "Migraine",
    "Asthma",
    "Kidney Disease",
    "Epilepsy",
    "Tuberculosis",
    "PCOS",
    "Anemia",
  ];

  const familyMembers = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Grandfather",
    "Grandmother",
    "Uncle",
    "Aunt",
    "Son",
    "Daughter",
  ];

  const [inputValues, setInputValues] = React.useState({
    allergies: "",
    existingConditions: "",
  });

  const [showFamilyHistory, setShowFamilyHistory] =
    React.useState(false);

  const [familyCondition, setFamilyCondition] =
    React.useState("");

  const [familyMember, setFamilyMember] =
    React.useState("");

  const [familyHistory, setFamilyHistory] =
    React.useState(formData?.familyMedicalHistory || []);

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

  const sanitizeText = (value) => {
    return value
      .replace(/[<>]/g, "")
      .replace(/\s{2,}/g, " ")
      .slice(0, 250);
  };

  const getValues = (value) => {
    if (!value) return [];

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const updateMultiValue = (field, value) => {
    if (!editable) return;

    const current = getValues(formData?.[field]);

    const newValues = value
      .split(",")
      .map((item) => sanitizeText(item.trim()))
      .filter(Boolean);

    const combined = [
      ...current,
      ...newValues.filter(
        (item) =>
          !current.some(
            (currentItem) =>
              currentItem.toLowerCase() ===
              item.toLowerCase()
          )
      ),
    ];

    handleChange(field, combined.join(", "));
  };

  const handleAutocompleteChange = (field, values) => {
    if (!editable) return;

    const cleaned = values
      .map((value) => sanitizeText(value.trim()))
      .filter(Boolean);

    const unique = cleaned.filter(
      (value, index, array) =>
        array.findIndex(
          (item) =>
            item.toLowerCase() === value.toLowerCase()
        ) === index
    );

    handleChange(field, unique.join(", "));
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

  const renderMultiSelect = (
    field,
    options,
    placeholder
  ) => {
    const inputValue = inputValues[field] || "";

    const setInputValue = (value) => {
      setInputValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    return (
      <Autocomplete
        multiple
        freeSolo
        options={options}
        value={getValues(formData?.[field])}
        inputValue={inputValue}
        disabled={!editable}
        filterSelectedOptions
        onInputChange={(event, value) => {
          setInputValue(value);
        }}
        onChange={(event, values) => {
          handleAutocompleteChange(field, values);
          setInputValue("");
        }}
        sx={{
          flex: 1,
          minWidth: 0,

          "& .MuiAutocomplete-inputRoot": {
            padding: "2px 0 !important",
            gap: "4px",
          },

          "& .MuiAutocomplete-tag": {
            margin: "2px !important",
            height: 28,
            fontSize: "12px",
            backgroundColor: "#edf7f2",
          },

          "& .MuiChip-label": {
            px: 1,
          },

          "& .MuiAutocomplete-input": {
            padding: "6px 4px !important",
            fontSize: "12.5px",
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="standard"
            onKeyDown={(e) => {
              if (e.key === ",") {
                e.preventDefault();

                const value = inputValue.trim();

                if (value) {
                  updateMultiValue(field, value);
                  setInputValue("");
                }
              }
            }}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
            }}
          />
        )}
      />
    );
  };

  const addFamilyHistory = () => {
    if (!editable) return;

    const condition = sanitizeText(
      familyCondition.trim()
    );

    if (!condition || !familyMember) return;

    const newHistory = {
      medical_condition: condition,
      family_member: familyMember,
    };

    const updatedHistory = [
      ...familyHistory,
      newHistory,
    ];

    setFamilyHistory(updatedHistory);

    handleChange(
      "familyMedicalHistory",
      updatedHistory
    );

    setFamilyCondition("");
    setFamilyMember("");
  };

  const removeFamilyHistory = (index) => {
    if (!editable) return;

    const updatedHistory = familyHistory.filter(
      (_, i) => i !== index
    );

    setFamilyHistory(updatedHistory);

    handleChange(
      "familyMedicalHistory",
      updatedHistory
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* TOP SECTION */}
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
        {/* LEFT */}
        <Stack
          spacing={1.2}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* BLOOD GROUP */}
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

          {/* ALLERGIES */}
          <Box
            sx={{
              ...boxStyle,
              alignItems: "flex-start",
              minHeight: 50,
            }}
          >
            <Typography
              sx={{
                ...labelStyle,
                pt: 1,
              }}
            >
              Allergies
            </Typography>

            {renderMultiSelect(
              "allergies",
              allergyOptions,
              editable
                ? "Search or type allergy..."
                : "Not provided"
            )}
          </Box>
        </Stack>

        {/* DIVIDER */}
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

        {/* RIGHT */}
        <Stack
          spacing={1.2}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* EXISTING CONDITIONS */}
          <Box
            sx={{
              ...boxStyle,
              alignItems: "flex-start",
              minHeight: 50,
            }}
          >
            <Typography
              sx={{
                ...labelStyle,
                pt: 1,
              }}
            >
              Existing Conditions
            </Typography>

            {renderMultiSelect(
              "existingConditions",
              conditionOptions,
              editable
                ? "Search or type condition..."
                : "Not provided"
            )}
          </Box>
        </Stack>
      </Box>

      {/* SHORT BIO */}
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

      {/* FAMILY MEDICAL HISTORY */}
      <Box
        sx={{
          mt: 2.5,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: {
            xs: 1.5,
            sm: 2,
          },
          backgroundColor:
            theme.palette.background.paper,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Family Medical History
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: theme.palette.text.secondary,
                mt: 0.3,
              }}
            >
              Health conditions that have occurred in your
              family.
            </Typography>
          </Box>

          {editable && (
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                setShowFamilyHistory(
                  !showFamilyHistory
                )
              }
              sx={{
                minWidth: "auto",
                px: 1.3,
                py: 0.5,
                borderColor:
                  theme.palette.text.primary,
                color: theme.palette.text.primary,
                fontSize: "11px",
                textTransform: "none",
                borderRadius: 1.5,
                whiteSpace: "nowrap",
              }}
            >
              {showFamilyHistory
                ? "− Hide"
                : "+ Add History"}
            </Button>
          )}
        </Box>

        {/* ADD FORM */}
        {showFamilyHistory && editable && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: "#edf7f2",
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 1,
              alignItems: {
                xs: "stretch",
                sm: "flex-end",
              },
            }}
          >
            {/* MEDICAL CONDITION */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: theme.palette.text.secondary,
                  mb: 0.4,
                }}
              >
                Medical Condition
              </Typography>

              <Autocomplete
                freeSolo
                options={conditionOptions}
                value={familyCondition}
                inputValue={familyCondition}
                onInputChange={(event, value) =>
                  setFamilyCondition(value)
                }
                onChange={(event, value) =>
                  setFamilyCondition(value || "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search or enter condition"
                    size="small"
                    sx={{
                      backgroundColor:
                        theme.palette.background.paper,

                      "& .MuiOutlinedInput-root": {
                        fontSize: "12px",
                        height: 35,
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* FAMILY MEMBER */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: theme.palette.text.secondary,
                  mb: 0.4,
                }}
              >
                Family Member
              </Typography>

              <select
                value={familyMember}
                onChange={(e) =>
                  setFamilyMember(e.target.value)
                }
                style={{
                  width: "100%",
                  height: 35,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                  padding: "0 10px",
                  backgroundColor:
                    theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontSize: "12px",
                  outline: "none",
                }}
              >
                <option value="">
                  Select relation
                </option>

                {familyMembers.map((member) => (
                  <option
                    key={member}
                    value={member}
                  >
                    {member}
                  </option>
                ))}
              </select>
            </Box>

            {/* ADD */}
            <Button
              variant="contained"
              onClick={addFamilyHistory}
              disabled={
                !familyCondition.trim() ||
                !familyMember
              }
              sx={{
                minWidth: 50,
                height: 35,
                backgroundColor:
                  theme.palette.primary.main,
                fontSize: "12px",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor:
                    theme.palette.primary.dark,
                  boxShadow: "none",
                },
              }}
            >
              Add
            </Button>
          </Box>
        )}

        {/* HISTORY LIST */}
        {familyHistory.length > 0 && (
          <Box
            sx={{
              mt: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1.5,
              overflow: "hidden",
            }}
          >
            {/* TABLE HEADER */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr 30px",
                  sm: "1fr 1fr 40px",
                },
                px: 1.5,
                py: 0.8,
                backgroundColor: "#edf7f2",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",
                  color: theme.palette.text.secondary,
                }}
              >
                Medical Condition
              </Typography>

              <Typography
                sx={{
                  fontSize: "10px",
                  color: theme.palette.text.secondary,
                }}
              >
                Family Member
              </Typography>

              <Box />
            </Box>

            {/* ROWS */}
            {familyHistory.map((item, index) => (
              <Box
                key={`${item.medical_condition}-${index}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr 30px",
                    sm: "1fr 1fr 40px",
                  },
                  alignItems: "center",
                  px: 1.5,
                  py: 1,
                  borderBottom:
                    index !== familyHistory.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: theme.palette.text.primary,
                  }}
                >
                  {item.medical_condition}
                </Typography>

                <Box>
                  <Typography
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.4,
                      borderRadius: 5,
                      backgroundColor: "#edf7f2",
                      color:
                        theme.palette.primary.main,
                      fontSize: "10px",
                    }}
                  >
                    {item.family_member}
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  disabled={!editable}
                  onClick={() =>
                    removeFamilyHistory(index)
                  }
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: "13px",
                    color:
                      theme.palette.text.secondary,
                  }}
                >
                  ×
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

      </Box>

      {/* ADDRESS */}
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
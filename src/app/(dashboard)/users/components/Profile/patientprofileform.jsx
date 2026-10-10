"use client";
import FamilyMedicalHistory from "./FamilyMedicalHistory";
import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Button,
  IconButton,
  Collapse,
  Chip,
  MenuItem,
} from "@mui/material";
import {
  ExpandMore,
  FamilyRestroomOutlined,
  AddRounded,
  CloseRounded,
} from "@mui/icons-material";
import UserAddress from "../Profile/UserAddress";
const normalizeFamilyHistory = (value) => {
  const records = Array.isArray(value) ? value : value ? [value] : [];

  return records
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      medical_condition: String(
        item.medical_condition ?? item.Medical_Condition ?? ""
      ).trim(),
      family_member: String(
        item.family_member ?? item.Family_Member ?? ""
      ).trim(),
    }))
    .filter((item) => item.medical_condition || item.family_member);
};
const ALLERGIES = [
  "Dust", "Eggs", "Wheat", "Soy", "Shellfish", "Milk", "Peanuts",
  "Fish", "Insect Sting", "Penicillin", "Pollen", "Latex",
  "Dust Mites", "Pet Dander",
];

const CONDITIONS = [
  "Diabetes", "Hypertension", "Thyroid Disorder", "Heart Disease",
  "Arthritis", "Migraine", "Asthma", "Kidney Disease",
  "Epilepsy", "Tuberculosis", "PCOS", "Anemia",
];

const MEMBERS = [
  "Father", "Mother", "Brother", "Sister", "Grandfather",
  "Grandmother", "Uncle", "Aunt", "Son", "Daughter",
];

const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",
];

const cleanText = (value) =>
  String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, 250);

const getValues = (value) =>
  (Array.isArray(value) ? value : String(value || "").split(","))
    .map((item) => String(item).trim())
    .filter(Boolean);

const fieldSx = {
  "& .MuiInputBase-root": { fontSize: 12.5, bgcolor: "white" },
  "& .MuiInputLabel-root": { fontSize: 12 },
};

const labelSx = {
  fontSize: 12.5,
  fontWeight: 600,
  minWidth: { xs: 105, sm: 125 },
  flexShrink: 0,
};

export default function PatientProfileForm({
  formData = {},
  editable,
  handleChange,
}) {
  const [inputs, setInputs] = useState({
    allergies: "",
    existingConditions: "",
  });
  const [familyExpanded, setFamilyExpanded] = useState(false);
  const [showFamilyHistory, setShowFamilyHistory] = useState(false);
  const [familyCondition, setFamilyCondition] = useState("");
  const [familyMember, setFamilyMember] = useState("");

  const familyHistory = Array.isArray(formData.familyMedicalHistory)
    ? formData.familyMedicalHistory
    : [];

  const rowSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    minWidth: 0,
    minHeight: 43,
    px: 1.5,
    py: 0.7,
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 1.5,
    bgcolor: "background.default",
    "&:focus-within": {
      borderColor: editable ? "primary.main" : "divider",
    },
  };

  const setInput = (field, value) =>
    setInputs((prev) => ({ ...prev, [field]: value }));

  const updateValues = (field, values) => {
    if (!editable) return;

    const unique = values
      .map((value) => cleanText(value).trim())
      .filter(Boolean)
      .filter(
        (value, index, array) =>
          array.findIndex(
            (item) => item.toLowerCase() === value.toLowerCase()
          ) === index
      );

    handleChange(field, unique.join(", "));
  };

  const renderMultiSelect = (field, options, placeholder) => (
    <Autocomplete
      multiple
      freeSolo
      filterSelectedOptions
      options={options}
      value={getValues(formData[field])}
      inputValue={inputs[field]}
      disabled={!editable}
      onInputChange={(_, value) => setInput(field, value)}
      onChange={(_, values) => {
        updateValues(field, values);
        setInput(field, "");
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
          fontSize: 12,
          bgcolor: "#EDF7F2",
        },
        "& .MuiAutocomplete-input": {
          padding: "6px 4px !important",
          fontSize: 12.5,
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder={
            getValues(formData[field]).length
              ? ""
              : editable
                ? placeholder
                : "Not provided"
          }
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
          }}
          onKeyDown={(event) => {
            if (!editable || event.key !== ",") return;

            event.preventDefault();

            if (inputs[field].trim()) {
              updateValues(field, [
                ...getValues(formData[field]),
                ...inputs[field].split(","),
              ]);
              setInput(field, "");
            }
          }}
        />
      )}
    />
  );

  const toggleFamilyForm = () => {
    setFamilyExpanded(true);
    setShowFamilyHistory((prev) => !prev);
  };

  const addFamilyHistory = () => {
    const condition = cleanText(familyCondition).trim();

    if (!editable || !condition || !familyMember) return;

    handleChange("familyMedicalHistory", [
      ...familyHistory,
      {
        medical_condition: condition,
        family_member: familyMember,
      },
    ]);

    setFamilyCondition("");
    setFamilyMember("");
  };

  const historyColumns = editable
    ? "minmax(0, 1fr) minmax(0, 1fr) 30px"
    : "minmax(0, 1fr) minmax(0, 1fr)";

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 1.2, md: 2.5 },
        }}
      >
        <Stack spacing={1.2} sx={{ minWidth: 0 }}>
          <Box sx={rowSx}>
            <Typography sx={labelSx}>Blood Group</Typography>

            <select
              value={formData.bloodGroup || ""}
              disabled={!editable}
              aria-label="Blood Group"
              onChange={(event) =>
                handleChange("bloodGroup", event.target.value)
              }
              style={{
                flex: 1,
                width: "100%",
                minWidth: 0,
                padding: "6px 4px",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "inherit",
                font: "inherit",
                fontSize: 12.5,
                cursor: editable ? "pointer" : "default",
              }}
            >
              <option value="">
                {editable ? "Select Blood Group" : "Not provided"}
              </option>

              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </Box>

          <Box sx={{ ...rowSx, alignItems: "flex-start", minHeight: 50 }}>
            <Typography sx={{ ...labelSx, pt: 1 }}>
              Allergies
            </Typography>

            {renderMultiSelect(
              "allergies",
              ALLERGIES,
              "Search or type allergy..."
            )}
          </Box>
        </Stack>

        <Box
          sx={{
            minWidth: 0,
            pl: { md: 2.5 },
            borderLeft: { md: "1px solid" },
            borderColor: "divider",
          }}
        >
          <Box sx={{ ...rowSx, alignItems: "flex-start", minHeight: 50 }}>
            <Typography sx={{ ...labelSx, pt: 1 }}>
              Existing Conditions
            </Typography>

            {renderMultiSelect(
              "existingConditions",
              CONDITIONS,
              "Search or type condition..."
            )}
          </Box>
        </Box>
      </Box>

      {/* SHORT BIO */}
      <Box sx={{ mt: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            Short Bio
          </Typography>

          {editable && (
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              {(formData.bio || "").length}/500
            </Typography>
          )}
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={2}
          value={formData.bio || ""}
          disabled={!editable}
          placeholder={editable ? "Write a short bio..." : "No bio provided"}
          onChange={(event) => {
            if (editable) {
              handleChange(
                "bio",
                event.target.value.replace(/[<>]/g, "").slice(0, 500)
              );
            }
          }}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: 12.5,
              lineHeight: 1.6,
              bgcolor: "background.default",
              borderRadius: 1.5,
            },
          }}
        />
      </Box>
     <Box sx={{ mt: 2.5 }}>
  <FamilyMedicalHistory
    value={normalizeFamilyHistory(
      formData.familyMedicalHistory ??
      formData.family_medical_history
    )}
    editable={editable}
    onChange={(history) =>
      handleChange("familyMedicalHistory", history)
    }
  />
</Box>

      {/* ADDRESS */}
      <Box sx={{ mt: 2.5 }}>
        <UserAddress
          address={formData.address || {}}
          emergencyContact={formData.emergencyContact || {}}
          editable={editable}
          handleChange={handleChange}
        />
      </Box>
    </Box>
  );
}
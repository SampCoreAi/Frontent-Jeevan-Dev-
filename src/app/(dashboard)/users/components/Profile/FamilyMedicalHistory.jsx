"use client";

import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddRounded,
  CloseRounded,
  DeleteOutlineRounded,
  EditOutlined,
  ExpandMore,
  FamilyRestroomOutlined,
} from "@mui/icons-material";

const CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Stroke",
  "High Cholesterol",
  "Cancer",
  "Asthma",
  "Kidney Disease",
  "Thyroid Disorder",
  "Arthritis",
  "Epilepsy",
  "Mental Health Condition",
  "Sickle Cell Disease",
  "Thalassemia",
];

const MEMBERS = [
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
  "Half Brother",
  "Half Sister",
  "Cousin",
];

const EMPTY = {
  medical_condition: "",
  family_member: "",
};

const clean = (value) =>
  String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const fieldSx = {
  "& .MuiInputBase-root": { fontSize: 13, bgcolor: "white" },
  "& .MuiInputLabel-root": { fontSize: 12 },
};

export default function FamilyMedicalHistory(props) {
  return (
    <HistorySection
      key={props.editable ? "editing" : "viewing"}
      {...props}
    />
  );
}

function HistorySection({
  value = [],
  editable = false,
  onChange,
}) {
  const history = Array.isArray(value)
  ? value.filter(
      (item) =>
        clean(item?.medical_condition) ||
        clean(item?.family_member)
    )
  : [];
  const [expanded, setExpanded] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState({ ...EMPTY });
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [error, setError] = useState("");

  const editingRecord = editIndex !== null;
  const columns = editable
    ? "minmax(0, 1fr) minmax(0, 1fr) 64px"
    : "minmax(0, 1fr) minmax(0, 1fr)";

  const closeForm = () => {
    setFormOpen(false);
    setDraft({ ...EMPTY });
    setEditIndex(null);
    setError("");
  };

  const openForm = (index = null) => {
    if (!editable) return;

    setDraft(
      index === null
        ? { ...EMPTY }
        : {
            medical_condition: history[index]?.medical_condition || "",
            family_member: history[index]?.family_member || "",
          }
    );
    setEditIndex(index);
    setError("");
    setExpanded(true);
    setFormOpen(true);
  };

  const updateDraft = (field, nextValue) => {
    setDraft((prev) => ({ ...prev, [field]: nextValue }));
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    if (!editable) return;

    const condition = clean(draft.medical_condition);
    const member = clean(draft.family_member);

    if (!condition || !member) {
      setError("Enter a medical condition and select a family member.");
      return;
    }

    if (condition.length > 250) {
      setError("Medical condition must be 250 characters or fewer.");
      return;
    }

    const entry = {
      ...(editingRecord ? history[editIndex] : {}),
      medical_condition: condition,
      family_member: member,
    };

    onChange(
      editingRecord
        ? history.map((item, index) =>
            index === editIndex ? entry : item
          )
        : [...history, entry]
    );

    closeForm();
  };

  const deleteRecord = () => {
    if (!editable || deleteIndex === null) return;

    onChange(history.filter((_, index) => index !== deleteIndex));
    closeForm();
    setDeleteIndex(null);
  };

  return (
    <Box
      sx={{
        border: "1px solid #DDE9E5",
        borderRadius: 2,
        bgcolor: "white",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ px: 1.5, minHeight: 54 }}
      >
        <Box
          component="button"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 1.5,
            px: 0,
            border: 0,
            bgcolor: "transparent",
            color: "inherit",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <FamilyRestroomOutlined
            sx={{ fontSize: 20, color: "#07876A", flexShrink: 0 }}
          />

          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            Family Medical History
          </Typography>
        </Box>

        {editable && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddRounded />}
            onClick={() => openForm()}
            disabled={formOpen}
            sx={{
              flexShrink: 0,
              fontSize: 11,
              textTransform: "none",
              whiteSpace: "nowrap",
              borderColor: "#DDE9E5",
            }}
          >
            Add History
          </Button>
        )}

        <IconButton
          size="small"
          aria-label={expanded ? "Collapse history" : "Expand history"}
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <ExpandMore
            sx={{
              fontSize: 20,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 250ms ease",
            }}
          />
        </IconButton>
      </Stack>

      <Collapse in={expanded} timeout="auto">
        <Box sx={{ p: 1.5, borderTop: "1px solid #DDE9E5" }}>
          <Collapse in={editable && formOpen} timeout="auto" unmountOnExit>
            <Box
              component="form"
              onSubmit={submit}
              sx={{
                p: 1.5,
                mb: history.length ? 1.5 : 0,
                border: "1px solid #DDE9E5",
                borderRadius: 1.5,
                bgcolor: "#F8FAF9",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.5 }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                  {editingRecord ? "Edit family history" : "Add family history"}
                </Typography>

                <IconButton
                  size="small"
                  aria-label="Close entry form"
                  onClick={closeForm}
                >
                  <CloseRounded sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.5,
                }}
              >
                <Autocomplete
                  options={MEMBERS}
                  value={draft.family_member || null}
                  onChange={(_, member) =>
                    updateDraft("family_member", member || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Family Member"
                      size="small"
                      sx={fieldSx}
                    />
                  )}
                />

                <Autocomplete
                  freeSolo
                  options={CONDITIONS}
                  value={draft.medical_condition || null}
                  inputValue={draft.medical_condition}
                  onInputChange={(_, condition) =>
                    updateDraft("medical_condition", condition)
                  }
                  onChange={(_, condition) =>
                    updateDraft("medical_condition", condition || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Medical Condition"
                      placeholder="Select or type a condition"
                      size="small"
                      sx={fieldSx}
                    />
                  )}
                />
              </Box>

              {error && (
                <Typography
                  role="alert"
                  color="error"
                  sx={{ mt: 1, fontSize: 12 }}
                >
                  {error}
                </Typography>
              )}

              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={1}
                sx={{ mt: 1.5 }}
              >
                <Button
                  size="small"
                  onClick={closeForm}
                  sx={{ fontSize: 12, textTransform: "none" }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  disabled={
                    !clean(draft.medical_condition) ||
                    !draft.family_member
                  }
                  sx={{
                    fontSize: 12,
                    textTransform: "none",
                    boxShadow: "none",
                  }}
                >
                  {editingRecord ? "Update entry" : "Add entry"}
                </Button>
              </Stack>
            </Box>
          </Collapse>

          {!history.length && !formOpen && (
            <Typography
              sx={{
                py: 2,
                textAlign: "center",
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              No records found
            </Typography>
          )}

          {history.length > 0 && (
            <Box
              sx={{
                border: "1px solid #DDE9E5",
                borderRadius: 1.5,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: columns,
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  bgcolor: "#F8FAF9",
                }}
              >
                {["Medical Condition", "Family Member"].map((label) => (
                  <Typography
                    key={label}
                    sx={{ fontSize: 11, color: "text.secondary" }}
                  >
                    {label}
                  </Typography>
                ))}
              </Box>

              {history.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: columns,
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    borderTop: "1px solid #DDE9E5",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12, overflowWrap: "anywhere" }}
                  >
                    {item.medical_condition || ""}
                  </Typography>

                  <Typography
                    sx={{ fontSize: 12, overflowWrap: "anywhere" }}
                  >
                    {item.family_member || ""}
                  </Typography>

                  {editable && (
                    <Stack direction="row">
                      <IconButton
                        size="small"
                        aria-label="Edit history entry"
                        disabled={formOpen}
                        onClick={() => openForm(index)}
                      >
                        <EditOutlined sx={{ fontSize: 17 }} />
                      </IconButton>

                      <IconButton
                        size="small"
                        aria-label="Delete history entry"
                        disabled={formOpen}
                        onClick={() => setDeleteIndex(index)}
                        sx={{
                          "&:hover": {
                            color: "error.main",
                            bgcolor: "#FEF2F2",
                          },
                        }}
                      >
                        <DeleteOutlineRounded sx={{ fontSize: 17 }} />
                      </IconButton>
                    </Stack>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Collapse>

      <Dialog
        open={editable && deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        maxWidth="xs"
        fullWidth
        aria-labelledby="delete-family-history-title"
      >
        <DialogTitle
          id="delete-family-history-title"
          sx={{ fontSize: 16 }}
        >
          Delete this entry?
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: 13 }}>
            {history[deleteIndex]?.medical_condition}
            {" — "}
            {history[deleteIndex]?.family_member}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>
            Cancel
          </Button>
          <Button color="error" onClick={deleteRecord}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
"use client";

import { useEffect, useState } from "react";
import {
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  LocalOfferOutlined,
  NotesOutlined,
  PercentOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const STORAGE_KEY = "medical-purchase-settings";
const green = "#07876A";
const border = "#DDE9E5";
const muted = "#71827B";

const initialSettings = {
  defaultGst: "5",
  defaultDiscount: "0",
  noteTemplates: [],
};

const cardSx = {
  p: { xs: 2, sm: 2.5 },
  borderColor: border,
  borderRadius: 2.5,
  boxShadow: "0 3px 14px rgba(29,43,38,0.04)",
};

function SectionHeading({ icon, title, subtitle, action }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={1}
      sx={{ mb: 2.5 }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          sx={{
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            color: green,
            bgcolor: "#EAF8F4",
            borderRadius: 1.5,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1D2B26" }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 12, color: muted, mt: 0.25 }}>
            {subtitle}
          </Typography>
        </Box>
      </Stack>
      {action}
    </Stack>
  );
}

export default function PurchaseSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [noteDialog, setNoteDialog] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: "", text: "" });
  const [noteError, setNoteError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      setSettings({ ...initialSettings, ...JSON.parse(stored) });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
  };

  const openNoteDialog = (note) => {
    setEditingNoteId(note?.id || null);
    setNoteForm({ title: note?.title || "", text: note?.text || "" });
    setNoteError("");
    setNoteDialog(true);
  };

  const saveNote = () => {
    if (!noteForm.title.trim() || !noteForm.text.trim()) {
      setNoteError("Enter both a template name and note.");
      return;
    }

    const note = {
      id: editingNoteId || crypto.randomUUID(),
      title: noteForm.title.trim(),
      text: noteForm.text.trim(),
    };

    setSettings((current) => ({
      ...current,
      noteTemplates: editingNoteId
        ? current.noteTemplates.map((item) =>
            item.id === editingNoteId ? note : item,
          )
        : [...current.noteTemplates, note],
    }));

    setNoteDialog(false);
    setNoteError("");
  };

  const deleteNote = (id) => {
    setSettings((current) => ({
      ...current,
      noteTemplates: current.noteTemplates.filter((note) => note.id !== id),
    }));
  };

  return (
    <Box sx={{  mx: "auto", pb: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        gap={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveOutlined />}
          onClick={saveSettings}
          sx={{
            bgcolor: green,
            px: 2,
            py: 1,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": { bgcolor: "#06765D", boxShadow: "none" },
          }}
        >
          Save Settings
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
          alignItems: "start",
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={cardSx}>
          <SectionHeading
            icon={<PercentOutlined sx={{ color: "#52645D", fontSize: 19 }} />}
            title="Default Values"
            subtitle="Used for new medicine rows"
          />

          <Stack spacing={2}>
            <TextField
              label="Default GST"
              type="number"
              size="small"
              fullWidth
              value={settings.defaultGst}
              inputProps={{ min: 0, max: 100 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onChange={(event) =>
                updateSetting("defaultGst", event.target.value)
              }
            />

            <TextField
              label="Default Discount"
              type="number"
              size="small"
              fullWidth
              value={settings.defaultDiscount}
              inputProps={{ min: 0, max: 100 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onChange={(event) =>
                updateSetting("defaultDiscount", event.target.value)
              }
            />
          </Stack>

          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: "#F5FAF8",
              border: `1px solid ${border}`,
              borderRadius: 1.5,
            }}
          >
            <Typography sx={{ fontSize: 12, color: "#52645D", lineHeight: 1.6 }}>
              These values will prefill new rows. You can change GST or discount
              for an individual medicine when needed.
            </Typography>
          </Box>

          <Typography sx={{ mt: 1.25, fontSize: 12, color: muted }}>
            Free quantity starts at 0.
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={cardSx}>
          <SectionHeading
            icon={<NotesOutlined sx={{ color: "#52645D", fontSize: 19 }}  />}
            title="Note Templates"
            subtitle="Save notes to reuse in purchase entries"
            action={
              <Chip
                size="small"
                label={settings.noteTemplates.length}
                sx={{ bgcolor: "#F1F6F3", color: "#52645D", fontWeight: 700 }}
              />
            }
          />

          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={() => openNoteDialog()}
            sx={{
              mb: 1.5,
              py: 1,
              borderColor: "#A9CFC1",
              color: green,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { borderColor: green, bgcolor: "#F7FBF9" },
            }}
          >
            Add Note Template
          </Button>

          {settings.noteTemplates.length ? (
            <Stack spacing={1}>
              {settings.noteTemplates.map((note) => (
                <Paper
                  key={note.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderColor: border,
                    borderRadius: 1.5,
                    bgcolor: "#FCFEFD",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    gap={1}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        {note.title}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.5,
                          color: muted,
                          fontSize: 13,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {note.text}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.25}>
                      <IconButton
                        size="small"
                        aria-label="Edit note"
                        onClick={() => openNoteDialog(note)}
                        sx={{ color: "#52645D" }}
                      >
                        <EditOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Delete note"
                        onClick={() => deleteNote(note.id)}
                        sx={{ color: "#C43D3D" }}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                bgcolor: "#F8FBF9",
                border: `1px dashed ${border}`,
                borderRadius: 1.5,
              }}
            >
              <LocalOfferOutlined sx={{ color: "#8AA69B", mb: 0.75 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#52645D" }}>
                No note templates yet
              </Typography>
              <Typography sx={{ mt: 0.4, fontSize: 12, color: muted }}>
                Add a template to reuse a note in future purchases.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <Dialog
        open={noteDialog}
        onClose={() => setNoteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingNoteId ? "Edit Note Template" : "Add Note Template"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Template Name"
              placeholder="e.g. Delivery Instructions"
              size="small"
              value={noteForm.title}
              onChange={(event) =>
                setNoteForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
            <TextField
              label="Note"
              placeholder="Enter the note to reuse in Purchase Entry"
              multiline
              minRows={3}
              value={noteForm.text}
              onChange={(event) =>
                setNoteForm((current) => ({
                  ...current,
                  text: event.target.value,
                }))
              }
            />
            {noteError && <Alert severity="error">{noteError}</Alert>}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setNoteDialog(false)}
            sx={{ color: muted, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveNote}
            sx={{
              bgcolor: green,
              textTransform: "none",
              "&:hover": { bgcolor: "#06765D" },
            }}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={saved}
        autoHideDuration={2500}
        onClose={() => setSaved(false)}
      >
        <Alert severity="success" onClose={() => setSaved(false)}>
          Settings saved successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutline,
  SearchOutlined,
  FilterListOutlined,
  CloseOutlined,
  SaveOutlined,
  ExpandMoreOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const primary = "#07876A";

const emptyForm = {
  name: "",
  salt: "",
  manufacturer: "",
  form: "Tablet",
  gst: "",
  hsn: "",
  barcode: "",
};

const initialData = [
  { id: 1, name: "Dolo 650", salt: "Paracetamol", manufacturer: "Micro Labs", form: "Tablet", gst: 5, hsn: "30049099", barcode: "8901148100123" },
  { id: 2, name: "Augmentin 625", salt: "Amoxicillin + Clavulanic Acid", manufacturer: "GSK", form: "Tablet", gst: 12, hsn: "30041090", barcode: "8901571001234" },
  { id: 3, name: "Crocin Advance", salt: "Paracetamol", manufacturer: "GSK", form: "Tablet", gst: 5, hsn: "30049099", barcode: "" },
  { id: 4, name: "Cetirizine 10", salt: "Cetirizine", manufacturer: "Cipla", form: "Tablet", gst: 5, hsn: "30049099", barcode: "8901234567890" },
  { id: 5, name: "Cough Syrup", salt: "Dextromethorphan", manufacturer: "Abbott", form: "Syrup", gst: 12, hsn: "", barcode: "" },
  { id: 6, name: "Vitamin C", salt: "Ascorbic Acid", manufacturer: "HealthKart", form: "Capsule", gst: 5, hsn: "29362700", barcode: "8905678901234" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
  "& .MuiInputLabel-root": { fontSize: 13 },
  "& .MuiInputBase-input": { fontSize: 13 },
};

const fields = [
  { key: "name", label: "Medicine name", placeholder: "e.g. Dolo 650", required: true },
  { key: "salt", label: "Salt / Ingredient", placeholder: "e.g. Paracetamol" },
  { key: "manufacturer", label: "Manufacturer", placeholder: "Company name" },
  { key: "gst", label: "GST %", placeholder: "e.g. 5", required: true, type: "number" },
  { key: "hsn", label: "HSN code", placeholder: "Enter HSN code" },
  { key: "barcode", label: "Barcode (optional)", placeholder: "Scan or type" },
];

export default function QuickAddPage() {
  const [medicines, setMedicines] = useState(initialData);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [message, setMessage] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [csvMode, setCsvMode] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const filtered = useMemo(
    () =>
      medicines.filter((m) => {
        const text = `${m.name} ${m.salt} ${m.manufacturer} ${m.hsn} ${m.barcode}`.toLowerCase();
        const matchesSearch = text.includes(search.toLowerCase());
        const status = m.hsn && m.manufacturer ? "Complete" : "Incomplete";
        return matchesSearch && (statusFilter === "All" || status === statusFilter);
      }),
    [medicines, search, statusFilter]
  );

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setMessage("");
    setCsvMode(false);
    setCsvFile(null);
    setOpen(true);
  };

  const openEdit = (medicine) => {
    setForm({
      name: medicine.name,
      salt: medicine.salt,
      manufacturer: medicine.manufacturer,
      form: medicine.form,
      gst: String(medicine.gst ?? ""),
      hsn: medicine.hsn,
      barcode: medicine.barcode,
    });
    setEditing(medicine.id);
    setMessage("");
    setCsvMode(false);
    setCsvFile(null);
    setOpen(true);
  };

  const saveMedicine = () => {
    if (
      !form.name.trim() ||
      form.gst === "" ||
      !Number.isFinite(Number(form.gst)) ||
      Number(form.gst) < 0 ||
      Number(form.gst) > 100
    ) {
      setMessage("Medicine name aur valid GST % required hai.");
      return;
    }

    const medicine = {
      ...form,
      id: editing ?? Date.now(),
      name: form.name.trim(),
      gst: Number(form.gst),
    };

    setMedicines((prev) =>
      editing
        ? prev.map((m) => (m.id === editing ? medicine : m))
        : [medicine, ...prev]
    );

    setPage(0);
    setOpen(false);
    setMessage("");
  };

  const deleteMedicine = (id) => {
    if (window.confirm("Kya aap is medicine ko delete karna chahte hain?")) {
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      setPage(0);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPage(0);
  };

  const inputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box sx={{ color: "#172033" }}>
     
<Stack
  direction={{ xs: "column", md: "row" }}
  justifyContent="space-between"
  alignItems={{ xs: "stretch", md: "center" }}
  gap={1.5}
  sx={{ mb: 2 }}
>
  <Box>
    <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
      Medicine Quick Add
    </Typography>
    <Typography sx={{ fontSize: 12, color: "#71827B", mt: 0.5 }}>
      Medicine catalog manage karein, add karein aur details edit karein.
    </Typography>
  </Box>

  <Stack
    direction="row"
    alignItems="center"
    gap={1}
    flexWrap="wrap"
  >
    <TextField
      size="small"
      placeholder="Search medicine..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(0);
      }}
      InputProps={{
        startAdornment: (
          <SearchOutlined sx={{ fontSize: 19, color: "#71827B", mr: 1 }} />
        ),
      }}
      sx={{
        ...fieldSx,
        width: { xs: "100%", sm: 220 },
        flex: { xs: "1 1 100%", sm: "0 0 auto" },
      }}
    />

    <Button
      variant="outlined"
      startIcon={<FilterListOutlined />}
      endIcon={<ExpandMoreOutlined />}
      onClick={() => setFilterOpen((prev) => !prev)}
      sx={{
        borderColor: "#DDE9E5",
        color: "#42554D",
        textTransform: "none",
        borderRadius: 2,
        whiteSpace: "nowrap",
      }}
    >
      Filter
    </Button>

    <Button
      variant="contained"
      startIcon={<AddOutlined />}
      onClick={openAdd}
      sx={{
        bgcolor: "#07876A",
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 2,
        boxShadow: "none",
        whiteSpace: "nowrap",
        "&:hover": { bgcolor: "#066D56", boxShadow: "none" },
      }}
    >
      Quick Add
    </Button>
  </Stack>
</Stack>

<Collapse in={filterOpen}>
  <Paper
    variant="outlined"
    sx={{
      p: 1.5,
      mb: 2,
      borderColor: "#DDE9E5",
      borderRadius: 2,
    }}
  >
    <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
        >
          <MenuItem value="All">All medicines</MenuItem>
          <MenuItem value="Complete">Complete</MenuItem>
          <MenuItem value="Incomplete">Incomplete</MenuItem>
        </Select>
      </FormControl>

      <Button
        onClick={() => {
          setStatusFilter("All");
          setSearch("");
          setPage(0);
        }}
        sx={{ color: "#07876A", textTransform: "none" }}
      >
        Reset
      </Button>
    </Stack>
  </Paper>
</Collapse>



      <Paper
        variant="outlined"
        sx={{ borderColor: "#DDE9E5", borderRadius: 3, overflow: "hidden" }}
      >
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F3F8F5" }}>
                {[
                  "Medicine Name",
                  "Salt / Ingredient",
                  "Manufacturer",
                  "Dosage Form",
                  "GST %",
                  "HSN Code",
                  "Barcode",
                  "Status",
                  "Action",
                ].map((label) => (
                  <TableCell
                    key={label}
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#52635C",
                      py: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((m) => {
                  const status = m.hsn && m.manufacturer ? "Complete" : "Incomplete";

                  return (
                    <TableRow key={m.id} hover>
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                        {m.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, maxWidth: 190 }}>
                        {m.salt || "—"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {m.manufacturer || "—"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{m.form}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{m.gst}%</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{m.hsn || "—"}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{m.barcode || "—"}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={status}
                          sx={{
                            fontSize: 10,
                            height: 23,
                            fontWeight: 600,
                            bgcolor: status === "Complete" ? "#E5F5ED" : "#FFF3DB",
                            color: status === "Complete" ? "#08764F" : "#A46608",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" gap={0.5}>
                          <IconButton
                            size="small"
                            title="Edit"
                            onClick={() => openEdit(m)}
                            sx={{ color: primary }}
                          >
                            <EditOutlined sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Delete"
                            onClick={() => deleteMedicine(m.id)}
                            sx={{ color: "#D14343" }}
                          >
                            <DeleteOutline sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!filtered.length && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ py: 6, color: "#71827B", fontSize: 13 }}
                  >
                    Koi medicine nahi mili.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={Math.min(page, Math.max(0, Math.ceil(filtered.length / rowsPerPage) - 1))}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: "1px solid #EDF2EF",
            "& .MuiTablePagination-toolbar": { minHeight: 48 },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: 11,
            },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
       <DialogTitle
  sx={{
    px: 2.5,
    py: 2,
    borderBottom: "1px solid #E8EFEC",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{ width: "100%", gap: 2 }}
  >
    <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#172033" }}>
      {editing
        ? "Edit Medicine"
        : csvMode
          ? "Import Medicines from CSV"
          : "Quick Add Medicine"}
    </Typography>

    <Stack direction="row" alignItems="center" gap={1}>
      {!editing && (
        <>
          <Button
            size="small"
            variant="outlined"
            endIcon={<ExpandMoreOutlined />}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{
              borderColor: "#DDE9E5",
              color: primary,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 2,
              px: 1.5,
              py: 0.7,
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: primary,
                bgcolor: "#F3FAF7",
              },
            }}
          >
            {csvMode ? "CSV Import" : "Add Medicine"}
          </Button>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 175,
                  border: "1px solid #E8EFEC",
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(23,32,51,0.10)",
                  "& .MuiMenuItem-root": {
                    fontSize: 13,
                    py: 1.2,
                    gap: 1,
                  },
                },
              },
            }}
          >
            <MenuItem
              selected={!csvMode}
              onClick={() => {
                setCsvMode(false);
                setCsvFile(null);
                setMessage("");
                setMenuAnchor(null);
              }}
            >
              <AddOutlined sx={{ fontSize: 18, color: primary }} />
              Manually
            </MenuItem>

            <MenuItem
              selected={csvMode}
              onClick={() => {
                setCsvMode(true);
                setCsvFile(null);
                setMessage("");
                setMenuAnchor(null);
              }}
            >
              <UploadFileOutlined sx={{ fontSize: 18, color: primary }} />
              CSV Import
            </MenuItem>
          </Menu>
        </>
      )}

      <IconButton
        onClick={() => setOpen(false)}
        size="small"
        sx={{
          color: "#64748B",
          borderRadius: 2,
          "&:hover": { bgcolor: "#F1F5F3", color: "#172033" },
        }}
      >
        <CloseOutlined fontSize="small" />
      </IconButton>
    </Stack>
  </Stack>
</DialogTitle>

        <DialogContent sx={{ pt: "20px !important" }}>
          {csvMode ? (
            <Box sx={{ py: 1 }}>
              <Typography sx={{ fontSize: 12, color: "#71827B", mb: 2 }}>
                CSV file upload karein. First row me column headers hone chahiye: name, salt, manufacturer, form, gst, hsn, barcode.
              </Typography>
              {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}
              <Button component="label" variant="outlined" startIcon={<UploadFileOutlined />} sx={{ textTransform: "none", borderColor: "#DDE9E5", color: primary, borderRadius: 2 }}>
                {csvFile ? csvFile.name : "Choose CSV File"}
                <input hidden type="file" accept=".csv,text/csv" onChange={(e) => { setCsvFile(e.target.files?.[0] || null); setMessage(""); }} />
              </Button>
              <Typography sx={{ mt: 1.5, fontSize: 11, color: "#71827B" }}>
                Required columns: name and gst. Existing medicines will remain unchanged.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography sx={{ fontSize: 12, color: "#71827B", mb: 2 }}>
                Medicine details enter karein. Name aur GST required hain.
              </Typography>
              {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}
              <Box
                sx={{
                  display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {fields.slice(0, 3).map((f) => (
              <TextField
                key={f.key}
                label={f.label}
                placeholder={f.placeholder}
                required={f.required}
                value={form[f.key]}
                onChange={(e) => inputChange(f.key, e.target.value)}
                sx={fieldSx}
              />
            ))}

            <FormControl sx={fieldSx}>
              <InputLabel>Dosage form</InputLabel>
              <Select
                value={form.form}
                label="Dosage form"
                onChange={(e) => inputChange("form", e.target.value)}
              >
                {["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Cream", "Ointment", "Powder", "Other"].map((v) => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {fields.slice(3).map((f) => (
              <TextField
                key={f.key}
                label={f.label}
                placeholder={f.placeholder}
                required={f.required}
                type={f.type || "text"}
                value={form[f.key]}
                onChange={(e) => inputChange(f.key, e.target.value)}
                sx={fieldSx}
                slotProps={{
                  htmlInput: f.type === "number" ? { min: 0, max: 100, step: 0.1 } : {},
                }}
              />
            ))}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #EDF2EF" }}>
          <Button onClick={() => { setOpen(false); setCsvMode(false); setCsvFile(null); }} sx={{ color: "#52635C", textTransform: "none" }}>
            Cancel
          </Button>
          {csvMode ? (
            <Button
              variant="contained"
              startIcon={<UploadFileOutlined />}
              disabled={!csvFile}
              onClick={async () => {
                if (!csvFile) return;
                const text = await csvFile.text();
                const rows = text.trim().split(/\r?\n/);
                if (rows.length < 2) { setMessage("CSV file me medicine data nahi hai."); return; }
                const parseRow = (line) => {
                  const cells = [];
                  let value = "", quoted = false;
                  for (let i = 0; i < line.length; i++) {
                    const ch = line[i];
                    if (ch === '"' && line[i + 1] === '"' && quoted) { value += '"'; i++; }
                    else if (ch === '"') quoted = !quoted;
                    else if (ch === "," && !quoted) { cells.push(value.trim()); value = ""; }
                    else value += ch;
                  }
                  cells.push(value.trim());
                  return cells;
                };
                const headers = parseRow(rows[0]).map((h) => h.toLowerCase().replace(/[\s/_-]+/g, ""));
                const index = (...names) => headers.findIndex((h) => names.includes(h));
                const nameIndex = index("name", "medicinename");
                const gstIndex = index("gst", "gst%");
                if (nameIndex < 0 || gstIndex < 0) { setMessage("CSV me name aur gst columns required hain."); return; }
                const imported = rows.slice(1).filter((r) => r.trim()).map((line) => {
                  const c = parseRow(line);
                  const val = (i, fallback = "") => i < 0 ? fallback : c[i] || fallback;
                  return {
                    id: Date.now() + Math.random(),
                    name: val(nameIndex),
                    salt: val(index("salt", "ingredient")),
                    manufacturer: val(index("manufacturer", "company")),
                    form: val(index("form", "dosageform"), "Tablet"),
                    gst: Number(val(gstIndex)),
                    hsn: val(index("hsn", "hsncode")),
                    barcode: val(index("barcode")),
                  };
                }).filter((m) => m.name && Number.isFinite(m.gst) && m.gst >= 0 && m.gst <= 100);
                if (!imported.length) { setMessage("Valid medicine rows nahi mile. Name aur GST check karein."); return; }
                setMedicines((prev) => [...imported, ...prev]);
                setPage(0);
                setOpen(false);
                setCsvMode(false);
                setCsvFile(null);
                setMessage("");
              }}
              sx={{ bgcolor: primary, textTransform: "none", borderRadius: 2, boxShadow: "none", "&:hover": { bgcolor: "#066D56", boxShadow: "none" } }}
            >
              Import Medicines
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={saveMedicine}
              startIcon={<SaveOutlined />}
              sx={{ bgcolor: primary, textTransform: "none", borderRadius: 2, boxShadow: "none", "&:hover": { bgcolor: "#066D56", boxShadow: "none" } }}
            >
              {editing ? "Update Medicine" : "Save Medicine"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

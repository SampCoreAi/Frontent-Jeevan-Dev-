"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import UpdateIcon from "@mui/icons-material/Update";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

const STOCK_KEY = "medical-stock-batches";
const border = "#DDE9E5";
const muted = "#71827B";

const emptyRow = () => ({
  medicine: "",
  batch: "",
  expiry: "",
  mfg: "",
  qty: "",
  free: "0",
  purchase: "",
  mrp: "",
  selling: "",
  gst: "5",
  discount: "0",
});

const batchFields = [
  ["medicine", "Medicine", "Medicine name", 220],
  ["batch", "Batch No.", "Batch no.", 145],
  ["expiry", "Expiry", "MM/YY", 100],
  ["mfg", "MFG", "MM/YY", 100],
  ["qty", "Qty", "0", 72],
  ["purchase", "Purchase ₹", "0.00", 70],
  ["mrp", "MRP ₹", "0.00", 100],
  ["gst", "GST %", "5", 75],
  ["discount", "Discount %", "0", 65],
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    bgcolor: "#fff",
    fontSize: 13,
    "& fieldset": { borderColor: border },
  },
};

const headCell = {
  color: "#52645D",
  fontWeight: 700,
  fontSize: 12,
  whiteSpace: "nowrap",
};

const greenButton = {
  bgcolor: "#07876A",
  color: "#fff",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: 1.5,
  boxShadow: "none",
  "&:hover": { bgcolor: "#06765D", boxShadow: "none" },
};

const outlineButton = {
  color: "#52645D",
  borderColor: border,
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
};

const getAmount = (row) =>
  Number(row.qty || 0) *
  Number(row.purchase || 0) *
  (1 - Number(row.discount || 0) / 100);

function Field({ label, children, ...props }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      {label && (
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, color: "#5F7069", mb: 0.6 }}
        >
          {label}
        </Typography>
      )}
      {children || <TextField fullWidth size="small" sx={inputSx} {...props} />}
    </Box>
  );
}

export default function PurchaseStockPage() {
  const router = useRouter();
  const csvInputRef = useRef(null);

  const [entryMode, setEntryMode] = useState("manual");
  const [supplier, setSupplier] = useState("Medline Distributors");
  const [billNo, setBillNo] = useState("INV-1042");
  const [billDate, setBillDate] = useState("2026-10-27");
  const [note, setNote] = useState("");
  const [rows, setRows] = useState([emptyRow()]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const totalUnits = useMemo(
    () =>
      purchaseItems.reduce(
        (sum, row) => sum + Number(row.qty || 0) + Number(row.free || 0),
        0,
      ),
    [purchaseItems],
  );

  const billValue = useMemo(
    () => purchaseItems.reduce((sum, row) => sum + getAmount(row), 0),
    [purchaseItems],
  );

  const updateRow = (index, key, value) => {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
  };

  const addRow = () => setRows((current) => [...current, emptyRow()]);

  const addToPurchase = (index) => {
    const row = rows[index];
    if (!row.medicine.trim()) return;

    setPurchaseItems((current) => [
      ...current,
      { ...row, id: crypto.randomUUID() },
    ]);

    setRows((current) =>
      current.length > 1 ? current.filter((_, i) => i !== index) : [emptyRow()],
    );
  };

  const saveEntryRow = (index) => {
    const row = rows[index];
    if (!row.medicine.trim()) return;

    if (editingId) {
      setPurchaseItems((current) => [...current, { ...row, id: editingId }]);
      setEditingId(null);
      setRows([emptyRow()]);
    } else {
      addToPurchase(index);
    }
  };

  const editPurchaseItem = (item) => {
    setPurchaseItems((current) =>
      current.filter((entry) => entry.id !== item.id),
    );
    setRows([{ ...item }]);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeRow = (index) => {
    setRows((current) =>
      current.length > 1 ? current.filter((_, i) => i !== index) : [emptyRow()],
    );
  };

  const copyRow = (index) => {
    const row = rows[index];

    setRows((current) => [
      ...current,
      {
        ...emptyRow(),
        medicine: row.medicine,
        purchase: row.purchase,
        mrp: row.mrp,
        selling: row.selling,
        gst: row.gst,
        discount: row.discount,
      },
    ]);
  };

  const importCsv = (file) => {
    if (!file || file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();

    reader.onload = () => {
      const lines = String(reader.result)
        .split(/\r?\n/)
        .filter((line) => line.trim());

      if (!lines.length) return;

      const headers = lines[0]
        .split(",")
        .map((value) => value.trim().toLowerCase());

      const fields = [
        "medicine",
        "batch",
        "expiry",
        "mfg",
        "qty",
        "free",
        "purchase",
        "mrp",
        "selling",
        "gst",
        "discount",
      ];

      const imported = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",").map((value) => value.trim());
          const row = emptyRow();

          fields.forEach((field, index) => {
            const column = headers.indexOf(field);
            const value = values[column < 0 ? index : column];
            if (value !== undefined) row[field] = value;
          });

          return row;
        })
        .filter((row) => row.medicine);

      if (imported.length) setRows(imported);
    };

    reader.readAsText(file);
  };

  const saveStock = () => {
    const validRows = purchaseItems
      .filter((row) => row.medicine && row.batch)
      .map((row) => ({
        ...row,
        supplier,
        billNo,
        billDate,
        note,
        qty: Number(row.qty || 0),
        free: Number(row.free || 0),
        purchase: Number(row.purchase || 0),
        mrp: Number(row.mrp || 0),
        selling: Number(row.selling || 0),
        gst: Number(row.gst || 0),
        discount: Number(row.discount || 0),
      }));

    if (!validRows.length) return;

    const savedRows = JSON.parse(
      localStorage.getItem(STOCK_KEY) || "[]",
    );

    localStorage.setItem(
      STOCK_KEY,
      JSON.stringify([...validRows, ...savedRows]),
    );

    setPurchaseItems([]);
    setRows([emptyRow()]);
    router.push("/medical/pages/stock-management/batches");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        px: { xs: 2, md: 1 },
        color: "#1D2B26",
      }}
    >
      <Paper sx={{ borderRadius: 3, boxShadow: "none" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: "#5F7069", mb: 0.6 }}
            >
              Mode
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={entryMode}
              sx={inputSx}
              onChange={(event) => setEntryMode(event.target.value)}
            >
              <MenuItem value="manual">Manual Entry</MenuItem>
              <MenuItem value="csv">CSV Import</MenuItem>
            </TextField>
          </Box>

          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(event) => {
              importCsv(event.target.files?.[0]);
              event.target.value = "";
            }}
          />

          <Field label="Supplier">
            <TextField
              select
              fullWidth
              size="small"
              value={supplier}
              sx={inputSx}
              onChange={(event) => setSupplier(event.target.value)}
            >
              <MenuItem value="Medline Distributors">
                Medline Distributors - Distributor
              </MenuItem>
              <MenuItem value="HealthCare Supply Co.">
                HealthCare Supply Co. - Distributor
              </MenuItem>
              <MenuItem value="City Pharma Suppliers">
                City Pharma Suppliers - Manufacturer
              </MenuItem>
            </TextField>
          </Field>

          <Field
            label="Supplier bill no."
            value={billNo}
            onChange={(event) => setBillNo(event.target.value)}
          />
          <Field
            label="Bill date"
            type="date"
            value={billDate}
            onChange={(event) => setBillDate(event.target.value)}
          />
          <Field
            label="Note"
            placeholder="Optional"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          sx={{ mt: 3, mb: 2 }}
          gap={1}
        >
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
              Medicine batches
            </Typography>
            <Typography sx={{ color: muted, fontSize: 13 }}>
              Enter the medicine and batch details from the supplier bill.
            </Typography>
          </Box>

          {entryMode === "manual" && (
            <Stack direction="row" gap={1}>
              <Button variant="contained" onClick={addRow} sx={greenButton}>
                + Add row
              </Button>
            </Stack>
          )}
        </Stack>

        {entryMode === "csv" && (
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 4 },
              mb: 2,
              textAlign: "center",
              border: "1.5px dashed #A9CFC1",
              borderRadius: 3,
              bgcolor: "#F7FBF9",
            }}
          >
            <Stack alignItems="center" spacing={1.25}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems="center"
              >
                <Button
                  variant="contained"
                  onClick={() => csvInputRef.current?.click()}
                  startIcon={<CloudUploadOutlinedIcon />}
                  sx={greenButton}
                >
                  Choose CSV file
                </Button>

                <Button
                  component="a"
                  href="/medicine_purchase_template.csv"
                  download
                  startIcon={<DownloadOutlinedIcon />}
                  sx={{ ...outlineButton, border: `1px solid ${border}` }}
                >
                  Download template
                </Button>
              </Stack>

              <Typography sx={{ color: muted, fontSize: 12 }}>
                CSV only · Max 5 MB · Upload ke baad medicines review kar sakte hain
              </Typography>
            </Stack>
          </Paper>
        )}

        {(entryMode === "manual" ||
          rows.some((row) => row.medicine.trim())) && (
          <TableContainer
            sx={{
              display: { xs: "none", md: "block" },
              border: `1px solid ${border}`,
              borderRadius: 1.5,
              overflowX: "auto",
            }}
          >
            <Table size="small" sx={{ width: "100%", tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F1F6F3" }}>
                  {batchFields.map(([key, label, , width]) => (
                    <TableCell
                      key={key}
                      sx={{
                        ...headCell,
                        width,
                        px: 1.2,
                        py: 1.4,
                        bgcolor: "#F1F6F3",
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      ...headCell,
                      width: 150,
                      textAlign: "center",
                      bgcolor: "#F1F6F3",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index} hover>
                    {batchFields.map(([key, , placeholder]) => (
                      <TableCell key={key} sx={{ p: 0.8 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder={placeholder}
                          value={row[key]}
                          onChange={(event) =>
                            updateRow(index, key, event.target.value)
                          }
                          sx={{
                            ...inputSx,
                            "& .MuiOutlinedInput-root": {
                              height: 40,
                              borderRadius: 2,
                            },
                            "& .MuiInputBase-input": {
                              fontSize: 12,
                              px: 1,
                            },
                          }}
                        />
                      </TableCell>
                    ))}

                    <TableCell
                      sx={{
                        p: 0.5,
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={0.75}
                      >
                        <Tooltip
                          title={
                            editingId ? "Update purchase item" : "Add to purchase"
                          }
                        >
                          <Button
                            size="small"
                            onClick={() => saveEntryRow(index)}
                            sx={{
                              ...greenButton,
                              width: 34,
                              minWidth: 34,
                              height: 34,
                              p: 0,
                              flexShrink: 0,
                            }}
                          >
                            {editingId ? (
                              <UpdateIcon sx={{ color: "#fff", fontSize: 20 }} />
                            ) : (
                              <AddIcon sx={{ color: "#fff", fontSize: 20 }} />
                            )}
                          </Button>
                        </Tooltip>

                        <Tooltip title="Copy row">
                          <Button
                            size="small"
                            onClick={() => copyRow(index)}
                            sx={{
                              width: 34,
                              minWidth: 34,
                              height: 34,
                              p: 0,
                              color: "#52645D",
                              bgcolor: "#F3F7F5",
                              flexShrink: 0,
                              "&:hover": { bgcolor: "#E8F1ED" },
                            }}
                          >
                            <ContentCopyIcon
                              sx={{ color: "#52645D", fontSize: 19 }}
                            />
                          </Button>
                        </Tooltip>

                        <Tooltip title="Delete row">
                          <Button
                            size="small"
                            onClick={() => removeRow(index)}
                            sx={{
                              width: 34,
                              minWidth: 34,
                              height: 34,
                              p: 0,
                              color: "#C43D3D",
                              bgcolor: "#FFF3F2",
                              flexShrink: 0,
                              "&:hover": { bgcolor: "#FCE5E3" },
                            }}
                          >
                            <DeleteOutlineIcon
                              sx={{ color: "#C43D3D", fontSize: 20 }}
                            />
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack display={{ xs: "flex", md: "none" }} spacing={1.5}>
          {rows.map((row, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 1.5, borderColor: border, borderRadius: 2 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  Medicine batch {index + 1}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <Button
                    size="small"
                    onClick={() => saveEntryRow(index)}
                    sx={{ ...greenButton, minWidth: 34, p: 0.6 }}
                  >
                    {editingId ? (
                      <UpdateIcon fontSize="small" />
                    ) : (
                      <AddIcon fontSize="small" />
                    )}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => copyRow(index)}
                    sx={{ minWidth: 34, p: 0.6 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => removeRow(index)}
                    sx={{ minWidth: 34, p: 0.6, color: "#C43D3D" }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </Button>
                </Stack>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.2,
                }}
              >
                {batchFields.map(([key, label, placeholder]) => (
                  <Field
                    key={key}
                    label={label}
                    placeholder={placeholder}
                    value={row[key]}
                    onChange={(event) =>
                      updateRow(index, key, event.target.value)
                    }
                  />
                ))}
              </Box>
            </Paper>
          ))}
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
            Items in this Purchase
          </Typography>

          <TableContainer
            sx={{
              border: `1px solid ${border}`,
              borderRadius: 2.5,
              overflowX: "auto",
              boxShadow: "0 2px 10px rgba(29,43,38,0.04)",
            }}
          >
            <Table size="small" sx={{ minWidth: 1120 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F1F6F3" }}>
                  {[
                    "#",
                    "Medicine",
                    "Batch No.",
                    "Expiry (FEFO)",
                    "Qty",
                    "Purchase (₹)",
                    "MRP (₹)",
                    "GST (%)",
                    "Discount (%)",
                    "Amount (₹)",
                    "Action",
                  ].map((label) => (
                    <TableCell
                      key={label}
                      sx={{
                        ...headCell,
                        px: 1.5,
                        py: 1.4,
                        bgcolor: "#F1F6F3",
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {purchaseItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      align="center"
                      sx={{ py: 4, color: muted }}
                    >
                      No medicines added yet. Add medicines from the form above.
                    </TableCell>
                  </TableRow>
                ) : (
                  purchaseItems.map((row, index) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell sx={{ px: 1.5, color: muted }}>
                        {index + 1}
                      </TableCell>
                      <TableCell
                        sx={{ px: 1.5, fontWeight: 600, minWidth: 190 }}
                      >
                        {row.medicine}
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        {row.batch || "—"}
                      </TableCell>
                      <TableCell sx={{ px: 1.5, whiteSpace: "nowrap" }}>
                        {row.expiry || "—"}
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>{row.qty || 0}</TableCell>
                      <TableCell sx={{ px: 1.5, whiteSpace: "nowrap" }}>
                        ₹{Number(row.purchase || 0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ px: 1.5, whiteSpace: "nowrap" }}>
                        ₹{Number(row.mrp || 0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>{row.gst || 0}%</TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        {row.discount || 0}%
                      </TableCell>
                      <TableCell
                        sx={{
                          px: 1.5,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₹{getAmount(row).toFixed(2)}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: 100,
                          px: 1,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          spacing={0.5}
                        >
                          <Tooltip title="Edit item">
                            <Button
                              size="small"
                              onClick={() => editPurchaseItem(row)}
                              sx={{
                                width: 34,
                                minWidth: 34,
                                height: 34,
                                p: 0,
                                color: "#07876A",
                                bgcolor: "#EAF8F4",
                                flexShrink: 0,
                              }}
                            >
                              <EditOutlinedIcon
                                sx={{ color: "#07876A", fontSize: 20 }}
                              />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete item">
                            <Button
                              size="small"
                              onClick={() =>
                                setPurchaseItems((current) =>
                                  current.filter((item) => item.id !== row.id),
                                )
                              }
                              sx={{
                                width: 34,
                                minWidth: 34,
                                height: 34,
                                p: 0,
                                color: "#C43D3D",
                                bgcolor: "#FFF3F2",
                                flexShrink: 0,
                              }}
                            >
                              <DeleteOutlineIcon
                                sx={{ color: "#C43D3D", fontSize: 20 }}
                              />
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="flex-end"
            gap={2}
            sx={{ mt: 1.5 }}
          >
            <Typography sx={{ color: muted }}>
              Line items: <b>{purchaseItems.length}</b>
            </Typography>
            <Typography sx={{ color: muted }}>
              Total units: <b>{totalUnits}</b>
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              Total amount: ₹{billValue.toFixed(2)}
            </Typography>
          </Stack>
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-end"
          gap={1.2}
          sx={{ mt: 2 }}
        >
          <Button onClick={addRow} variant="outlined" sx={outlineButton}>
            <AddIcon sx={{ mr: 0.5 }} /> Add row
          </Button>
          <Button onClick={saveStock} variant="contained" sx={greenButton}>
            Save all stock
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
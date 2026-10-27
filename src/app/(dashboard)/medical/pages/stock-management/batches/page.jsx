"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DeleteOutline,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

const STORAGE_KEY = "medical-stock-batches";
const border = "#DDE9E5";
const green = "#07876A";
const muted = "#71827B";
const headCell = {
  bgcolor: "#F1F6F3",
  color: "#52645D",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};
const sampleRows = [
  {
    slotNo: "SLOT-001",
    supplier: "Medline Distributors",
    billNo: "INV-1042",
    billDate: "2026-10-27",
    medicine: "Paracetamol 500 mg",
    batch: "PC2406",
    mfg: "2025-08-31",
    expiry: "2027-08-31",
    qty: 12,
    free: 0,
    purchase: 18,
    mrp: 30,
    selling: 28,
    gst: 5,
    discount: 0,
  },
  {
    slotNo: "SLOT-001",
    supplier: "Medline Distributors",
    billNo: "INV-1042",
    billDate: "2026-10-27",
    medicine: "Amoxicillin 250 mg",
    batch: "AMX01",
    mfg: "2025-05-01",
    expiry: "2027-04-30",
    qty: 25,
    free: 2,
    purchase: 60,
    mrp: 95,
    selling: 90,
    gst: 5,
    discount: 0,
  },
  {
    slotNo: "SLOT-002",
    supplier: "HealthCare Supply Co.",
    billNo: "INV-1043",
    billDate: "2026-10-26",
    medicine: "Cetirizine 10 mg",
    batch: "CET24B",
    mfg: "2025-09-30",
    expiry: "2027-09-30",
    qty: 40,
    free: 0,
    purchase: 16,
    mrp: 28,
    selling: 25,
    gst: 5,
    discount: 0,
  },
];

const getKey = (row) =>
  row.slotNo ||
  `${row.supplier || ""}|${row.billNo || ""}|${row.billDate || ""}`;

const getAmount = (row) =>
  Number(row.qty || 0) *
  Number(row.purchase || 0) *
  (1 - Number(row.discount || 0) / 100);

const formatDate = (value) => {
  if (!value) return "—";
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}-${month}-${year}`;
};

function getStatus(items) {
  const today = new Date().toISOString().slice(0, 10);
  const expired = items.filter(
    (item) => item.expiry && item.expiry < today,
  ).length;
  const quantity = items.reduce(
    (sum, item) => sum + Number(item.qty || 0) + Number(item.free || 0),
    0,
  );

  if (quantity === 0) return "Completed";
  if (expired === items.length) return "Expired";
  if (expired > 0) return "Partial";
  return "Available";
}

function StatusChip({ status }) {
  const styles = {
    Available: { bgcolor: "#E8F5EF", color: "#33805D" },
    Partial: { bgcolor: "#FFF7E5", color: "#A87500" },
    Expired: { bgcolor: "#FFF2F2", color: "#B83333" },
    Completed: { bgcolor: "#EEF1F0", color: "#64716C" },
  };

  return (
    <Chip
      size="small"
      label={status || "Available"}
      sx={{ ...styles[status || "Available"], fontWeight: 700 }}
    />
  );
}

export default function BatchesPage() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editSlot, setEditSlot] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setRows(saved.length ? saved : sampleRows);
  }, []);

  const saveRows = (nextRows) => {
    setRows(nextRows);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRows));
  };

  const slots = useMemo(() => {
    const groups = new Map();

    rows.forEach((row) => {
      const key = getKey(row);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });

    return Array.from(groups, ([key, items], index) => {
      const totalQuantity = items.reduce(
        (sum, item) => sum + Number(item.qty || 0) + Number(item.free || 0),
        0,
      );

      return {
        key,
        items,
        slotNo: items[0].slotNo || `SLOT-${String(index + 1).padStart(3, "0")}`,
        supplier: items[0].supplier || "—",
        billNo: items[0].billNo || "—",
        billDate: items[0].billDate || "",
        totalQuantity,
        itemCount: new Set(
          items.map((item) => item.medicine?.toLowerCase().trim()),
        ).size,
        status: getStatus(items),
      };
    });
  }, [rows]);

  const filteredSlots = slots.filter((slot) => {
    const text = `${slot.slotNo} ${slot.supplier} ${slot.billNo}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All statuses" || slot.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openEdit = (slot) => {
    setEditSlot(slot);
    setEditForm({
      supplier: slot.supplier === "—" ? "" : slot.supplier,
      billNo: slot.billNo === "—" ? "" : slot.billNo,
      billDate: slot.billDate,
    });
  };

  const saveEdit = () => {
    const updated = rows.map((row) =>
      getKey(row) === editSlot.key
        ? {
            ...row,
            slotNo: editSlot.slotNo,
            supplier: editForm.supplier,
            billNo: editForm.billNo,
            billDate: editForm.billDate,
          }
        : row,
    );

    saveRows(updated);
    setEditSlot(null);
  };

  const deleteSlot = (slot) => {
    if (!window.confirm(`${slot.slotNo} delete karna hai?`)) return;
    saveRows(rows.filter((row) => getKey(row) !== slot.key));
  };

  return (
    <Box>
     

      <Paper
        variant="outlined"
        sx={{ p: 1.5, mb: 2, borderColor: border, borderRadius: 2.5 }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search slot, supplier or bill no."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            sx={{ minWidth: { sm: 190 } }}
          >
            {[
              "All statuses",
              "Available",
              "Partial",
              "Expired",
              "Completed",
            ].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{ borderColor: border, borderRadius: 2.5, overflow: "hidden" }}
      >
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 950 }}>
            <TableHead>
              <TableRow>
                {[
                  "Slot No.",
                  "Supplier Name",
                  "Purchase Date",
                  "Total Quantity",
                  "No. of Items",
                  "Status",
                  "Action",
                ].map((label) => (
                  <TableCell
                    key={label}
                    sx={{
                      bgcolor: "#F1F6F3",
                      color: "#52645D",
                      fontSize: 12,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      py: 1.5,
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredSlots.length ? (
                filteredSlots.map((slot) => (
                  <TableRow
                    key={slot.key}
                    hover
                    sx={{
                      "& td": { py: 1.5 },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ color: green, fontWeight: 700 }}>
                      {slot.slotNo}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {slot.supplier}
                    </TableCell>
                    <TableCell>{formatDate(slot.billDate)}</TableCell>
                    <TableCell>{slot.totalQuantity}</TableCell>
                    <TableCell>{slot.itemCount}</TableCell>
                    <TableCell>
                      <StatusChip status={slot.status} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedSlot(slot)}
                            sx={{
                              color: green,
                              bgcolor: "#EAF8F4",
                              "&:hover": { bgcolor: "#DDF2EA" },
                            }}
                          >
                            <VisibilityOutlined sx={{ color: "#52645D", fontSize: 19 }}  />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit slot">
                          <IconButton
                            size="small"
                            onClick={() => openEdit(slot)}
                            sx={{
                              color: "#52645D",
                              bgcolor: "#F3F7F5",
                              "&:hover": { bgcolor: "#E8F1ED" },
                            }}
                          >
                            <EditOutlined sx={{ color: "#52645D", fontSize: 19 }}  />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete slot">
                          <IconButton
                            size="small"
                            onClick={() => deleteSlot(slot)}
                            sx={{
                              color: "#C43D3D",
                              bgcolor: "#FFF3F2",
                              "&:hover": { bgcolor: "#FCE5E3" },
                            }}
                          >
                            <DeleteOutline sx={{ color: "#52645D", fontSize: 19 }}  />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 5, color: muted }}
                  >
                    Koi purchase slot nahi mila.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={Boolean(selectedSlot)}
        onClose={() => setSelectedSlot(null)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedSlot?.slotNo} — Purchase Details
        </DialogTitle>
        <DialogContent>
          {selectedSlot && (
            <>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                gap={2}
                sx={{ mb: 2 }}
              >
                <Typography>
                  Supplier: <b>{selectedSlot.supplier}</b>
                </Typography>
                <Typography>
                  Bill No.: <b>{selectedSlot.billNo}</b>
                </Typography>
                <Typography>
                  Purchase Date: <b>{formatDate(selectedSlot.billDate)}</b>
                </Typography>
                <Typography>
                  Total Quantity: <b>{selectedSlot.totalQuantity}</b>
                </Typography>
              </Stack>

              <TableContainer
                sx={{
                  border: `1px solid ${border}`,
                  borderRadius: 2,
                  overflowX: "auto",
                }}
              >
                <Table size="small" sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow>
                      {[
                        "#",
                        "Medicine",
                        "Batch No.",
                        "MFG",
                        "Expiry",
                        "Qty",
                        "Free",
                        "Purchase ₹",
                        "MRP ₹",
                        "Selling ₹",
                        "GST %",
                        "Discount %",
                        "Amount ₹",
                      ].map((label) => (
                        <TableCell key={label} sx={{ ...headCell, py: 1.4 }}>
                          {label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSlot.items.map((item, index) => (
                      <TableRow key={`${item.batch}-${index}`} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {item.medicine || "—"}
                        </TableCell>
                        <TableCell>{item.batch || "—"}</TableCell>
                        <TableCell>{formatDate(item.mfg)}</TableCell>
                        <TableCell>{formatDate(item.expiry)}</TableCell>
                        <TableCell>{item.qty || 0}</TableCell>
                        <TableCell>{item.free || 0}</TableCell>
                        <TableCell>
                          ₹{Number(item.purchase || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>₹{Number(item.mrp || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          ₹{Number(item.selling || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>{item.gst || 0}%</TableCell>
                        <TableCell>{item.discount || 0}%</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          ₹{getAmount(item).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSlot(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(editSlot)}
        onClose={() => setEditSlot(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Purchase Slot</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Supplier Name"
              size="small"
              value={editForm.supplier || ""}
              onChange={(event) =>
                setEditForm({ ...editForm, supplier: event.target.value })
              }
            />
            <TextField
              label="Supplier bill no."
              size="small"
              value={editForm.billNo || ""}
              onChange={(event) =>
                setEditForm({ ...editForm, billNo: event.target.value })
              }
            />
            <TextField
              label="Purchase Date"
              type="date"
              size="small"
              value={editForm.billDate || ""}
              onChange={(event) =>
                setEditForm({ ...editForm, billDate: event.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSlot(null)}>Cancel</Button>
          <Button
            onClick={saveEdit}
            variant="contained"
            sx={{ bgcolor: green, "&:hover": { bgcolor: "#06765D" } }}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
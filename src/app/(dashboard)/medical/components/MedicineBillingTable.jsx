"use client";

import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const headerCellSx = {
  py: 1,
  px: 1,
  color: "#52627A",
  bgcolor: "#F7FAF9",
  borderBottom: "1px solid #DCE7E3",
  fontSize: 9.5,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const inputSx = {
  "& .MuiInputBase-root": {
    height: 28,
    fontSize: 11,
  },
  "& .MuiInputBase-input": {
    px: 0.5,
    py: 0.3,
  },
};

export default function MedicineBillingTable({
  invoiceLines = [],
  onUpdateLine = () => {},
  onRemoveLine = () => {},
}) {
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        border: "1px solid #D6E6E0",
        borderRadius: "8px",
      }}
    >
      <Table size="small" sx={{ minWidth: 690, tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, width: 38 }}>#</TableCell>
            <TableCell sx={{ ...headerCellSx, width: 190 }}>MEDICINE</TableCell>
            <TableCell sx={{ ...headerCellSx, width: 78 }}>BATCH</TableCell>
            <TableCell sx={{ ...headerCellSx, width: 108 }}>EXPIRY</TableCell>
            <TableCell sx={{ ...headerCellSx, width: 50 }}>QTY</TableCell>
            <TableCell sx={{ ...headerCellSx, width: 94 }}>UNIT PRICE</TableCell>
            <TableCell sx={{ ...headerCellSx, width: 76 }}>DISCOUNT</TableCell>
            <TableCell sx={{ ...headerCellSx, width: 90, textAlign: "right" }}>
              AMOUNT
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoiceLines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} sx={{ py: 3, textAlign: "center", color: "#64748B", fontSize: 12 }}>
                No medicines added yet
              </TableCell>
            </TableRow>
          ) : (
            invoiceLines.map((line, index) => {
              const quantity = Number(line.quantity || 0);
              const price = Number(line.unit_price || 0);
              const gst = Number(line.gst_rate || 0);
              const subtotal = quantity * price;
              const amount = subtotal + (subtotal * gst) / 100;
              const discount = line.discount_amount ?? line.discount;

              return (
                <TableRow key={line._rowId || index}>
                  <TableCell sx={{ px: 1, py: 1, color: "#172033", fontSize: 11 }}>
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell sx={{ px: 0.7, py: 0.7 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.2 }}>
                      <IconButton
                        size="small"
                        onClick={() => onRemoveLine(index)}
                        aria-label={`Remove ${line.medicine_name || "medicine"}`}
                        sx={{
                          width: 21,
                          height: 24,
                          mt: 0.1,
                          color: "#94A3B8",
                          "&:hover": { color: "#DC2626", bgcolor: "#FEF2F2" },
                        }}
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <TextField
                          value={line.medicine_name ?? ""}
                          onChange={(event) => onUpdateLine(index, "medicine_name", event.target.value)}
                          placeholder="Medicine name"
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                          sx={{
                            "& .MuiInputBase-root": { fontSize: 11, fontWeight: 650 },
                            "& .MuiInputBase-input": { p: 0 },
                          }}
                        />
                        <TextField
                          value={line.dose ?? ""}
                          onChange={(event) => onUpdateLine(index, "dose", event.target.value)}
                          placeholder="Dosage instructions"
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                          sx={{
                            mt: 0.2,
                            "& .MuiInputBase-root": { fontSize: 9.5, color: "#64748B" },
                            "& .MuiInputBase-input": { p: 0 },
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ px: 0.5, py: 0.7 }}>
                    <TextField
                      value={line.batch_number ?? ""}
                      onChange={(event) => onUpdateLine(index, "batch_number", event.target.value)}
                      variant="standard"
                      fullWidth
                      InputProps={{ disableUnderline: true }}
                      sx={inputSx}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 0.5, py: 0.7 }}>
                    <TextField
                      type="date"
                      value={line.expiry_date ?? ""}
                      onChange={(event) => onUpdateLine(index, "expiry_date", event.target.value)}
                      variant="standard"
                      fullWidth
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        ...inputSx,
                        "& input": { fontSize: 10, p: 0 },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 0.5, py: 0.7 }}>
                    <TextField
                      type="number"
                      value={line.quantity ?? ""}
                      onChange={(event) => onUpdateLine(index, "quantity", event.target.value)}
                      variant="standard"
                      fullWidth
                      inputProps={{ min: 1 }}
                      InputProps={{ disableUnderline: true }}
                      sx={{ ...inputSx, "& input": { textAlign: "center", p: 0 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 0.6, py: 0.6 }}>
                    <TextField
                      type="number"
                      value={line.unit_price ?? ""}
                      onChange={(event) => onUpdateLine(index, "unit_price", event.target.value)}
                      variant="standard"
                      fullWidth
                      inputProps={{ min: 0, step: "0.01", "aria-label": "Unit price" }}
                      InputProps={{ disableUnderline: true }}
                      sx={{ ...inputSx, "& input": { textAlign: "right", p: 0 } }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.4, mt: 0.25 }}>
                      <Typography sx={{ color: "#64748B", fontSize: 9 }}>GST</Typography>
                      <TextField
                        type="number"
                        value={line.gst_rate ?? ""}
                        onChange={(event) => onUpdateLine(index, "gst_rate", event.target.value)}
                        variant="standard"
                        inputProps={{ min: 0, max: 100, "aria-label": "GST rate" }}
                        InputProps={{ disableUnderline: true }}
                        sx={{ width: 37, "& .MuiInputBase-root": { height: 18, fontSize: 9 }, "& input": { textAlign: "right", p: 0 } }}
                      />
                      <Typography sx={{ color: "#64748B", fontSize: 9 }}>%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 1, color: "#475569", fontSize: 10.5, whiteSpace: "nowrap" }}>
                    {discount == null || discount === "" ? "—" : `₹${Number(discount).toFixed(2)}`}
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 1, color: "#172033", fontSize: 10.5, textAlign: "right", whiteSpace: "nowrap" }}>
                    ₹{amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

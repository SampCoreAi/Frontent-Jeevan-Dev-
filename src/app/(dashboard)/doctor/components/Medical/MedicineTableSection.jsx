import {
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SectionCard from "./SectionCard";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function MedicineTableSection({
  rows,
  stores,
  totalAmount,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  onResetRows,
  onComplete,
}) {
  return (
    <SectionCard
      title="Medicine list"
      subtitle="Add each medicine with its assigned store and final cost."
      action={
        <Button variant="outlined" onClick={onAddRow} sx={{ textTransform: "none" }}>
          Add medicine
        </Button>
      }
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Medical Store</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={row.medicineName}
                    onChange={(event) => onUpdateRow(row.id, "medicineName", event.target.value)}
                    placeholder="Medicine name"
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 90 }}>
                  <TextField
                    size="small"
                    type="number"
                    value={row.quantity}
                    onChange={(event) => onUpdateRow(row.id, "quantity", Number(event.target.value || 1))}
                    inputProps={{ min: 1 }}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  <Select
                    size="small"
                    fullWidth
                    value={row.storeId || ""}
                    onChange={(event) => onUpdateRow(row.id, "storeId", event.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Select store</MenuItem>
                    {stores
                      .filter((store) => store.status === "APPROVED")
                      .map((store) => (
                        <MenuItem key={store.id} value={store.id}>
                          {store.name}
                        </MenuItem>
                      ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <TextField
                    size="small"
                    type="number"
                    value={row.amount}
                    onChange={(event) => onUpdateRow(row.id, "amount", Number(event.target.value || 0))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button color="error" variant="text" onClick={() => onRemoveRow(row.id)} sx={{ textTransform: "none" }}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: "grid", gap: 2 }}>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
          <Typography variant="subtitle2" sx={{ color: "#1e293b", fontWeight: 700 }}>
            Total amount payable
          </Typography>
          <Typography variant="h6" sx={{ color: "#0f766e", fontWeight: 800 }}>
            {formatCurrency(totalAmount)}
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end">
          <Button variant="outlined" onClick={onResetRows} sx={{ textTransform: "none" }}>
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<ReceiptLongOutlinedIcon />}
            onClick={onComplete}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Complete request
          </Button>
        </Stack>
      </Box>
    </SectionCard>
  );
}
